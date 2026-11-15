import { validateSnapshot } from "./protocol.js";

export class RobotClient {
  constructor(api, onChange) {
    this.api = api;
    this.onChange = onChange;
    this.status = "disconnected";
    this.snapshot = null;
    this.lastSampleAt = 0;
    this.error = "";
    this.epoch = 0;
    this.commandPending = false;
  }

  async connect(options) {
    if (!this.api) throw new Error("Robot connections require the downloadable desktop app.");
    const epoch = ++this.epoch;
    clearTimeout(this.timer);
    this.snapshot = null;
    this.status = "connecting";
    this.error = "";
    this.onChange(true);
    try {
      const data = validateSnapshot(await this.api.connect(options));
      if (epoch !== this.epoch) return;
      this.snapshot = data;
      this.lastSampleAt = Date.now();
      this.status = "connected";
      this.onChange(true);
      this.poll(epoch);
    } catch (error) {
      if (epoch === this.epoch) this.fail(error);
      throw error;
    }
  }

  accept(data) {
    validateSnapshot(data);
    if (this.snapshot && data.revision < this.snapshot.revision) return this.snapshot;
    // A stopped OpMode can still have a listening socket. Treat an unchanged
    // sample timestamp as stale even when HTTP requests succeed.
    if (data.sampleTimeMs !== this.snapshot?.sampleTimeMs) this.lastSampleAt = Date.now();
    if (Date.now() - this.lastSampleAt > 1500)
      throw new Error("Controller telemetry stopped. Reconnect after checking Driver Station.");
    const changed =
      data.armed !== this.snapshot?.armed ||
      data.started !== this.snapshot?.started ||
      data.programLoaded !== this.snapshot?.programLoaded ||
      JSON.stringify(data.devices.map((d) => d.id)) !==
        JSON.stringify(this.snapshot?.devices.map((d) => d.id));
    this.snapshot = data;
    this.onChange(changed);
    return data;
  }

  async poll(epoch) {
    try {
      const data = await this.api.call("heartbeat", {});
      if (epoch !== this.epoch) return;
      this.accept(data);
      this.timer = setTimeout(() => this.poll(epoch), 200);
    } catch (error) {
      if (epoch === this.epoch) this.fail(error);
    }
  }

  fail(error) {
    ++this.epoch;
    clearTimeout(this.timer);
    this.status = "lost";
    this.error = error.message;
    if (this.snapshot) this.snapshot = { ...this.snapshot, armed: false };
    this.api?.disconnect().catch(() => {});
    this.onChange(true);
  }

  async command(route, body = {}) {
    if (this.status !== "connected") throw new Error("Reconnect to the robot first.");
    if (this.commandPending && route !== "stop")
      throw new Error("Wait for the controller to acknowledge the previous command.");
    const epoch = this.epoch;
    this.commandPending = true;
    try {
      const result = await this.api.call(route, body);
      if (epoch !== this.epoch) throw new Error("Connection changed before acknowledgement.");
      return this.accept(result);
    } catch (error) {
      // The response could have been lost after applying a command. Disarm before retrying.
      if (epoch === this.epoch) this.fail(error);
      throw error;
    } finally {
      this.commandPending = false;
    }
  }

  async disconnect() {
    ++this.epoch;
    clearTimeout(this.timer);
    this.status = "disconnected";
    if (this.snapshot) this.snapshot = { ...this.snapshot, armed: false };
    this.onChange(true);
    await this.api?.disconnect();
  }
}
