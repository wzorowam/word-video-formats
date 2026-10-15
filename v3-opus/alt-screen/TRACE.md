# TRACE: Alt Screen (v3-opus)

CA.EYE agents word-learning clip for **agent**. Remade from scratch in `v3-opus/`.

| Field | Value |
|---|---|
| MODEL | Claude Opus 5.5 (Cursor Cloud Agent) |
| Credit | CA.EYE agents |
| Tool | Remotion 4.0.535 (`remotion`, `@remotion/cli`, `@remotion/media`), React 19.3.0, TypeScript 5.9.3, Node 22.14.0, Chromium headless shell 157.0.8080.0 |
| Audio tools | Piper TTS 1.8.0 + onnxruntime 1.31.0, Python 3.12.3 + numpy 1.26.4, FFmpeg 6.1.1, faster-whisper 1.2.1 (check only) |
| Skill / guidance | Remotion agent skills from `remotion-dev/skills` (`remotion-best-practices`, `remotion-render`, `remotion-multimedia`; pinned in `v3-opus/skills-lock.json`): `useCurrentFrame` + `interpolate` with easing, no CSS animations, `Audio` from `@remotion/media`. Clip notes: `uploads/CLIP-REVIEW-NOTES.md` (Ca). |
| Composition | `AltScreen` in `v3-opus/src/Root.tsx`, scene in `v3-opus/alt-screen/Video.tsx` |
| Output | `v3-opus/alt-screen/alt-screen-v3-opus.mp4` |
| Format | 720x1280 h264 30 fps + AAC 48000 Hz 2 ch, 25.00 s |
| Loudness | I: -14.0 LUFS, LRA: 4.9 LU, Peak: -1.4 dBFS (EBU R128, ffmpeg ebur128) |
| Stills | `stills/01-word.png` (frame 0), `02-meaning.png`, `03-example.png`, `04-recap.png`, `05-safe-zones.png` (UI zones overlaid) |

## Notes applied

Clip note: *Alt Screen: a blinking cursor, an amber glow on the active line, snappier windows.*

- The prompt types "agent" letter by letter and the block cursor blinks with an eased (not hard) blink.
- Windows open in about 0.3 s with a stiff spring and close in 0.16 s; each has a pop SFX.
- An amber glow and bar move line by line, in time with the voice: look, then tool, then look again.
- Contrast beat: a chatbot window answers once and closes back to the prompt; the agent window keeps cycling and counts rounds.

Global notes (all nine clips):

- Real motion: every element enters with an eased or spring curve (Easing.bezier, plus a damped-spring helper at damping 8-15); nothing appears in one frame. The measured largest frame-to-frame change is in the table below.
- One accent (#FFB21E amber) is applied through the narration timeline: an element is amber only while its card or voice line is on it, and fades in and out over about 0.3 s.
- Camera: the whole scene drifts from 100 % to 104 % zoom with a slight pan over the clip (Camera in src/kit.tsx), so nothing ever freezes.
- Structure: four sections (word, meaning, example, recap) with a progress bar; the target word is drawn at full opacity from frame 0, settles from 107 % to 100 % scale on a spring over 0.9 s, then breathes by ±1.2 %.
- Text: every card is 3-5 words (enforced by build_audio.py), white or amber on #141C2C panels, 43 px Outfit Bold, bottom edge at 922 px; scenes are clipped to the safe area.

## Cards, voice and timing

| Time (s) | Section | Card (3-5 words) | Voice says | Heard by Whisper | Match |
|---|---|---|---|---|---|
| 0.00-4.02 | word | What does agent start? | (card, verbatim) | What does agent start? | 1.00 |
| 4.02-9.11 | meaning | Look, use tools, look again | (card, verbatim) | Look. Use tools. Look again. | 1.00 |
| 9.11-12.88 | example | User-Agent is a label | User agent is a label. | User agent is a label. | 1.00 |
| 12.88-16.66 | example | A chatbot answers once | (card, verbatim) | The chatbot answers once. | 0.75 |
| 16.66-20.43 | example | The agent keeps looking | (card, verbatim) | The agent keeps looking. | 1.00 |
| 20.43-25.00 | recap | Look, tool, look again | (card, verbatim) | Look tool, look again. | 1.00 |

Motion SFX cues: keys @ word+0.0s, pop @ meaning+0.1s, pop @ header+0.1s, pop @ chat+0.1s, tick @ chat+2.2s, pop @ keeps+0.1s, tick @ recap+0.1s. A soft tick also marks each card change after the first.

## Audio: sources and licences

| Layer | Source | Licence |
|---|---|---|
| Voice-over | Piper TTS 1.8.0, run locally on this VM's CPU (`python3 -m piper`, length scale 1.08). Voice `en_US-ljspeech-high` from `huggingface.co/rhasspy/piper-voices`, trained by Bryce Beattie on the LJ Speech dataset. Clear US-English female voice; reads each card verbatim (`say` only respells numbers and the Latin word). | Piper program: GPL-3.0-or-later (the program, not the audio it outputs). Voice dataset: LJ Speech, public domain (per the voice's MODEL_CARD). piper-voices repository: MIT. |
| Music bed | Original four-chord pad synthesised in `build_audio.py` (detuned sines plus a sub-octave, slow tremolo, low-pass at 1.8 kHz, 1.2 s fade-in and 1.6 s fade-out). The root note differs per clip. | Original, made for this repo; no third-party material. |
| Ducking | Envelope follower on the voice (60 ms attack, 450 ms release) lowers the bed by 11 dB under speech. Measured: voice -17.5 dBFS RMS, bed under voice -35.3 dBFS, bed between lines -27.4 dBFS. | n/a |
| SFX | Synthesised in `build_audio.py` from noise bursts, filtered sweeps and sine drops (whoosh, swish, pop, tick, clunk, snap, thud, chime and so on), each peak-normalised and mixed soft (peak -12.4 dBFS before mastering). | Original, no samples. |
| Master | Gentle tanh soft clip, then two-pass FFmpeg `loudnorm` (I = -14 LUFS, TP = -1.5 dBTP, linear), 48 kHz; Remotion encodes AAC 192 kb/s. | n/a |
| Intelligibility check | faster-whisper 1.2.1 with `small.en` (OpenAI Whisper weights, CTranslate2 conversion by Systran), run on the final mp4's AAC audio, one card slot at a time. Score 0.96. | MIT (faster-whisper and Whisper weights). Used for checking only; not in the output. |
| Fonts | Outfit (`public/fonts/Outfit.ttf`); JetBrains Mono (system font, Alt Screen terminal). | SIL Open Font License 1.1 |

## Verification (`verify_video.py`, every frame of the mp4)

| Check | Result |
|---|---|
| Bright pixels outside the safe area (top 180, bottom 950, left 56, right 592) in any frame | 0 |
| Target word on frame 0 (bright share of the word band) | 0.193 (word drawn at full opacity) |
| Largest single-frame change (share of pixels changing by more than 40/255) | 0.0305 (no hard cuts or pop-ins; median 0.0002) |
| Duration | 25.00 s (target 20-30 s) |

## Render commands

```bash
cd v3-opus
npm install                                  # remotion 4.0.535 and friends (package.json)
pip install piper-tts==1.8.0 numpy faster-whisper==1.2.1
mkdir -p .voices && for f in en_US-ljspeech-high.onnx en_US-ljspeech-high.onnx.json; do
  curl -sSL -o .voices/ljspeech-$f https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/$f
done
python3 build_audio.py alt-screen                # voice + music + SFX -> public/alt-screen.wav, timeline.json
python3 pick_takes.py alt-screen:<line-id>       # optional: re-roll a mumbled Piper line
python3 build_audio.py alt-screen
./render-all.sh alt-screen                       # mp4 + stills + probe + loudness
#   = npx remotion render src/index.ts AltScreen alt-screen/.raw.mp4 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k
#     ffmpeg -i alt-screen/.raw.mp4 -c copy -movflags +faststart -metadata artist="CA.EYE agents" alt-screen/alt-screen-v3-opus.mp4
#     npx remotion render ... --sequence --frames=<word,meaning,example,recap> --image-format=png
#     npx remotion still src/index.ts AltScreen alt-screen/stills/05-safe-zones.png --props='{"safe":true}'
python3 verify_video.py alt-screen               # safe zones, frame 0, motion
python3 check_audio.py alt-screen                # Whisper hears each card in its slot
python3 make_trace.py                        # this file
```

Not merged, not deployed.
