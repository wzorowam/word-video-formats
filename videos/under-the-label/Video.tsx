import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useGsapTimeline } from "@remotion/gsap";
import { at, pilotOf } from "../src/cue";
import { AgentWord, Cap, SANS } from "../src/ui";

const pilot = pilotOf("under-the-label");

export const UnderTheLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue } = at(pilot, t);
  const scope = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    const peel = selector(".peel");
    timeline.set(peel, { rotate: 0, transformOrigin: "80% 0%" }, 0);
    timeline.to(peel, { rotate: -28, duration: 1.6, ease: "power1.inOut" }, 14);
    timeline.to(peel, { rotate: -62, duration: 1.5, ease: "power1.inOut" }, 16.2);
    timeline.to(peel, { rotate: -10, duration: 1.2, ease: "power1.out" }, 42);
    timeline.set(peel, { rotate: 0 }, 46);
  });
  const count = ["an", "three", "picture", "takes", "next"].includes(cue.beat);
  const people = cue.beat === "three" ? 3 : 1;
  return (
    <AbsoluteFill style={{ background: "#1c1915", fontFamily: SANS }}>
      <div ref={scope} style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 330, top: 280, width: 420, height: 860, borderRadius: 80, background: "#3a342c", border: "8px solid #0e0c0a" }} />
      <div style={{ position: "absolute", left: 390, top: 250, width: 300, height: 70, borderRadius: 16, background: "#5c564c" }} />
      <div style={{ position: "absolute", left: 400, top: 560, width: 280, color: "#f4efe6", fontWeight: 800, fontSize: 54, textAlign: "center" }}>
        {count ? "an agent" : "a spy"}
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 18 }}>
          {Array.from({ length: people }).map((_, i) => (
            <div key={i} style={{ width: 54, height: 54, borderRadius: 27, background: "#e7d7c3" }} />
          ))}
        </div>
      </div>
      <div
        className="peel"
        style={{
          position: "absolute",
          left: 390,
          top: 480,
          width: 300,
          height: 360,
          background: "#f3ecdf",
          borderRadius: 12,
          boxShadow: "0 12px 0 rgba(0,0,0,0.25)",
        }}
      >
        <AgentWord pilot={pilot} t={t} style={{ marginTop: 120, textAlign: "center", fontSize: 64, color: "#1c1915" }} />
      </div>
      <Cap text={cue.caption} light top={1500} />
      </div>
      <Audio src={staticFile("under-the-label.wav")} />
    </AbsoluteFill>
  );
};
