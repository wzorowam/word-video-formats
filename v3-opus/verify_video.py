#!/usr/bin/env python3
"""Check each rendered mp4 against the visual rules and write <clip>/.verify.json.

- safe zones: no bright (text/line) pixel outside the safe rectangle, any frame
- motion: the largest frame-to-frame change, as a share of pixels that changed
  noticeably (a bare pop-in shows up as a one-frame spike)
- frame 1: share of bright pixels inside the target-word band on frame 0
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
W, H = 720, 1280
SAFE = {"top": 180, "bottom": 950, "left": 56, "right": 592}
WORD_BAND = (250, 370)


def frames(path: Path):
    proc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        stdout=subprocess.PIPE,
    )
    size = W * H
    while True:
        buf = proc.stdout.read(size)
        if len(buf) < size:
            break
        yield np.frombuffer(buf, dtype=np.uint8).reshape(H, W)
    proc.wait()


def main() -> None:
    clips = sys.argv[1:] or [p.parent.name for p in sorted(ROOT.glob("*/*-v3-opus.mp4"))]
    for clip in clips:
        mp4 = ROOT / clip / f"{clip}-v3-opus.mp4"
        outside = np.ones((H, W), dtype=bool)
        outside[SAFE["top"]:SAFE["bottom"], SAFE["left"]:SAFE["right"]] = False
        worst_outside, worst_outside_frame = 0, -1
        prev = None
        diffs = []
        word_frame0 = None
        for i, f in enumerate(frames(mp4)):
            if i == 0:
                band = f[WORD_BAND[0]:WORD_BAND[1], SAFE["left"]:SAFE["right"]]
                word_frame0 = round(float((band > 140).mean()), 3)
            n = int((f[outside] > 90).sum())
            if n > worst_outside:
                worst_outside, worst_outside_frame = n, i
            if prev is not None:
                diffs.append(float((np.abs(f.astype(np.int16) - prev) > 40).mean()))
            prev = f.astype(np.int16)
        d = np.array(diffs)
        top = np.argsort(d)[-3:][::-1]
        res = {
            "frames": len(diffs) + 1,
            "bright_pixels_outside_safe_zone": worst_outside,
            "worst_outside_frame": worst_outside_frame,
            "frame0_word_band_bright_share": word_frame0,
            "median_frame_change": round(float(np.median(d)), 4),
            "max_frame_change": round(float(d.max()), 4),
            "max_change_frames": [int(k) + 1 for k in top],
            "frames_with_no_change": int((d == 0).sum()),
        }
        (ROOT / clip / ".verify.json").write_text(json.dumps(res, indent=2) + "\n")
        print(clip, res)


if __name__ == "__main__":
    main()
