#!/usr/bin/env python3
"""Transcribe each finished soundtrack (voice + music + SFX) with Whisper and
check every card is heard. Writes audio-check.json."""

import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent
TIMELINE = json.loads((ROOT / "timeline.json").read_text())


DIGITS = "zero one two three four five six seven eight nine".split()


def words(s: str) -> list[str]:
    out = re.findall(r"[a-z0-9]+", s.lower().replace("-", " "))
    return [DIGITS[int(w)] if w.isdigit() and len(w) == 1 else w for w in out]


def main() -> None:
    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    only = set(sys.argv[1:])
    results = {}
    for clip, spec in TIMELINE.items():
        if only and clip not in only:
            continue
        pcm = subprocess.check_output(
            ["ffmpeg", "-v", "error", "-i", str(ROOT / clip / f"{clip}-v3-opus.mp4"), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"]
        )
        audio = np.frombuffer(pcm, dtype=np.float32)
        per = []
        for line in spec["lines"]:
            a, b = int(line["t"] * 16000), int(line["end"] * 16000)
            segs, _ = model.transcribe(np.concatenate([np.zeros(6400, dtype=np.float32), audio[a:b]]), beam_size=5)
            said = " ".join(s.text for s in segs).strip()
            want = words(line["card"])
            got = words(said)
            hit = sum(1 for w in want if w in got)
            per.append({"id": line["id"], "card": line["card"], "slot": [line["t"], line["end"]], "heard": said, "match": round(hit / max(1, len(want)), 2)})
        transcript = " / ".join(p["heard"] for p in per)
        score = round(sum(p["match"] for p in per) / len(per), 2)
        results[clip] = {"model": "faster-whisper small.en", "score": score, "transcript": transcript, "lines": per}
        print(f"{clip}: {score}")
        for p in per:
            print(f"   {p['match']:.2f}  {p['card']!r:40} heard {p['heard']!r}")
    out = ROOT / "audio-check.json"
    prev = json.loads(out.read_text()) if out.exists() else {}
    prev.update(results)
    out.write_text(json.dumps(prev, indent=2) + "\n")


if __name__ == "__main__":
    main()
