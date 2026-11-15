export const PROTOCOL = 1;
export const ACTUATORS = new Set(["motor", "servo", "crservo"]);

export function controllerAddress(input) {
  const value = String(input).trim();
  const match = /^(\d{1,3}(?:\.\d{1,3}){3})(?::(\d{1,5}))?$/.exec(value);
  if (!match) throw new Error("Enter a local IPv4 address, such as 192.168.43.1:8585.");
  const octets = match[1].split(".").map(Number);
  const port = Number(match[2] || 8585);
  const [a, b] = octets;
  const local =
    a === 10 || a === 127 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
  if (!local || octets.some((n) => n > 255) || port < 1 || port > 65535) {
    throw new Error("Use a private network address and a port between 1 and 65535.");
  }
  return `http://${octets.join(".")}:${port}`;
}

export function validateSnapshot(data) {
  if (data?.protocol !== PROTOCOL || !Array.isArray(data.devices) || data.devices.length > 256) {
    throw new Error("This controller does not support OneTester protocol 1. Update the bridge.");
  }
  if (typeof data.armed !== "boolean" || typeof data.started !== "boolean") {
    throw new Error("The controller returned an invalid status.");
  }
  if (
    !Number.isFinite(data.sampleTimeMs) ||
    !Number.isSafeInteger(data.revision) ||
    !Number.isInteger(data.programStep)
  ) {
    throw new Error("The controller returned invalid telemetry metadata.");
  }
  const ids = new Set();
  for (const device of data.devices) {
    if (
      !device ||
      ["id", "name", "type", "port", "model"].some(
        (k) => typeof device[k] !== "string" || device[k].length > 512,
      ) ||
      ids.has(device.id)
    ) {
      throw new Error("The controller returned an invalid hardware map.");
    }
    if (
      !Array.isArray(device.capabilities) ||
      device.capabilities.some((c) => typeof c !== "string")
    ) {
      throw new Error("The controller returned invalid device capabilities.");
    }
    if (
      ACTUATORS.has(device.type) &&
      (!Number.isFinite(device.min) || !Number.isFinite(device.max) || device.min >= device.max)
    ) {
      throw new Error("The controller returned invalid operating limits.");
    }
    ids.add(device.id);
  }
  return data;
}

export function validateProgram(program, devices) {
  if (
    !program ||
    !Array.isArray(program.steps) ||
    program.steps.length < 1 ||
    program.steps.length > 100
  ) {
    throw new Error("A program needs between 1 and 100 steps.");
  }
  let duration = 0;
  for (const step of program.steps) {
    if (!Number.isInteger(step.durationMs) || step.durationMs < 100 || step.durationMs > 10000) {
      throw new Error("Each step must last between 100 and 10000 ms.");
    }
    duration += step.durationMs;
    if (step.device === null) continue;
    const device = devices.find((d) => d.id === step.device);
    if (!device || !ACTUATORS.has(device.type))
      throw new Error("A program step references an unavailable output.");
    if (!Number.isFinite(step.value) || step.value < device.min || step.value > device.max) {
      throw new Error(`Use a value between ${device.min} and ${device.max} for ${device.name}.`);
    }
  }
  if (duration > 60000) throw new Error("Keep test programs under 60 seconds.");
  return duration;
}

// JSON string escaping is also valid for Java string literals after non-ASCII escaping.
export function javaString(value) {
  return JSON.stringify(String(value)).replace(
    /[\u007f-\uffff]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

export function generateJava(program, devices) {
  validateProgram(program, devices);
  const used = devices.filter((d) => program.steps.some((s) => s.device === d.id));
  const variables = new Map(used.map((d, i) => [d.id, `device${i}`]));
  const types = { motor: "DcMotor", servo: "Servo", crservo: "CRServo" };
  const setup = used
    .map((d) => {
      const variable = variables.get(d.id);
      const type = types[d.type];
      const direction = d.direction === "Reverse" ? "REVERSE" : "FORWARD";
      return `        ${type} ${variable} = hardwareMap.get(${type}.class, ${javaString(d.name)});\n        ${variable}.setDirection(${type}.Direction.${direction});${d.type === "motor" ? `\n        ${variable}.setPower(0);\n        ${variable}.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);` : d.type === "crservo" ? `\n        ${variable}.setPower(0);` : ""}`;
    })
    .join("\n");
  const steps = program.steps
    .map((s) => {
      const d = used.find((item) => item.id === s.device);
      const variable = d ? variables.get(d.id) : "";
      const enable =
        d && d.type !== "motor"
          ? `            if (${variable}.getController() instanceof ServoControllerEx)\n                ((ServoControllerEx) ${variable}.getController()).setServoPwmEnable(${variable}.getPortNumber());\n`
          : "";
      const command = d
        ? `${enable}            ${variable}.${d.type === "servo" ? "setPosition" : "setPower"}(${s.value});\n`
        : "";
      return `            if (!opModeIsActive()) return;\n${command}            sleep(${s.durationMs});`;
    })
    .join("\n");
  const stop = used
    .map((d) =>
      d.type === "servo"
        ? `            if (${variables.get(d.id)}.getController() instanceof ServoControllerEx)\n                ((ServoControllerEx) ${variables.get(d.id)}.getController()).setServoPwmDisable(${variables.get(d.id)}.getPortNumber());`
        : `            ${variables.get(d.id)}.setPower(0);`,
    )
    .map(
      (command) =>
        `            try {\n${command}\n            } catch (RuntimeException stopError) {\n                telemetry.addData("Stop error", stopError.getMessage());\n                telemetry.update();\n            }`,
    )
    .join("\n");
  return `package org.firstinspires.ftc.teamcode;\n\nimport com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;\nimport com.qualcomm.robotcore.eventloop.opmode.TeleOp;\nimport com.qualcomm.robotcore.hardware.*;\n\n// Generated by OneTester. Review mechanism limits before running.\n// Runs independently of the desktop app; use Driver Station STOP to interrupt.\n@TeleOp(name = "OneTester Program", group = "OneTester")\npublic class OneTesterProgram extends LinearOpMode {\n    @Override\n    public void runOpMode() throws InterruptedException {\n${setup}\n        try {\n            waitForStart();\n${steps}\n        } finally {\n${stop}\n        }\n    }\n}\n`;
}
