#!/usr/bin/env python3
"""Build a 26.0s mix for every agent-series clip.

TTS: Flite 2.2, voice slt (cmu_us_slt, CMU ARCTIC). The engine carries the
Carnegie Mellon BSD-style Flite grant (use and distribute without
restriction). The voice is free for any purpose:
https://www.festvox.org/cmu_arctic/

Music and SFX are original signals from this file, dedicated CC0 1.0:
https://creativecommons.org/publicdomain/zero/1.0/
"""

from __future__ import annotations

import array
import json
import math
import random
import subprocess
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CUES = Path(__file__).resolve().parent / "cues.json"
BUILD = Path(__file__).resolve().parent / "build"
PUBLIC = ROOT / "public" / "audio"
FPS = 30
DURATION = 26.0
SR = 48000
N = int(DURATION * SR)

TRANSPOSE = {
    "ai-agent": 0,
    "secret-agent": -2,
    "talent-agent": 3,
    "chemical-agent": 5,
    "free-agent": -4,
    "change-agent": 2,
    "grammatical-agent": -5,
    "someones-agent": 4,
    "service-agent": 1,
}


def write_wav(path: Path, samples: list[float], sr: int = SR) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frames = array.array("h", (int(max(-1.0, min(1.0, s)) * 32767) for s in samples))
    with wave.open(str(path), "w") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(sr)
        handle.writeframes(frames.tobytes())


def read_wav(path: Path) -> tuple[list[float], int]:
    with wave.open(str(path), "r") as handle:
        sr = handle.getframerate()
        count = handle.getnframes()
        channels = handle.getnchannels()
        width = handle.getsampwidth()
        raw = handle.readframes(count)
    if width != 2:
        raise RuntimeError(f"expected 16-bit wav: {path}")
    frames = array.array("h")
    frames.frombytes(raw)
    if channels == 1:
        data = [v / 32768.0 for v in frames]
    else:
        data = [frames[i] / 32768.0 for i in range(0, len(frames), channels)]
    return data, sr


def resample(samples: list[float], src_sr: int, dst_sr: int = SR) -> list[float]:
    if src_sr == dst_sr or not samples:
        return samples
    out_len = int(round(len(samples) * dst_sr / src_sr))
    if out_len <= 1:
        return samples[:1]
    scale = (len(samples) - 1) / (out_len - 1)
    out: list[float] = []
    last = len(samples) - 1
    for i in range(out_len):
        pos = i * scale
        j = int(pos)
        frac = pos - j
        a = samples[j]
        b = samples[min(j + 1, last)]
        out.append(a * (1 - frac) + b * frac)
    return out


def fade(samples: list[float], ms: float = 8) -> list[float]:
    ramp = max(1, int(SR * ms / 1000))
    out = samples[:]
    for i in range(min(ramp, len(out))):
        g = i / ramp
        out[i] *= g
        out[-1 - i] *= g
    return out


def normalize(samples: list[float], peak: float) -> list[float]:
    top = max((abs(s) for s in samples), default=1.0) or 1.0
    gain = peak / top
    return [s * gain for s in samples]


def synth_spring() -> list[float]:
    dur = 0.34
    count = int(SR * dur)
    phase = 0.0
    out = []
    for i in range(count):
        t = i / SR
        freq = 140 + 380 * math.exp(-t * 7.5)
        phase += 2 * math.pi * freq / SR
        amp = math.exp(-t * 6.2) * min(1.0, t / 0.012)
        out.append(math.sin(phase) * amp)
    return fade(normalize(out, 0.8), 6)


def synth_whoosh() -> list[float]:
    dur = 0.36
    count = int(SR * dur)
    rng = random.Random(11)
    low = 0.0
    lower = 0.0
    out = []
    for i in range(count):
        t = i / SR
        noise = rng.random() * 2 - 1
        low += (noise - low) * 0.16
        lower += (low - lower) * 0.04
        env = math.sin(min(1.0, t / dur) * math.pi) ** 1.3
        out.append((low - lower) * env)
    return fade(normalize(out, 0.75), 10)


def synth_tick() -> list[float]:
    dur = 0.07
    count = int(SR * dur)
    phase = 0.0
    out = []
    for i in range(count):
        t = i / SR
        phase += 2 * math.pi * 740 / SR
        out.append(math.sin(phase) * math.exp(-t * 46))
    return fade(normalize(out, 0.65), 3)


def synth_drip() -> list[float]:
    dur = 0.22
    count = int(SR * dur)
    phase = 0.0
    out = []
    for i in range(count):
        t = i / SR
        freq = 620 * math.exp(-t * 8)
        phase += 2 * math.pi * freq / SR
        out.append(math.sin(phase) * math.exp(-t * 11) * min(1.0, t / 0.008))
    return fade(normalize(out, 0.7), 4)


def synth_slide() -> list[float]:
    dur = 0.42
    count = int(SR * dur)
    rng = random.Random(17)
    low = 0.0
    out = []
    for i in range(count):
        t = i / SR
        noise = rng.random() * 2 - 1
        low += (noise - low) * (0.05 + 0.2 * t)
        env = math.sin(min(1.0, t / dur) * math.pi) ** 1.1
        out.append(low * env)
    return fade(normalize(out, 0.7), 12)


def synth_thud() -> list[float]:
    dur = 0.24
    count = int(SR * dur)
    rng = random.Random(23)
    phase = 0.0
    out = []
    for i in range(count):
        t = i / SR
        phase += 2 * math.pi * (80 + 50 * math.exp(-t * 10)) / SR
        noise = (rng.random() * 2 - 1) * math.exp(-t * 28)
        out.append(math.sin(phase) * math.exp(-t * 9) * 0.75 + noise * 0.2)
    return fade(normalize(out, 0.75), 5)


SFX = {
    "spring": synth_spring,
    "whoosh": synth_whoosh,
    "tick": synth_tick,
    "drip": synth_drip,
    "slide": synth_slide,
    "thud": synth_thud,
}


def music(transpose: int) -> list[float]:
    chords = [
        [196.00, 246.94, 293.66],
        [174.61, 220.00, 261.63],
        [220.00, 261.63, 329.63],
        [164.81, 196.00, 246.94],
    ]
    shift = 2 ** (transpose / 12)
    chord_len = N / len(chords)
    out = [0.0] * N
    rng = random.Random(40 + transpose)
    air = 0.0
    for i in range(N):
        pos = i / chord_len
        left = int(pos) % len(chords)
        right = (left + 1) % len(chords)
        frac = pos - int(pos)
        blend = 0.0 if frac < 0.8 else (frac - 0.8) / 0.2
        w0 = math.cos(blend * math.pi / 2)
        w1 = math.sin(blend * math.pi / 2)
        t = i / SR
        sample = 0.0
        swell = 0.86 + 0.14 * math.sin(2 * math.pi * t / 13.0)
        for notes, weight in ((chords[left], w0), (chords[right], w1)):
            for note in notes:
                f = note * shift
                sample += math.sin(2 * math.pi * f * t) * weight * 0.2
                sample += math.sin(2 * math.pi * f * 1.004 * t) * weight * 0.1
                sample += math.sin(2 * math.pi * f * 2 * t) * weight * 0.03
        noise = rng.random() * 2 - 1
        air += (noise - air) * 0.015
        out[i] = (sample * 0.34 + air * 0.03) * swell
    return out


def speak(text: str, dest: Path) -> list[float]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    raw = dest.with_suffix(".raw.wav")
    subprocess.run(
        ["flite", "-voice", "slt", "-t", text, "-o", str(raw)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    data, src_sr = read_wav(raw)
    return fade(resample(data, src_sr), 12)


def fit_voice(samples: list[float], max_sec: float) -> tuple[list[float], float]:
    dur = len(samples) / SR
    if dur <= max_sec or dur <= 0:
        return samples, 1.0
    tempo = min(1.7, dur / max_sec)
    src = BUILD / "_tempo_in.wav"
    dst = BUILD / "_tempo_out.wav"
    write_wav(src, samples)
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-filter:a", f"atempo={tempo:.4f}", "-ar", str(SR), "-ac", "1", str(dst)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    sped, src_sr = read_wav(dst)
    return fade(resample(sped, src_sr), 8), tempo


def mix_at(buffer: list[float], clip: list[float], start: int, gain: float) -> None:
    end = min(len(buffer), start + len(clip))
    for i in range(max(0, start), end):
        buffer[i] += clip[i - start] * gain


def words(text: str) -> int:
    return len(text.split())


def build_one(slug: str, spec: dict, library: dict[str, list[float]]) -> None:
    for _frame, text in spec["cues"]:
        count = words(text)
        if count < 3 or count > 5:
            raise SystemExit(f"{slug} card must be 3–5 words: {text!r} ({count})")
    cue_text = [text for _frame, text in spec["cues"]]
    voice_text = [text for _frame, text in spec["voice"]]
    if voice_text[0] != "agent" or spec["voice"][0][0] != 0:
        raise SystemExit(f"{slug} voice must open with agent at frame 0")
    for text in cue_text:
        if text not in voice_text:
            raise SystemExit(f"{slug} missing voice for card {text!r}")

    voices: list[tuple[int, list[float], str]] = []
    lines = spec["voice"]
    for index, (frame, text) in enumerate(lines):
        nxt = lines[index + 1][0] if index + 1 < len(lines) else 780
        max_sec = max(0.45, (nxt - frame) / FPS - 0.15)
        spoken = speak(text, BUILD / slug / f"{index}.wav")
        spoken, tempo = fit_voice(spoken, max_sec)
        spoken = normalize(spoken, 0.86)
        voices.append((int(frame / FPS * SR), spoken, text))
        print(f"  voice {frame:4d} {len(spoken) / SR:.2f}s x{tempo:.2f}  {text}")

    bed = music(TRANSPOSE[slug])
    targets = [0.16] * N
    for start, clip, _text in voices:
        end = min(N, start + len(clip) + int(0.18 * SR))
        begin = max(0, start - int(0.03 * SR))
        for i in range(begin, end):
            targets[i] = 0.04
    envelope = []
    gain = 0.16
    for target in targets:
        tau = 0.05 if target < gain else 0.22
        coef = 1 - math.exp(-1 / (tau * SR))
        gain += (target - gain) * coef
        envelope.append(gain)
    peak = max((abs(s) for s in bed), default=1.0) or 1.0
    bed = [sample / peak * envelope[i] for i, sample in enumerate(bed)]

    mix = bed[:]
    for start, clip, _text in voices:
        mix_at(mix, clip, start, 1.0)
    for frame, kind in spec["sfx"]:
        mix_at(mix, library[kind], int(frame / FPS * SR), 0.16)
        print(f"  sfx   {frame:4d} {kind}")

    ramp = int(0.03 * SR)
    for i in range(ramp):
        edge = i / ramp
        mix[i] *= edge
        mix[-1 - i] *= edge
    top = max((abs(s) for s in mix), default=1.0) or 1.0
    if top > 0.97:
        scale = 0.97 / top
        mix = [s * scale for s in mix]
    out = PUBLIC / slug / "mix.wav"
    write_wav(out, mix)
    if abs(len(mix) / SR - DURATION) > 0.02:
        raise SystemExit(f"{slug} mix duration {len(mix) / SR}")
    voice_energy = 0.0
    count = 0
    for start, clip, _text in voices:
        chunk = mix[start : start + len(clip)]
        voice_energy += sum(s * s for s in chunk)
        count += len(chunk)
    idle = mix[int(3.05 * SR) : int(4.15 * SR)]
    idle_rms = (sum(s * s for s in idle) / len(idle)) ** 0.5
    voice_rms = (voice_energy / max(1, count)) ** 0.5
    print(f"  mix {out.relative_to(ROOT)} voice_rms={voice_rms:.3f} idle_rms={idle_rms:.3f}")


def main() -> None:
    spec = json.loads(CUES.read_text())
    missing = [slug for slug in TRANSPOSE if slug not in spec]
    if missing:
        raise SystemExit(f"missing cues: {missing}")
    library = {name: fn() for name, fn in SFX.items()}
    for slug in TRANSPOSE:
        print(slug)
        build_one(slug, spec[slug], library)


if __name__ == "__main__":
    main()
