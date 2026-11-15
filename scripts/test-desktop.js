import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs/promises";
import path from "node:path";
import { _electron as electron } from "playwright-core";
import { startHarness } from "./mock-controller.js";

const child = startHarness();
let app;
const logs = [];
child.stderr.on("data", (chunk) => logs.push(String(chunk)));
try {
  const [ready] = await once(child.stdout, "data");
  const code = /READY ([A-F0-9]{8})/.exec(String(ready))?.[1];
  assert.ok(code, "Bridge started");
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  app = await electron.launch({
    args: process.env.ONETESTER_APP ? [] : ["."],
    executablePath: process.env.ONETESTER_APP,
    env,
  });
  const page = await app.firstWindow();
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setAlwaysOnTop(true));
  await page.bringToFront();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.getByRole("heading", { name: "Your robot. Ready to read." }).waitFor();
  await fs.mkdir("dist/qa", { recursive: true });
  await page.screenshot({ animations: "disabled", path: "dist/qa/welcome.png" });
  const integrationRoot = path.resolve("dist/qa");
  await app.evaluate(({ dialog, shell }, folder) => {
    dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [folder] });
    shell.openPath = async () => "";
  }, integrationRoot);
  await page.getByRole("button", { name: "Save robot integration", exact: true }).click();
  await page.getByText("Integration saved in a new folder. Follow OneTester-Setup.md.").waitFor();
  const folders = (await fs.readdir(integrationRoot)).filter((name) =>
    name.startsWith("OneTester-Integration-"),
  );
  assert.ok(folders.length);
  const source = await fs.readFile(
    path.join(integrationRoot, folders[folders.length - 1], "OneTesterBridge.java"),
    "utf8",
  );
  assert.ok(source.includes("class OneTesterBridge"));

  await page.getByRole("button", { name: "Connect Control Hub" }).click();
  await page.locator("#robot-address").fill("127.0.0.1:8585");
  await page.locator("#robot-code").fill("00000000");
  await page.getByRole("button", { name: "Connect & read hardware" }).click();
  await page
    .locator("#robot-connect-error")
    .getByText(/Pairing code is incorrect/)
    .waitFor();
  await page.locator("#robot-code").fill(code);
  await page.getByRole("button", { name: "Connect & read hardware" }).click();
  await page.getByText("5 devices from your active FTC hardware map").waitFor();
  assert.equal(await page.locator("[data-robot-device]").count(), 5);
  await page.locator('[data-robot-device="lift"]').click();
  await page.getByRole("tab", { name: "Quick test" }).click();
  assert.equal(await page.getByRole("button", { name: "Apply to device" }).isDisabled(), true);
  await page.getByRole("button", { name: "Enable outputs" }).click();
  await page.getByRole("button", { name: "Disable outputs" }).waitFor();
  await page.locator("#robot-output").fill("0.2");
  await page.getByRole("button", { name: "Apply to device" }).click();
  await page.getByText("Command acknowledged by controller.").waitFor();
  await page.getByRole("tab", { name: "Live readings" }).click();
  await page.getByText("0.4 A", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Record telemetry" }).click();
  await page.waitForFunction(
    () => Number.parseInt(document.querySelector("#robot-sample-count")?.textContent, 10) >= 5,
  );
  await page.getByRole("button", { name: "Stop recording" }).click();
  await page.screenshot({ animations: "disabled", path: "dist/qa/live-hardware.png" });
  await page.getByRole("button", { name: "Stop all", exact: true }).click();
  await page.getByRole("button", { name: "Enable outputs" }).waitFor();
  await page.locator('[data-view="sequences"]').click();
  await page.locator("#robot-step-device").selectOption("claw");
  await page.locator("#robot-step-value").fill("0.6");
  await page.locator("#robot-step-duration").fill("500");
  await page.getByRole("button", { name: "Add step", exact: true }).click();
  await page.getByRole("button", { name: "Upload to controller" }).click();
  await page.getByText("Uploaded and acknowledged by controller.").waitFor();
  await page.screenshot({ animations: "disabled", path: "dist/qa/programmer.png" });
  await page.getByRole("button", { name: "Enable outputs" }).click();
  await page.getByRole("button", { name: "Run program", exact: true }).click();
  await page.getByText("Program completed · outputs disabled", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Enable outputs" }).click();
  child.kill();
  await page.getByText("Connection lost", { exact: true }).waitFor({ timeout: 5000 });
  assert.equal(await page.getByRole("button", { name: "Enable outputs" }).isDisabled(), true);
  assert.deepEqual(errors, []);
  console.log(
    "Desktop passed: bad pairing, discovery, live telemetry, explicit output, recording, STOP, upload/run/completion, connection loss.",
  );
  console.log("Screenshots: dist/qa/");
} catch (error) {
  if (app) {
    const page = await app.firstWindow();
    console.error(await page.locator("body").textContent());
    await page.screenshot({ path: "dist/qa/failure.png" });
  }
  throw error;
} finally {
  child.kill();
  if (app) await app.close();
  if (logs.length) console.error(logs.join(""));
}
