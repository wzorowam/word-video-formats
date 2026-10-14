import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useGsapTimeline } from "@remotion/gsap";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("clamp");

const fillFor = (beat: string) => {
  if (beat.startsWith("literary") || beat === "next1") return { bg: "#8a5a2b", label: "a novel" };
  if (beat.startsWith("insurance") || beat === "next2") return { bg: "#1f6b4a", label: "a policy" };
  if (beat.startsWith("press") || beat === "next3") return { bg: "#1d3f73", label: "a photo" };
  if (["storm", "pause", "reveal"].includes(beat)) return { bg: "#6e88a6", label: "a storm" };
  if (["ask", "lock", "letgo"].includes(beat)) return { bg: "#3a3a3a", label: "four frames" };
  return { bg: "#2a2a2a", label: "" };
};

export const Clamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const scope = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    const top = selector(".bar-top");
    const bot = selector(".bar-bottom");
    const shut = (atSec: number) => {
      timeline.to(top, { y: 210, duration: 0.28, ease: "back.out(2.2)" }, atSec);
      timeline.to(bot, { y: -210, duration: 0.28, ease: "back.out(2.2)" }, atSec);
    };
    const open = (atSec: number) => {
      timeline.to(top, { y: 0, duration: 0.22, ease: "power2.in" }, atSec);
      timeline.to(bot, { y: 0, duration: 0.22, ease: "power2.in" }, atSec);
    };
    timeline.set(top, { y: 0 }, 0);
    timeline.set(bot, { y: 0 }, 0);
    shut(2.05);
    open(7.55);
    shut(8.05);
    open(13.55);
    shut(14.05);
    open(19.55);
    shut(25.0);
    open(37.7);
    timeline.set(top, { y: 0 }, 44);
    timeline.set(bot, { y: 0 }, 44);
  });
  const fill = fillFor(cue.beat);
  const stack = cue.beat === "ask" || cue.beat === "lock" || cue.beat === "letgo";
  return (
    <AbsoluteFill style={{ background: "#1a1a1a", fontFamily: SANS }}>
      <div ref={scope} style={{ position: "absolute", inset: 0 }}>
      <div className="bar-top" style={{ position: "absolute", left: 230, top: 300, width: 620, height: 42, background: "linear-gradient(#d9dde3,#8d949c)", borderRadius: 8, zIndex: 3 }} />
      <div className="bar-bottom" style={{ position: "absolute", left: 230, top: 1120, width: 620, height: 42, background: "linear-gradient(#8d949c,#d9dde3)", borderRadius: 8, zIndex: 3 }} />
      {!stack && (
        <div style={{ position: "absolute", left: 270, top: 430, width: 540, height: 640, borderRadius: 28, background: fill.bg }} />
      )}
      {stack && (
        <div style={{ position: "absolute", left: 390, top: 380, width: 300, display: "flex", flexDirection: "column", gap: 16 }}>
          {["novel", "policy", "photo", "storm"].map((name) => (
            <div key={name} style={{ height: 120, borderRadius: 16, background: "#3d3d3d", color: "#f4efe6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 32 }}>{name}</div>
          ))}
        </div>
      )}
      <AgentWord
        pilot={pilot}
        t={t}
        text="agent"
        style={{
          position: "absolute",
          left: 270,
          width: 540,
          top: stack ? 980 : 680,
          textAlign: "center",
          fontSize: 96,
          color: "#f7f4ee",
        }}
      />
      <Cap text={cue.caption} light top={1500} />
      </div>
      <Audio src={staticFile("clamp.wav")} />
    </AbsoluteFill>
  );
};
