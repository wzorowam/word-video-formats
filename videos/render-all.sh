#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p /opt/cursor/artifacts
declare -A IDS=(
  [passing-hand]=PassingHand
  [word-tree]=WordTree
  [clamp]=Clamp
  [time-machine]=TimeMachine
  [under-the-label]=UnderTheLabel
  [hidden-uses]=HiddenUses
  [shove-test]=ShoveTest
  [same-cord]=SameCord
  [alt-screen]=AltScreen
)
declare -A STILL=(
  [passing-hand]=1080
  [word-tree]=1290
  [clamp]=840
  [time-machine]=1200
  [under-the-label]=780
  [hidden-uses]=990
  [shove-test]=1230
  [same-cord]=1200
  [alt-screen]=720
)
for key in passing-hand word-tree clamp time-machine under-the-label hidden-uses shove-test same-cord alt-screen; do
  id="${IDS[$key]}"
  out="$key/render.mp4"
  echo "rendering $id"
  npx remotion render src/index.ts "$id" "$out" --codec=h264 --crf=28 --concurrency=3
  ffmpeg -y -i "$out" -c copy -metadata comment="CA.EYE agents" -metadata artist="CA.EYE agents" "$key/render-tagged.mp4"
  mv "$key/render-tagged.mp4" "$out"
  ffmpeg -y -ss "$(python3 -c "print(${STILL[$key]}/30)")" -i "$out" -frames:v 1 "/opt/cursor/artifacts/${key}.png"
done
