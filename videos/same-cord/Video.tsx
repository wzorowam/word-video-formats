import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, GreyBlock, MUTED, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("same-cord");

const tagFor = (b: string) => {
  if (b === "sole") return "Sole";
  if (b === "prov") return "Provocateur";
  if (b === "change") return "Change";
  if (b === "chaos" || b === "mess") return "Chaos";
  if (b === "pause") return "Pause";
  if (b === "boss") return "The boss";
  return "The cord";
};

export const SameCord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const b = cue.beat;
  const fray = b === "chaos" || b === "mess";
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tagFor(b)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
        <svg width={780} height={440} viewBox="0 0 780 440" fill="none">
          {!fray && <path d="M390 0 V250" stroke={CYAN} strokeWidth={2.2} />}
          {fray && (
            <>
              <path d="M390 0 V120" stroke={CYAN} strokeWidth={2} />
              <path d="M360 150 Q390 230 370 280" stroke={CYAN} strokeWidth={1.6} />
              <path d="M420 140 Q450 230 410 290" stroke={CYAN} strokeWidth={1.6} />
            </>
          )}
        </svg>
        <GreyBlock top={230} left={230} width={320} height={160} lines={2} active />
        {b === "pause" && (
          <div style={{ position: "absolute", left: 40, right: 40, top: 420, display: "flex", justifyContent: "space-between", color: MUTED, fontSize: 24 }}>
            <span>change agent</span>
            <span>agent of chaos</span>
          </div>
        )}
      </Stage>
      <Audio src={staticFile("same-cord.wav")} />
    </AbsoluteFill>
  );
};
