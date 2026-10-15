import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const WIDTH = 720;
export const HEIGHT = 1280;
/** 26.0s — inside the 20–30s brief. */
export const DURATION = 780;

export const GROUND = "#0C0E12";
export const INK = "#F6F3EC";
export const STEEL = "#C5CAD3";
export const LINE = "#2A303A";

export const POP = { damping: 11, stiffness: 170, mass: 0.58 };
export const SNAP = { damping: 8, stiffness: 260, mass: 0.4 };
export const SOFT = { damping: 16, stiffness: 80, mass: 0.9 };

export const fontFamily = "Outfit, sans-serif";

const SCENE = { left: 80, top: 372, width: 560, height: 470 };

type SpringCfg = { damping: number; stiffness: number; mass: number };

export function arrive(
  frame: number,
  fps: number,
  delay: number,
  config: SpringCfg = POP,
) {
  return spring({ frame, fps, delay, config });
}

/** Accent amount that springs on, then springs off. Values may overshoot past 1. */
export function gate(
  frame: number,
  fps: number,
  on: number,
  off?: number,
  config: SpringCfg = POP,
) {
  const a = arrive(frame, fps, on, config);
  if (off === undefined) return a;
  const b = arrive(frame, fps, off, config);
  return Math.max(0, a - b);
}

export function mixHex(amount: number, hot: string, cold: string) {
  const a = Math.max(0, Math.min(1, amount));
  const h = hex(hot);
  const c = hex(cold);
  const r = Math.round(c[0] + (h[0] - c[0]) * a);
  const g = Math.round(c[1] + (h[1] - c[1]) * a);
  const b = Math.round(c[2] + (h[2] - c[2]) * a);
  return `rgb(${r}, ${g}, ${b})`;
}

function hex(value: string): [number, number, number] {
  const n = value.replace("#", "");
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
}

function phase(frame: number) {
  if (frame < 135) return "WORD";
  if (frame < 330) return "MEANING";
  if (frame < 615) return "EXAMPLE";
  return "RECAP";
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function Stage({
  slug,
  accent,
  cues,
  children,
}: {
  slug: string;
  accent: string;
  cues: [number, string][];
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const zoom = interpolate(t, [0, 1], [1.02, 1.05], {
    easing: Easing.inOut(Easing.sin),
  });
  const driftX = Math.sin(t * Math.PI) * 4;
  const driftY = interpolate(t, [0, 1], [3, -4]);
  const settle = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 90, mass: 0.8 },
  });
  const wordScale = 1.05 - Math.min(settle, 1.15) * 0.05;
  const wordOn = frame < 135;

  return (
    <AbsoluteFill
      style={{ background: GROUND, overflow: "hidden", fontFamily, color: INK }}
    >
      <Audio src={staticFile(`audio/${slug}/mix.wav`)} />
      <AbsoluteFill
        style={{
          background: GROUND,
          transform: `translate(${driftX}px, ${driftY}px) scale(${zoom})`,
          transformOrigin: "50% 44%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 216,
            left: 88,
            right: 88,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 15,
              letterSpacing: 3.5,
              fontWeight: 700,
              color: INK,
            }}
          >
            {phase(frame)}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 0.92,
              color: wordOn ? accent : INK,
              transform: `scale(${wordScale})`,
            }}
          >
            agent
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: SCENE.left,
            top: SCENE.top,
            width: SCENE.width,
            height: SCENE.height,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            left: 88,
            right: 88,
            top: 856,
            height: 100,
          }}
        >
          <Cards cues={cues} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 88,
            right: 88,
            top: 976,
            textAlign: "center",
            color: "#D9D3C7",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          CA.EYE agents
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Cards({ cues }: { cues: [number, string][] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {cues.map(([at, text], i) => {
        const count = wordCount(text);
        if (count < 3 || count > 5) {
          throw new Error(`Card must be 3–5 words, got ${count}: "${text}"`);
        }
        const next = cues[i + 1]?.[0] ?? 10000;
        if (frame < at || frame > next + 10) return null;
        const enter = spring({ frame: frame - at, fps, config: POP });
        const leaveP = frame > next ? Math.min(1, (frame - next) / 10) : 0;
        const leave = Easing.in(Easing.cubic)(leaveP);
        const y = (1 - enter) * 42 - leave * 16;
        const scale = 0.9 + Math.min(Math.max(enter, 0), 1.25) * 0.1 - leave * 0.05;
        const opacity = Math.min(1, Math.max(0, enter) * 1.8) * (1 - leave);
        return (
          <div
            key={`${at}-${text}`}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: INK,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -0.4,
              lineHeight: 1.15,
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}

function loadOutfit() {
  if (typeof document === "undefined") return;
  const handle = delayRender("Outfit");
  const url = staticFile("fonts/Outfit.ttf");
  const attempt = (desc?: FontFaceDescriptors) =>
    new FontFace("Outfit", `url(${url})`, desc).load();
  attempt({ weight: "100 900", style: "normal" })
    .catch(() => attempt())
    .then((loaded) => {
      (document.fonts as unknown as { add(face: FontFace): void }).add(loaded);
      continueRender(handle);
    })
    .catch((err) => {
      cancelRender(err);
    });
}

loadOutfit();
