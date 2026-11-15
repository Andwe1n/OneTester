// Runs the real Java bridge against simulated SDK hardware. No robot is contacted.
import { spawn } from "node:child_process";
import path from "node:path";
export function startHarness(args = []) {
  const cache = process.env.ONETESTER_SDK_CACHE || "/tmp/onetester-sdk";
  const java = path.join(
    process.env.ONETESTER_JDK || "/Applications/Android Studio.app/Contents/jbr/Contents/Home",
    "bin/java",
  );
  return spawn(
    java,
    [
      "-cp",
      `${cache}/harness:${cache}/core/classes.jar:${cache}/json.jar`,
      "BridgeHarness",
      ...args,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const child = startHarness();
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
}
