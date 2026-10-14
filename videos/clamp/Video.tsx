import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useGsapTimeline } from "@remotion/gsap";
import { at, pilotOf } from "../src/cue";
import { AgentWord, CYAN, GreyBlock, MUTED, Stage, stepNo } from "../src/ui";

const pilot = pilotOf("clamp");

const tagFor = (b: string) => {
  if (b.startsWith("literary") || b === "next1") return "Novel";
  if (b.startsWith("insurance") || b === "next2") return "Policy";
  if (b.startsWith("press") || b === "next3") return "Photo";
  if (["storm", "pause", "reveal"].includes(b)) return b === "pause" ? "Pause" : "Storm";
  if (["ask", "lock", "letgo"].includes(b)) return "The lock";
  return "Clamp";
};

export const Clamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, i } = at(pilot, t);
  const scope = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    const top = selector(".bar-top");
    const bot = selector(".bar-bottom");
    const shut = (atSec: number) => {
      timeline.to(top, { y: 150, duration: 0.28, ease: "power2.out" }, atSec);
      timeline.to(bot, { y: -150, duration: 0.28, ease: "power2.out" }, atSec);
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
  const stack = cue.beat === "ask" || cue.beat === "lock" || cue.beat === "letgo";
  return (
    <AbsoluteFill>
      <div ref={scope} style={{ position: "absolute", inset: 0 }}>
        <Stage caption={cue.caption} tag={tagFor(cue.beat)} numeral={stepNo(i)} heading={<AgentWord pilot={pilot} t={t} text="agent" />}>
          <div className="bar-top" style={{ position: "absolute", left: 80, top: 70, width: 620, height: 3, background: CYAN, boxShadow: "0 0 16px rgba(34,211,238,0.7)" }} />
          <div className="bar-bottom" style={{ position: "absolute", left: 80, top: 400, width: 620, height: 3, background: CYAN, boxShadow: "0 0 16px rgba(34,211,238,0.7)" }} />
          {!stack && <GreyBlock top={140} left={140} width={500} height={250} lines={3} active />}
          {stack &&
            ["novel", "policy", "photo", "storm"].map((name, n) => (
              <div key={name} style={{ position: "absolute", left: 180, top: 40 + n * 120, color: MUTED, fontSize: 28, letterSpacing: 1 }}>
                <span style={{ color: CYAN, marginRight: 16 }}>0{n + 1}</span>
                {name}
              </div>
            ))}
        </Stage>
      </div>
      <Audio src={staticFile("clamp.wav")} />
    </AbsoluteFill>
  );
};
