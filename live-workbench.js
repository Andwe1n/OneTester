import { ACTUATORS, generateJava, validateProgram } from "./lib/protocol.js";
import { RobotClient } from "./lib/robot-client.js";

const html = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const button = (label, action, style = "", disabled = false) =>
  `<button class="btn ${style}" data-robot-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>`;
const labels = {
  motor: "DC motor",
  servo: "Positional servo",
  crservo: "Continuous servo",
  distance: "Distance sensor",
  color: "Color sensor",
  touch: "Touch sensor",
  analog: "Analog input",
  digital: "Digital channel",
  voltage: "Voltage sensor",
  imu: "IMU",
  unsupported: "No adapter",
};
const units = {
  commandedPosition: ["Commanded position", "pos"],
  commandedPower: ["Commanded power", "power"],
  encoderTicks: ["Encoder position", "ticks"],
  velocityTicksPerSecond: ["Measured velocity", "ticks/s"],
  currentAmps: ["Measured current", "A"],
  distanceMm: ["Distance", "mm"],
  voltage: ["Voltage", "V"],
  yawDegrees: ["Yaw", "°"],
  pitchDegrees: ["Pitch", "°"],
  rollDegrees: ["Roll", "°"],
  pressed: ["Pressed", ""],
  digitalState: ["Digital state", ""],
};

export class LiveWorkbench {
  constructor({ render, notify, openDialog, download, setView }) {
    Object.assign(this, { renderApp: render, notify, openDialog, download, setView });
    this.active = true;
    this.page = "hardware";
    this.selected = null;
    this.tab = "readings";
    this.query = "";
    this.program = { name: "My robot program", steps: [] };
    this.uploaded = "";
    this.recording = false;
    this.samples = [];
    this.lastRecordedSample = null;
    this.client = new RobotClient(window.oneTesterDesktop, (changed) => {
      if (changed && this.active) this.renderApp();
      this.updateReadings();
    });
    document.addEventListener("click", (event) => this.click(event));
    document.addEventListener("input", (event) => this.input(event));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.client.snapshot?.armed) this.stop();
    });
  }

  get devices() {
    return this.client.snapshot?.devices || [];
  }
  get device() {
    return this.devices.find((d) => d.id === this.selected) || this.devices[0];
  }
  get connected() {
    return this.client.status === "connected";
  }
  get armed() {
    return this.connected && this.client.snapshot?.armed;
  }

  header() {
    const label = this.connected
      ? "Robot connected"
      : this.client.status === "connecting"
        ? "Connecting…"
        : this.client.status === "lost"
          ? "Connection lost"
          : "Not connected";
    return `<span class="demo-pill ${this.connected ? "robot-online" : ""}"><i class="status-dot"></i>${label}</span>${button(this.connected ? "Connection" : "Connect robot", "connect", "", this.client.status === "connecting")}`;
  }

  footer() {
    return this.connected
      ? "Live controller · configured hardware"
      : "Robot workspace · no active connection";
  }

  render(view) {
    this.page = view;
    if (!this.client.snapshot) return this.welcome();
    if (view === "sequences") return this.programmer();
    if (view === "runs") return this.recordings();
    if (view === "profiles") return this.profile();
    if (view !== "hardware")
      return `<section class="panel robot-empty"><h2>${view === "pid" ? "PID tuning" : "Trajectory planning"} is available in demo</h2><p>This robot bridge supports hardware tests and timed programs. ${view === "pid" ? "The tuning model remains a simulation." : "Trajectory previews do not drive a real robot."}</p>${button("Back to hardware", "hardware", "primary")}${button("Open demo workspace", "demo")}</section>`;
    return this.hardware();
  }

  welcome() {
    return `<section class="panel robot-welcome"><span class="robot-eyebrow">ONETESTER / ROBOT WORKSPACE</span><h2>Your robot.<br>Ready to read.</h2><p>Connect to your Control Hub to load its hardware map, watch live readings, and program your mechanisms in one place.</p><div class="robot-welcome-actions">${button("Connect Control Hub", "connect", "primary", this.client.status === "connecting")}${button("Explore the demo", "demo")}</div>${this.client.error ? `<p class="robot-error" role="alert">${html(this.client.error)}</p>` : ""}<div class="robot-setup-grid"><div><span>01</span><h3>Install the bridge</h3><p>Save the included Java file. Add it to your FTC project or upload it through OnBot Java.</p>${button("Save robot integration", "save-bridge")}</div><div><span>02</span><h3>Start on Driver Station</h3><p>Select OneTester Bridge and tap INIT. The pairing code appears on Driver Station.</p></div><div><span>03</span><h3>Connect and discover</h3><p>Join your robot’s Wi-Fi. Pair once per session; configured devices load automatically.</p></div></div><div class="robot-notice">Discovery reads the active FTC configuration. Configure ports on the controller first. PWM servos cannot identify themselves or report physical position.</div></section>`;
  }

  banner() {
    return `<div class="robot-session ${this.connected ? "" : "robot-session-lost"}"><div><span class="robot-eyebrow">${this.armed ? "OUTPUTS ENABLED" : "OUTPUTS DISABLED"}</span><p id="robot-status">${html(this.connected ? this.client.snapshot.status : this.client.error || "Disconnected. Readings are stale.")}</p></div><div>${this.armed ? button("Disable outputs", "stop") : button("Enable outputs", "arm", "primary", !this.connected || !this.client.snapshot.started)}${button("Export profile", "export-profile")}</div></div>`;
  }

  deviceList() {
    const filtered = this.devices.filter((d) =>
      `${d.name} ${d.type} ${d.port}`.toLowerCase().includes(this.query.toLowerCase()),
    );
    return filtered.length
      ? filtered
          .map(
            (d) =>
              `<button class="device-row ${this.device?.id === d.id ? "selected" : ""}" data-robot-device="${html(d.id)}"><span class="robot-device-mark">${d.type === "motor" ? "M" : d.type === "servo" ? "S" : d.type === "crservo" ? "CR" : "IN"}</span><span class="device-row-text"><span class="device-name">${html(d.name)}</span><span class="device-meta">${html(labels[d.type] || d.type)}</span></span></button>`,
          )
          .join("")
      : '<div class="empty-state">No matching devices.</div>';
  }

  hardware() {
    return `${this.banner()}<div class="settings-intro"><span>Configured hardware</span><p>${this.devices.length} devices from your active FTC hardware map</p>${button("Refresh readings", "refresh")}</div><div class="hardware-grid"><section class="device-library panel"><div class="device-library-heading"><h2>Devices <span>${this.devices.length}</span></h2></div><div class="device-search"><input id="robot-search" aria-label="Search robot devices" placeholder="Find a device…" value="${html(this.query)}"></div><div class="device-group-label">CONTROL HUB <span>CONFIGURED</span></div><div class="device-list" id="robot-device-list">${this.deviceList()}</div><p class="robot-library-note">Configured does not verify a physical connection. Unplugged PWM devices remain in this list.</p></section><div class="device-workspace">${this.detail()}</div></div>`;
  }

  detail() {
    const d = this.device;
    if (!d)
      return '<section class="panel robot-empty"><h2>No configured hardware</h2><p>Create an active configuration on Driver Station, restart the bridge, then reconnect.</p></section>';
    return `<section class="panel device-detail"><div class="device-detail-head"><div class="port-path">${html(d.port)}</div><div class="detail-title"><h2>${html(d.name)}</h2><span class="tag">${html(labels[d.type] || d.type)}</span></div><p class="device-subtitle">${html(d.model)} · reported by the FTC driver</p><div class="tabs" role="tablist" aria-label="Device workspace">${[
      ["readings", "Live readings"],
      ["test", "Quick test"],
      ["settings", "Settings"],
    ]
      .map(
        ([tab, title]) =>
          `<button class="tab ${this.tab === tab ? "active" : ""}" role="tab" aria-selected="${this.tab === tab}" data-robot-tab="${tab}">${title}</button>`,
      )
      .join(
        "",
      )}</div></div><div class="control-body robot-detail-body">${this.tab === "readings" ? this.readings(d) : this.tab === "settings" ? this.settings(d) : this.controls(d)}</div></section>`;
  }

  readings(d) {
    return `<div class="robot-reading-title"><h3>Controller telemetry</h3><span id="robot-sample-age">${this.connected ? "Live · about 5 updates/s" : "Stale · disconnected"}</span></div><div id="robot-readings" class="robot-reading-grid">${this.readingCards(d)}</div><p id="robot-reading-error" class="robot-error">${html(d.readError)}</p>${d.type === "servo" ? '<div class="robot-notice">Commanded position is the last SDK command, not measured shaft position.</div>' : ""}${d.type === "unsupported" ? '<div class="robot-notice">This device is listed by the FTC SDK. It needs a device-specific adapter before OneTester can read or control it.</div>' : ""}<div class="robot-record-bar">${button(this.recording ? "Stop recording" : "Record telemetry", "record", "", !this.connected && !this.recording)}<span id="robot-sample-count">${this.samples.length} samples in this session</span>${button("Export CSV", "export-telemetry", "", this.samples.length === 0)}</div>`;
  }

  readingCards(d) {
    const entries = Object.entries(d.readings || {});
    return entries.length
      ? entries
          .map(([key, value]) => {
            const [label, unit] = units[key] || [key, ""];
            const display =
              value === null
                ? "Unavailable"
                : typeof value === "number"
                  ? Number(value.toFixed(3))
                  : String(value);
            return `<div class="robot-reading"><span>${html(label)}</span><strong>${html(display)} <small>${unit}</small></strong></div>`;
          })
          .join("")
      : '<p class="muted">No readings available from this adapter.</p>';
  }

  controls(d) {
    if (!ACTUATORS.has(d.type))
      return '<div class="robot-notice">This device is read only. Its supported measurements are in Live readings.</div>';
    const value = d.type === "servo" ? (d.readings?.commandedPosition ?? d.min) : 0;
    return `<h3>${d.type === "servo" ? "Set a position" : "Set output power"}</h3><p class="robot-copy">Commands are sent when you press Apply. Range: ${d.min} to ${d.max}.</p><div class="robot-command-form"><label for="robot-output">${d.type === "servo" ? "Normalized position" : "Power (−1 to 1)"}</label><input id="robot-output" type="number" min="${d.min}" max="${d.max}" step="0.01" value="${Math.max(d.min, Math.min(d.max, value))}">${button("Apply to device", "output", "primary", !this.armed)}${button("Stop all outputs", "stop", "danger", !this.connected)}</div><div class="robot-notice">${this.armed ? "Outputs are enabled. The controller applies and acknowledges each command." : "Press START on Driver Station, then enable outputs to send a command."} Motors and CR servos stop when disabled. Positional servo PWM is disabled where supported; a loaded mechanism may move when holding torque is removed.</div>`;
  }

  settings(d) {
    if (!ACTUATORS.has(d.type))
      return `<h3>Read-only device</h3><p class="robot-copy">Configure this device in the Robot Controller. ${d.type === "imu" ? "IMU readings require the correct robot mounting orientation to be initialized in your FTC project." : "OneTester uses the configured FTC SDK driver."}</p>`;
    return `<h3>Runtime settings</h3><p class="robot-copy">Limits and direction apply for this bridge session. Export your profile to keep a copy. Uploading a program or applying settings requires outputs to be disabled.</p><div class="robot-settings-form"><div class="field"><label for="robot-min">Minimum ${d.type === "servo" ? "position" : "power"}</label><input id="robot-min" type="number" step="0.01" min="${d.type === "servo" ? 0 : -1}" max="1" value="${d.min}"></div><div class="field"><label for="robot-max">Maximum ${d.type === "servo" ? "position" : "power"}</label><input id="robot-max" type="number" step="0.01" min="${d.type === "servo" ? 0 : -1}" max="1" value="${d.max}"></div><div class="field"><label for="robot-direction">Direction</label><select id="robot-direction"><option ${d.direction === "Forward" ? "selected" : ""}>Forward</option><option ${d.direction === "Reverse" ? "selected" : ""}>Reverse</option></select></div></div>${button("Apply runtime settings", "configure", "primary", !this.connected || this.armed)}<div class="robot-notice">This configures SDK behavior. Firmware flashing and vendor servo mode programming require their manufacturer’s tools.</div>`;
  }

  programmer() {
    const outputs = this.devices.filter((d) => ACTUATORS.has(d.type));
    return `${this.banner()}<section class="panel robot-programmer"><div class="robot-reading-title"><div><span class="robot-eyebrow">PROGRAMMER</span><h2>Build a mechanism routine</h2><p class="robot-copy">Add outputs and waits. Upload once; the controller runs the timing.</p></div>${button("Export Java OpMode", "export-java", "", !this.program.steps.length)}</div><div class="field"><label for="robot-program-name">Program name</label><input id="robot-program-name" maxlength="60" value="${html(this.program.name)}"></div><ol class="robot-steps">${this.program.steps.map((step, i) => `<li><span class="robot-step-number">${String(i + 1).padStart(2, "0")}</span><div><strong>${html(step.device === null ? "Wait" : this.devices.find((d) => d.id === step.device)?.name || "Missing device")}</strong><span>${step.device === null ? "Keep previous outputs" : `Command ${step.value}`} · ${step.durationMs} ms</span></div><button class="btn" aria-label="Remove step ${i + 1}" data-robot-remove="${i}" ${this.armed ? "disabled" : ""}>Remove</button></li>`).join("") || '<li class="robot-empty-step">Your program starts with a step. Choose a device below.</li>'}</ol><div class="robot-step-form"><div class="field"><label for="robot-step-device">Device</label><select id="robot-step-device"><option value="">Wait</option>${outputs.map((d) => `<option value="${html(d.id)}">${html(d.name)} · ${d.min} to ${d.max}</option>`).join("")}</select></div><div class="field"><label for="robot-step-value">Command value</label><input id="robot-step-value" type="number" step="0.01" value="0"></div><div class="field"><label for="robot-step-duration">Duration (ms)</label><input id="robot-step-duration" type="number" min="100" max="10000" step="100" value="500"></div>${button("Add step", "add-step", "", this.armed)}</div><div class="robot-program-actions">${button("Upload to controller", "upload", "primary", !this.connected || this.armed || !this.program.steps.length)}${button("Run program", "run", "", !this.armed || this.uploaded !== JSON.stringify(this.program) || this.client.snapshot.programStep >= 0)}${button("Save program JSON", "export-program", "", !this.program.steps.length)}<label class="btn robot-import">Import JSON<input type="file" id="robot-import-program" accept=".json,application/json" ${this.armed ? "disabled" : ""}></label></div><p id="robot-program-state" class="robot-copy">${this.uploaded === JSON.stringify(this.program) ? "Uploaded and acknowledged by controller." : "Upload the current program before running it."}</p><div class="robot-notice">An output stays active through following waits until changed. All outputs are disabled at completion or on connection loss. Test programs are limited to 100 steps and 60 seconds. Java export runs as a separate OpMode after you build it in your FTC project.</div></section>`;
  }

  recordings() {
    return `${this.banner()}<section class="panel robot-empty"><h2>Live telemetry recordings</h2><p>Record timestamped controller measurements for every device. Exports identify the configured name, reading, value, and sample time.</p><strong id="robot-sample-count">${this.samples.length} samples in this session</strong><div class="robot-welcome-actions">${button(this.recording ? "Stop recording" : "Record telemetry", "record", "", !this.connected && !this.recording)}${button("Export CSV", "export-telemetry", "primary", !this.samples.length)}</div><p>Session recordings are kept in memory, up to 10,000 device samples. Export before closing the app.</p></section>`;
  }

  profile() {
    return `${this.banner()}<section class="panel robot-empty"><h2>Your connected robot</h2><p>${this.devices.length} configured devices. The controller’s active configuration is the source of device names, ports, and drivers.</p><div class="robot-welcome-actions">${button("Export robot profile", "export-profile", "primary")}${button("Save robot integration", "save-bridge")}${button("Disconnect", "disconnect", "", !this.connected)}</div><p>Runtime limits and direction reset when the bridge restarts. A profile export is a record of your settings; it does not replace the FTC hardware configuration.</p></section>`;
  }

  updateReadings() {
    if (!this.active || !this.client.snapshot) return;
    if (
      this.recording &&
      this.connected &&
      this.lastRecordedSample !== this.client.snapshot.sampleTimeMs
    ) {
      this.lastRecordedSample = this.client.snapshot.sampleTimeMs;
      for (const d of this.devices)
        this.samples.push({
          timestamp: new Date().toISOString(),
          controllerTimeMs: this.client.snapshot.sampleTimeMs,
          device: d.name,
          readings: structuredClone(d.readings || {}),
          error: d.readError || "",
        });
      if (this.samples.length >= 10000) {
        this.samples = this.samples.slice(0, 10000);
        this.recording = false;
        this.notify("Recording reached 10,000 device samples. Export your CSV.");
        this.renderApp();
      }
    }
    const cards = document.getElementById("robot-readings");
    if (cards && this.device) cards.innerHTML = this.readingCards(this.device);
    const error = document.getElementById("robot-reading-error");
    if (error) error.textContent = this.device?.readError || "";
    const status = document.getElementById("robot-status");
    if (status)
      status.textContent = this.connected
        ? this.client.snapshot.status
        : this.client.error || "Disconnected. Readings are stale.";
    const count = document.getElementById("robot-sample-count");
    if (count) count.textContent = `${this.samples.length} samples in this session`;
    for (const exportButton of document.querySelectorAll('[data-robot-action="export-telemetry"]'))
      exportButton.disabled = !this.samples.length;
    const program = document.getElementById("robot-program-state");
    if (program && this.client.snapshot.programStep >= 0)
      program.textContent = `Running step ${this.client.snapshot.programStep + 1} on controller`;
    if (this.client.snapshot.stopFault)
      this.notify(
        `Controller stop fault: ${this.client.snapshot.stopFault}. Use Driver Station STOP.`,
      );
  }

  connectDialog() {
    if (this.connected) {
      this.openDialog(
        "Robot connection",
        `<p class="dialog-description">Connected to ${html(this.address)}. ${this.devices.length} devices imported from the active configuration.</p><div class="robot-notice">Disconnecting disables outputs. Reconnecting always starts with outputs disabled.</div>`,
        button("Disconnect robot", "disconnect", "primary"),
      );
      return;
    }
    this.openDialog(
      "Connect your Control Hub",
      `<p class="dialog-description">Join the robot’s Wi-Fi and INIT OneTester Bridge on Driver Station. Enter the pairing code shown there.</p><div class="field"><label for="robot-address">Controller address</label><input id="robot-address" value="${html(this.address || "192.168.43.1:8585")}" placeholder="192.168.43.1:8585" autocomplete="off"></div><div class="field"><label for="robot-code">Pairing code</label><input id="robot-code" maxlength="8" placeholder="8 characters from Driver Station" autocomplete="off" autocapitalize="characters" spellcheck="false"></div><p id="robot-connect-error" class="robot-error" role="alert">${window.oneTesterDesktop ? "" : "Open the desktop app to connect to real hardware. Browser mode is for the demo."}</p><div class="robot-notice">First time? Save the robot integration and follow its setup guide. Devices are read automatically after pairing.</div>`,
      button("Save integration", "save-bridge") +
        button("Connect & read hardware", "pair", "primary", !window.oneTesterDesktop),
    );
    document.getElementById("robot-code").focus();
  }

  async pair() {
    const address = document.getElementById("robot-address").value.trim();
    const code = document.getElementById("robot-code").value.trim();
    const pair = document.querySelector('[data-robot-action="pair"]');
    pair.disabled = true;
    this.active = true;
    this.uploaded = "";
    try {
      await this.client.connect({ address, code });
      this.address = address;
      this.selected = this.devices[0]?.id;
      document.getElementById("dialog").close();
      this.setView("hardware");
      this.notify(`${this.devices.length} configured devices loaded. Outputs are disabled.`);
    } catch (error) {
      document.getElementById("robot-connect-error").textContent =
        `${error.message} Check robot Wi-Fi, address, and that the bridge is initialized.`;
    } finally {
      pair.disabled = false;
    }
  }

  async stop() {
    if (!this.connected) return;
    try {
      await this.client.command("stop");
      this.notify("Controller acknowledged STOP. Outputs disabled.");
    } catch (error) {
      this.notify(`STOP could not be confirmed: ${error.message}. Use Driver Station STOP.`);
    }
  }

  addStep() {
    const device = document.getElementById("robot-step-device").value || null;
    const value = document.getElementById("robot-step-value").valueAsNumber;
    const durationMs = document.getElementById("robot-step-duration").valueAsNumber;
    const next = {
      ...this.program,
      steps: [...this.program.steps, { device, value: device === null ? 0 : value, durationMs }],
    };
    validateProgram(next, this.devices);
    this.program = next;
    this.uploaded = "";
    this.renderApp();
  }

  async configure() {
    const d = this.device;
    const min = document.getElementById("robot-min").valueAsNumber;
    const max = document.getElementById("robot-max").valueAsNumber;
    const direction = document.getElementById("robot-direction").value;
    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min < (d.type === "servo" ? 0 : -1) ||
      max > 1 ||
      min >= max ||
      (d.type !== "servo" && (min > 0 || max < 0))
    )
      throw new Error(
        "Enter valid limits within the device range. Power limits must include zero.",
      );
    await this.client.command("configure", { device: d.id, min, max, direction });
    this.uploaded = "";
    this.notify("Runtime settings acknowledged by controller.");
    this.renderApp();
  }

  exportTelemetry() {
    const rows = [["timestamp", "controller_time_ms", "device", "reading", "value", "error"]];
    for (const sample of this.samples) {
      const readings = Object.entries(sample.readings);
      if (!readings.length) readings.push(["", ""]);
      for (const [reading, value] of readings)
        rows.push([
          sample.timestamp,
          sample.controllerTimeMs,
          sample.device,
          reading,
          value,
          sample.error,
        ]);
    }
    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            let text = String(value ?? "");
            if (/^[=+@\-\t\r]/.test(text) && typeof value !== "number") text = `'${text}`;
            return `"${text.replaceAll('"', '""')}"`;
          })
          .join(","),
      )
      .join("\r\n");
    this.download("onetester-live-telemetry.csv", csv, "text/csv");
  }

  async perform(action) {
    const handlers = {
      connect: () => this.connectDialog(),
      pair: () => this.pair(),
      hardware: () => this.setView("hardware"),
      demo: async () => {
        if (this.connected) await this.client.disconnect();
        this.active = false;
        this.recording = false;
        this.setView("hardware");
      },
      disconnect: async () => {
        await this.client.disconnect();
        this.recording = false;
        this.uploaded = "";
        document.getElementById("dialog").close();
        this.renderApp();
      },
      "save-bridge": async () => {
        if (window.oneTesterDesktop) {
          if (await window.oneTesterDesktop.saveBridge())
            this.notify("Integration saved in a new folder. Follow OneTester-Setup.md.");
        } else {
          const response = await fetch("robot/OneTesterBridge.java");
          this.download("OneTesterBridge.java", await response.text(), "text/plain");
        }
      },
      stop: () => this.stop(),
      arm: async () => {
        await this.client.command("arm");
        this.notify("Outputs enabled. Apply a command to move a device.");
      },
      refresh: async () => {
        this.client.accept(await this.client.api.call("state"));
        this.renderApp();
      },
      output: async () => {
        const value = document.getElementById("robot-output").valueAsNumber;
        const d = this.device;
        if (!Number.isFinite(value) || value < d.min || value > d.max)
          throw new Error(`Use a value between ${d.min} and ${d.max}.`);
        await this.client.command("output", { device: d.id, value });
        this.notify("Command acknowledged by controller.");
      },
      configure: () => this.configure(),
      record: () => {
        this.recording = !this.recording;
        this.renderApp();
      },
      "export-telemetry": () => this.exportTelemetry(),
      "export-profile": () =>
        this.download(
          "onetester-live-profile.json",
          JSON.stringify(
            {
              protocol: 1,
              source: "controller-hardware-map",
              exportedAt: new Date().toISOString(),
              devices: this.devices,
            },
            null,
            2,
          ),
        ),
      "add-step": () => this.addStep(),
      upload: async () => {
        const submitted = structuredClone(this.program);
        validateProgram(submitted, this.devices);
        await this.client.command("program", submitted);
        this.uploaded = JSON.stringify(submitted);
        this.notify("Program uploaded and acknowledged.");
        this.renderApp();
      },
      run: async () => {
        if (this.uploaded !== JSON.stringify(this.program))
          throw new Error("Upload the current program first.");
        await this.client.command("run");
        this.renderApp();
      },
      "export-program": () =>
        this.download("onetester-program.json", JSON.stringify(this.program, null, 2)),
      "export-java": () =>
        this.download(
          "OneTesterProgram.java",
          generateJava(this.program, this.devices),
          "text/plain",
        ),
    };
    try {
      await handlers[action]?.();
    } catch (error) {
      this.notify(error.message);
    }
  }

  click(event) {
    const target = event.target.closest("button");
    if (!target || target.disabled) return;
    if (target.dataset.robotAction) {
      this.perform(target.dataset.robotAction);
      return;
    }
    if (target.dataset.robotDevice !== undefined) {
      this.selected = target.dataset.robotDevice;
      this.renderApp();
    }
    if (target.dataset.robotTab) {
      this.tab = target.dataset.robotTab;
      this.renderApp();
    }
    if (target.dataset.robotRemove !== undefined && !this.armed) {
      this.program.steps.splice(Number(target.dataset.robotRemove), 1);
      this.uploaded = "";
      this.renderApp();
    }
  }

  async input(event) {
    const el = event.target;
    if (el.id === "robot-search") {
      this.query = el.value;
      document.getElementById("robot-device-list").innerHTML = this.deviceList();
    }
    if (el.id === "robot-program-name") {
      this.program.name = el.value;
      this.uploaded = "";
      const run = document.querySelector('[data-robot-action="run"]');
      if (run) run.disabled = true;
    }
    if (el.id === "robot-import-program" && el.files[0]) {
      try {
        if (el.files[0].size > 65536) throw new Error("Program file is too large.");
        const data = JSON.parse(await el.files[0].text());
        validateProgram(data, this.devices);
        this.program = {
          name: String(data.name || "Imported program").slice(0, 60),
          steps: data.steps.map(({ device, value, durationMs }) => ({ device, value, durationMs })),
        };
        this.uploaded = "";
        this.renderApp();
      } catch (error) {
        this.notify(`Import failed: ${error.message}`);
      }
    }
  }
}
