import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("hidden-uses");

const ring = (on: boolean, color: string) =>
  on ? `0 0 0 10px ${color}` : "0 0 0 8px #c8c2b8";

export const HiddenUses: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const b = cue.beat;
  const pause = b === "pause";
  const wet = ["wet", "wet2"].includes(b);
  const mix = ["mix", "mix2"].includes(b);
  const thick = ["thick", "thick2"].includes(b);
  const bio = ["bio", "sick", "count"].includes(b);
  return (
    <AbsoluteFill style={{ background: pause ? "#2a2a2a" : "#f7f1e6", fontFamily: SANS }}>
      {!pause && (
        <>
          <div style={{ position: "absolute", left: 360, top: 240, width: 360, height: 160, borderRadius: 24, background: "#f0d78c", boxShadow: ring(wet || b === "hook", "#e8a317"), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 36 }}>leaf</div>
          <div style={{ position: "absolute", left: 360, top: 460, width: 360, height: 160, borderRadius: 24, background: "#f2e2a8", boxShadow: ring(mix, "#1aa6b8"), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 36 }}>oil + water</div>
          <div style={{ position: "absolute", left: 360, top: 680, width: 360, height: 160, borderRadius: 24, background: "#e7c7a2", boxShadow: ring(thick, "#c45c26"), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 36 }}>sauce</div>
          <div style={{ position: "absolute", left: 360, top: 900, width: 360, height: 180, borderRadius: 24, background: "#efe6d6", boxShadow: ring(bio, "#2f9e44"), display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: bio ? "#2f9e44" : "#b7b1a6" }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 80, top: 250, width: 120, height: 220, borderRadius: 40, background: b === "coat" ? "#222" : "#d9d3c8", opacity: bio ? 0.35 : 1 }} />
        </>
      )}
      {pause && (
        <div style={{ position: "absolute", left: 180, top: 520, right: 180, display: "flex", flexDirection: "column", gap: 24 }}>
          {["suit", "germ"].map((label) => (
            <div key={label} style={{ height: 160, borderRadius: 20, background: "#4a4a4a", color: "#f4efe6", fontSize: 54, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{label}</div>
          ))}
        </div>
      )}
      <AgentWord
        pilot={pilot}
        t={t}
        style={{
          position: "absolute",
          left: 70,
          width: 860,
          top: 1160,
          textAlign: "center",
          fontSize: 92,
          color: pause ? "#f4efe6" : "#1b1b1f",
        }}
      />
      <Cap text={cue.caption} light={pause} />
      <Audio src={staticFile("hidden-uses.wav")} />
    </AbsoluteFill>
  );
};
