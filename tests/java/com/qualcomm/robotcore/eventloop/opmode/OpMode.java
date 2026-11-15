package com.qualcomm.robotcore.eventloop.opmode;
import com.qualcomm.robotcore.hardware.HardwareMap;
import org.firstinspires.ftc.robotcore.external.Telemetry;
/** Test-only lifecycle host. Hardware interfaces and HTTP server use the real FTC SDK jar. */
public abstract class OpMode {
    public HardwareMap hardwareMap;
    public Telemetry telemetry;
    public abstract void init();
    public void init_loop() {}
    public void start() {}
    public abstract void loop();
    public void stop() {}
}
