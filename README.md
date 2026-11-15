# OneTester

A downloadable macOS workbench for REV Control Hub robots. Connect to the included FTC bridge to import configured hardware, read telemetry, apply runtime settings and output commands, and upload timed mechanism programs.

The app opens in the robot workspace. **Explore the demo** retains the existing simulated hardware, PID, trajectory, and sequence prototype. Demo controls never send robot commands.

## Use the app

Build archives are written to `dist/OneTester-0.4.0-arm64.zip` (Apple silicon) and `dist/OneTester-0.4.0-x64.zip` (Intel). Requires macOS 13 or newer. Unzip and move `OneTester.app` to Applications. Development archives are unsigned and not notarized.

Click **Save robot integration** in the app, then follow [the Control Hub setup guide](robot/README.md). Install `OneTesterBridge.java` once through OnBot Java or your team's Android Studio project. INIT it on Driver Station, join the robot Wi-Fi, and pair using its displayed code. Hardware discovery and live readings start automatically. Physical commands require Driver Station START and **Enable outputs**.

The bridge reads the active FTC hardware configuration. It cannot identify an unconfigured passive device or verify that a PWM servo is physically connected. Generic vendor firmware flashing is outside this integration. Motor power, servo position, CR-servo power, limits/direction, supported sensor readings, live CSV recording, and timed program upload/run are implemented. Profiles and Java OpModes can be exported. PID and trajectory execution remain demo-only.

## Development

Requires Bun and Node 22.12+.

```sh
bun install --frozen-lockfile
# Electron 45+ installs its platform runtime explicitly:
node node_modules/electron/install.js
bun run desktop
```

`bun run dev` serves the browser demo on `http://127.0.0.1:4173`. Real connections use the Electron main process; the browser version cannot connect to the bridge.

```sh
bun run check                  # Biome formatting/lint + syntax
bun run test                   # Protocol and client tests
bun run test:bridge            # Compile against FTC SDK + actual bridge integration tests
bun run test:desktop           # Actual Electron UI against the Java bridge with simulated devices
bun run package:mac            # Apple silicon and Intel ZIPs
```

Bridge tests require a JDK, an Android `android.jar`, and downloads from Maven Central on the first run. On this Mac they default to Android Studio's JDK and Android SDK platform 30. On another machine, set `ONETESTER_JDK`, `ONETESTER_ANDROID_JAR`, and optionally `ONETESTER_SDK_CACHE`. `scripts/verify-bridge.sh` compiles production source against real FTC SDK 12.0.0 before compiling a test harness. The harness substitutes the Android OpMode lifecycle and hardware registry, uses simulated device interfaces, and runs the actual bridge HTTP server and control logic. It does not establish physical hardware compatibility.

## Architecture and quality

- `desktop/`: sandboxed Electron renderer, narrow preload API, authenticated local-network HTTP transport. No remote page navigation or renderer Node access.
- `robot/OneTesterBridge.java`: hardware discovery, serialized OpMode commands, validation, telemetry, single-client lease, robot-side sequence timing, stop and watchdog handling. Uses the NanoHTTPD supplied in RobotCore.
- `lib/`: protocol validation, controller client lifecycle, and Java generator.
- `live-workbench.js`: connected hardware, readings, controls, settings, program builder, and recordings.
- `app.js`: existing demo workspace and shared navigation.

The Plankton skill's format-and-verify workflow is applied with Biome across all JavaScript/JSON and the same checks in CI. No linter rules are disabled to pass. The skill's Claude-specific autonomous hooks are not installed or represented as active in Codex. Use `bun run format` after edits, followed by `bun run check`.

See [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) for the original design and the current implementation boundary. No physical Control Hub was available during development; validate stop behavior and each mechanism on supported hardware before relying on it.
