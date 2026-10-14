import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, GreyBlock, MUTED, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("passing-hand");

const tagFor = (b: string) => {
  if (b === "pause" || b === "quiz") return "Pause";
  if (b === "room" || b === "wrong" || b === "stuck") return "Agency";
  if (b === "reveal" || b === "pay" || b === "act" || b === "pocket") return "The hand";
  return "Booking";
};

const Hand: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={160} height={90} style={{ position: "absolute", left: x, top: y }} viewBox="0 0 160 90" fill="none">
    <path d="M18 48 H128 a16 16 0 0 0 0-32 H18" stroke={CYAN} strokeWidth={2.4} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${36 + i * 26} 16 V4`} stroke={CYAN} strokeWidth={2.4} strokeLinecap="round" />
    ))}
  </svg>
);

export const PassingHand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const b = cue.beat;
  const split = b === "pause" || b === "quiz";
  const low = b === "pay" || b === "room" || b === "carry" || b === "stick";
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tagFor(b)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
        {split ? (
          <>
            <GreyBlock top={80} left={40} width={320} height={360} label="Sign" lines={2} />
            <div style={{ position: "absolute", left: 70, top: 200, color: MUTED, fontSize: 28, letterSpacing: 2 }}>AGENCY</div>
            <GreyBlock top={80} left={400} width={320} height={360} label="Hand" lines={2} active />
            <Hand x={470} y={230} />
          </>
        ) : (
          <>
            <GreyBlock top={low ? 250 : 70} left={250} width={280} height={150} lines={2} active={b === "reveal" || b === "pay"} />
            <Hand x={b === "hook" || b === "wrong" ? 430 : 300} y={low ? 300 : 150} />
            <div style={{ position: "absolute", right: 36, top: 36, color: MUTED, fontSize: 22, letterSpacing: 2 }}>AGENCY</div>
          </>
        )}
      </Stage>
      <Audio src={staticFile("passing-hand.wav")} />
    </AbsoluteFill>
  );
};
