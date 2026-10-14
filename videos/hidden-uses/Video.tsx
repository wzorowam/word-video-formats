import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, GreyBlock, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("hidden-uses");

const tagFor = (b: string) => {
  if (["wet", "wet2"].includes(b)) return "Wetting";
  if (["mix", "mix2"].includes(b)) return "Emulsifying";
  if (["thick", "thick2"].includes(b)) return "Thickening";
  if (["bio", "sick", "count"].includes(b)) return "Biological";
  if (b === "pause") return "Pause";
  if (b === "coat") return "Not the spy";
  return "Which one";
};

const rows = [
  { key: "leaf", label: "Leaf", on: (b: string) => ["wet", "wet2", "hook"].includes(b) },
  { key: "oil", label: "Oil + water", on: (b: string) => ["mix", "mix2"].includes(b) },
  { key: "sauce", label: "Sauce", on: (b: string) => ["thick", "thick2"].includes(b) },
  { key: "germ", label: "Germ", on: (b: string) => ["bio", "sick", "count"].includes(b) },
];

export const HiddenUses: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const b = cue.beat;
  const pause = b === "pause";
  return (
    <AbsoluteFill>
      <Stage caption={cue.caption} tag={tagFor(b)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
        {pause ? (
          <>
            <GreyBlock top={60} left={140} width={500} height={160} label="Suit" lines={2} />
            <GreyBlock top={280} left={140} width={500} height={160} label="Germ" lines={2} active />
          </>
        ) : (
          rows.map((row, n) => (
            <GreyBlock key={row.key} top={8 + n * 112} left={150} width={480} height={96} lines={1} label={row.label} active={row.on(b)} />
          ))
        )}
        {["bio", "sick", "count"].includes(b) && (
          <div style={{ position: "absolute", left: 200, top: 430, display: "flex", gap: 10 }}>
            {Array.from({ length: 7 }).map((_, n) => (
              <div key={n} style={{ width: 10, height: 10, borderRadius: 5, background: CYAN }} />
            ))}
          </div>
        )}
      </Stage>
      <Audio src={staticFile("hidden-uses.wav")} />
    </AbsoluteFill>
  );
};
