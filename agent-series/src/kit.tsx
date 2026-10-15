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
export const PANEL = "#141820";

export const POP = { damping: 11, stiffness: 170, mass: 0.58 };
export const TRAVEL = { damping: 12, stiffness: 70, mass: 0.85 };
export const SOFT = { damping: 16, stiffness: 80, mass: 0.9 };

export const fontFamily = "Inter, sans-serif";

export const SCENE = { left: 96, top: 368, width: 528, height: 450 };

export type SpringCfg = { damping: number; stiffness: number; mass: number };
export type Line = [number, string];

export function pop(frame: number, fps: number, delay = 0, config: SpringCfg = POP) {
  return spring({ frame, fps, delay, config });
}

/** Springs on, then springs off. May overshoot past 1 and dip below 0. */
export function gate(frame: number, fps: number, on: number, off?: number, config: SpringCfg = POP) {
  const a = pop(frame, fps, on, config);
  if (off === undefined) return a;
  return a - pop(frame, fps, off, config);
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

export function bob(frame: number, speed = 24, amp = 3) {
  return Math.sin(frame / speed) * amp;
}

function hex(value: string): [number, number, number] {
  const n = value.replace("#", "");
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
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

export function Field({ children }: { children: ReactNode }) {
  return (
    <svg width={SCENE.width} height={SCENE.height} viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}>
      {children}
    </svg>
  );
}

export function Stage({
  slug,
  accent,
  cues,
  children,
}: {
  slug: string;
  accent: string;
  cues: Line[];
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const zoom = interpolate(t, [0, 1], [1, 1.04], {
    easing: Easing.inOut(Easing.sin),
  });
  const driftX = Math.sin(t * Math.PI) * 7;
  const driftY = Math.sin(t * Math.PI * 0.85) * 5;
  const settle = pop(frame, fps, 0, { damping: 13, stiffness: 90, mass: 0.8 });
  const wordScale = 1.06 - settle * 0.06;
  const titleColor = mixHex(1 - pop(frame, fps, 135), accent, INK);

  return (
    <AbsoluteFill style={{ background: GROUND, overflow: "hidden", fontFamily, color: INK }}>
      <Audio src={staticFile(`audio/${slug}/mix.wav`)} />
      <AbsoluteFill
        style={{
          background: GROUND,
          transform: `translate(${driftX}px, ${driftY}px) scale(${zoom})`,
          transformOrigin: "50% 44%",
        }}
      >
        <div style={{ position: "absolute", top: 220, left: 96, right: 96, textAlign: "center" }}>
          <div style={{ fontSize: 14, letterSpacing: 4, fontWeight: 600, color: INK }}>{phase(frame)}</div>
          <div
            style={{
              marginTop: 10,
              fontSize: 80,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.9,
              color: titleColor,
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
        <div style={{ position: "absolute", left: 96, right: 96, top: 834, height: 108 }}>
          <Cards cues={cues} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            top: 964,
            textAlign: "center",
            color: INK,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          CA.EYE agents
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Cards({ cues }: { cues: Line[] }) {
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
        if (frame < at || frame > next + 12) return null;
        const enter = pop(frame - at, fps, 0);
        const leaveP = frame > next ? Math.min(1, (frame - next) / 12) : 0;
        const leave = Easing.in(Easing.cubic)(leaveP);
        const y = (1 - enter) * 36 - leave * 18;
        const scale = 0.9 + Math.max(enter, 0) * 0.1 - leave * 0.04;
        const opacity = Math.min(1, Math.max(0, enter) * 1.6) * (1 - leave);
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
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: -0.3,
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

function loadInter() {
  if (typeof document === "undefined") return;
  const handle = delayRender("Inter");
  const faces: [string, string][] = [
    ["700", "Inter-Bold.ttf"],
    ["600", "Inter-SemiBold.ttf"],
    ["500", "Inter-Medium.ttf"],
  ];
  Promise.all(
    faces.map(([weight, file]) => new FontFace("Inter", `url(${staticFile(`fonts/${file}`)})`, { weight, style: "normal" }).load()),
  )
    .then((loaded) => {
      for (const face of loaded) {
        (document.fonts as unknown as { add(font: FontFace): void }).add(face);
      }
      continueRender(handle);
    })
    .catch((err) => {
      cancelRender(err);
    });
}

loadInter();
