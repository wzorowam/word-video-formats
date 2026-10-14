import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("shove-test");

const groundFor = (beat: string) => {
  if (beat === "where") return "#141414";
  if (["gone", "door"].includes(beat)) return "#2c3354";
  if (["start", "key", "hand"].includes(beat)) return "#f7f7f5";
  return "#f3ebdd";
};

export const ShoveTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const b = cue.beat;
  const dark = b === "where";
  const ink = dark ? "#f3ebdd" : "#1b1b1f";
  const showMaya = !["gone", "door"].includes(b);
  const ribbonToDoor = !["key", "hand"].includes(b);
  const x2 = ribbonToDoor ? 760 : 430;
  return (
    <AbsoluteFill style={{ background: groundFor(b), fontFamily: SANS }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {showMaya && (
          <g>
            <circle cx={280} cy={620} r={46} fill={b === "maya" || b === "pay" ? "#c4554a" : "#e7d3c0"} stroke={ink} strokeWidth={6} />
            <path d="M280 670 V860 M280 740 H180 M280 740 H390" stroke={ink} strokeWidth={10} strokeLinecap="round" />
            <text x={230} y={940} fill={ink} fontSize={36} fontFamily={SANS} fontWeight={700}>Maya</text>
          </g>
        )}
        <rect x={760} y={560} width={34} height={360} rx={6} fill={ink} />
        {b === "key" || b === "hand" ? (
          <rect x={360} y={700} width={90} height={28} rx={6} fill="#d4a017" stroke={ink} strokeWidth={4} />
        ) : null}
        <path d={`M390 760 C520 700 ${x2 - 80} 700 ${x2} 740`} stroke="#e25b2a" strokeWidth={22} fill="none" strokeLinecap="round" />
      </svg>
      {(b === "pause" || b === "quiz") && (
        <>
          <div style={{ position: "absolute", left: 180, top: 500, width: 160, height: 160, borderRadius: 80, border: "10px solid #e25b2a" }} />
          <div style={{ position: "absolute", left: 720, top: 560, width: 120, height: 280, border: "10px solid #e25b2a", borderRadius: 12 }} />
        </>
      )}
      <AgentWord
        pilot={pilot}
        t={t}
        style={{
          position: "absolute",
          left: showMaya ? 120 : 80,
          top: showMaya ? 430 : 480,
          fontSize: 72,
          color: "#e25b2a",
        }}
      />
      <Cap text={cue.caption} light={dark} />
      <Audio src={staticFile("shove-test.wav")} />
    </AbsoluteFill>
  );
};
