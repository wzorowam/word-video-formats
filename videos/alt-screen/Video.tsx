import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { Cap, MONO, SANS } from "../src/ui";

const pilot = pilotOf("alt-screen");

export const AltScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const b = cue.beat;
  const alt = ["alt", "loop", "answer", "gone"].includes(b);
  const header = b === "header";
  const typed = b === "hook" || b === "boot";
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: alt ? "#141414" : "#0a0a0a", fontFamily: MONO, color: "#e1e1e1" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 72, background: "#1b1b1b", display: "flex", alignItems: "center", paddingLeft: 28, gap: 10 }}>
        {["#f7768e", "#e0af68", "#9ece6a"].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
        ))}
        <div style={{ marginLeft: 18, color: "#6c6c6c" }}>{alt ? "agent" : "zsh"}</div>
      </div>
      <div style={{ position: "absolute", left: 64, top: 160, right: 80, fontSize: 34, lineHeight: 1.45 }}>
        {!alt && !header && (
          <>
            <div><span style={{ color: "#9ece6a" }}>you</span> <span style={{ color: "#7aa2f7" }}>~</span></div>
            <div>
              {typed ? "agent" : ""}
              {blink && !header ? "█" : ""}
            </div>
            {b === "chat" && (
              <>
                <div style={{ marginTop: 28 }}>Sure.</div>
                <div style={{ color: "#f7768e" }}>exit 0</div>
              </>
            )}
            {b === "boot" && (
              <>
                <div style={{ marginTop: 28, color: "#7dcfff" }}>Grok Build 1.0.45</div>
                <div>model grok-4.7</div>
                <div>session start</div>
              </>
            )}
          </>
        )}
        {header && (
          <div style={{ fontSize: 40 }}>
            User-Agent: curl/8.7.1
            <div style={{ marginTop: 24, color: "#6c6c6c", fontFamily: SANS, fontSize: 36 }}>a name tag, not a mind</div>
          </div>
        )}
        {alt && (
          <div>
            <div style={{ color: "#1abc9c", fontWeight: 700, fontSize: 42 }}>Grok Build</div>
            <div style={{ marginTop: 20, color: "#6c6c6c" }}>New worktree</div>
            <div style={{ color: "#6c6c6c" }}>Resume session</div>
            <div style={{ marginTop: 36, border: "2px solid #505058", borderRadius: 16, padding: 18 }}>
              ❯ {b === "loop" || b === "answer" || b === "gone" ? "look again" : ""}
              {blink ? "█" : ""}
            </div>
            {(b === "loop" || b === "answer" || b === "gone") && (
              <div style={{ marginTop: 22, color: "#7dcfff" }}>tool · result · look</div>
            )}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 64, top: 1180, fontFamily: SANS, fontWeight: 800, fontSize: 92, color: "#e1e1e1" }}>
        agent
      </div>
      <Cap text={cue.caption} light top={1500} />
      <Audio src={staticFile("alt-screen.wav")} />
    </AbsoluteFill>
  );
};
