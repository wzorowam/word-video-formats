import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, MUTED, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("shove-test");

const tagFor = (b: string) => {
  if (b === "pause" || b === "quiz") return "Pause";
  if (["key", "hand"].includes(b)) return "Not the key";
  if (["gone", "door"].includes(b)) return "Not the door";
  if (["maya", "pay", "rule"].includes(b)) return "From her";
  return "The shove";
};

export const ShoveTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const b = cue.beat;
  const showMaya = !["gone", "door"].includes(b);
  const toKey = b === "key" || b === "hand";
  const x2 = toKey ? 360 : 620;
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tagFor(b)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
        <svg width={780} height={440} viewBox="0 0 780 440" fill="none">
          {showMaya && (
            <>
              <circle cx={160} cy={230} r={28} stroke={CYAN} strokeWidth={2.2} />
              <path d="M160 258 V360 M160 300 H110 M160 300 H230" stroke={CYAN} strokeWidth={2.2} strokeLinecap="round" />
              <text x={124} y={400} fill={MUTED} fontSize={22} fontFamily="Outfit, Liberation Sans, sans-serif">Maya</text>
            </>
          )}
          <path d="M620 160 V420" stroke={CYAN} strokeWidth={2.2} />
          {toKey && <rect x={300} y={250} width={70} height={16} rx={3} stroke={CYAN} strokeWidth={2} />}
          <path d={`M230 300 C360 240 ${x2 - 40} 240 ${x2} 300`} stroke={CYAN} strokeWidth={2.2} fill="none" />
        </svg>
      </Stage>
      <Audio src={staticFile("shove-test.wav")} />
    </AbsoluteFill>
  );
};
