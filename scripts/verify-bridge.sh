#!/bin/sh
set -eu
# SDK artifacts are cached outside the source tree. Override for CI or another Mac.
ONETESTER_SDK_CACHE=${ONETESTER_SDK_CACHE:-/tmp/onetester-sdk}
ONETESTER_JDK=${ONETESTER_JDK:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}
ONETESTER_ANDROID_JAR=${ONETESTER_ANDROID_JAR:-$HOME/Library/Android/sdk/platforms/android-30/android.jar}
mkdir -p "$ONETESTER_SDK_CACHE/core" "$ONETESTER_SDK_CACHE/compiled" "$ONETESTER_SDK_CACHE/harness"
if [ ! -f "$ONETESTER_SDK_CACHE/core/classes.jar" ]; then
  curl -fsSL https://repo.maven.apache.org/maven2/org/firstinspires/ftc/RobotCore/12.0.0/RobotCore-12.0.0.aar -o "$ONETESTER_SDK_CACHE/RobotCore.aar"
  unzip -oq "$ONETESTER_SDK_CACHE/RobotCore.aar" classes.jar -d "$ONETESTER_SDK_CACHE/core"
fi
if [ ! -f "$ONETESTER_SDK_CACHE/json.jar" ]; then
  curl -fsSL https://repo.maven.apache.org/maven2/org/json/json/20250517/json-20250517.jar -o "$ONETESTER_SDK_CACHE/json.jar"
fi
"$ONETESTER_JDK/bin/javac" -Xlint:all -classpath "$ONETESTER_SDK_CACHE/core/classes.jar:$ONETESTER_ANDROID_JAR" -d "$ONETESTER_SDK_CACHE/compiled" robot/OneTesterBridge.java
"$ONETESTER_JDK/bin/javac" -classpath "$ONETESTER_SDK_CACHE/core/classes.jar:$ONETESTER_ANDROID_JAR:$ONETESTER_SDK_CACHE/json.jar" -d "$ONETESTER_SDK_CACHE/harness" tests/java/com/qualcomm/robotcore/eventloop/opmode/OpMode.java tests/java/com/qualcomm/robotcore/hardware/HardwareMap.java tests/java/BridgeHarness.java robot/OneTesterBridge.java
