import assert from "node:assert/strict";
import test from "node:test";
import {
  controllerAddress,
  generateJava,
  validateProgram,
  validateSnapshot,
} from "../lib/protocol.js";

const devices = [
  {
    id: "claw",
    name: 'claw "left"',
    type: "servo",
    port: "Servo 0",
    model: "PWM",
    capabilities: ["position"],
    min: 0.1,
    max: 0.8,
    direction: "Reverse",
  },
];
const snapshot = {
  protocol: 1,
  armed: false,
  started: false,
  revision: 1,
  sampleTimeMs: 100,
  programStep: -1,
  devices,
};

test("connection only accepts private IPv4 endpoints without URL injection", () => {
  assert.equal(controllerAddress("192.168.43.1"), "http://192.168.43.1:8585");
  assert.equal(controllerAddress(" 127.0.0.1:8082 "), "http://127.0.0.1:8082");
  for (const input of [
    "https://example.com",
    "192.168.43.1@evil.com",
    "8.8.8.8",
    "192.168.43.256",
    "10.0.0.1:65536",
    "127.0.0.1/secret",
    "169.254.169.254",
  ])
    assert.throws(() => controllerAddress(input));
});
test("hardware snapshots reject incompatible, duplicate, and malformed devices", () => {
  assert.equal(validateSnapshot(snapshot), snapshot);
  assert.throws(() => validateSnapshot({ ...snapshot, protocol: 2 }));
  assert.throws(() => validateSnapshot({ ...snapshot, devices: [...devices, ...devices] }));
  assert.throws(() => validateSnapshot({ ...snapshot, devices: [{ ...devices[0], min: NaN }] }));
  assert.throws(() => validateSnapshot({ ...snapshot, revision: undefined }));
});
test("program validation rejects unavailable hardware and unsafe or unbounded values", () => {
  const step = { device: "claw", value: 0.5, durationMs: 500 };
  assert.equal(validateProgram({ steps: [step, { device: null, durationMs: 100 }] }, devices), 600);
  for (const change of [
    { value: NaN },
    { value: 1 },
    { device: "missing" },
    { durationMs: Infinity },
    { durationMs: 1.5 },
    { durationMs: 0 },
  ])
    assert.throws(() => validateProgram({ steps: [{ ...step, ...change }] }, devices));
  assert.throws(() =>
    validateProgram({ steps: Array(7).fill({ ...step, durationMs: 10000 }) }, devices),
  );
  assert.throws(() => validateProgram({ steps: [] }, devices));
});
test("Java export preserves configured names, directions, stop guards, and cleanup", () => {
  const code = generateJava(
    {
      steps: [
        { device: "claw", value: 0.4, durationMs: 500 },
        { device: null, durationMs: 100 },
      ],
    },
    devices,
  );
  assert.ok(code.includes('hardwareMap.get(Servo.class, "claw \\"left\\"")'));
  assert.ok(code.includes("Servo.Direction.REVERSE"));
  assert.ok(code.includes("if (!opModeIsActive()) return;"));
  assert.ok(code.includes("finally"));
  assert.ok(code.includes("setServoPwmDisable"));
  assert.ok(code.includes("sleep(100)"));
});
