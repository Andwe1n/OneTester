# OneTester: product direction

## Implemented in 0.4

The project now includes a macOS Electron app and an FTC SDK 12-compatible robot bridge. The connected workspace imports the configured hardware map, polls live telemetry, applies runtime limits/direction and device commands, records CSV, and uploads/runs timed programs on the robot. Java OpMode export is also available. The original prototype below remains available as an explicit demo. PID/trajectory execution, vendor firmware programming, unconfigured device discovery, and camera adapters remain outside the connected implementation. See [README.md](README.md) and [robot setup](robot/README.md) for current behavior.

The remaining sections preserve the original design brief; their first-deliverable/future wording describes the prototype stage.

## First deliverable

A desktop-first, local interactive visual prototype for FTC teams. It demonstrates the workflow with clearly labeled simulated devices and telemetry. This stage has no robot connection, hardware discovery, device programming, or physical motion.

The immediate design goal is a settings workspace where a student can select a device, inspect its capabilities, adjust its configuration, and test the result. Keep configuration fields and exact values prominent.

## Core model

- **Robot profile:** named hardware, hub/port assignments, device capabilities, mechanism limits, saved presets, and drivetrain configuration.
- **Device:** a capability-based interface, rather than a universal panel. Positional servos accept target positions; continuous-rotation servos accept power/direction; motors may expose encoder position, velocity, or current; sensors expose the measurements their driver supports. Manufacturer adapters can extend this model later. “All hardware” is a coverage goal, not a first-version compatibility promise.
- **Mechanism:** a meaningful grouping such as claw, lift, or intake. Teams work with these names while retaining access to exact ports and device types.
- **Recipe:** a saved set of actions and settings that can be repeated. A recipe can later combine mechanisms, waits, conditions, and trajectory actions.
- **Run:** the recipe/configuration snapshot plus timestamped observations and notes.

Keep **commanded position** separate from **measured position**. Sending a conventional servo a target does not establish that its physical shaft reached that target. Only display actual position when a supported feedback source supplies it. Use normalized servo values by default; show degrees only with an explicit, calibrated mapping. The FTC SDK’s position accessor reports the last command rather than sensor feedback. [FTC SDK servo reference](https://javadoc.io/static/org.firstinspires.ftc/RobotCore/6.2.1/com/qualcomm/robotcore/hardware/ServoImpl.html)

Also distinguish **runtime setup** from **vendor programming**. Presets, direction, logical limits, and sequences belong in the main runtime workflow. Changing firmware-level modes or stored angular limits may require a manufacturer-specific programmer and supported integration. REV's SRS Programmer, for example, changes operating modes and angular limits. [REV SRS Programmer documentation](https://docs.revrobotics.com/rev-crossover-products/servo/srs-programmer)

## Navigation and first screen

1. **Hardware:** device settings, quick tests, and activity.
2. **Sequences:** reusable mechanism actions and ordered tests.
3. **PID tuner:** targets, gain settings, response traces, and run comparisons.
4. **Trajectories:** waypoints, headings, constraints, simulation, and action markers.
5. **Test runs:** recorded results and configuration comparisons.
6. **Robot profiles:** hardware mapping and reusable robot configurations.

Start on Hardware with the wrist servo selected and **Settings** open. Use labeled side navigation, a compact device list, and a generous configuration area. Group operating limits and direction into clear settings sections. Show model, port, and supported capabilities as read-only information. Keep robot identity, demo/connection state, and Stop visible in the header.

Keep each device's unsaved settings in a session draft when switching tabs, devices, or workspaces. Save commits valid local configuration; Revert restores that device's last saved settings. Show the draft state beside these actions and keep temporary test commands distinct from configuration changes.

Put position input, power controls, sliders, and named presets in **Quick test**, with controls matched to device capabilities. **Activity** contains recent commands. Trajectory editing stays in its dedicated workspace. Remove the robot illustration, route promotion, and radial gauges from Hardware.

## Visual direction

Retain the reference's near-black canvas, charcoal surfaces, white text, and pale-blue interactive accents. Use compact rows, labeled controls, and restrained rounded corners to support settings work. Blue marks selected devices, primary actions, sliders, links, and keyboard focus. Keep green, amber, and red for meaningful status; red Stop should remain easy to distinguish.

Prioritize clear labels, visible units, tabular numerals, and readable plots. Keep interface surfaces neutral and use illustrations only when they represent known hardware accurately and help a specific task. Interactive states must also be communicated by labels, shape, or borders so color is not the only cue.

## Five ideas worth exploring

1. **Named mechanism presets:** save “claw open” and “intake deployed” with the values and configuration that produced them.
2. **Guided commissioning:** identify a port, verify direction, establish a usable range, name the mechanism, and save the robot profile.
3. **Repeatable test recipes:** retain commands, durations, targets, and configuration together so another teammate can reproduce a result.
4. **Before/after comparisons:** overlay response traces and identify which gains, limits, or targets changed between runs.
5. **Trajectory action markers:** attach mechanism actions to a path and preview their timing. Road Runner's action model is a useful future integration target because it composes sequential and parallel robot behaviors. [Road Runner actions documentation](https://rr.brott.dev/docs/v1-0/actions/)

## Future implementation boundary

Use a robot-side agent/OpMode to access the FTC SDK and supported device drivers. The desktop application sends intentional commands and configuration, receives telemetry, and records runs. Keep time-sensitive PID, trajectory following, sequence execution, and loss-of-connection behavior on the robot; network/UI timing should not drive a control loop.

Define a versioned capability and command protocol before promising broad manufacturer support. Evaluate an FTC Dashboard adapter before creating an overlapping transport: its existing architecture places a Java server beside robot code and a browser client across a WebSocket connection. [FTC Dashboard source and architecture](https://github.com/acmerobotics/ftc-dashboard)

## Open brainstorming decisions

1. Who should the first release help most: a new programmer commissioning hardware, or an experienced programmer tuning mechanisms?
2. Should the first robot integration extend a team's existing FTC project, or provide a dedicated OneTester test OpMode?
3. What should “servo programming” include first: runtime presets/sequences, supported vendor-level programming, or a staged path covering both?
