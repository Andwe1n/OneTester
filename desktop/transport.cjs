const { randomUUID } = require("node:crypto");

class RobotTransport {
  constructor() {
    this.connection = null;
    this.generation = 0;
  }

  async request(connection, path, body) {
    const response = await fetch(`${connection.url}/v1/${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${connection.code}`,
        "X-OneTester-Client": connection.id,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: "error",
      signal: AbortSignal.timeout(2000),
    });
    const text = await response.text();
    if (text.length > 1024 * 1024) throw new Error("Controller response is too large.");
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("No OneTester bridge at this address.");
    }
    if (!response.ok) throw new Error(data.error || `Controller error ${response.status}`);
    return data;
  }

  async connect({ address, code }) {
    if (this.connection) await this.disconnect();
    const { controllerAddress, validateSnapshot } = await import("../lib/protocol.js");
    if (!/^[a-fA-F0-9]{8}$/.test(code))
      throw new Error("Enter the 8-character pairing code on Driver Station.");
    const generation = ++this.generation;
    const connection = {
      url: controllerAddress(address),
      code: code.toUpperCase(),
      id: randomUUID(),
    };
    const snapshot = validateSnapshot(await this.request(connection, "connect", {}));
    if (generation !== this.generation) throw new Error("Connection cancelled.");
    this.connection = connection;
    return snapshot;
  }

  async call(path, body) {
    if (!this.connection) throw new Error("Connect to the controller first.");
    const allowed = new Set([
      "state",
      "heartbeat",
      "arm",
      "stop",
      "output",
      "configure",
      "program",
      "run",
    ]);
    if (!allowed.has(path) || (path === "state") !== (body === undefined))
      throw new Error("Unsupported robot request.");
    const connection = this.connection;
    const result = await this.request(connection, path, body);
    if (connection !== this.connection) throw new Error("Connection changed.");
    return result;
  }

  async disconnect() {
    const connection = this.connection;
    this.connection = null;
    this.generation++;
    if (connection) await this.request(connection, "disconnect", {});
  }
}
module.exports = { RobotTransport };
