#!/usr/bin/env python3
"""Build a 26.0s mix for every v2 clip.

TTS: Flite 2.2, voice slt (cmu_us_slt, CMU ARCTIC). The engine is the
Carnegie Mellon BSD-style Flite licence (use and distribute without
restriction). The voice is free for any purpose:
https://www.festvox.org/cmu_arctic/

Music and SFX are original signals from this file, dedicated CC0 1.0:
https://creativecommons.org/publicdomain/zero/1.0/
"""

from __future__ import annotations

import json
import math
import random
import struct
import subprocess
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CUES = ROOT / "audio" / "cues.json"
BUILD = ROOT / "audio" / "build"
PUBLIC = ROOT / "public" / "audio"
FPS = 30
DURATION = 26.0
SR = 48000
N = int(DURATION * SR)

TRANSPOSE = {
    "word-tree": 0,
    "clamp": 2,
    "passing-hand": -2,
    "alt-screen": 3,
    "shove-test": -3,
    "time-machine": 5,
    "under-the-label": 1,
    "same-cord": -1,
    "hidden-uses": 4,
}


def write_wav(path: Path, samples: list[float], sr: int = SR) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "w") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(sr)
        frames = bytearray()
        for sample in samples:
            value = max(-1.0, min(1.0, sample))
            frames += struct.pack("<h", int(value * 32767))
        handle.writeframes(frames)


def read_wav(path: Path) -> tuple[list[float], int]:
    with wave.open(str(path), "r") as handle:
        sr = handle.getframerate()
        count = handle.getnframes()
        channels = handle.getnchannels()
        width = handle.getsampwidth()
        raw = handle.readframes(count)
    if width != 2:
        raise RuntimeError(f"expected 16-bit wav: {path}")
    values = struct.unpack("<" + "h" * (len(raw) // 2), raw)
    if channels == 1:
        data = [v / 32768.0 for v in values]
    else:
        data = [values[i] / 32768.0 for i in range(0, len(values), channels)]
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
        freq = 150 + 420 * math.exp(-t * 7.5)
        phase += 2 * math.pi * freq / SR
        amp = math.exp(-t * 6.2) * min(1.0, t / 0.012)
        out.append(math.sin(phase) * amp)
    return fade(normalize(out, 0.9), 6)


def synth_snap() -> list[float]:
    dur = 0.12
    count = int(SR * dur)
    rng = random.Random(3)
    out = []
    phase = 0.0
    for i in range(count):
        t = i / SR
        phase += 2 * math.pi * 1400 / SR
        noise = (rng.random() * 2 - 1) * math.exp(-t * 48)
        tick = math.sin(phase) * math.exp(-t * 28)
        out.append(noise * 0.45 + tick * 0.55)
    return fade(normalize(out, 0.85), 4)


def synth_peel() -> list[float]:
    dur = 0.55
    count = int(SR * dur)
    rng = random.Random(7)
    low = 0.0
    out = []
    for i in range(count):
        t = i / SR
        noise = rng.random() * 2 - 1
        low += (noise - low) * 0.08
        env = math.sin(min(1.0, t / dur) * math.pi) ** 1.4
        crackle = noise * (0.015 if rng.random() > 0.92 else 0.0)
        out.append((low * 0.8 + crackle) * env)
    return fade(normalize(out, 0.8), 12)


def synth_whoosh() -> list[float]:
    dur = 0.32
    count = int(SR * dur)
    rng = random.Random(11)
    low = 0.0
    lower = 0.0
    out = []
    for i in range(count):
        t = i / SR
        noise = rng.random() * 2 - 1
        low += (noise - low) * 0.18
        lower += (low - lower) * 0.05
        band = low - lower
        env = math.sin(min(1.0, t / dur) * math.pi) ** 1.2
        out.append(band * env)
    return fade(normalize(out, 0.8), 8)


def synth_tick() -> list[float]:
    dur = 0.07
    count = int(SR * dur)
    phase = 0.0
    out = []
    for i in range(count):
        t = i / SR
        phase += 2 * math.pi * 880 / SR
        out.append(math.sin(phase) * math.exp(-t * 42))
    return fade(normalize(out, 0.7), 3)


def synth_rustle() -> list[float]:
    dur = 0.48
    count = int(SR * dur)
    rng = random.Random(19)
    low = 0.0
    out = []
    for i in range(count):
        t = i / SR
        noise = rng.random() * 2 - 1
        low += (noise - low) * 0.22
        env = math.sin(min(1.0, t / dur) * math.pi) * (0.65 + 0.35 * math.sin(t * 37))
        out.append(low * env)
    return fade(normalize(out, 0.75), 10)


def synth_thud() -> list[float]:
    dur = 0.22
    count = int(SR * dur)
    rng = random.Random(23)
    phase = 0.0
    out = []
    for i in range(count):
        t = i / SR
        phase += 2 * math.pi * (90 + 40 * math.exp(-t * 12)) / SR
        noise = (rng.random() * 2 - 1) * math.exp(-t * 30)
        out.append(math.sin(phase) * math.exp(-t * 10) * 0.8 + noise * 0.25)
    return fade(normalize(out, 0.85), 4)


SFX = {
    "spring": synth_spring,
    "snap": synth_snap,
    "peel": synth_peel,
    "whoosh": synth_whoosh,
    "tick": synth_tick,
    "rustle": synth_rustle,
    "thud": synth_thud,
}


def music(transpose: int) -> list[float]:
    chords = [
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66],
        [164.81, 220.00, 246.94],
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
        blend = 0.0 if frac < 0.78 else (frac - 0.78) / 0.22
        w0 = math.cos(blend * math.pi / 2)
        w1 = math.sin(blend * math.pi / 2)
        t = i / SR
        sample = 0.0
        for notes, weight in ((chords[left], w0), (chords[right], w1)):
            for note in notes:
                f = note * shift
                sample += math.sin(2 * math.pi * f * t) * weight * 0.22
                sample += math.sin(2 * math.pi * f * 1.004 * t) * weight * 0.12
        noise = rng.random() * 2 - 1
        air += (noise - air) * 0.02
        out[i] = sample * 0.35 + air * 0.04
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
    return fade(resample(data, src_sr), 10)


def fit_voice(samples: list[float], max_sec: float) -> tuple[list[float], float]:
    dur = len(samples) / SR
    if dur <= max_sec or dur <= 0:
        return samples, 1.0
    tempo = min(1.65, dur / max_sec)
    src = BUILD / "_tempo_in.wav"
    dst = BUILD / "_tempo_out.wav"
    write_wav(src, samples)
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-filter:a",
            f"atempo={tempo:.4f}",
            "-ar",
            str(SR),
            "-ac",
            "1",
            str(dst),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    sped, src_sr = read_wav(dst)
    return fade(resample(sped, src_sr), 8), tempo


def mix_at(buffer: list[float], clip: list[float], start: int, gain: float) -> None:
    for i, sample in enumerate(clip):
        j = start + i
        if 0 <= j < len(buffer):
            buffer[j] += sample * gain


def build_one(slug: str, spec: dict, library: dict[str, list[float]]) -> None:
    voices: list[tuple[int, list[float], str]] = []
    lines = spec["voice"]
    for index, (frame, text) in enumerate(lines):
        nxt = lines[index + 1][0] if index + 1 < len(lines) else 780
        max_sec = max(0.45, (nxt - frame) / FPS - 0.12)
        spoken = speak(text, BUILD / slug / f"{index}.wav")
        spoken, tempo = fit_voice(spoken, max_sec)
        spoken = normalize(spoken, 0.84)
        voices.append((int(frame / FPS * SR), spoken, text))
        print(f"  voice {frame:4d} {len(spoken)/SR:.2f}s x{tempo:.2f}  {text}")

    bed = music(TRANSPOSE[slug])
    targets = [0.15] * N
    for start, clip, _text in voices:
        end = min(N, start + len(clip) + int(0.16 * SR))
        begin = max(0, start - int(0.02 * SR))
        for i in range(begin, end):
            targets[i] = 0.042
    envelope = []
    gain = 0.15
    for target in targets:
        tau = 0.045 if target < gain else 0.2
        coef = 1 - math.exp(-1 / (tau * SR))
        gain += (target - gain) * coef
        envelope.append(gain)
    peak = max((abs(s) for s in bed), default=1.0) or 1.0
    bed = [sample / peak * envelope[i] for i, sample in enumerate(bed)]

    mix = bed[:]
    for start, clip, _text in voices:
        mix_at(mix, clip, start, 1.0)
    for frame, kind in spec["sfx"]:
        clip = library[kind]
        mix_at(mix, clip, int(frame / FPS * SR), 0.22)
        print(f"  sfx   {frame:4d} {kind}")

    ramp = int(0.02 * SR)
    for i in range(ramp):
        edge = i / ramp
        mix[i] *= edge
        mix[-1 - i] *= edge
    top = max((abs(s) for s in mix), default=1.0) or 1.0
    if top > 0.98:
        scale = 0.98 / top
        mix = [s * scale for s in mix]
    out = PUBLIC / slug / "mix.wav"
    write_wav(out, mix)
    voice_rms = 0.0
    count = 0
    for start, clip, _text in voices:
        chunk = mix[start : start + len(clip)]
        voice_rms += sum(s * s for s in chunk)
        count += len(chunk)
    idle = mix[int(4.6 * SR) : int(5.2 * SR)]
    idle_rms = (sum(s * s for s in idle) / len(idle)) ** 0.5
    voice_rms = (voice_rms / max(1, count)) ** 0.5
    print(f"  mix {out.relative_to(ROOT)} voice_rms={voice_rms:.3f} idle_rms={idle_rms:.3f}")


def main() -> None:
    spec = json.loads(CUES.read_text())
    library = {name: fn() for name, fn in SFX.items()}
    for slug, row in spec.items():
        print(slug)
        build_one(slug, row, library)


if __name__ == "__main__":
    main()
