import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useGsapTimeline } from "@remotion/gsap";
import { at, pilotOf } from "../src/cue";
import { AgentWord, BLOCK, CYAN, MUTED, Stage, WHITE, stepNo } from "../src/ui";

const pilot = pilotOf("under-the-label");

const tagFor = (b: string) => {
  if (["an", "three", "picture", "takes", "next"].includes(b)) return "An agent";
  if (b === "pause" || b === "quiz") return "Pause";
  if (b === "peel" || b === "under" || b === "hide") return "Peel";
  return "One spy";
};

export const UnderTheLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const scope = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    const peel = selector(".peel");
    timeline.set(peel, { rotate: 0, transformOrigin: "80% 0%" }, 0);
    timeline.to(peel, { rotate: -26, duration: 1.6, ease: "power1.inOut" }, 14);
    timeline.to(peel, { rotate: -58, duration: 1.5, ease: "power1.inOut" }, 16.2);
    timeline.to(peel, { rotate: -8, duration: 1.2, ease: "power1.out" }, 42);
    timeline.set(peel, { rotate: 0 }, 46);
  });
  const count = ["an", "three", "picture", "takes", "next"].includes(cue.beat);
  const people = cue.beat === "three" ? 3 : 1;
  return (
    <AbsoluteFill>
      <div ref={scope} style={{ position: "absolute", inset: 0 }}>
        <Stage caption={cue.caption} tag={tagFor(cue.beat)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} />}>
          <div style={{ position: "absolute", left: 230, top: 40, width: 320, height: 470, borderRadius: 36, border: `2px solid ${CYAN}`, background: BLOCK }} />
          <div style={{ position: "absolute", left: 270, top: 160, width: 240, textAlign: "center", color: WHITE, fontSize: 36, fontWeight: 700 }}>
            {count ? "an agent" : "a spy"}
            <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 14 }}>
              {Array.from({ length: people }).map((_, n) => (
                <div key={n} style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${CYAN}` }} />
              ))}
            </div>
          </div>
          <div
            className="peel"
            style={{
              position: "absolute",
              left: 250,
              top: 150,
              width: 280,
              height: 220,
              background: "#121826",
              border: `2px solid ${CYAN}`,
              boxShadow: "0 0 24px rgba(34,211,238,0.2)",
            }}
          >
            <div style={{ marginTop: 78, textAlign: "center", color: MUTED, letterSpacing: 2, fontSize: 22 }}>LABEL</div>
          </div>
        </Stage>
      </div>
      <Audio src={staticFile("under-the-label.wav")} />
    </AbsoluteFill>
  );
};
