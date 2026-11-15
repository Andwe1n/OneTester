import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { RobotTransport } from "../desktop/transport.cjs";
import { startHarness } from "../scripts/mock-controller.js";

test("actual Java bridge: pairing, read-only connect, output limits, programs, STOP, watchdog", async (t) => {
  const child = startHarness();
  t.after(() => child.kill());
  let errors = "";
  child.stderr.on("data", (chunk) => {
    errors += chunk;
  });
  const [data] = await Promise.race([
    once(child.stdout, "data"),
    once(child, "exit").then(() => {
      throw new Error(errors);
    }),
    delay(5000).then(() => {
      throw new Error(`Bridge did not start: ${errors}`);
    }),
  ]);
  const code = /READY ([A-F0-9]{8})/.exec(String(data))?.[1];
  assert.ok(code, String(data));
  const transport = new RobotTransport();
  await assert.rejects(
    () => transport.connect({ address: "127.0.0.1:8585", code: "00000000" }),
    /Pairing code/,
  );
  let result = await transport.connect({ address: "127.0.0.1:8585", code });
  assert.equal(result.devices.length, 5);
  assert.equal(result.armed, false);
  assert.equal(result.devices.find((d) => d.id === "distance").readings.distanceMm, 243.5);
  await assert.rejects(() => transport.call("output", { device: "lift", value: 0.4 }), /disabled/);
  await transport.call("configure", { device: "lift", min: -0.3, max: 0.3, direction: "Reverse" });
  await transport.call("arm", {});
  await assert.rejects(
    () => transport.call("output", { device: "lift", value: 0.5 }),
    /Invalid output/,
  );
  result = await transport.call("output", { device: "lift", value: 0.2 });
  assert.equal(result.devices.find((d) => d.id === "lift").readings.commandedPower, 0.2);
  const second = new RobotTransport();
  await assert.rejects(
    () => second.connect({ address: "127.0.0.1:8585", code }),
    /Another desktop/,
  );
  result = await transport.call("stop", {});
  assert.equal(result.armed, false);
  assert.equal(result.devices.find((d) => d.id === "lift").readings.commandedPower, 0);
  await assert.rejects(
    () => transport.call("program", { steps: [{ device: "lift", value: 1, durationMs: 100 }] }),
    /Invalid output/,
  );
  await transport.call("program", {
    steps: [
      { device: "lift", value: 0.2, durationMs: 100 },
      { device: null, durationMs: 100 },
    ],
  });
  await transport.call("heartbeat", {});
  await transport.call("arm", {});
  result = await transport.call("run", {});
  assert.equal(result.programStep, 0);
  await delay(280);
  result = await transport.call("heartbeat", {});
  assert.equal(result.armed, false);
  assert.equal(result.programStep, -1);
  assert.match(result.status, /completed/);
  await transport.call("arm", {});
  await transport.call("output", { device: "intake", value: 0.5 });
  await delay(1400);
  await assert.rejects(() => transport.call("state"), /Session expired/);
  const reconnect = new RobotTransport();
  result = await reconnect.connect({ address: "127.0.0.1:8585", code });
  assert.equal(result.armed, false);
  assert.equal(result.devices.find((d) => d.id === "intake").readings.commandedPower, 0);
  await reconnect.disconnect();
});

test("Driver Station INIT permits readings but refuses arming and physical commands", async (t) => {
  const child = startHarness(["init-only"]);
  t.after(() => child.kill());
  const [data] = await once(child.stdout, "data");
  const code = /READY ([A-F0-9]{8})/.exec(String(data))[1];
  const transport = new RobotTransport();
  const state = await transport.connect({ address: "127.0.0.1:8585", code });
  assert.equal(state.started, false);
  assert.equal(state.armed, false);
  await assert.rejects(() => transport.call("arm", {}), /START/);
  await assert.rejects(() => transport.call("output", { device: "claw", value: 0.7 }), /disabled/);
  await transport.disconnect();
});
