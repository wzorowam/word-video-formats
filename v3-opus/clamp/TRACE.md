# TRACE: Clamp (v3-opus)

CA.EYE agents word-learning clip for **agent**. Remade from scratch in `v3-opus/`.

| Field | Value |
|---|---|
| MODEL | Claude Opus 5.5 (Cursor Cloud Agent) |
| Credit | CA.EYE agents |
| Tool | Remotion 4.0.535 (`remotion`, `@remotion/cli`, `@remotion/media`), React 19.3.0, TypeScript 5.9.3, Node 22.14.0, Chromium headless shell 157.0.8080.0 |
| Audio tools | Piper TTS 1.8.0 + onnxruntime 1.31.0, Python 3.12.3 + numpy 1.26.4, FFmpeg 6.1.1, faster-whisper 1.2.1 (check only) |
| Skill / guidance | Remotion agent skills from `remotion-dev/skills` (`remotion-best-practices`, `remotion-render`, `remotion-multimedia`; pinned in `v3-opus/skills-lock.json`): `useCurrentFrame` + `interpolate` with easing, no CSS animations, `Audio` from `@remotion/media`. Clip notes: `uploads/CLIP-REVIEW-NOTES.md` (Ca). |
| Composition | `Clamp` in `v3-opus/src/Root.tsx`, scene in `v3-opus/clamp/Video.tsx` |
| Output | `v3-opus/clamp/clamp-v3-opus.mp4` |
| Format | 720x1280 h264 30 fps + AAC 48000 Hz 2 ch, 25.00 s |
| Loudness | I: -14.0 LUFS, LRA: 4.2 LU, Peak: -2.2 dBFS (EBU R128, ffmpeg ebur128) |
| Stills | `stills/01-word.png` (frame 0), `02-meaning.png`, `03-example.png`, `04-recap.png`, `05-safe-zones.png` (UI zones overlaid) |

## Notes applied

Clip note: *Clamp: the clamps slide in, strain under the storm and snap open on "let go".*

- Two vise jaws slide in from either side with spring overshoot and lock onto the word block (a clunk on each lock).
- The person icon sits in the block for the novel; the storm set slides in, then the jaws strain with jitter, rain and lightning flashes (low rumble).
- On "Let go" the jaws snap open and tilt away (snap SFX), and the block shows "?" because nothing fixes its meaning.
- Recap: the jaws close again with a lock icon on the block; the accent sits on the jaws ("the lock").

Global notes (all nine clips):

- Real motion: every element enters with an eased or spring curve (Easing.bezier, plus a damped-spring helper at damping 8-15); nothing appears in one frame. The measured largest frame-to-frame change is in the table below.
- One accent (#FFB21E amber) is applied through the narration timeline: an element is amber only while its card or voice line is on it, and fades in and out over about 0.3 s.
- Camera: the whole scene drifts from 100 % to 104 % zoom with a slight pan over the clip (Camera in src/kit.tsx), so nothing ever freezes.
- Structure: four sections (word, meaning, example, recap) with a progress bar; the target word is drawn at full opacity from frame 0, settles from 107 % to 100 % scale on a spring over 0.9 s, then breathes by ±1.2 %.
- Text: every card is 3-5 words (enforced by build_audio.py), white or amber on #141C2C panels, 43 px Outfit Bold, bottom edge at 922 px; scenes are clipped to the safe area.

## Cards, voice and timing

| Time (s) | Section | Card (3-5 words) | Voice says | Heard by Whisper | Match |
|---|---|---|---|---|---|
| 0.00-5.39 | word | Agent: one word, many meanings | (card, verbatim) | Agent, one word, many meanings. | 1.00 |
| 5.39-9.13 | meaning | The sentence is the lock | (card, verbatim) | The sentence is the lock. | 1.00 |
| 9.13-12.86 | example | For a novel: a person | (card, verbatim) | for a novel, a person. | 1.00 |
| 12.86-16.60 | example | In a storm: a force | (card, verbatim) | In a storm. A force. | 1.00 |
| 16.60-20.46 | recap | Let go: it opens | (card, verbatim) | Let go. It opens. | 1.00 |
| 20.46-25.00 | recap | The sentence is the lock | (card, verbatim) | The sentence is the lock. | 1.00 |

Motion SFX cues: whoosh @ meaning+0.3s, clunk @ meaning+0.75s, whoosh @ storm+0.0s, clunk @ storm+0.75s, rumble @ storm+1.7s, snap @ letgo+0.15s, whoosh @ final+0.3s, clunk @ final+0.7s. A soft tick also marks each card change after the first.

## Audio: sources and licences

| Layer | Source | Licence |
|---|---|---|
| Voice-over | Piper TTS 1.8.0, run locally on this VM's CPU (`python3 -m piper`, length scale 1.08). Voice `en_US-ljspeech-high` from `huggingface.co/rhasspy/piper-voices`, trained by Bryce Beattie on the LJ Speech dataset. Clear US-English female voice; reads each card verbatim (`say` only respells numbers and the Latin word). | Piper program: GPL-3.0-or-later (the program, not the audio it outputs). Voice dataset: LJ Speech, public domain (per the voice's MODEL_CARD). piper-voices repository: MIT. |
| Music bed | Original four-chord pad synthesised in `build_audio.py` (detuned sines plus a sub-octave, slow tremolo, low-pass at 1.8 kHz, 1.2 s fade-in and 1.6 s fade-out). The root note differs per clip. | Original, made for this repo; no third-party material. |
| Ducking | Envelope follower on the voice (60 ms attack, 450 ms release) lowers the bed by 11 dB under speech. Measured: voice -16.3 dBFS RMS, bed under voice -35.4 dBFS, bed between lines -27.2 dBFS. | n/a |
| SFX | Synthesised in `build_audio.py` from noise bursts, filtered sweeps and sine drops (whoosh, swish, pop, tick, clunk, snap, thud, chime and so on), each peak-normalised and mixed soft (peak -11.7 dBFS before mastering). | Original, no samples. |
| Master | Gentle tanh soft clip, then two-pass FFmpeg `loudnorm` (I = -14 LUFS, TP = -1.5 dBTP, linear), 48 kHz; Remotion encodes AAC 192 kb/s. | n/a |
| Intelligibility check | faster-whisper 1.2.1 with `small.en` (OpenAI Whisper weights, CTranslate2 conversion by Systran), run on the final mp4's AAC audio, one card slot at a time. Score 1.00. | MIT (faster-whisper and Whisper weights). Used for checking only; not in the output. |
| Fonts | Outfit (`public/fonts/Outfit.ttf`); JetBrains Mono (system font, Alt Screen terminal). | SIL Open Font License 1.1 |

Retakes (Piper is stochastic; `pick_takes.py` kept the first take Whisper heard word-for-word): `clamp:novel`: 1 take(s), kept 1.00 ("for a novel, a person."); `clamp:storm`: 1 take(s), kept 1.00 ("in a storm, a force.").

## Verification (`verify_video.py`, every frame of the mp4)

| Check | Result |
|---|---|
| Bright pixels outside the safe area (top 180, bottom 950, left 56, right 592) in any frame | 0 |
| Target word on frame 0 (bright share of the word band) | 0.187 (word drawn at full opacity) |
| Largest single-frame change (share of pixels changing by more than 40/255) | 0.0358 (no hard cuts or pop-ins; median 0.0002) |
| Duration | 25.00 s (target 20-30 s) |

## Render commands

```bash
cd v3-opus
npm install                                  # remotion 4.0.535 and friends (package.json)
pip install piper-tts==1.8.0 numpy faster-whisper==1.2.1
mkdir -p .voices && for f in en_US-ljspeech-high.onnx en_US-ljspeech-high.onnx.json; do
  curl -sSL -o .voices/ljspeech-$f https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/$f
done
python3 build_audio.py clamp                # voice + music + SFX -> public/clamp.wav, timeline.json
python3 pick_takes.py clamp:<line-id>       # optional: re-roll a mumbled Piper line
python3 build_audio.py clamp
./render-all.sh clamp                       # mp4 + stills + probe + loudness
#   = npx remotion render src/index.ts Clamp clamp/.raw.mp4 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k
#     ffmpeg -i clamp/.raw.mp4 -c copy -movflags +faststart -metadata artist="CA.EYE agents" clamp/clamp-v3-opus.mp4
#     npx remotion render ... --sequence --frames=<word,meaning,example,recap> --image-format=png
#     npx remotion still src/index.ts Clamp clamp/stills/05-safe-zones.png --props='{"safe":true}'
python3 verify_video.py clamp               # safe zones, frame 0, motion
python3 check_audio.py clamp                # Whisper hears each card in its slot
python3 make_trace.py                        # this file
```

Not merged, not deployed.
