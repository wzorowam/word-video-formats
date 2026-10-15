#!/bin/bash
# Render every agent-series clip at 720x1280 with AAC audio.
set -euo pipefail
cd "$(dirname "$0")"
python3 audio/generate.py
CHROME=/usr/local/bin/google-chrome

render() {
  local id="$1" dir="$2" frame="$3"
  npx remotion render src/index.ts "$id" "$dir/render.mp4" \
    --browser-executable="$CHROME" \
    --concurrency=2 \
    --codec=h264 \
    --audio-codec=aac \
    --crf=20 \
    --pixel-format=yuv420p
  npx remotion still src/index.ts "$id" "$dir/still.png" \
    --browser-executable="$CHROME" \
    --frame="$frame"
}

render AiAgent ai-agent 252
render SecretAgent secret-agent 352
render TalentAgent talent-agent 352
render ChemicalAgent chemical-agent 388
render FreeAgent free-agent 360
render ChangeAgent change-agent 370
render GrammaticalAgent grammatical-agent 360
render SomeonesAgent someones-agent 370
render ServiceAgent service-agent 355

python3 - << 'PY'
import json, subprocess
from pathlib import Path
ok = True
for slug in ["ai-agent","secret-agent","talent-agent","chemical-agent","free-agent","change-agent","grammatical-agent","someones-agent","service-agent"]:
    path = Path(slug) / "render.mp4"
    raw = subprocess.check_output([
        "ffprobe","-v","error","-show_entries","format=duration","-show_entries","stream=codec_type,codec_name,width,height",
        "-of","json",str(path)
    ])
    data = json.loads(raw)
    duration = float(data["format"]["duration"])
    streams = data["streams"]
    video = next(s for s in streams if s["codec_type"]=="video")
    audio = [s for s in streams if s["codec_type"]=="audio"]
    good = (
        int(video["width"])==720 and int(video["height"])==1280
        and 20 <= duration <= 30
        and len(audio)==1 and audio[0]["codec_name"]=="aac"
    )
    print(f"{slug} {duration:.3f}s {video['width']}x{video['height']} audio={audio[0]['codec_name'] if audio else 'NONE'} {'OK' if good else 'FAIL'}")
    ok = ok and good
if not ok:
    raise SystemExit(1)
PY
