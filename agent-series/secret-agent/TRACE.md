# TRACE

- Tool: Remotion 4.0.535 for the picture, Flite 2.2 for the voice, Python 3.12.3 for the music, the effects, and the mix, Google Chrome 154.0.8037.92 for the frames. Picture type is Inter (SIL Open Font License 1.1, bundled in `public/fonts/` with `OFL.txt`).
- Tool version: remotion 4.0.535, @remotion/cli 4.0.535, flite-2.2-current (Debian flite 2.2-6build3), Python 3.12.3, Chrome 154.0.8037.92.
- Skill or guidance followed: the three shared motion rules in the project note `internal/CLIP-REVIEW-NOTES.md`. No separate Cursor skill. Clip-specific devices from that note were not used: no cord, clamps, peel, tree, shove, dial, passing hand, terminal chrome, or hotspot lines. No bleach, no sport, no grammar, and no hat tip.
- MODEL: Grok 4.7 / grok-4.7-high

## Review notes applied

- Real motion: the figure steps toward the door on a travel spring, the note slides into the gap under the door and overshoots slightly as it settles, then the figure eases back. The figure keeps a small vertical bob. Nothing appears in a single-frame pop.
- One accent, `#FF3B55`, and only on the thing the current line is about. The headword uses it during the word beat. Then it moves to the figure ("sent to work unseen"), the note ("she hides a note"), and the figure again on the recap.
- Camera: scale eases from 1.00 to 1.04 (a 4% zoom, inside the 2–5% drift) plus a slow horizontal and vertical sine, so a hold never freezes.
- Frame is 720×1280 and the cut is 26.0 seconds (780 frames at 30 fps), inside 20–30 seconds. Order is word, meaning, example, recap. `agent` is already on screen at frame 0. Each caption card is 3–5 words, white on near-black, inside the safe area (clear of the top 14%, the bottom 18%, and the side edges). The credit is written exactly `CA.EYE agents`.

## Audio

- TTS: Flite 2.2 (`flite-2.2-current`, Debian package flite 2.2-6build3), voice `slt` (`cmu_us_slt`). Engine page: http://cmuflite.org and https://github.com/festvox/flite. Licence: Carnegie Mellon BSD-style grant — permission to use and distribute the synthesizer without restriction, keeping the notice and not using CMU's name to endorse a product. Voice data: CMU ARCTIC SLT, https://www.festvox.org/cmu_arctic/, free for any purpose, commercial or non-commercial. `agent-series/audio/generate.py` speaks the on-screen word at frame 0 and each caption card at that card's start frame.
- Music: original quiet pad synthesized by `agent-series/audio/generate.py` (Python 3.12 standard library, no sample library). Dedicated under CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/. The bed sits under the voice and ducks further while a line is speaking.
- SFX: original soft whoosh, slide, and thud from the same script, on the step, the note, and the step back. Dedicated under CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/. No commercial sample pack.

## Render commands

From `agent-series/`:

```
python3 audio/generate.py
npx remotion render src/index.ts SecretAgent secret-agent/render.mp4 --browser-executable=/usr/local/bin/google-chrome --concurrency=2 --codec=h264 --audio-codec=aac --crf=20 --pixel-format=yuv420p
npx remotion still src/index.ts SecretAgent secret-agent/still.png --browser-executable=/usr/local/bin/google-chrome --frame=352
```
