# Connect OneTester to a REV Control Hub

OneTester is a macOS desktop app with an FTC robot-side OpMode. The included `OneTesterBridge.java` uses only classes already supplied by FTC RobotCore; no Dashboard or extra Gradle dependency is needed. It has been compiled against FTC SDK 12.0.0. The current integration is a bench-test tool, and must be validated on your robot before use.

## One-time installation

1. Configure and name your motors, positional servos, continuous-rotation servos, and sensors in the Robot Controller's active configuration. OneTester imports this configuration; it cannot detect unconfigured passive electronics or identify a PWM servo model.
2. Add `OneTesterBridge.java` to your robot project:
   - **OnBot Java:** join the Control Hub Wi-Fi, open `http://192.168.43.1:8080` in your browser, open OnBot Java, upload the file, and Build Everything.
   - **Android Studio:** copy the file into `TeamCode/src/main/java/org/firstinspires/ftc/teamcode/`, then build and install the Robot Controller app using your team's normal process.
3. On Driver Station select **TeleOp → OneTester Bridge**, then **INIT**. Its 8-character pairing code appears in telemetry. The code changes each time the bridge is initialized.
4. Open OneTester on your Mac. Join the same robot Wi-Fi, select **Connect Control Hub**, enter `192.168.43.1:8585` and the pairing code. Use the controller's actual IPv4 address if it differs. The hardware list and live readings load automatically.
5. For physical tests, press **START** on Driver Station, then **Enable outputs** in OneTester. Connecting or enabling outputs does not itself send a movement command. Select a device, open **Quick test**, enter a value, and press **Apply to device**.

The desktop app communicates directly over the robot's private Wi-Fi. Internet access is not needed after installation. Do not expose bridge port 8585 to the public internet. The connection is authenticated with the displayed session code and a single desktop lease, but uses unencrypted HTTP on the local robot network.

## What is supported

| Hardware | Reading | Command |
| --- | --- | --- |
| DC motor | Encoder position; current and velocity for `DcMotorEx` | Power, direction, power limits |
| Positional servo | Last commanded position, not measured shaft position | Position, direction, logical position limits |
| Continuous-rotation servo | Commanded power | Power, direction, power limits |
| Distance / color / touch sensors | Driver-supported values | Read only |
| Analog / digital input | Voltage / digital state | Read only; mode remains controller-defined |
| Voltage sensor | Voltage | Read only |
| SDK IMU | Yaw, pitch, roll if already initialized | Read only |
| Other configured hardware | Name, connection, driver-reported model | Listed as unsupported |

IMU mounting orientation must be initialized correctly in your FTC project. The generic bridge does not assume an orientation. Camera streams, vendor firmware flashing, vendor servo mode programming, encoder position/velocity commands, closed-loop tuning, and autonomous trajectory execution are not implemented in this bridge. The PID and trajectory workspaces in the app remain labeled demos.

## Runtime settings and programs

Disable outputs to change logical limits/direction or upload a program. Settings last for the current bridge session. Export a profile JSON to keep a record; it does not rewrite the FTC hardware configuration. Power limits must include zero.

In **Programmer**, add a device command and a duration, or a wait. A command remains in effect through subsequent steps until replaced. **Upload to controller** validates the whole program without running it. Then enable outputs and press **Run program**. Timing runs on the controller's OpMode loop. Programs are limited to 100 steps, 10 seconds per step, and 60 seconds total. All outputs are disabled when a run ends. Programs are held in controller memory and lost when the OpMode restarts; export JSON to keep and reimport one.

**Export Java OpMode** generates `OneTesterProgram.java` using the configured device names and directions. Upload/build this separately in OnBot Java or Android Studio. It is a standalone OpMode with Driver Station stop checks and output cleanup; it does not depend on the desktop heartbeat. Review the generated routine and mechanism limits before running it.

## Stop behavior

- **Stop all**, **Disable outputs**, a disconnect, or a missed heartbeat for more than 1.2 seconds disables outputs and cancels the running program.
- Motors and continuous-rotation servos receive zero power. Positional servo PWM is disabled where `ServoControllerEx` supports it. A servo without that capability may keep its last command; use Driver Station STOP and the robot's power switch as appropriate.
- Disabling servo PWM can remove holding torque. Support gravity-loaded mechanisms during tests.
- The desktop requests STOP when its window closes or becomes hidden. If the desktop crashes or the network fails, the controller watchdog handles the loss.
- No automatic reconnect, re-arm, or program restart occurs. A new connection starts read only.
- The watchdog runs on the OpMode loop. It is not an independent hardware emergency stop and cannot guarantee timing if a hardware driver blocks the loop. Keep Driver Station STOP accessible.

## Troubleshooting

- **No connection:** check robot Wi-Fi, INIT status, address, and port 8585. Restarting the bridge changes its pairing code. Only one desktop can own the session.
- **Empty list / missing device:** update the active FTC hardware configuration and restart the bridge. Refresh readings cannot invent a new configured device.
- **Device unplugged but still listed:** the list reflects configuration, not electrical presence. Many passive devices have no presence or model detection.
- **Reading unavailable:** the configured driver may need initialization or the sensor may be disconnected. OneTester shows the read error instead of substituting simulated values.
- **Outputs disabled:** press START on Driver Station and enable outputs. A lost acknowledgement closes the desktop session; reconnect before retrying.
- **macOS refuses an unsigned download:** these development builds are not notarized. For your own verified build, use System Settings → Privacy & Security → Open Anyway if macOS offers it. Distribution to other users should use a Developer ID signed and notarized build.

References: [FTC configuration guide](https://ftc-docs.firstinspires.org/en/latest/hardware_and_software_configuration/configuring/getting_started/getting-started.html), [FTC SDK](https://github.com/FIRST-Tech-Challenge/FtcRobotController).
