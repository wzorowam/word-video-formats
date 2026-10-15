#!/usr/bin/env python3
"""Piper is stochastic, so a line can come out mumbled. For each named line,
synthesise up to N takes, transcribe each one alone with Whisper, and keep the
first take whose words match the card. Usage: pick_takes.py clip:line ..."""

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent
SCRIPT = json.loads((ROOT / "script.json").read_text())
PARTS = ROOT / ".parts"
MODEL = ROOT / ".voices" / "ljspeech-en_US-ljspeech-high.onnx"
TRIES = 5


def words(s: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", s.lower().replace("-", " "))


def main() -> None:
    asr = WhisperModel("small.en", device="cpu", compute_type="int8")
    log = {}
    for arg in sys.argv[1:]:
        clip, lid = arg.split(":")
        line = next(l for l in SCRIPT[clip]["lines"] if l["id"] == lid)
        text = line.get("say", line["card"])
        want = words(line["card"])
        best = (-1.0, None, "")
        for k in range(TRIES):
            take = PARTS / f"{clip}-{lid}.take{k}.wav"
            subprocess.run(
                [sys.executable, "-m", "piper", "-m", str(MODEL), "-f", str(take), "--length-scale", "1.08", "--sentence-silence", "0.25"],
                input=text.encode(), check=True, capture_output=True,
            )
            pcm = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(take), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"])
            segs, _ = asr.transcribe(np.frombuffer(pcm, dtype=np.float32), beam_size=5)
            heard = " ".join(s.text for s in segs)
            got = words(heard)
            score = sum(1 for w in want if w in got) / len(want)
            print(f"{clip}:{lid} take {k}: {score:.2f} {heard!r}")
            if score > best[0]:
                best = (score, take, heard)
            if score == 1.0:
                break
        shutil.copy(best[1], PARTS / f"{clip}-{lid}.raw.wav")
        (PARTS / f"{clip}-{lid}.raw.txt").write_text(text)
        log[arg] = {"takes": k + 1, "kept_score": round(best[0], 2), "heard": best[2].strip()}
    out = ROOT / "takes.json"
    prev = json.loads(out.read_text()) if out.exists() else {}
    prev.update(log)
    out.write_text(json.dumps(prev, indent=2) + "\n")


if __name__ == "__main__":
    main()
