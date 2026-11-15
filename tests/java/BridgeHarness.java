import org.firstinspires.ftc.teamcode.OneTesterBridge;
import org.firstinspires.ftc.robotcore.external.Telemetry;
import com.qualcomm.robotcore.hardware.*;
import java.lang.reflect.*;
import java.util.*;

/** Runs the actual bridge with simulated SDK devices for desktop integration tests. */
public class BridgeHarness {
    static Object fallback(Class<?> type) {
        if (type == boolean.class) return false;
        if (type == int.class) return 0;
        if (type == double.class) return 0.0;
        if (type == float.class) return 0.0f;
        return null;
    }
    static <T> T device(Class<T> type, String name) {
        Map<String, Object> state = new HashMap<>();
        state.put("Power", 0.0);
        state.put("Position", 0.5);
        state.put("Direction", type == Servo.class ? Servo.Direction.FORWARD : DcMotorSimple.Direction.FORWARD);
        ServoControllerEx controller = (ServoControllerEx) Proxy.newProxyInstance(BridgeHarness.class.getClassLoader(), new Class[]{ServoControllerEx.class}, (proxy, method, args) -> {
            if (method.getName().equals("isServoPwmEnabled")) return state.getOrDefault("pwm", false);
            if (method.getName().equals("setServoPwmEnable")) state.put("pwm", true);
            if (method.getName().equals("setServoPwmDisable")) state.put("pwm", false);
            return fallback(method.getReturnType());
        });
        return type.cast(Proxy.newProxyInstance(BridgeHarness.class.getClassLoader(), new Class[]{type}, (proxy, method, args) -> {
            String key = method.getName();
            if (key.equals("getDeviceName")) return "Simulated " + name;
            if (key.equals("getConnectionInfo")) return "TEST HUB / " + name;
            if (key.equals("hashCode")) return System.identityHashCode(proxy);
            if (key.equals("equals")) return proxy == args[0];
            if (key.equals("getController")) return controller;
            if (key.equals("getCurrentPosition")) return (int) (((Double)state.get("Power")) * 1000);
            if (key.equals("getVelocity")) return ((Double)state.get("Power")) * 1000;
            if (key.equals("getCurrent")) return Math.abs((Double)state.get("Power")) * 2;
            if (key.equals("getDistance")) return 243.5;
            if (key.equals("getVoltage")) return 12.7;
            if (key.startsWith("set") && args != null && args.length == 1) state.put(key.substring(3), args[0]);
            if (key.startsWith("get") && state.containsKey(key.substring(3))) return state.get(key.substring(3));
            return fallback(method.getReturnType());
        }));
    }
    public static void main(String[] args) throws Exception {
        OneTesterBridge bridge = new OneTesterBridge();
        bridge.hardwareMap = new HardwareMap();
        bridge.hardwareMap.put("lift", device(DcMotorEx.class, "Lift motor"));
        bridge.hardwareMap.put("claw", device(Servo.class, "Claw servo"));
        bridge.hardwareMap.put("intake", device(CRServo.class, "Intake"));
        bridge.hardwareMap.put("distance", device(DistanceSensor.class, "Distance sensor"));
        bridge.hardwareMap.put("battery", device(VoltageSensor.class, "Battery"));
        bridge.telemetry = (Telemetry) Proxy.newProxyInstance(BridgeHarness.class.getClassLoader(), new Class[]{Telemetry.class}, (proxy, method, values) -> fallback(method.getReturnType()));
        bridge.init();
        Field code = OneTesterBridge.class.getDeclaredField("pairingCode");
        code.setAccessible(true);
        System.out.println("READY " + code.get(bridge));
        if (args.length == 0 || !args[0].equals("init-only")) bridge.start();
        Runtime.getRuntime().addShutdownHook(new Thread(bridge::stop));
        while (!Thread.currentThread().isInterrupted()) { bridge.loop(); Thread.sleep(20); }
    }
}
