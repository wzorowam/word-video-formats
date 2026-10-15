import type { ReactNode } from "react";
import { cuesFor } from "../audio/script";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SNAP, Stage, arrive } from "../src/kit";

const ACCENT = "#FFB020";
export const STILL_FRAME = 510;

const CUES = cuesFor("alt-screen");

export const AltScreen = () => (
  <Stage slug="alt-screen" accent={ACCENT} cues={CUES}>
    <Windows />
  </Stage>
);

function Windows() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const header = arrive(frame, fps, 135, SNAP);
  const second = arrive(frame, fps, 318, SNAP);
  const look = arrive(frame, fps, 330, SNAP);
  const tool = arrive(frame, fps, 400, SNAP);
  const again = arrive(frame, fps, 480, SNAP);
  const blink = Math.floor(frame / 14) % 2 === 0;
  const hot = (on: number, off: number) => Math.max(0, arrive(frame, fps, on, SNAP) - arrive(frame, fps, off, SNAP));
  const recap = arrive(frame, fps, 615, SNAP);
  const headerHot = hot(135, 330);
  const lookHot = Math.max(hot(330, 400), recap);
  const toolHot = Math.max(hot(400, 480), recap);
  const againHot = Math.max(hot(480, 615), recap);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", fontFamily: "Outfit, sans-serif" }}>
      <Window
        top={8 + (1 - Math.min(second, 1)) * 10}
        title="shell"
        scale={1}
      >
        <Row text="agent" cursor={frame < 135 && blink} hot={0} />
        <div style={{ transform: `translateY(${(1 - header) * 18}px)`, opacity: Math.min(1, header * 2) }}>
          <Row text="User-Agent is a label" hot={headerHot} cursor={frame >= 135 && frame < 330 && blink} />
        </div>
      </Window>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 214,
          transform: `translateY(${(1 - second) * 70}px) scale(${0.92 + Math.min(second, 1.18) * 0.08})`,
          transformOrigin: "50% 0%",
        }}
      >
        <Window top={0} title="session" scale={1} absolute={false}>
          <div style={{ transform: `translateY(${(1 - look) * 14}px)` }}>
            <Row text="look" hot={lookHot} cursor={frame >= 330 && frame < 400 && blink} />
          </div>
          <div style={{ transform: `translateY(${(1 - tool) * 14}px)`, opacity: Math.min(1, tool * 2.2) }}>
            <Row text="use a tool" hot={toolHot} cursor={frame >= 400 && frame < 480 && blink} />
          </div>
          <div style={{ transform: `translateY(${(1 - again) * 14}px)`, opacity: Math.min(1, again * 2.2) }}>
            <Row text="look again" hot={againHot} cursor={frame >= 480 && blink} />
          </div>
        </Window>
      </div>
    </div>
  );
}

function Window({
  top,
  title,
  scale,
  children,
  absolute = true,
}: {
  top: number;
  title: string;
  scale: number;
  children: ReactNode;
  absolute?: boolean;
}) {
  return (
    <div
      style={{
        position: absolute ? "absolute" : "relative",
        left: absolute ? 18 : 0,
        right: absolute ? 18 : 0,
        top,
        transform: `scale(${scale})`,
        transformOrigin: "50% 0%",
        background: "#161922",
        border: "2px solid #343846",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          background: "#12141B",
          color: "#9AA0AA",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <Dot /><Dot /><Dot />
        <span style={{ marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ padding: "8px 10px 12px" }}>{children}</div>
    </div>
  );
}

function Dot() {
  return <span style={{ width: 8, height: 8, borderRadius: 8, background: "#5C6370", display: "inline-block" }} />;
}

function Row({
  text,
  hot,
  cursor,
}: {
  text: string;
  hot: number;
  cursor?: boolean;
}) {
  const glow = Math.min(hot, 1);
  return (
    <div
      style={{
        marginTop: 4,
        padding: "7px 10px",
        borderRadius: 8,
        color: "#F6F3EC",
        fontSize: 26,
        fontWeight: 700,
        background: glow > 0.08 ? `rgba(255, 176, 32, ${0.1 + glow * 0.14})` : "transparent",
        boxShadow: glow > 0.08 ? `0 0 ${6 + glow * 16}px rgba(255, 176, 32, ${0.35 + glow * 0.5})` : "none",
      }}
    >
      {text}
      {cursor ? (
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 24,
            marginLeft: 6,
            background: "#F6F3EC",
            verticalAlign: "middle",
          }}
        />
      ) : null}
    </div>
  );
}
