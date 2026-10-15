#!/bin/bash
# Render every v3-opus clip: H.264 + AAC mp4 at 720x1280, four section stills,
# and one still with the platform-UI zones overlaid.
set -euo pipefail
cd "$(dirname "$0")"

declare -A IDS=(
  [word-tree]=WordTree [clamp]=Clamp [passing-hand]=PassingHand [alt-screen]=AltScreen
  [shove-test]=ShoveTest [time-machine]=TimeMachine [under-the-label]=UnderTheLabel
  [hidden-uses]=HiddenUses [same-cord]=SameCord
)
if [ $# -gt 0 ]; then CLIPS=("$@"); else
  CLIPS=(word-tree clamp passing-hand alt-screen shove-test time-machine under-the-label hidden-uses same-cord)
fi

for key in "${CLIPS[@]}"; do
  id="${IDS[$key]}"
  out="$key/$key-v3-opus.mp4"
  echo "== $key ($id)"
  npx remotion render src/index.ts "$id" "$key/.raw.mp4" \
    --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k --concurrency=4 --log=error
  ffmpeg -y -v error -i "$key/.raw.mp4" -c copy -movflags +faststart \
    -metadata artist="CA.EYE agents" -metadata comment="CA.EYE agents · v3-opus · Claude Opus 5.5" \
    -metadata title="agent · $key (v3-opus)" "$out"
  rm "$key/.raw.mp4"

  frames=$(python3 - "$key" <<'EOF'
import json, sys
clip = json.load(open("timeline.json"))[sys.argv[1]]
pick = {}
for l in clip["lines"]:
    pick.setdefault(l["section"], l)
out = []
for s in ["word", "meaning", "example", "recap"]:
    l = pick[s]
    t = 0 if s == "word" else l["t"] + min(1.6, (l["end"] - l["t"]) * 0.6)
    out.append(str(int(round(t * 30))))
print(",".join(out))
EOF
)
  rm -rf "$key/stills" && mkdir -p "$key/stills"
  npx remotion render src/index.ts "$id" "$key/stills/f" --sequence --frames="$frames" --image-format=png --log=error
  i=1
  for name in word meaning example recap; do
    f=$(echo "$frames" | cut -d, -f$i)
    mv "$key/stills/f/element-$(printf %03d "$f").png" "$key/stills/0$i-$name.png"
    i=$((i + 1))
  done
  rm -rf "$key/stills/f"
  safe_frame=$(echo "$frames" | cut -d, -f3)
  npx remotion still src/index.ts "$id" "$key/stills/05-safe-zones.png" --frame="$safe_frame" --props='{"safe":true}' --log=error

  ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,sample_rate,channels:format=duration,bit_rate \
    -of json "$out" > "$key/.probe.json"
  ffmpeg -nostats -i "$out" -filter_complex ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):" | tr -s ' ' > "$key/.loudness.txt" || true
done
