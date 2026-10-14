import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, GreyBlock, MUTED, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("time-machine");

const tickFor = (beat: string) => {
  if (["early", "force"].includes(beat)) return "Before 1500";
  if (["substance", "away"].includes(beat)) return "1550s";
  if (["dep2", "quiz"].includes(beat)) return "1590s";
  if (["latin", "english", "pay", "later"].includes(beat)) return "Latin";
  if (beat === "pause") return "Pause";
  return "Now";
};

export const TimeMachine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const spin = cue.beat === "pause" ? 0 : (frame * 3) % 360;
  const vessel = ["early", "force", "substance"].includes(cue.beat);
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tickFor(cue.beat)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
        <div style={{ position: "absolute", left: 48, top: 40, bottom: 40, width: 2, background: CYAN, opacity: 0.8 }} />
        <svg width={780} height={560} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(360 250) rotate(${spin})`}>
            <circle r={92} fill="none" stroke={CYAN} strokeWidth={2.2} />
            <path d="M0 -78 V78 M-78 0 H78" stroke={CYAN} strokeWidth={1.6} />
          </g>
        </svg>
        {vessel && <GreyBlock top={160} left={500} width={180} height={200} lines={2} />}
        <div style={{ position: "absolute", left: 28, top: 24, color: MUTED, fontSize: 22 }}>{tickFor(cue.beat)}</div>
      </Stage>
      <Audio src={staticFile("time-machine.wav")} />
    </AbsoluteFill>
  );
};
