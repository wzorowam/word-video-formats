import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Bottle, Cap, SANS, Spy } from "../src/ui";

const pilot = pilotOf("word-tree");

const bgFor = (beat: string) => {
  if (["keys", "fit"].includes(beat)) return "#c9898a";
  if (["bleach", "noperson"].includes(beat)) return "#e8a317";
  if (["hide", "secret", "double"].includes(beat)) return "#241b4a";
  if (["sends", "free", "alone"].includes(beat)) return "#3d8c4a";
  return "#f4efe6";
};

export const WordTree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const b = cue.beat;
  const dark = ["hide", "secret", "double"].includes(b);
  const showBleach = b !== "hook" && t >= 8 && t < 45.4;
  const showSecret = t >= 15.5 && t < 45.4;
  const showFree = t >= 23 && t < 45.4;
  const ink = dark ? "#f4efe6" : "#1b1b1f";
  return (
    <AbsoluteFill style={{ background: bgFor(b), fontFamily: SANS }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M540 1280 C540 980 540 860 540 620" stroke={ink} strokeWidth={18} fill="none" />
        {showBleach && <path d="M540 860 C420 760 280 640 220 520" stroke={ink} strokeWidth={12} fill="none" />}
        {showSecret && <path d="M540 800 C680 700 820 620 900 500" stroke={ink} strokeWidth={12} fill="none" />}
        {showFree && <path d="M540 980 C700 1040 820 1120 880 1040" stroke={ink} strokeWidth={12} fill="none" />}
        {(b === "hook" || b === "keys" || b === "fit" || t >= 39.4) && <Bottle x={150} y={250} s={1.4} />}
        {(b === "hook" || showSecret) && <Spy x={760} y={250} s={1.3} />}
        {showBleach && b !== "hook" && <Bottle x={120} y={430} />}
        {showFree && <rect x={820} y={980} width={70} height={46} rx={6} fill="#f4efe6" stroke={ink} strokeWidth={4} />}
      </svg>
      {showBleach && b !== "hook" && (
        <div style={{ position: "absolute", left: 80, top: 620, color: ink, fontWeight: 700, fontSize: 32 }}>bleaching agent</div>
      )}
      {showSecret && (
        <div style={{ position: "absolute", left: 700, top: 430, color: dark ? "#f4efe6" : ink, fontWeight: 700, fontSize: 32 }}>
          {b === "double" ? "double agent" : "secret agent"}
        </div>
      )}
      {showFree && (
        <div style={{ position: "absolute", left: 700, top: 1120, color: ink, fontWeight: 700, fontSize: 32 }}>free agent</div>
      )}
      <AgentWord
        pilot={pilot}
        t={t}
        style={{
          position: "absolute",
          left: 0,
          width: 900,
          top: 1280,
          textAlign: "center",
          fontSize: 120,
          color: b === "pay" ? "#fffaf3" : ink,
          background: b === "pay" ? "#1b1b1f" : "transparent",
        }}
      />
      <Cap text={cue.caption} light={dark} />
      <Audio src={staticFile("word-tree.wav")} />
    </AbsoluteFill>
  );
};
