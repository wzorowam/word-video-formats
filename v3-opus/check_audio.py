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


def words(s: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", s.lower().replace("-", " "))


def main() -> None:
    model = WhisperModel("base.en", device="cpu", compute_type="int8")
    only = set(sys.argv[1:])
    results = {}
    for clip, spec in TIMELINE.items():
        if only and clip not in only:
            continue
        pcm = subprocess.check_output(
            ["ffmpeg", "-v", "error", "-i", str(ROOT / "public" / f"{clip}.wav"), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"]
        )
        segs, _ = model.transcribe(np.frombuffer(pcm, dtype=np.float32), beam_size=5, word_timestamps=True)
        heard = [(w.start, w.word) for s in segs for w in (s.words or [])]
        per = []
        for line in spec["lines"]:
            said = " ".join(w for st, w in heard if line["t"] - 0.4 <= st < line["end"] - 0.3)
            want = words(line["card"])
            got = words(said)
            hit = sum(1 for w in want if w in got)
            per.append({"id": line["id"], "card": line["card"], "heard": said.strip(), "match": round(hit / max(1, len(want)), 2)})
        score = round(sum(p["match"] for p in per) / len(per), 2)
        results[clip] = {"score": score, "lines": per}
        print(f"{clip}: {score}")
        for p in per:
            print(f"   {p['match']:.2f}  {p['card']!r:40} heard {p['heard']!r}")
    out = ROOT / "audio-check.json"
    prev = json.loads(out.read_text()) if out.exists() else {}
    prev.update(results)
    out.write_text(json.dumps(prev, indent=2) + "\n")


if __name__ == "__main__":
    main()
