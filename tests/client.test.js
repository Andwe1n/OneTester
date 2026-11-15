import assert from "node:assert/strict";
import test from "node:test";
import { RobotClient } from "../lib/robot-client.js";

const state = (extra = {}) => ({
  protocol: 1,
  armed: false,
  started: true,
  devices: [],
  revision: 1,
  sampleTimeMs: 1,
  programStep: -1,
  ...extra,
});

test("a lost command acknowledgement closes the session instead of allowing retries", async () => {
  let disconnects = 0;
  const api = {
    connect: async () => state(),
    call: async (path) => {
      if (path === "output") throw new Error("timeout");
      return state();
    },
    disconnect: async () => {
      disconnects++;
    },
  };
  const client = new RobotClient(api, () => {});
  await client.connect({});
  await assert.rejects(() => client.command("output", { device: "motor", value: 0.5 }), /timeout/);
  assert.equal(client.status, "lost");
  assert.equal(client.snapshot.armed, false);
  assert.equal(disconnects, 1);
  await assert.rejects(() => client.command("arm"), /Reconnect/);
});
test("late responses cannot replace a newer STOP acknowledgement", () => {
  const client = new RobotClient({}, () => {});
  client.snapshot = state({ revision: 5, armed: false });
  client.lastSampleAt = Date.now();
  client.accept(state({ revision: 4, armed: true }));
  assert.equal(client.snapshot.armed, false);
});
test("stale telemetry is rejected even when HTTP succeeds", () => {
  const client = new RobotClient({}, () => {});
  client.snapshot = state();
  client.lastSampleAt = Date.now() - 1600;
  assert.throws(() => client.accept(state()), /telemetry stopped/);
});
test("disconnect cancels connection completion and ignores its late response", async () => {
  let resolveConnect;
  const api = {
    connect: () =>
      new Promise((resolve) => {
        resolveConnect = resolve;
      }),
    disconnect: async () => {},
  };
  const client = new RobotClient(api, () => {});
  const pending = client.connect({});
  await client.disconnect();
  resolveConnect(state({ armed: true }));
  await pending;
  assert.equal(client.status, "disconnected");
  assert.equal(client.snapshot, null);
});

test("editing a program during upload does not mark the new draft as uploaded", async () => {
  const { LiveWorkbench } = await import("../live-workbench.js");
  const workbench = Object.create(LiveWorkbench.prototype);
  const original = { name: "First draft", steps: [{ device: null, value: 0, durationMs: 100 }] };
  let acknowledge;
  Object.assign(workbench, {
    program: structuredClone(original),
    client: {
      snapshot: { devices: [] },
      command: () =>
        new Promise((resolve) => {
          acknowledge = resolve;
        }),
    },
    notify: () => {},
    renderApp: () => {},
  });
  const upload = workbench.perform("upload");
  workbench.program.steps.push({ device: null, value: 0, durationMs: 200 });
  acknowledge({});
  await upload;
  assert.equal(workbench.uploaded, JSON.stringify(original));
  assert.notEqual(workbench.uploaded, JSON.stringify(workbench.program));
});
