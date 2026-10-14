import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("passing-hand");

const Hand: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={0} y={18} width={150} height={78} rx={28} fill="#f2c7a5" stroke="#1b1b1f" strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={18 + i * 28} y={-8} width={22} height={40} rx={10} fill="#f2c7a5" stroke="#1b1b1f" strokeWidth={6} />
    ))}
  </g>
);

export const PassingHand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const b = cue.beat;
  const cream = b === "reveal" || b === "pay" || b === "room";
  const ticketX = b === "hook" || b === "wrong" || b === "stuck" ? 430 : b === "carry" || b === "stick" ? 470 : b === "pay" || b === "room" ? 390 : 520;
  const ticketY = b === "pay" || b === "room" ? 1180 : b === "carry" || b === "stick" ? 760 : 280;
  const handX = b === "hook" ? 760 : b === "reveal" ? 390 : b === "pay" || b === "room" ? 250 : 560;
  const handY = b === "pay" || b === "room" ? 1080 : b === "reveal" ? 620 : 360;
  const showSplit = b === "pause" || b === "quiz";
  return (
    <AbsoluteFill style={{ background: cream ? "#f6f1e7" : "#16324a", fontFamily: SANS }}>
      {!showSplit && !cream && (
        <>
          <div style={{ position: "absolute", inset: "140px 80px 520px 80px", background: "rgba(255,255,255,0.08)", borderBottom: "8px solid rgba(255,255,255,0.25)" }} />
          <div style={{ position: "absolute", left: 760, top: 220, width: 150, height: 70, background: "#2a2e33", color: "#d7d2c8", fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>
            AGENCY
          </div>
        </>
      )}
      {showSplit && (
        <>
          <div style={{ position: "absolute", left: 80, top: 420, width: 420, height: 520, background: "#2a2e33", borderRadius: 24, color: "#d7d2c8", fontSize: 42, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>AGENCY</div>
          <div style={{ position: "absolute", left: 560, top: 420, width: 420, height: 520, background: "#f6f1e7", borderRadius: 24 }} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <Hand x={640} y={620} />
          </svg>
        </>
      )}
      {!showSplit && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <rect x={ticketX} y={ticketY} width={210} height={120} rx={16} fill="#e07a5f" stroke="#1b1b1f" strokeWidth={6} />
          <Hand x={handX} y={handY} rot={b === "stuck" ? -8 : 0} />
        </svg>
      )}
      <AgentWord
        pilot={pilot}
        t={t}
        style={{
          position: "absolute",
          left: 0,
          right: 180,
          top: cream ? 280 : 980,
          textAlign: "center",
          fontSize: cream ? 150 : 84,
          color: cream ? "#111" : "#f6f1e7",
        }}
      />
      <Cap text={cue.caption} light={!cream && !showSplit} />
      <Audio src={staticFile("passing-hand.wav")} />
    </AbsoluteFill>
  );
};
