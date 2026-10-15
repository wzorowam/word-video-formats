#!/usr/bin/env python3
"""Build every clip's soundtrack locally, then write timeline.json.

Voice: Piper TTS (runs on this VM) with the en_US-ljspeech-high voice; the
voice reads each card verbatim (`say` only respells numbers or Latin).
Music: an original pad synthesised here with numpy, ducked under the voice.
SFX: short sounds synthesised here with numpy, placed on key motion.

Rules enforced: every card is 3-5 words, and every clip is 20-30 s.
"""

import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
SCRIPT = json.loads((ROOT / "script.json").read_text())
PUBLIC = ROOT / "public"
PARTS = ROOT / ".parts"
VOICE_MODEL = ROOT / ".voices" / "ljspeech-en_US-ljspeech-high.onnx"
SR = 48000

LEAD = 0.25
GAP = 0.6
MIN_HOLD = 2.6
TAIL = 1.4
TARGET = 25.0
MAX_TOTAL = 30.0

VOICE_PEAK = 0.80
MUSIC_RMS = 0.050
DUCK_DB = -11.0
SFX_GAIN = 0.24


def run(args: list[str], stdin: bytes | None = None) -> None:
    subprocess.run(args, input=stdin, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        ch = w.getnchannels()
    return data.reshape(-1, ch).mean(axis=1) if ch > 1 else data


def write_wav(path: Path, stereo: np.ndarray) -> None:
    pcm = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def tts(text: str, clip: str, lid: str) -> np.ndarray:
    raw = PARTS / f"{clip}-{lid}.raw.wav"
    stamp = raw.with_suffix(".txt")
    if not (raw.exists() and stamp.exists() and stamp.read_text() == text):
        run(
            [sys.executable, "-m", "piper", "-m", str(VOICE_MODEL), "-f", str(raw),
             "--length-scale", "1.08", "--sentence-silence", "0.25"],
            stdin=text.encode(),
        )
        stamp.write_text(text)
    out = PARTS / f"{clip}-{lid}.wav"
    run(
        ["ffmpeg", "-y", "-i", str(raw), "-af",
         "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,"
         "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,"
         "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80",
         "-ar", str(SR), "-ac", "1", str(out)]
    )
    v = read_wav(out)
    return v * (VOICE_PEAK / max(1e-6, np.abs(v).max()))


def loudnorm(src: Path, dest: Path, target: float = -14.0, tp: float = -1.5) -> dict:
    """Two-pass EBU R128 normalisation with ffmpeg loudnorm (linear mode)."""
    probe = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(src), "-af", f"loudnorm=I={target}:TP={tp}:LRA=11:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    m = json.loads(probe[probe.rindex("{"): probe.rindex("}") + 1])
    run(
        ["ffmpeg", "-y", "-i", str(src), "-af",
         f"loudnorm=I={target}:TP={tp}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
         f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
         "-ar", str(SR), "-c:a", "pcm_s16le", str(dest)]
    )
    return m


def db(x: np.ndarray) -> float:
    return round(float(20 * np.log10(max(1e-9, np.sqrt(np.mean(x ** 2))))), 1)


def check_cards(clip: str, lines: list[dict]) -> None:
    for line in lines:
        n = len(line["card"].split())
        if not 3 <= n <= 5:
            sys.exit(f"{clip}/{line['id']}: card has {n} words: {line['card']!r}")
        if line.get("accent") and line["accent"].lower() not in line["card"].lower():
            sys.exit(f"{clip}/{line['id']}: accent {line['accent']!r} not in card")


def schedule(lines: list[dict], durs: list[float]) -> tuple[list[dict], float]:
    slots = [max(d + GAP, line.get("hold", MIN_HOLD)) for line, d in zip(lines, durs)]
    budget = TARGET - LEAD - TAIL + GAP
    if sum(slots) < budget:
        slots = [s * budget / sum(slots) for s in slots]
    t = LEAD
    out = []
    for line, d, s in zip(lines, durs, slots):
        out.append({**line, "voice": line.get("say", line["card"]), "t": round(t, 3), "voiceDur": round(d, 3), "end": round(t + s, 3)})
        t += s
    out[0]["t"] = 0.0
    total = round(max(t - GAP + TAIL, out[-1]["t"] + durs[-1] + TAIL), 2)
    out[-1]["end"] = total
    return out, total


# ---------- synthesis helpers ----------

def env(n: int, a: float, r: float) -> np.ndarray:
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))


def noise(n: int, seed: int) -> np.ndarray:
    return np.random.default_rng(seed).standard_normal(n).astype(np.float32)


def lowpass(x: np.ndarray, cutoff: float | np.ndarray) -> np.ndarray:
    cut = np.broadcast_to(np.asarray(cutoff, dtype=np.float32), x.shape)
    a = 1 - np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def tone(freq: float | np.ndarray, n: int) -> np.ndarray:
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,))
    return np.sin(2 * np.pi * np.cumsum(f) / SR).astype(np.float32)


SFX_LEVEL = {"tick": 0.6, "rumble": 0.8, "low": 0.9, "keys": 0.8, "ratchet": 0.7}


def sfx(kind: str, seed: int) -> np.ndarray:
    x = _sfx(kind, seed)
    return x / max(1e-6, np.abs(x).max()) * SFX_LEVEL.get(kind, 1.0)


def _sfx(kind: str, seed: int) -> np.ndarray:
    def secs(s: float) -> int:
        return int(s * SR)

    if kind == "whoosh":
        n = secs(0.55)
        sweep = np.interp(np.arange(n), [0, n * 0.6, n], [300, 2400, 600])
        x = lowpass(noise(n, seed), sweep) * np.sin(np.pi * np.arange(n) / n) ** 2
        return x * 1.6
    if kind == "swish":
        n = secs(0.3)
        sweep = np.interp(np.arange(n), [0, n], [3000, 700])
        return lowpass(noise(n, seed), sweep) * np.sin(np.pi * np.arange(n) / n) ** 1.5 * 1.4
    if kind == "slide":
        n = secs(0.45)
        x = lowpass(noise(n, seed), 1400) * np.sin(np.pi * np.arange(n) / n) * 1.2
        return x
    if kind == "pop":
        n = secs(0.16)
        f = np.interp(np.arange(n), [0, n], [900, 380])
        return tone(f, n) * env(n, 0.003, 0.05) * 0.9
    if kind == "tick":
        n = secs(0.06)
        return (tone(2100, n) * 0.5 + lowpass(noise(n, seed), 5000) * 0.5) * env(n, 0.001, 0.012)
    if kind == "keys":
        out = np.zeros(secs(0.9), dtype=np.float32)
        for k in range(5):
            n = secs(0.05)
            s = secs(0.05 + k * 0.14)
            out[s:s + n] += (lowpass(noise(n, seed + k), 3500) * env(n, 0.001, 0.01))
        return out * 1.2
    if kind == "drip":
        n = secs(0.22)
        f = np.interp(np.arange(n), [0, n * 0.3, n], [600, 1500, 1700])
        return tone(f, n) * env(n, 0.002, 0.06) * 0.8
    if kind == "clunk":
        n = secs(0.25)
        body = tone(np.interp(np.arange(n), [0, n], [180, 90]), n) * env(n, 0.002, 0.06)
        hit = lowpass(noise(n, seed), 2500) * env(n, 0.001, 0.015)
        return body * 0.9 + hit * 0.7
    if kind == "snap":
        n = secs(0.35)
        crack = lowpass(noise(n, seed), 6000) * env(n, 0.0005, 0.02) * 1.3
        thump = tone(np.interp(np.arange(n), [0, n], [140, 60]), n) * env(n, 0.002, 0.09)
        return crack + thump * 0.8
    if kind == "rumble":
        n = secs(1.6)
        x = lowpass(noise(n, seed), 160) * 5 * np.sin(np.pi * np.arange(n) / n)
        return x
    if kind == "stamp":
        n = secs(0.3)
        return tone(np.interp(np.arange(n), [0, n], [120, 70]), n) * env(n, 0.002, 0.07) + lowpass(noise(n, seed), 3000) * env(n, 0.001, 0.02) * 0.8
    if kind == "chime":
        n = secs(1.2)
        return (tone(880, n) * 0.5 + tone(1318.5, n) * 0.35 + tone(1760, n) * 0.15) * env(n, 0.004, 0.35) * 0.6
    if kind == "thud":
        n = secs(0.3)
        return tone(np.interp(np.arange(n), [0, n], [110, 55]), n) * env(n, 0.003, 0.08) * 1.1 + lowpass(noise(n, seed), 900) * env(n, 0.001, 0.03) * 0.6
    if kind == "creak":
        n = secs(0.7)
        f = 180 + 40 * np.sin(np.arange(n) / SR * 2 * np.pi * 3)
        x = np.sign(tone(f, n)) * 0.25
        return lowpass(x, 1200) * np.sin(np.pi * np.arange(n) / n) * 0.8
    if kind == "ratchet":
        out = np.zeros(secs(0.7), dtype=np.float32)
        for k in range(8):
            n = secs(0.03)
            s = secs(k * 0.07 * (1 + k * 0.05))
            if s + n < len(out):
                out[s:s + n] += tone(1600 - k * 60, n) * env(n, 0.0005, 0.008)
        return out
    if kind == "peel":
        n = secs(1.1)
        crackle = noise(n, seed) * (np.random.default_rng(seed + 1).random(n) > 0.985)
        return lowpass(crackle, 4500) * np.sin(np.pi * np.arange(n) / n) * 3 + lowpass(noise(n, seed + 2), 1800) * 0.15
    if kind == "low":
        n = secs(0.9)
        return (tone(98, n) + tone(103.8, n)) * 0.5 * env(n, 0.03, 0.4)
    raise ValueError(kind)


ROOTS = {
    "word-tree": 220.0, "clamp": 196.0, "passing-hand": 233.08, "alt-screen": 207.65, "shove-test": 220.0,
    "time-machine": 174.61, "under-the-label": 246.94, "hidden-uses": 196.0, "same-cord": 207.65,
}
PROGRESSION = [(0, 4, 7), (-4, 0, 3), (-7, -3, 0), (-2, 2, 5)]


def music(clip: str, total: float) -> np.ndarray:
    n = int(total * SR)
    t = np.arange(n) / SR
    root = ROOTS[clip]
    bar = total / 8
    out = np.zeros(n, dtype=np.float32)
    for k in range(8):
        a, b = int(k * bar * SR), int(min(total, (k + 1) * bar + 0.6) * SR)
        seg = np.arange(b - a) / SR
        shape = np.minimum(1, seg / 0.8) * np.minimum(1, (seg[::-1]) / 0.6)
        for semi in PROGRESSION[k % 4]:
            f = root * 2 ** (semi / 12)
            for det in (-0.12, 0.12):
                out[a:b] += np.sin(2 * np.pi * (f + det) * seg + det * 9).astype(np.float32) * shape * 0.22
            out[a:b] += np.sin(2 * np.pi * f / 2 * seg).astype(np.float32) * shape * 0.10
    out *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t).astype(np.float32)
    out = lowpass(out, 1800)
    out *= np.minimum(1, t / 1.2) * np.minimum(1, (total - t) / 1.6)
    return out * (MUSIC_RMS / max(1e-6, np.sqrt(np.mean(out ** 2))))


def duck_gain(voice: np.ndarray) -> np.ndarray:
    hop = 240
    frames = np.sqrt(np.convolve(voice ** 2, np.ones(hop) / hop, mode="same"))
    target = (frames > 0.02).astype(np.float32)
    g = np.empty_like(target)
    acc = 0.0
    att, rel = 1 - np.exp(-1 / (0.06 * SR)), 1 - np.exp(-1 / (0.45 * SR))
    for i in range(len(target)):
        acc += (att if target[i] > acc else rel) * (target[i] - acc)
        g[i] = acc
    return 10 ** (DUCK_DB * g / 20)


def place(track: np.ndarray, clipx: np.ndarray, at: float, gain: float = 1.0) -> None:
    s = max(0, int(at * SR))
    e = min(len(track), s + len(clipx))
    if e > s:
        track[s:e] += clipx[: e - s] * gain


def main() -> None:
    PARTS.mkdir(exist_ok=True)
    PUBLIC.mkdir(exist_ok=True)
    only = set(sys.argv[1:])
    clips = {k: v for k, v in SCRIPT.items() if not only or k in only}
    timeline_path = ROOT / "timeline.json"
    timeline = json.loads(timeline_path.read_text()) if timeline_path.exists() else {}
    report = {}

    for clip, spec in clips.items():
        check_cards(clip, spec["lines"])
        voices = [tts(l.get("say", l["card"]), clip, l["id"]) for l in spec["lines"]]
        durs = [len(v) / SR for v in voices]
        lines, total = schedule(spec["lines"], durs)
        if not 20.0 <= total <= MAX_TOTAL:
            sys.exit(f"{clip}: total {total:.2f}s is outside 20-30 s")
        n = int(total * SR)

        vo = np.zeros(n, dtype=np.float32)
        for line, v in zip(lines, voices):
            place(vo, v, max(line["t"] + 0.12, 0.15))

        fx = np.zeros(n, dtype=np.float32)
        starts = {l["id"]: l["t"] for l in lines}
        for k, cue in enumerate(spec.get("sfx", [])):
            place(fx, sfx(cue["kind"], 100 + k), starts[cue["line"]] + cue["dt"], SFX_GAIN)
        for k, line in enumerate(lines[1:]):
            place(fx, sfx("tick", 900 + k), line["t"], SFX_GAIN * 0.5)

        bed = music(clip, total) * duck_gain(vo)
        mixl = vo + fx * 0.95 + bed * 1.0
        mixr = vo + fx * 1.05 + bed * 0.96
        stereo = np.stack([mixl, mixr], axis=1)
        stereo = np.tanh(stereo * 1.1) / np.tanh(1.1)
        premix = PARTS / f"{clip}-premix.wav"
        write_wav(premix, stereo)
        loudnorm(premix, PUBLIC / f"{clip}.wav")
        speaking = duck_gain(vo) < 10 ** (DUCK_DB / 2 / 20)
        levels = {
            "voice_rms_db": db(vo[speaking]),
            "music_under_voice_db": db(bed[speaking]),
            "music_in_gaps_db": db(bed[~speaking]) if (~speaking).any() else None,
            "sfx_peak_db": round(float(20 * np.log10(max(1e-9, np.abs(fx).max()))), 1),
        }

        timeline[clip] = {"title": spec["title"], "duration": total, "lines": lines, "sfx": spec.get("sfx", []), "levels": levels}
        report[clip] = total
        print(f"{clip}: {total:.2f}s, {len(lines)} cards, {len(spec.get('sfx', []))} motion sfx, {levels}")

    timeline_path.write_text(json.dumps(timeline, indent=2) + "\n")


if __name__ == "__main__":
    main()
