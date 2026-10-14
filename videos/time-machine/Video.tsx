import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("time-machine");

const gradeFor = (beat: string) => {
  if (["deputy", "notfirst", "again", "hook"].includes(beat)) return "#e7b89a";
  if (["latin", "english"].includes(beat)) return "#c47a3a";
  if (["early", "force"].includes(beat)) return "#e0a04a";
  if (["substance", "away"].includes(beat)) return "#6f8ea8";
  if (["dep2", "quiz"].includes(beat)) return "#1c2420";
  if (beat === "pause") return "#f4f1ea";
  if (["pay", "later"].includes(beat)) return "#c47a3a";
  return "#e7b89a";
};

const tickFor = (beat: string) => {
  if (["early", "force"].includes(beat)) return "before 1500";
  if (["substance", "away"].includes(beat)) return "1550s";
  if (["dep2", "quiz"].includes(beat)) return "1590s";
  if (["latin", "english", "pay", "later"].includes(beat)) return "Latin";
  if (beat === "pause") return "which?";
  return "now";
};

export const TimeMachine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const spin = (frame * 4) % 360;
  const dark = ["dep2", "quiz"].includes(cue.beat);
  const ink = cue.beat === "pause" ? "#1b1b1f" : "#1b1b1f";
  return (
    <AbsoluteFill style={{ background: gradeFor(cue.beat), fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 70, top: 180, bottom: 360, width: 16, background: dark ? "#f4efe6" : "#1b1b1f", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 36, top: 200, width: 220, color: dark ? "#f4efe6" : ink, fontWeight: 800, fontSize: 28 }}>{tickFor(cue.beat)}</div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 860) rotate(${cue.beat === "pause" ? 0 : spin})`}>
          <circle r={150} fill="none" stroke={dark ? "#f4efe6" : "#1b1b1f"} strokeWidth={16} />
          <path d="M0 -130 V130 M-130 0 H130" stroke={dark ? "#f4efe6" : "#1b1b1f"} strokeWidth={10} />
        </g>
        {["early", "force", "substance"].includes(cue.beat) && (
          <rect x={700} y={760} width={70} height={110} rx={8} fill="rgba(255,255,255,0.35)" stroke="#1b1b1f" strokeWidth={4} />
        )}
      </svg>
      <AgentWord
        pilot={pilot}
        t={t}
        style={{
          position: "absolute",
          left: 120,
          width: 760,
          top: 1120,
          textAlign: "center",
          fontSize: 110,
          color: dark ? "#f4efe6" : "#1b1b1f",
        }}
      />
      <Cap text={cue.caption} light={dark} />
      <Audio src={staticFile("time-machine.wav")} />
    </AbsoluteFill>
  );
};
