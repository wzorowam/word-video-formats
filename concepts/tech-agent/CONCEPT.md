# Alt-Screen

**Format name:** Alt-Screen
**Series:** Alt-Screen #1 — agent
**Logline:** You type the word `agent` at a shell prompt. The terminal does not define it. It takes the alternate screen, and only one sense of the word refuses to give the prompt back.
**Duration:** 48 seconds. **Frame:** 9:16.

One word, four chunks, nothing else taught in this episode: the string you type, the `User-Agent` header, the session that takes the screen, and the loop that looks again. A chatbot is the wrong picture, not a second vocabulary word.

## Beat-by-beat storyboard

Timings sum to 48.0s. Every beat changes the visual state. Narration is written to land on the same frame as the picture.

| Time | Dur | Visual state | What you hear, in sync |
| --- | --- | --- | --- |
| 0.0–2.0 | 2.0 | No logo, no intro. Dark terminal, shell prompt, blinking cursor. The word `agent` strikes in as kinetic type and settles onto the prompt line. | "What starts if you type agent?" |
| 2.0–8.0 | 6.0 | Cut to a single pale reply, `Sure.`, then the shell prints `exit 0` in red and the prompt returns. | "Not a chatbot. One prompt, one answer, and the shell comes back. That exit is the tell." |
| 8.0–15.0 | 7.0 | The glass tears to a raw request. `User-Agent: curl/8.7.1` locks on, and the kinetic `agent` inside the header pulses, then dims to a label. | "User-Agent is the old sense. A header. The client names itself. A label — not a mind." |
| 15.0–22.0 | 7.0 | Back to the shell. Human-cadence `a-g-e-n-t`, Enter, then boot lines scroll: `Grok Build 1.0.45`, `model grok-4.7`, `session start`. | "Type agent. Enter. Version. Model. Session start. Still no definition." |
| 22.0–29.0 | 7.0 | Alternate screen. The Grok Build TUI replaces the shell: braille logo, menu, focused `❯` composer. A tool row appears, then a second look starts. Kinetic `agent` once, as the word is said. | "The shell is gone. This is the agent. Look. Use a tool. Look again." |
| 29.0–32.0 | 3.0 | TUI dims. Two short choices hold. No answer on screen. | "Pause. One reply — or another look?" |
| 32.0–37.0 | 5.0 | Undim. The second look is on screen. The shell prompt is still gone. | "Another look." |
| 37.0–42.0 | 5.0 | Same TUI, held a beat longer than feels natural. Composer still owns the bottom. | "A chatbot would have given the shell back." |
| 42.0–48.0 | 6.0 | Alt screen releases. Last frame is the first frame: empty shell, blinking cursor, the word not yet typed. | "Type agent again. It still won't exit." |

The 15.0–22.0 beat is the required handoff: a realistic terminal, the user types `agent`, Enter, boot output, then the Grok terminal agent UI. The runnable prototype plays that handoff on its own, at a readable length, and holds on the usable TUI.

## Visual system and animation style

Portrait 1080×1920. One terminal, full bleed, monospace (JetBrains Mono). Shell chrome is a dark window: traffic-light title bar, title `zsh`, background `#0a0a0a`, green user, blue path, block cursor.

Grok's screen is the real Grok Build TUI in the default GrokNight theme, not a chat bubble. Background `#141414`, primary text `#e1e1e1`, muted `#6c6c6c`, keys `#787878`, model teal `#1abc9c`, running cyan `#7dcfff`, error `#f7768e`. Narrow stacked welcome, which is what this portrait column actually is: braille logo with the real diagonal shimmer, bold labels with shortcuts on the right (`New worktree` / `ctrl+w`, `Resume session` / `ctrl+r`, `Changelog`, `Quit` / `ctrl+q`), a rounded composer with a `❯` prefix, and a right-aligned `Grok Build 1.0.45` badge. The border goes from `#323237` to `#505058` when the composer is focused. That focus, plus the blinking cursor, is the UI becoming usable. Boot text uses the shipping version line from the 1.0.45 changelog and the current model name `grok-4.7`.

Motion is terminal motion only: keystrokes, scroll, a wipe into the alternate screen, a border brightening. The only kinetic type is the word `agent`. Captions are two to four words, burned in, never a transcript.

Accuracy, so the episode does not teach a fake command: the shipping binary is `grok`. This film types the vocabulary word `agent`, and the screen that takes over is the real Grok Build TUI. `User-Agent` is the HTTP header (a client label). A chatbot turn is one model call that stops. An agent is that model inside a loop that can use tools and look again until a stop. Those other names — tool call, agent loop, sub-agent, agentic — are later episodes, not this script.

## Voiceover and captions

Warm, conversational, slowed on the word `agent`. The word is spoken five times. Music, if any, ducks under the voice. A soft tick only on a beat change.

| Time | Voiceover | On-screen caption |
| --- | --- | --- |
| 0.0–2.0 | What starts if you type agent? | kinetic `agent` only |
| 2.0–8.0 | Not a chatbot. One prompt, one answer, and the shell comes back. That exit is the tell. | one answer |
| 8.0–15.0 | User-Agent is the old sense. A header. The client names itself. A label — not a mind. | a label |
| 15.0–22.0 | Type agent. Enter. Version. Model. Session start. Still no definition. | session start |
| 22.0–29.0 | The shell is gone. This is the agent. Look. Use a tool. Look again. | look · tool · look |
| 29.0–32.0 | Pause. One reply — or another look? | one reply, or another look? |
| 32.0–37.0 | Another look. | another look |
| 37.0–42.0 | A chatbot would have given the shell back. | shell still gone |
| 42.0–48.0 | Type agent again. It still won't exit. | kinetic `agent` returns with the prompt |

## Hook, re-hooks, payoff

**Hook (0.0–2.0).** A question, no logo: what starts if you type this word? The open loop is that question. The payoff is withheld.

**Re-hooks.** A visual change plus a micro-cliffhanger at each beat, never more than 8 seconds apart:

- 2.0 — the reply dies with `exit 0`. "That exit is the tell."
- 8.0 — the header takes the glass. "A label — not a mind."
- 15.0 — the shell is back and the word has to be typed for real. "Still no definition."
- 22.0 — the alternate screen steals the prompt. "Look again."
- 29.0 — the picture dims into the pause.
- 37.0 — the shell is still gone.
- 42.0 — the last line points at the empty prompt you are about to see.

**Payoff, looped into the hook.** The pause closes on "another look." That is what Enter started: not a reply, an agent, and the shell does not come back until you quit. The last frame is the first frame, so the replay is the hook. The last line ("Type agent again") is the hand that puts the viewer back on the cursor.

## Series plan

Named, numbered series: **Alt-Screen**. Later episodes quiz one or two earlier words before the new premise. The connection is explicit, not a buried end card.

1. **Alt-Screen #1 — agent.** This episode. Four chunks: the string, the header, the session, the loop that looks again.
2. **Alt-Screen #2 — tool call.** Quiz: was `agent` one reply or another look, and was `User-Agent` a header or a mind? Premise: a tool call is the runtime doing what the model asked, then handing the result back.
3. **Alt-Screen #3 — agent loop.** Quiz: who runs a tool call, the model or the runtime? Premise: look, act, look, stop — the cycle, and the condition that finally returns the shell.
4. **Alt-Screen #4 — sub-agent.** Quiz: what does `agent` keep that a chatbot gives back, and what closes an agent loop? Premise: a child loop with its own stop, spawned by the parent, not a second copy of the chat.
5. **Alt-Screen #5 — agentic.** Quiz: is a sub-agent a second chatbot, and does an agent loop exit on the first reply? Premise: agentic names the loop-shaped behavior, not a bigger model and not a mood.

## Production approach

**Remotion** for the full 48s episode: deterministic 9:16 frames, voice locked to the timeline, kinetic type on one word. **Vanilla canvas** for the prototype of the terminal handoff, so it plays with no build. The episode's 15.0–22.0 beat reuses that drawing. Not Three.js (no space to move through) and not Manim (the subject is terminal chrome, not a diagram).

**Difficulty: medium.** The pictures are flat and the cuts are hard, but GrokNight has to stay accurate under motion, the keystrokes need human timing, and each caption has to hit the same frame as the word. That is timing work, not a character rig.

## What this format refuses to be

A myth-then-fact explainer: the wrong picture is one beat, and the spine is the terminal's alternate screen.

## How to run the prototype

Open `concepts/tech-agent/prototype/index.html` in a browser. It autoplays on a 1080×1920 canvas and loops: shell prompt, blinking cursor, `agent` typed with human cadence, Enter, boot scroll (`Grok Build 1.0.45`, `model grok-4.7`, `session start`), then the Grok Build TUI focused and usable. No build step and no server.

To record the same sequence:

```bash
node concepts/tech-agent/prototype/record.mjs
```

That writes a silent mp4 of one pass, ending on the usable TUI. Needs Chrome and ffmpeg on the machine.

## Checklist

1. **Met — 0.0–2.0.** Curiosity-gap hook, the question "What starts if you type agent?", no logo and no intro. The payoff is withheld until 32.0.
2. **Met — opened 0.0, closed 32.0–42.0.** The question is what Enter starts. The answer is an agent that looks again, and the shell does not come back.
3. **Met — 2.0, 8.0, 15.0, 22.0, 29.0, 37.0, 42.0.** Each is a new visual state and a micro-cliffhanger. The longest gap is 7s, inside the 5–8s band.
4. **Met — four chunks of `agent` only.** The string (0.0–2.0 and 15.0–22.0), the header (8.0–15.0), the session (15.0–22.0), the loop (22.0–42.0). Tool call, agent loop, sub-agent, and agentic are named only in the series plan.
5. **Met — same-moment dual coding.** Each row of the storyboard table is the line spoken while that picture is on screen, from the keystrokes through "another look."
6. **Met — kinetic type is only `agent`.** At 0.0–2.0, inside the header at 8.0–15.0, once at 22.0–29.0, and again as the loop resets at 42.0–48.0. Captions stay two to four words. Nothing on screen is a transcript of the voiceover.
7. **Met — short same-language captions, word repeated.** Captions are in the script table. `agent` is spoken five times (0.0, 8.0, 15.0, 22.0, 42.0), which is the 3–5 encounter band.
8. **Met — 29.0–32.0.** A 3s hold: "Pause. One reply — or another look?" The reveal starts at 32.0, not before.
9. **Met — 2.0 and 8.0, paid off at 32.0.** Concrete terminal, not a definition. Surprise: `User-Agent` is a header, not a mind, and a chatbot would have returned the shell.
10. **Met — the board is the template.** Hook question, wrong picture, twist in chunks, quiz, payoff, last frame identical to the first.
11. **Met — series Alt-Screen #1–#5.** Episodes 2–5 each quiz one or two earlier words in the premise line above, then teach the next word in the cluster.
12. **Met — measurement note.** Judge this cut by 0–2s retention, average percentage viewed, the retention curve at each re-hook, and saves plus sends per reach — not by views. A loopable ending should show up as a rewatch spike at the tail. Do not ask for shares.
