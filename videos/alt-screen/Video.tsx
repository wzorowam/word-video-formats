import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, BLOCK, BLOCK_LINE, CYAN, MUTED, Stage, WHITE, stepNo } from "../src/ui";

const pilot = pilotOf("alt-screen");

const tagFor = (b: string) => {
  if (b === "header") return "User-Agent";
  if (b === "chat") return "One answer";
  if (["alt", "loop", "answer", "gone"].includes(b)) return "Another look";
  if (b === "pause") return "Pause";
  if (b === "boot") return "Session";
  return "Type agent";
};

export const AltScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const b = cue.beat;
  const alt = ["alt", "loop", "answer", "gone"].includes(b);
  const blink = Math.floor(frame / 16) % 2 === 0;
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tagFor(b)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} text="agent" />}>
        <div style={{ position: "absolute", left: 70, top: 50, width: 640, height: 440, borderRadius: 16, background: BLOCK, padding: 28 }}>
          <div style={{ height: 10, width: 180, borderRadius: 5, background: BLOCK_LINE, marginBottom: 22 }} />
          {!alt && b !== "header" && (
            <div style={{ color: MUTED, fontSize: 28, lineHeight: 1.5 }}>
              <div style={{ color: CYAN }}>you ~</div>
              <div style={{ color: WHITE }}>
                {b === "hook" || b === "boot" ? "agent" : ""}
                {blink ? "▍" : ""}
              </div>
              {b === "chat" && (
                <>
                  <div style={{ marginTop: 16 }}>Sure.</div>
                  <div style={{ color: CYAN }}>exit 0</div>
                </>
              )}
              {b === "boot" && (
                <>
                  <div style={{ marginTop: 16, color: WHITE }}>Grok Build 1.0.45</div>
                  <div>model grok-4.7</div>
                  <div style={{ color: CYAN }}>session start</div>
                </>
              )}
            </div>
          )}
          {b === "header" && (
            <div style={{ color: WHITE, fontSize: 30, lineHeight: 1.45 }}>
              User-Agent: curl/8.7.1
              <div style={{ marginTop: 18, color: MUTED, fontSize: 26 }}>a name tag, not a mind</div>
            </div>
          )}
          {alt && (
            <div style={{ color: MUTED, fontSize: 28, lineHeight: 1.5 }}>
              <div style={{ color: CYAN, fontWeight: 700 }}>Grok Build</div>
              <div>New worktree</div>
              <div>Resume session</div>
              <div style={{ marginTop: 18, border: `1.5px solid ${CYAN}`, borderRadius: 10, padding: "10px 14px", color: WHITE }}>
                ❯ {b === "loop" || b === "answer" || b === "gone" ? "look again" : ""}
                {blink ? "▍" : ""}
              </div>
              {(b === "loop" || b === "answer" || b === "gone") && <div style={{ marginTop: 14, color: CYAN }}>tool · result · look</div>}
            </div>
          )}
        </div>
      </Stage>
      <Audio src={staticFile("alt-screen.wav")} />
    </AbsoluteFill>
  );
};
