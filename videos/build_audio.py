#!/usr/bin/env python3
"""Build one timed voice track per pilot. Audience pace: slightly slow, clear."""

import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
CUES = json.loads((ROOT / "cues.json").read_text())
PUBLIC = ROOT / "public"
PARTS = PUBLIC / "parts"
VOICE = "en-GB-SoniaNeural"
RATE = "+0%"


def run(args: list[str]) -> None:
    subprocess.check_call(args, stdout=subprocess.DEVNULL)


def duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "csv=p=0",
            str(path),
        ]
    )
    return float(out.strip())


def fit(src: Path, dest: Path, slot: float) -> None:
    trimmed = dest.with_suffix(".trim.mp3")
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-af",
            "silenceremove=start_periods=1:start_threshold=-35dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-35dB:start_silence=0.02,areverse",
            str(trimmed),
        ]
    )
    d = duration(trimmed)
    if d <= slot:
        dest.write_bytes(trimmed.read_bytes())
        return
    tempo = min(d / slot, 1.18)
    if d / slot > 1.18:
        print(f"  still tight {src.name} x{d/slot:.2f} capped at 1.18 (slot {slot:.2f}s)")
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(trimmed),
            "-filter:a",
            f"atempo={tempo:.4f}",
            str(dest),
        ]
    )


async def synth(text: str, path: Path) -> None:
    comm = edge_tts.Communicate(text, VOICE, rate=RATE)
    await comm.save(str(path))


async def main() -> None:
    PARTS.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(6)

    async def limited(text: str, path: Path) -> None:
        if path.exists() and path.stat().st_size > 500:
            return
        async with sem:
            await synth(text, path)

    jobs = []
    for pilot in CUES.values():
        for i, cue in enumerate(pilot["cues"]):
            voice = cue.get("voice")
            if not voice:
                continue
            raw = PARTS / f"{pilot['id']}-{i:02d}-raw.mp3"
            jobs.append(limited(voice, raw))
    await asyncio.gather(*jobs)

    for pilot in CUES.values():
        pid = pilot["id"]
        total = float(pilot["duration"])
        voiced = [(i, c) for i, c in enumerate(pilot["cues"]) if c.get("voice")]
        fitted = []
        for n, (i, cue) in enumerate(voiced):
            raw = PARTS / f"{pid}-{i:02d}-raw.mp3"
            nxt = voiced[n + 1][1]["t"] if n + 1 < len(voiced) else total - 0.05
            slot = max(0.35, nxt - cue["t"] - 0.06)
            out = PARTS / f"{pid}-{i:02d}.mp3"
            fit(raw, out, slot)
            fitted.append((cue["t"], out))

        base = PARTS / f"{pid}-base.wav"
        run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "lavfi",
                "-i",
                "anullsrc=r=44100:cl=stereo",
                "-t",
                str(total),
                "-c:a",
                "pcm_s16le",
                str(base),
            ]
        )
        current = base
        for k, (t, path) in enumerate(fitted):
            nxt = PARTS / f"{pid}-mix-{k}.wav"
            ms = int(round(t * 1000))
            run(
                [
                    "ffmpeg",
                    "-y",
                    "-i",
                    str(current),
                    "-i",
                    str(path),
                    "-filter_complex",
                    f"[1]adelay={ms}|{ms}[d];[0][d]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]",
                    "-map",
                    "[out]",
                    "-c:a",
                    "pcm_s16le",
                    str(nxt),
                ]
            )
            current = nxt
        wav = PUBLIC / f"{pid}.wav"
        wav.write_bytes(current.read_bytes())
        print(f"wrote {wav}")


if __name__ == "__main__":
    asyncio.run(main())
