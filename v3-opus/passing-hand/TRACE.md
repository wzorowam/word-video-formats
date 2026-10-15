# TRACE: Passing Hand (v3-opus)

CA.EYE agents word-learning clip for **agent**. Remade from scratch in `v3-opus/`.

| Field | Value |
|---|---|
| MODEL | Claude Opus 5.5 (Cursor Cloud Agent) |
| Credit | CA.EYE agents |
| Tool | Remotion 4.0.535 (`remotion`, `@remotion/cli`, `@remotion/media`), React 19.3.0, TypeScript 5.9.3, Node 22.14.0, Chromium headless shell 157.0.8080.0 |
| Audio tools | Piper TTS 1.8.0 + onnxruntime 1.31.0, Python 3.12.3 + numpy 1.26.4, FFmpeg 6.1.1, faster-whisper 1.2.1 (check only) |
| Skill / guidance | Remotion agent skills from `remotion-dev/skills` (`remotion-best-practices`, `remotion-render`, `remotion-multimedia`; pinned in `v3-opus/skills-lock.json`): `useCurrentFrame` + `interpolate` with easing, no CSS animations, `Audio` from `@remotion/media`. Clip notes: `uploads/CLIP-REVIEW-NOTES.md` (Ca). |
| Composition | `PassingHand` in `v3-opus/src/Root.tsx`, scene in `v3-opus/passing-hand/Video.tsx` |
| Output | `v3-opus/passing-hand/passing-hand-v3-opus.mp4` |
| Format | 720x1280 h264 30 fps + AAC 48000 Hz 2 ch, 25.00 s |
| Loudness | I: -14.0 LUFS, LRA: 5.1 LU, Peak: -1.2 dBFS (EBU R128, ffmpeg ebur128) |
| Stills | `stills/01-word.png` (frame 0), `02-meaning.png`, `03-example.png`, `04-recap.png`, `05-safe-zones.png` (UI zones overlaid) |

## Notes applied

Clip note: *Passing Hand: a recognisable hand passes a small job ticket across.*

- A side-view hand with a sleeve and cuff (thumb, knuckle line, fingers that close) reaches through a ticket window.
- You slide a small JOB ticket under the glass; the hand reaches out with spring overshoot, grips it, and carries it back.
- The BOOKED stamp lands on the ticket with a spring and a stamp thud; the AGENCY sign and window glow for "the room".
- Recap: the hand (agent) passes the booked ticket back to you, then the room (agency) lights.

Global notes (all nine clips):

- Real motion: every element enters with an eased or spring curve (Easing.bezier, plus a damped-spring helper at damping 8-15); nothing appears in one frame. The measured largest frame-to-frame change is in the table below.
- One accent (#FFB21E amber) is applied through the narration timeline: an element is amber only while its card or voice line is on it, and fades in and out over about 0.3 s.
- Camera: the whole scene drifts from 100 % to 104 % zoom with a slight pan over the clip (Camera in src/kit.tsx), so nothing ever freezes.
- Structure: four sections (word, meaning, example, recap) with a progress bar; the target word is drawn at full opacity from frame 0, settles from 107 % to 100 % scale on a spring over 0.9 s, then breathes by ±1.2 %.
- Text: every card is 3-5 words (enforced by build_audio.py), white or amber on #141C2C panels, 43 px Outfit Bold, bottom edge at 922 px; scenes are clipped to the safe area.

## Cards, voice and timing

| Time (s) | Section | Card (3-5 words) | Voice says | Heard by Whisper | Match |
|---|---|---|---|---|---|
| 0.00-4.04 | word | Agent, or agency? | (card, verbatim) | Agent or agency. | 1.00 |
| 4.04-7.83 | meaning | An agent acts for you | (card, verbatim) | An agent acts for you. | 1.00 |
| 7.83-11.61 | example | Their hand carries the job | (card, verbatim) | Their hand carries the job. | 1.00 |
| 11.61-15.40 | example | Your agent booked it | (card, verbatim) | Their agent booked it. | 0.75 |
| 15.40-19.19 | example | The agency is the room | (card, verbatim) | The agency is the room. | 1.00 |
| 19.19-25.00 | recap | Hand: agent. Room: agency. | (card, verbatim) | Hand agent, room, agency. | 1.00 |

Motion SFX cues: slide @ ticket+0.2s, tick @ ticket+1.45s, slide @ ticket+1.6s, stamp @ booked+0.45s, chime @ room+0.3s, slide @ recap+1.4s. A soft tick also marks each card change after the first.

## Audio: sources and licences

| Layer | Source | Licence |
|---|---|---|
| Voice-over | Piper TTS 1.8.0, run locally on this VM's CPU (`python3 -m piper`, length scale 1.08). Voice `en_US-ljspeech-high` from `huggingface.co/rhasspy/piper-voices`, trained by Bryce Beattie on the LJ Speech dataset. Clear US-English female voice; reads each card verbatim (`say` only respells numbers and the Latin word). | Piper program: GPL-3.0-or-later (the program, not the audio it outputs). Voice dataset: LJ Speech, public domain (per the voice's MODEL_CARD). piper-voices repository: MIT. |
| Music bed | Original four-chord pad synthesised in `build_audio.py` (detuned sines plus a sub-octave, slow tremolo, low-pass at 1.8 kHz, 1.2 s fade-in and 1.6 s fade-out). The root note differs per clip. | Original, made for this repo; no third-party material. |
| Ducking | Envelope follower on the voice (60 ms attack, 450 ms release) lowers the bed by 11 dB under speech. Measured: voice -16.8 dBFS RMS, bed under voice -34.7 dBFS, bed between lines -28.2 dBFS. | n/a |
| SFX | Synthesised in `build_audio.py` from noise bursts, filtered sweeps and sine drops (whoosh, swish, pop, tick, clunk, snap, thud, chime and so on), each peak-normalised and mixed soft (peak -12.4 dBFS before mastering). | Original, no samples. |
| Master | Gentle tanh soft clip, then two-pass FFmpeg `loudnorm` (I = -14 LUFS, TP = -1.5 dBTP, linear), 48 kHz; Remotion encodes AAC 192 kb/s. | n/a |
| Intelligibility check | faster-whisper 1.2.1 with `small.en` (OpenAI Whisper weights, CTranslate2 conversion by Systran), run on the final mp4's AAC audio, one card slot at a time. Score 0.96. | MIT (faster-whisper and Whisper weights). Used for checking only; not in the output. |
| Fonts | Outfit (`public/fonts/Outfit.ttf`); JetBrains Mono (system font, Alt Screen terminal). | SIL Open Font License 1.1 |

Retakes (Piper is stochastic; `pick_takes.py` kept the first take Whisper heard word-for-word): `passing-hand:recap`: 1 take(s), kept 1.00 ("hand agent, room, agency."); `passing-hand:booked`: 1 take(s), kept 1.00 ("Your agent booked it.").

## Verification (`verify_video.py`, every frame of the mp4)

| Check | Result |
|---|---|
| Bright pixels outside the safe area (top 180, bottom 950, left 56, right 592) in any frame | 0 |
| Target word on frame 0 (bright share of the word band) | 0.187 (word drawn at full opacity) |
| Largest single-frame change (share of pixels changing by more than 40/255) | 0.0247 (no hard cuts or pop-ins; median 0.0004) |
| Duration | 25.00 s (target 20-30 s) |

## Render commands

```bash
cd v3-opus
npm install                                  # remotion 4.0.535 and friends (package.json)
pip install piper-tts==1.8.0 numpy faster-whisper==1.2.1
mkdir -p .voices && for f in en_US-ljspeech-high.onnx en_US-ljspeech-high.onnx.json; do
  curl -sSL -o .voices/ljspeech-$f https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/$f
done
python3 build_audio.py passing-hand                # voice + music + SFX -> public/passing-hand.wav, timeline.json
python3 pick_takes.py passing-hand:<line-id>       # optional: re-roll a mumbled Piper line
python3 build_audio.py passing-hand
./render-all.sh passing-hand                       # mp4 + stills + probe + loudness
#   = npx remotion render src/index.ts PassingHand passing-hand/.raw.mp4 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k
#     ffmpeg -i passing-hand/.raw.mp4 -c copy -movflags +faststart -metadata artist="CA.EYE agents" passing-hand/passing-hand-v3-opus.mp4
#     npx remotion render ... --sequence --frames=<word,meaning,example,recap> --image-format=png
#     npx remotion still src/index.ts PassingHand passing-hand/stills/05-safe-zones.png --props='{"safe":true}'
python3 verify_video.py passing-hand               # safe zones, frame 0, motion
python3 check_audio.py passing-hand                # Whisper hears each card in its slot
python3 make_trace.py                        # this file
```

Not merged, not deployed.
