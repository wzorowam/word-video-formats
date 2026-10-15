#!/usr/bin/env python3
"""Write <clip>/TRACE.md from the build outputs (timeline, probes, checks)."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TIMELINE = json.loads((ROOT / "timeline.json").read_text())
CHECK = json.loads((ROOT / "audio-check.json").read_text())
TAKES = json.loads((ROOT / "takes.json").read_text()) if (ROOT / "takes.json").exists() else {}

IDS = {
    "word-tree": "WordTree", "clamp": "Clamp", "passing-hand": "PassingHand", "alt-screen": "AltScreen",
    "shove-test": "ShoveTest", "time-machine": "TimeMachine", "under-the-label": "UnderTheLabel",
    "hidden-uses": "HiddenUses", "same-cord": "SameCord",
}

NOTE = {
    "same-cord": "Same Cord: the cord sways and the box bobs gently, then tangles into chaos.",
    "clamp": "Clamp: the clamps slide in, strain under the storm and snap open on \"let go\".",
    "hidden-uses": "Hidden Uses: the lines draw across; dim the safe options when the germ one lands.",
    "word-tree": "Word Tree: a glow on the active branch; tiny icon gags (the hat tips for \"secret agent\").",
    "passing-hand": "Passing Hand: a recognisable hand passes a small job ticket across.",
    "alt-screen": "Alt Screen: a blinking cursor, an amber glow on the active line, snappier windows.",
    "shove-test": "Shove Test: Maya winds up and follows through, the door springs back, the hand is highlighted.",
    "time-machine": "Time Machine: a rotating dial, dates scrolling along a track, bigger labels.",
    "under-the-label": "Under the Label: the peel curls like real tape; the \"n\" drops in when \"a\" becomes \"an\".",
}

APPLIED = {
    "same-cord": [
        "The cord is a pendulum hanging from a fist with a cuff; the box swings and bobs on its own slower phase.",
        "On \"Agent of chaos: nobody\" the fist springs open, the cord whips loose and redraws as a tangled scribble (a snap and swish on the release).",
        "Sole agent: one company tag lights with the fist. Change agent: the box knocks a row of blocks (three ticks).",
        "Recap: the fist re-grabs with a spring, the tangle untwists, and the hand takes the accent (\"Look for the hand\").",
    ],
    "clamp": [
        "Two vise jaws slide in from either side with spring overshoot and lock onto the word block (a clunk on each lock).",
        "The person icon sits in the block for the novel; the storm set slides in, then the jaws strain with jitter, rain and lightning flashes (low rumble).",
        "On \"Let go\" the jaws snap open and tilt away (snap SFX), and the block shows \"?\" because nothing fixes its meaning.",
        "Recap: the jaws close again with a lock icon on the block; the accent sits on the jaws (\"the lock\").",
    ],
    "hidden-uses": [
        "Four lines draw out from the word to four uses, one after another, with dashed-offset drawing and an ease-in-out.",
        "Each use animates when named: a drop falls and spreads on a leaf, oil and water mix in a beaker, a sauce slows and thickens, a germ spins.",
        "When the germ lands it springs up in size and the three safe options dim to about a quarter (a low tone marks the moment).",
        "Recap: the three helpers light together for \"Three help\", then only the germ for \"One harms\".",
    ],
    "word-tree": [
        "The trunk grows, then each branch draws out and glows amber only while it is being read.",
        "Icon gags: the bleach bottle tips and pours a drop onto a cloth that turns white; the spy's hat tips; the free agent's jersey swings.",
        "Recap sweeps the accent along all three branches, then back to the trunk for \"the one doing it\".",
    ],
    "passing-hand": [
        "A side-view hand with a sleeve and cuff (thumb, knuckle line, fingers that close) reaches through a ticket window.",
        "You slide a small JOB ticket under the glass; the hand reaches out with spring overshoot, grips it, and carries it back.",
        "The BOOKED stamp lands on the ticket with a spring and a stamp thud; the AGENCY sign and window glow for \"the room\".",
        "Recap: the hand (agent) passes the booked ticket back to you, then the room (agency) lights.",
    ],
    "alt-screen": [
        "The prompt types \"agent\" letter by letter and the block cursor blinks with an eased (not hard) blink.",
        "Windows open in about 0.3 s with a stiff spring and close in 0.16 s; each has a pop SFX.",
        "An amber glow and bar move line by line, in time with the voice: look, then tool, then look again.",
        "Contrast beat: a chatbot window answers once and closes back to the prompt; the agent window keeps cycling and counts rounds.",
    ],
    "shove-test": [
        "Maya is a jointed stick figure: she winds up (leans back, arm cocked), strikes fast with an ease-in, overshoots, then settles.",
        "The door flies open on impact (thud plus creak) and springs back closed with damped bounces.",
        "For \"Where the push starts\" an amber dot pulses at her hand with an arrow to the door; for \"in her hand\" an amber ring pulses on the hand during a second, shorter push.",
        "The door is the accent only on \"The door only moves\", with a \"just moves\" tag.",
    ],
    "time-machine": [
        "A ticked dial rotates with spring overshoot for each jump; a motion ring shows while it spins.",
        "The dates scroll along a track under the dial (today, then back to Latin, then forward through before 1500, the 1550s and the 1590s, then back to the doer for the recap), with edge fades.",
        "Labels are 44 px (dates) and 30 px (meanings); the stop under the needle is accented while it is being read.",
        "Each dial jump has a soft ratchet SFX; the recap ends with a chime.",
    ],
    "under-the-label": [
        "A strip of tape over the article peels like real tape: the curl travels across, the lifted flap shows its paler sticky side with a shadow, then the strip flies off (peel crackle SFX).",
        "Under it is \"a\". The first \"a\" of agent lights for \"vowel\", then the \"n\" drops in with a bouncy spring as \"agent\" slides right to make room (pop SFX).",
        "Counting: badges 1, 2, 3 spring in (ticks). Plural: \"three agent\" appears and an \"s\" drops in.",
        "Recap: \"an\" is accented, then \"three agents\".",
    ],
}

GLOBAL = [
    "Real motion: every element enters with an eased or spring curve (Easing.bezier, plus a damped-spring helper at damping 8-15); nothing appears in one frame. The measured largest frame-to-frame change is in the table below.",
    "One accent (#FFB21E amber) is applied through the narration timeline: an element is amber only while its card or voice line is on it, and fades in and out over about 0.3 s.",
    "Camera: the whole scene drifts from 100 % to 104 % zoom with a slight pan over the clip (Camera in src/kit.tsx), so nothing ever freezes.",
    "Structure: four sections (word, meaning, example, recap) with a progress bar; the target word is drawn at full opacity from frame 0, settles from 107 % to 100 % scale on a spring over 0.9 s, then breathes by ±1.2 %.",
    "Text: every card is 3-5 words (enforced by build_audio.py), white or amber on #141C2C panels, 43 px Outfit Bold, bottom edge at 922 px; scenes are clipped to the safe area.",
]


def table(rows: list[list[str]]) -> str:
    head = "| " + " | ".join(rows[0]) + " |\n|" + "---|" * len(rows[0]) + "\n"
    return head + "".join("| " + " | ".join(r) + " |\n" for r in rows[1:])


def main() -> None:
    for clip, cid in IDS.items():
        tl = TIMELINE[clip]
        probe = json.loads((ROOT / clip / ".probe.json").read_text())
        loud = (ROOT / clip / ".loudness.txt").read_text().split("\n")
        ver = json.loads((ROOT / clip / ".verify.json").read_text())
        chk = CHECK[clip]
        v = next(s for s in probe["streams"] if s["codec_type"] == "video")
        a = next(s for s in probe["streams"] if s["codec_type"] == "audio")
        lv = tl["levels"]
        cards = [["Time (s)", "Section", "Card (3-5 words)", "Voice says", "Heard by Whisper", "Match"]]
        for line, c in zip(tl["lines"], chk["lines"]):
            said = line["voice"] if line["voice"] != line["card"] else "(card, verbatim)"
            cards.append([f"{line['t']:.2f}-{line['end']:.2f}", line["section"], line["card"], said, c["heard"], f"{c['match']:.2f}"])
        sfx = ", ".join(f"{s['kind']} @ {s['line']}+{s['dt']}s" for s in tl["sfx"])
        takes = [f"`{k}`: {v['takes']} take(s), kept {v['kept_score']:.2f} (\"{v['heard']}\")" for k, v in TAKES.items() if k.startswith(clip + ":")]

        md = f"""# TRACE: {tl['title']} (v3-opus)

CA.EYE agents word-learning clip for **agent**. Remade from scratch in `v3-opus/`.

| Field | Value |
|---|---|
| MODEL | Claude Opus 5.5 (Cursor Cloud Agent) |
| Credit | CA.EYE agents |
| Tool | Remotion 4.0.535 (`remotion`, `@remotion/cli`, `@remotion/media`), React 19.3.0, TypeScript 5.9.3, Node 22.14.0, Chromium headless shell 157.0.8080.0 |
| Audio tools | Piper TTS 1.8.0 + onnxruntime 1.31.0, Python 3.12.3 + numpy 1.26.4, FFmpeg 6.1.1, faster-whisper 1.2.1 (check only) |
| Skill / guidance | Remotion agent skills from `remotion-dev/skills` (`remotion-best-practices`, `remotion-render`, `remotion-multimedia`; pinned in `v3-opus/skills-lock.json`): `useCurrentFrame` + `interpolate` with easing, no CSS animations, `Audio` from `@remotion/media`. Clip notes: `uploads/CLIP-REVIEW-NOTES.md` (Ca). |
| Composition | `{cid}` in `v3-opus/src/Root.tsx`, scene in `v3-opus/{clip}/Video.tsx` |
| Output | `v3-opus/{clip}/{clip}-v3-opus.mp4` |
| Format | {v['width']}x{v['height']} {v['codec_name']} 30 fps + {a['codec_name'].upper()} {a['sample_rate']} Hz {a['channels']} ch, {float(probe['format']['duration']):.2f} s |
| Loudness | {loud[0].strip()}, {loud[1].strip()}, {loud[2].strip() if len(loud) > 2 else ''} (EBU R128, ffmpeg ebur128) |
| Stills | `stills/01-word.png` (frame 0), `02-meaning.png`, `03-example.png`, `04-recap.png`, `05-safe-zones.png` (UI zones overlaid) |

## Notes applied

Clip note: *{NOTE[clip]}*

""" + "".join(f"- {x}\n" for x in APPLIED[clip]) + """
Global notes (all nine clips):

""" + "".join(f"- {x}\n" for x in GLOBAL) + f"""
## Cards, voice and timing

{table(cards)}
Motion SFX cues: {sfx}. A soft tick also marks each card change after the first.

## Audio: sources and licences

| Layer | Source | Licence |
|---|---|---|
| Voice-over | Piper TTS 1.8.0, run locally on this VM's CPU (`python3 -m piper`, length scale 1.08). Voice `en_US-ljspeech-high` from `huggingface.co/rhasspy/piper-voices`, trained by Bryce Beattie on the LJ Speech dataset. Clear US-English female voice; reads each card verbatim (`say` only respells numbers and the Latin word). | Piper program: GPL-3.0-or-later (the program, not the audio it outputs). Voice dataset: LJ Speech, public domain (per the voice's MODEL_CARD). piper-voices repository: MIT. |
| Music bed | Original four-chord pad synthesised in `build_audio.py` (detuned sines plus a sub-octave, slow tremolo, low-pass at 1.8 kHz, 1.2 s fade-in and 1.6 s fade-out). The root note differs per clip. | Original, made for this repo; no third-party material. |
| Ducking | Envelope follower on the voice (60 ms attack, 450 ms release) lowers the bed by 11 dB under speech. Measured: voice {lv['voice_rms_db']} dBFS RMS, bed under voice {lv['music_under_voice_db']} dBFS, bed between lines {lv['music_in_gaps_db']} dBFS. | n/a |
| SFX | Synthesised in `build_audio.py` from noise bursts, filtered sweeps and sine drops (whoosh, swish, pop, tick, clunk, snap, thud, chime and so on), each peak-normalised and mixed soft (peak {lv['sfx_peak_db']} dBFS before mastering). | Original, no samples. |
| Master | Gentle tanh soft clip, then two-pass FFmpeg `loudnorm` (I = -14 LUFS, TP = -1.5 dBTP, linear), 48 kHz; Remotion encodes AAC 192 kb/s. | n/a |
| Intelligibility check | faster-whisper 1.2.1 with `small.en` (OpenAI Whisper weights, CTranslate2 conversion by Systran), run on the final mp4's AAC audio, one card slot at a time. Score {chk['score']:.2f}. | MIT (faster-whisper and Whisper weights). Used for checking only; not in the output. |
| Fonts | Outfit (`public/fonts/Outfit.ttf`); JetBrains Mono (system font, Alt Screen terminal). | SIL Open Font License 1.1 |

""" + (("Retakes (Piper is stochastic; `pick_takes.py` kept the first take Whisper heard word-for-word): " + "; ".join(takes) + ".\n\n") if takes else "") + f"""## Verification (`verify_video.py`, every frame of the mp4)

| Check | Result |
|---|---|
| Bright pixels outside the safe area (top 180, bottom 950, left 56, right 592) in any frame | {ver['bright_pixels_outside_safe_zone']} |
| Target word on frame 0 (bright share of the word band) | {ver['frame0_word_band_bright_share']} (word drawn at full opacity) |
| Largest single-frame change (share of pixels changing by more than 40/255) | {ver['max_frame_change']:.4f} (no hard cuts or pop-ins; median {ver['median_frame_change']:.4f}) |
| Duration | {float(probe['format']['duration']):.2f} s (target 20-30 s) |

## Render commands

```bash
cd v3-opus
npm install                                  # remotion 4.0.535 and friends (package.json)
pip install piper-tts==1.8.0 numpy faster-whisper==1.2.1
mkdir -p .voices && for f in en_US-ljspeech-high.onnx en_US-ljspeech-high.onnx.json; do
  curl -sSL -o .voices/ljspeech-$f https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/$f
done
python3 build_audio.py {clip}                # voice + music + SFX -> public/{clip}.wav, timeline.json
python3 pick_takes.py {clip}:<line-id>       # optional: re-roll a mumbled Piper line
python3 build_audio.py {clip}
./render-all.sh {clip}                       # mp4 + stills + probe + loudness
#   = npx remotion render src/index.ts {cid} {clip}/.raw.mp4 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k
#     ffmpeg -i {clip}/.raw.mp4 -c copy -movflags +faststart -metadata artist="CA.EYE agents" {clip}/{clip}-v3-opus.mp4
#     npx remotion render ... --sequence --frames=<word,meaning,example,recap> --image-format=png
#     npx remotion still src/index.ts {cid} {clip}/stills/05-safe-zones.png --props='{{"safe":true}}'
python3 verify_video.py {clip}               # safe zones, frame 0, motion
python3 check_audio.py {clip}                # Whisper hears each card in its slot
python3 make_trace.py                        # this file
```

Not merged, not deployed.
"""
        (ROOT / clip / "TRACE.md").write_text(md)
        print("wrote", clip)


if __name__ == "__main__":
    main()
