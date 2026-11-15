package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.OpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.CurrentUnit;
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import fi.iki.elonen.NanoHTTPD;
import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.*;

/** Dedicated bench-test OpMode. All SDK hardware access stays on the OpMode thread. */
@TeleOp(name = "OneTester Bridge", group = "OneTester")
public class OneTesterBridge extends OpMode {
    private static final int PORT = 8585;
    private static final long LEASE_MS = 1200;
    private final Map<String, Device> devices = new LinkedHashMap<>();
    private final BlockingDeque<FutureTask<JSONObject>> commands = new LinkedBlockingDeque<>(32);
    private BridgeServer server;
    private String pairingCode;
    private String owner = "";
    private boolean started;
    private boolean armed;
    private long heartbeatAt;
    private long sampleAt;
    private long revision;
    private volatile String snapshot = "{}";
    private String status = "Waiting for desktop";
    private String stopFault = "";
    private JSONArray program;
    private int programIndex = -1;
    private long stepEndsAt;

    private static long now() { return System.nanoTime() / 1000000; }

    @Override public void init() {
        try {
            pairingCode = String.format(Locale.US, "%08X", new SecureRandom().nextInt());
            discover();
            safeStop("Ready to connect");
            publish();
            server = new BridgeServer();
            server.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
            showStatus();
        } catch (Exception error) {
            safeStop("Bridge failed: " + error.getMessage());
            if (server != null) server.stop();
            telemetry.addData("Bridge error", error.getMessage());
        }
    }

    @Override public void init_loop() { tick(); }
    @Override public void start() { started = true; status = "Read only · enable outputs in OneTester"; }
    @Override public void loop() { tick(); }
    @Override public void stop() {
        started = false;
        cancelPending();
        safeStop("Driver Station stopped");
        if (server != null) server.stop();
    }

    private void tick() {
        try {
            if (!owner.isEmpty() && now() - heartbeatAt > LEASE_MS) {
                cancelPending();
                safeStop("Connection lost · outputs disabled");
                owner = "";
            }
            FutureTask<JSONObject> task;
            // Bound work per loop so a busy client cannot starve the watchdog.
            for (int i = 0; i < 8 && (task = commands.poll()) != null; i++) task.run();
            advanceProgram();
            if (now() - sampleAt >= 100) { publish(); sampleAt = now(); }
            showStatus();
        } catch (Exception error) {
            safeStop("Device error: " + error.getMessage());
            try { publish(); } catch (JSONException ignored) { /* Previous snapshot remains stale. */ }
        }
    }

    private void showStatus() {
        telemetry.addData("OneTester", status);
        telemetry.addData("Pairing code", pairingCode);
        telemetry.addData("Address", "192.168.43.1:" + PORT);
        telemetry.addData("Configured devices", devices.size());
        telemetry.addData("Outputs", armed ? "ENABLED" : "DISABLED");
        if (!stopFault.isEmpty()) telemetry.addData("STOP fault", stopFault);
        telemetry.update();
    }

    private void cancelPending() {
        FutureTask<JSONObject> task;
        while ((task = commands.poll()) != null) task.cancel(false);
    }

    private void safeStop(String reason) {
        armed = false;
        programIndex = -1;
        stopFault = "";
        for (Device device : devices.values()) {
            try { device.stop(); }
            catch (RuntimeException error) { stopFault += device.name + ": " + error.getMessage() + "; "; }
        }
        status = reason;
    }

    private void discover() {
        List<HardwareDevice> all = new ArrayList<>(hardwareMap.getAll(HardwareDevice.class));
        all.sort(Comparator.comparing(d -> firstName(d)));
        for (HardwareDevice hardware : all) {
            Set<String> names = hardwareMap.getNamesOf(hardware);
            if (names.isEmpty()) continue;
            String name = firstName(hardware);
            // A configured name may expose several SDK interfaces. Keep its richest adapter.
            Device device = new Device(name, hardware);
            Device existing = devices.get(name);
            if (existing == null || existing.type.equals("unsupported")) devices.put(name, device);
        }
    }

    private String firstName(HardwareDevice device) {
        Set<String> names = hardwareMap.getNamesOf(device);
        return names.isEmpty() ? "" : Collections.min(names);
    }

    private void publish() throws JSONException {
        JSONArray list = new JSONArray();
        for (Device device : devices.values()) list.put(device.describe());
        snapshot = new JSONObject().put("protocol", 1).put("robot", "REV Control Hub")
            .put("started", started).put("armed", armed).put("status", status)
            .put("stopFault", stopFault).put("programStep", programIndex)
            .put("programLoaded", program != null).put("sampleTimeMs", now())
            .put("revision", ++revision).put("devices", list).toString();
    }

    private JSONObject execute(String route, String client, JSONObject body) throws Exception {
        if (route.equals("connect")) {
            if (!owner.isEmpty() && !owner.equals(client)) throw new IllegalStateException("Another desktop is connected. Disconnect it or restart the bridge.");
            owner = client;
            heartbeatAt = now();
            status = started ? "Read only · enable outputs to test" : "Press START on Driver Station to allow tests";
        } else {
            if (!owner.equals(client)) throw new IllegalStateException("Session expired. Reconnect with the pairing code.");
            switch (route) {
                case "state": break;
                case "heartbeat": heartbeatAt = now(); break;
                case "arm":
                    if (!started) throw new IllegalStateException("Press START on Driver Station first.");
                    if (!stopFault.isEmpty()) throw new IllegalStateException("A device did not stop. Check Driver Station and restart the bridge.");
                    armed = true;
                    status = "Outputs enabled";
                    break;
                case "disconnect": safeStop("Desktop disconnected"); owner = ""; break;
                case "stop": safeStop("Stopped from desktop"); break;
                case "output":
                    requireArmed();
                    if (programIndex >= 0) throw new IllegalStateException("Stop the program before a manual test.");
                    Device output = getDevice(body.getString("device"));
                    output.command(number(body, "value"));
                    status = "Command applied to " + output.name;
                    break;
                case "configure":
                    if (armed) throw new IllegalStateException("Disable outputs before changing settings.");
                    getDevice(body.getString("device")).configure(body);
                    program = null; // Limits and direction have changed; require a fresh upload.
                    status = "Runtime settings applied";
                    break;
                case "program":
                    if (armed) throw new IllegalStateException("Disable outputs before uploading a program.");
                    JSONArray steps = body.getJSONArray("steps");
                    validateSteps(steps);
                    program = new JSONArray(steps.toString());
                    status = "Program uploaded · " + steps.length() + " steps";
                    break;
                case "run":
                    requireArmed();
                    if (program == null) throw new IllegalStateException("Upload a program first.");
                    if (programIndex >= 0) throw new IllegalStateException("A program is already running.");
                    validateSteps(program);
                    programIndex = 0;
                    startStep();
                    status = "Program running";
                    break;
                default: throw new IllegalArgumentException("Unknown command");
            }
        }
        publish();
        return new JSONObject(snapshot);
    }

    private void requireArmed() {
        if (!started || !armed || now() - heartbeatAt > LEASE_MS) throw new IllegalStateException("Outputs are disabled. Enable them before sending commands.");
    }

    private Device getDevice(String id) {
        Device device = devices.get(id);
        if (device == null) throw new IllegalArgumentException("Device is no longer configured: " + id);
        return device;
    }

    private static double number(JSONObject object, String key) throws JSONException {
        Object value = object.get(key);
        if (!(value instanceof Number)) throw new IllegalArgumentException(key + " must be a number");
        double result = ((Number) value).doubleValue();
        if (Double.isNaN(result) || Double.isInfinite(result)) throw new IllegalArgumentException(key + " must be finite");
        return result;
    }

    private void validateSteps(JSONArray steps) throws JSONException {
        if (steps.length() < 1 || steps.length() > 100) throw new IllegalArgumentException("Use 1–100 steps");
        double total = 0;
        for (int i = 0; i < steps.length(); i++) {
            JSONObject step = steps.getJSONObject(i);
            double duration = number(step, "durationMs");
            if (duration != Math.floor(duration) || duration < 100 || duration > 10000) throw new IllegalArgumentException("Step duration must be 100–10000 ms");
            total += duration;
            if (!step.has("device")) throw new IllegalArgumentException("Missing step device");
            if (!step.isNull("device")) getDevice(step.getString("device")).validate(number(step, "value"));
        }
        if (total > 60000) throw new IllegalArgumentException("Program exceeds 60 seconds");
    }

    private void startStep() throws JSONException {
        JSONObject step = program.getJSONObject(programIndex);
        if (!step.isNull("device")) getDevice(step.getString("device")).command(number(step, "value"));
        stepEndsAt = now() + step.getLong("durationMs");
    }

    private void advanceProgram() throws JSONException {
        if (programIndex < 0 || now() < stepEndsAt) return;
        requireArmed();
        programIndex++;
        if (programIndex >= program.length()) safeStop("Program completed · outputs disabled");
        else startStep();
    }

    private class BridgeServer extends NanoHTTPD {
        BridgeServer() { super(PORT); }
        @Override public Response serve(IHTTPSession session) {
            // No browser CORS access. The desktop main process owns authenticated requests.
            if (!session.getHeaders().getOrDefault("authorization", "").equals("Bearer " + pairingCode))
                return error(Response.Status.UNAUTHORIZED, "Pairing code is incorrect. Check Driver Station.");
            String client = session.getHeaders().getOrDefault("x-onetester-client", "");
            if (!client.matches("[a-fA-F0-9-]{36}")) return error(Response.Status.BAD_REQUEST, "Invalid client ID");
            String route = session.getUri().replaceFirst("^/v1/", "");
            if (!session.getUri().startsWith("/v1/") || !(route.equals("state") ? session.getMethod() == Method.GET : session.getMethod() == Method.POST))
                return error(Response.Status.BAD_REQUEST, "Invalid request");
            try {
                int size = Integer.parseInt(session.getHeaders().getOrDefault("content-length", "0"));
                if (size < 0 || size > 65536 || session.getHeaders().containsKey("transfer-encoding")) return error(Response.Status.BAD_REQUEST, "Request too large");
                Map<String, String> parsed = new HashMap<>();
                if (session.getMethod() == Method.POST) session.parseBody(parsed);
                String raw = parsed.getOrDefault("postData", "{}");
                if (raw.length() > 65536) return error(Response.Status.BAD_REQUEST, "Request too large");
                JSONObject body = new JSONObject(raw);
                if (route.equals("stop")) cancelPending();
                long deadline = now() + 1000;
                FutureTask<JSONObject> task = new FutureTask<>(() -> {
                    if (now() > deadline) throw new IllegalStateException("Command expired; retry.");
                    return execute(route, client, body);
                });
                if (!(route.equals("stop") ? commands.offerFirst(task) : commands.offerLast(task))) return error(Response.Status.SERVICE_UNAVAILABLE, "Controller busy");
                try {
                    JSONObject result = task.get(1500, TimeUnit.MILLISECONDS);
                    Response response = newFixedLengthResponse(Response.Status.OK, "application/json", result.toString());
                    response.addHeader("Cache-Control", "no-store");
                    return response;
                } catch (TimeoutException | CancellationException error) {
                    task.cancel(false);
                    return error(Response.Status.SERVICE_UNAVAILABLE, "Command expired or cancelled by STOP");
                }
            } catch (Exception error) {
                Throwable cause = error instanceof ExecutionException ? error.getCause() : error;
                return error(Response.Status.BAD_REQUEST, cause.getMessage());
            }
        }
        private Response error(Response.Status code, String message) {
            try {
                Response response = newFixedLengthResponse(code, "application/json", new JSONObject().put("error", message == null ? "Request failed" : message).toString());
                // An early rejection may leave unread request bytes. Never reuse that socket.
                response.closeConnection(true);
                return response;
            }
            catch (JSONException impossible) { return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "text/plain", "Request failed"); }
        }
    }

    private static class Device {
        final String name;
        final HardwareDevice hardware;
        final String type;
        double min;
        double max = 1;
        Device(String name, HardwareDevice hardware) {
            this.name = name;
            this.hardware = hardware;
            type = classify(hardware);
            min = type.equals("servo") ? 0 : -1;
        }
        static String classify(HardwareDevice h) {
            if (h instanceof DcMotor) return "motor";
            if (h instanceof Servo) return "servo";
            if (h instanceof CRServo) return "crservo";
            if (h instanceof IMU) return "imu";
            if (h instanceof DistanceSensor) return "distance";
            if (h instanceof ColorSensor) return "color";
            if (h instanceof TouchSensor) return "touch";
            if (h instanceof AnalogInput) return "analog";
            if (h instanceof DigitalChannel) return "digital";
            if (h instanceof VoltageSensor) return "voltage";
            return "unsupported";
        }
        boolean actuator() { return type.equals("motor") || type.equals("servo") || type.equals("crservo"); }
        void validate(double value) {
            if (!actuator() || Double.isNaN(value) || Double.isInfinite(value) || value < min || value > max)
                throw new IllegalArgumentException("Invalid output for " + name + "; range " + min + " to " + max);
        }
        void command(double value) {
            validate(value);
            if (hardware instanceof Servo) {
                Servo servo = (Servo) hardware;
                if (servo.getController() instanceof ServoControllerEx) ((ServoControllerEx) servo.getController()).setServoPwmEnable(servo.getPortNumber());
                servo.setPosition(value);
            } else if (hardware instanceof DcMotor) {
                DcMotor motor = (DcMotor) hardware;
                motor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
                motor.setPower(value);
            } else if (hardware instanceof CRServo) {
                CRServo servo = (CRServo) hardware;
                if (servo.getController() instanceof ServoControllerEx) ((ServoControllerEx) servo.getController()).setServoPwmEnable(servo.getPortNumber());
                servo.setPower(value);
            }
        }
        void stop() {
            if (hardware instanceof DcMotor) ((DcMotor) hardware).setPower(0);
            if (hardware instanceof CRServo) ((CRServo) hardware).setPower(0);
            if (hardware instanceof Servo) {
                Servo servo = (Servo) hardware;
                if (servo.getController() instanceof ServoControllerEx) ((ServoControllerEx) servo.getController()).setServoPwmDisable(servo.getPortNumber());
            }
        }
        void configure(JSONObject body) throws JSONException {
            if (!actuator()) throw new IllegalArgumentException("This adapter is read only");
            double newMin = number(body, "min"), newMax = number(body, "max");
            double floor = type.equals("servo") ? 0 : -1;
            String direction = body.getString("direction");
            if (newMin < floor || newMax > 1 || newMin >= newMax || (!type.equals("servo") && (newMin > 0 || newMax < 0))) throw new IllegalArgumentException("Invalid limits; power limits must include zero");
            if (!direction.equals("Forward") && !direction.equals("Reverse")) throw new IllegalArgumentException("Invalid direction");
            if (hardware instanceof Servo) ((Servo) hardware).setDirection(direction.equals("Reverse") ? Servo.Direction.REVERSE : Servo.Direction.FORWARD);
            else ((DcMotorSimple) hardware).setDirection(direction.equals("Reverse") ? DcMotorSimple.Direction.REVERSE : DcMotorSimple.Direction.FORWARD);
            min = newMin; max = newMax;
        }
        JSONObject describe() throws JSONException {
            JSONArray capabilities = new JSONArray();
            if (actuator()) capabilities.put(type.equals("servo") ? "position" : "power").put("configure");
            if (hardware instanceof Servo && ((Servo) hardware).getController() instanceof ServoControllerEx) capabilities.put("pwm-disable");
            if (!type.equals("unsupported")) capabilities.put("read");
            JSONObject result = new JSONObject().put("id", name).put("name", name).put("type", type)
                .put("model", hardware.getDeviceName()).put("port", hardware.getConnectionInfo())
                .put("capabilities", capabilities).put("min", min).put("max", max);
            if (actuator()) {
                String direction = hardware instanceof Servo ? ((Servo) hardware).getDirection().name() : ((DcMotorSimple) hardware).getDirection().name();
                result.put("direction", direction.equals("REVERSE") ? "Reverse" : "Forward");
            }
            JSONObject values = new JSONObject();
            try { read(values); }
            catch (RuntimeException | JSONException error) { result.put("readError", "Reading unavailable: " + error.getMessage()); }
            return result.put("readings", values);
        }
        void read(JSONObject values) throws JSONException {
            if (hardware instanceof Servo) values.put("commandedPosition", ((Servo) hardware).getPosition());
            if (hardware instanceof DcMotorSimple) values.put("commandedPower", ((DcMotorSimple) hardware).getPower());
            if (hardware instanceof DcMotor) values.put("encoderTicks", ((DcMotor) hardware).getCurrentPosition());
            if (hardware instanceof DcMotorEx) {
                values.put("velocityTicksPerSecond", ((DcMotorEx) hardware).getVelocity());
                values.put("currentAmps", ((DcMotorEx) hardware).getCurrent(CurrentUnit.AMPS));
            }
            if (hardware instanceof DistanceSensor) putFinite(values, "distanceMm", ((DistanceSensor) hardware).getDistance(DistanceUnit.MM));
            if (hardware instanceof ColorSensor) {
                ColorSensor color = (ColorSensor) hardware;
                values.put("red", color.red()).put("green", color.green()).put("blue", color.blue()).put("alpha", color.alpha());
            }
            if (hardware instanceof TouchSensor) values.put("pressed", ((TouchSensor) hardware).isPressed());
            if (hardware instanceof AnalogInput) values.put("voltage", ((AnalogInput) hardware).getVoltage());
            if (hardware instanceof DigitalChannel) values.put("digitalState", ((DigitalChannel) hardware).getState());
            if (hardware instanceof VoltageSensor) values.put("voltage", ((VoltageSensor) hardware).getVoltage());
            if (hardware instanceof IMU) {
                YawPitchRollAngles angles = ((IMU) hardware).getRobotYawPitchRollAngles();
                values.put("yawDegrees", angles.getYaw(AngleUnit.DEGREES)).put("pitchDegrees", angles.getPitch(AngleUnit.DEGREES)).put("rollDegrees", angles.getRoll(AngleUnit.DEGREES));
            }
        }
        static void putFinite(JSONObject values, String key, double value) throws JSONException {
            values.put(key, Double.isNaN(value) || Double.isInfinite(value) ? JSONObject.NULL : value);
        }
    }
}
