import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, MUTED, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("word-tree");

const tagFor = (b: string) => {
  if (["bleach", "noperson"].includes(b)) return "Bleaching";
  if (["secret", "double", "hide"].includes(b)) return b === "double" ? "Double" : "Secret";
  if (["free", "alone", "sends"].includes(b)) return "Free";
  if (b === "pause" || b === "quiz") return "Pause";
  if (b === "pay") return "One job";
  return "Word tree";
};

export const WordTree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const b = cue.beat;
  const bleach = b !== "hook" && t >= 8 && t < 45.4;
  const secret = t >= 15.5 && t < 45.4;
  const free = t >= 23 && t < 45.4;
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tagFor(b)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
        <svg width={780} height={440} viewBox="0 0 780 440" fill="none">
          <path d="M390 420 V140" stroke={CYAN} strokeWidth={2.2} />
          {bleach && <path d="M390 250 C300 210 180 180 120 140" stroke={CYAN} strokeWidth={2.2} />}
          {secret && <path d="M390 220 C500 180 620 160 700 120" stroke={CYAN} strokeWidth={2.2} />}
          {free && <path d="M390 320 C500 350 620 360 700 320" stroke={CYAN} strokeWidth={2.2} />}
          {(b === "hook" || b === "keys" || b === "fit" || t >= 39.4) && (
            <>
              <rect x={78} y={36} width={22} height={14} rx={2} stroke={CYAN} strokeWidth={2.2} />
              <rect x={62} y={50} width={54} height={62} rx={8} stroke={CYAN} strokeWidth={2.2} />
            </>
          )}
          {(b === "hook" || secret) && (
            <path d="M640 48 h70 l-8 18 h-54 Z M658 70 v28 h34 v-28" stroke={CYAN} strokeWidth={2.2} />
          )}
          {bleach && b !== "hook" && (
            <>
              <rect x={78} y={150} width={22} height={12} rx={2} stroke={CYAN} strokeWidth={2.2} />
              <rect x={62} y={162} width={54} height={58} rx={8} stroke={CYAN} strokeWidth={2.2} />
            </>
          )}
        </svg>
        {bleach && b !== "hook" && <div style={{ position: "absolute", left: 36, top: 250, color: MUTED, fontSize: 22 }}>bleaching agent</div>}
        {secret && (
          <div style={{ position: "absolute", right: 24, top: 200, color: MUTED, fontSize: 22 }}>
            {b === "double" ? "double agent" : "secret agent"}
          </div>
        )}
        {free && <div style={{ position: "absolute", right: 36, top: 360, color: MUTED, fontSize: 22 }}>free agent</div>}
      </Stage>
      <Audio src={staticFile("word-tree.wav")} />
    </AbsoluteFill>
  );
};
