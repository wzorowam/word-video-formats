# TRACE

- Tool: Remotion 4.0.535 for the picture, Flite 2.2 for the voice, Python 3.12.3 for the music, the effects, and the mix, Google Chrome 154.0.8037.92 for the frames.
- Tool version: remotion 4.0.535, @remotion/cli 4.0.535, flite-2.2-current (Debian flite 2.2-6build3), Python 3.12.3, Chrome 154.0.8037.92.
- Skill or guidance followed: Ca's clip review in the project note `internal/CLIP-REVIEW-NOTES.md`. No separate Cursor skill. The lesson split follows PR 10 `concepts/INDEX.md`, shortened to word, meaning, example, recap.
- MODEL: Grok 4.7 / grok-4.7-high

## Review notes applied

- Real motion: entrances use a Remotion spring (damping 11, stiffness 170) so they accelerate, settle, and overshoot slightly. Nothing appears in a single-frame pop.
- One accent, and only on the thing the current line is about. The big word uses it during the opening beat, then it moves.
- Camera: scale eases from 1.02 to 1.05 (a 3% zoom, inside the 2–5% drift) plus a few pixels of travel, so a hold never freezes.
- Frame is 720×1280 and the cut is 26.0 seconds (780 frames at 30 fps), inside 20–30 seconds. Order is word, meaning, example, recap. `agent` is already on screen at frame 0. Each card is 3–5 words, white on near-black, inside the safe area (clear of the top 14%, the bottom 18%, and the side edges). The credit is written exactly `CA.EYE agents`.

- Story device: the dial keeps rotating, dates scroll on a track and overshoot each stop, and the active label grows. Accent `#8B6CFF` is the pointer, then the big label.
- Fact kept here: which meaning came first — doer before 1500, a force in the 1550s, a deputy in the 1590s. No bleach bottle.
- SFX: a soft tick each time a date locks.

## Audio

- TTS: Flite 2.2 (`flite-2.2-current`, Debian package flite 2.2-6build3), voice `slt` (`cmu_us_slt`). Engine page: http://cmuflite.org and https://github.com/festvox/flite. Licence: Carnegie Mellon BSD-style grant — permission to use and distribute the synthesizer without restriction, keeping the notice and not using CMU's name to endorse a product. Voice data: CMU ARCTIC SLT, https://www.festvox.org/cmu_arctic/, free for any purpose, commercial or non-commercial. `v2/audio/generate.py` speaks the on-screen word and each card at that card's start frame.
- Music: original quiet pad synthesized by `v2/audio/generate.py` (Python 3.12 standard library, no sample library). Dedicated under CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/. The bed sits under the voice and ducks further while a line is speaking.
- SFX: original soft effects from the same script (spring, snap, peel, whoosh, tick, rustle, thud, only the ones this clip uses). Dedicated under CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/. No commercial sample pack.

## Render commands

From `v2/`:

```
python3 audio/generate.py
npx remotion render src/index.ts TimeMachine time-machine/render.mp4 --browser-executable=/usr/local/bin/google-chrome --concurrency=2 --codec=h264 --audio-codec=aac --crf=20 --pixel-format=yuv420p
npx remotion still src/index.ts TimeMachine time-machine/still.png --browser-executable=/usr/local/bin/google-chrome --frame=570
```
