import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("same-cord");

const bgFor = (beat: string) => {
  if (["boss"].includes(beat)) return "#3c2e12";
  if (["sole"].includes(beat)) return "#7ec8e3";
  if (["prov"].includes(beat)) return "#0e0e10";
  if (beat === "pause") return "#8a8a8a";
  if (["change"].includes(beat)) return "#1e3a2f";
  if (["chaos", "mess"].includes(beat)) return "#2a1210";
  return "#14122b";
};

export const SameCord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const b = cue.beat;
  const lightBg = b === "sole" || b === "pause";
  const fray = b === "chaos" || b === "mess";
  const label =
    b === "sole" ? "sole" : b === "prov" ? "provocateur" : b === "change" ? "change" : b === "chaos" || b === "mess" ? "of chaos" : "";
  return (
    <AbsoluteFill style={{ background: bgFor(b), fontFamily: SANS }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {!fray && <path d="M540 0 V860" stroke="#f3ede3" strokeWidth={16} />}
        {fray && (
          <>
            <path d="M540 0 V420" stroke="#f3ede3" strokeWidth={8} />
            <path d="M500 520 Q540 640 520 860" stroke="#f3ede3" strokeWidth={6} fill="none" />
            <path d="M560 500 Q600 680 580 880" stroke="#f3ede3" strokeWidth={6} fill="none" />
          </>
        )}
        {["hand", "sole", "change", "rule"].includes(b) && (
          <path d="M430 40 H620 L600 120 H450 Z" fill="#f3ede3" />
        )}
      </svg>
      <div style={{ position: "absolute", left: 250, top: 820, width: 500, minHeight: 150, borderRadius: 24, background: lightBg ? "#111" : "#f3ede3", color: lightBg ? "#f3ede3" : "#14122b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {label && <div style={{ fontWeight: 700, fontSize: 36 }}>{label}</div>}
        <AgentWord pilot={pilot} t={t} style={{ fontSize: 84, color: "inherit" }} />
      </div>
      {b === "pause" && (
        <div style={{ position: "absolute", left: 140, top: 1120, width: 720, display: "flex", justifyContent: "space-between", color: "#111", fontWeight: 800, fontSize: 32 }}>
          <div style={{ background: "#f3ede3", padding: 16, borderRadius: 12 }}>change agent</div>
          <div style={{ background: "#f3ede3", padding: 16, borderRadius: 12 }}>agent of chaos</div>
        </div>
      )}
      <Cap text={cue.caption} light={!lightBg} top={1500} />
      <Audio src={staticFile("same-cord.wav")} />
    </AbsoluteFill>
  );
};
