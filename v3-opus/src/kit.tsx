import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import raw from "../timeline.json";

export type Line = {
  id: string;
  section: "word" | "meaning" | "example" | "recap";
  focus: string;
  card: string;
  accent?: string;
  voice: string;
  t: number;
  end: number;
  voiceDur: number;
};
export type Clip = { title: string; duration: number; lines: Line[] };
export const timeline = raw as unknown as Record<string, Clip>;

export const W = 720;
export const H = 1280;
// Platform chrome on TikTok, Reels and Shorts: status/top bar, right-hand action
// rail, and caption/handle block at the bottom. Nothing readable goes there.
export const SAFE = { top: 180, bottom: 950, left: 56, right: 592 };
export const SAFE_W = SAFE.right - SAFE.left;
export const CX = (SAFE.left + SAFE.right) / 2;

export const SCENE = { x: SAFE.left, y: 384, w: SAFE_W, h: 396 };

/** Cards sit on this line; the entrance spring stays above SAFE.bottom. */
export const CARD_BOTTOM = 922;
/** Scene clip, inset by the camera's largest outward drift (zoom 4 % about CX). */
export const SCENE_CLIP_INSET = 14;

export type Pt = [number, number];
/** Catmull-Rom through the points, as cubic Béziers. */
export const smoothPath = (pts: Pt[]) => {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Small tag drawn inside the scene SVG. */
export const SvgTag: React.FC<{ x: number; y: number; text: string; on: number; show: number; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  on,
  show,
  anchor = "middle",
}) => {
  const w = text.length * 15.5 + 30;
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const s = mix(0.7, 1, show);
  return (
    <g opacity={Math.min(1, show * 1.4)} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <rect x={left} y={y - 22} width={w} height={44} rx={22} fill={interpolateColors(on, [0, 1], [PANEL, ACCENT])} stroke={interpolateColors(on, [0, 1], [DIM, ACCENT])} strokeWidth={2} />
      <text
        x={left + w / 2}
        y={y + 9}
        textAnchor="middle"
        fontFamily={SANS}
        fontSize={26}
        fontWeight={700}
        fill={interpolateColors(on, [0, 1], [INK, ACCENT_INK])}
      >
        {text}
      </text>
    </g>
  );
};

export const BG = "#0A0F1A";
export const PANEL = "#141C2C";
export const INK = "#F5F7FA";
export const SOFT = "#B9C2CF";
export const DIM = "#4A5568";
export const FAINT = "#252F40";
export const ACCENT = "#FFB21E";
export const ACCENT_INK = "#1A1100";
export const SANS = "Outfit, Liberation Sans, Arial, sans-serif";
export const CREDIT = "CA.EYE agents";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return { frame, fps, t: frame / fps, total: durationInFrames / fps };
};

/** 0 -> 1 with a spring that overshoots slightly (damping 12 is about 9 %). */
export const spring01 = (t: number, start: number, dur = 0.7, damping = 12) =>
  interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing: Easing.spring({ damping }) });

export const ease = (t: number, a: number, b: number, easing = EASE_IO) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing });

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Damped oscillation that starts at `start`: for things that spring back. */
export const ring = (t: number, start: number, amp: number, freq = 2.2, decay = 3.2) => {
  const dt = t - start;
  if (dt < 0) return 0;
  return amp * Math.exp(-decay * dt) * Math.sin(2 * Math.PI * freq * dt);
};

export const lineAt = (clip: Clip, t: number) => {
  let i = 0;
  clip.lines.forEach((l, k) => {
    if (t >= l.t) i = k;
  });
  return { line: clip.lines[i], i };
};

export const byId = (clip: Clip, id: string) => {
  const l = clip.lines.find((x) => x.id === id);
  if (!l) throw new Error(`no line ${id}`);
  return l;
};

/** How "on" a focus key is right now: eases in at a line's start, out at its end. */
export const focusOf = (clip: Clip, t: number, keys: string | string[]) => {
  const ks = Array.isArray(keys) ? keys : [keys];
  let v = 0;
  for (const l of clip.lines) {
    if (!ks.includes(l.focus)) continue;
    const up = l.t === 0 ? 1 : ease(t, l.t + 0.05, l.t + 0.4, EASE_OUT);
    const down = 1 - ease(t, l.end - 0.25, l.end + 0.1, EASE_IN);
    v = Math.max(v, Math.min(up, down));
  }
  return v;
};

export const window01 = (t: number, a: number, b: number, inDur = 0.35, outDur = 0.3) =>
  Math.min(ease(t, a, a + inDur, EASE_OUT), 1 - ease(t, b - outDur, b, EASE_IN));

export const tone = (on: number, base = SOFT) => interpolateColors(on, [0, 1], [base, ACCENT]);

let fontReady = false;
const useOutfit = () => {
  const [handle] = useState(() => delayRender("Outfit"));
  useEffect(() => {
    if (fontReady) {
      continueRender(handle);
      return;
    }
    new FontFace("Outfit", `url(${staticFile("fonts/Outfit.ttf")})`, { weight: "100 900" })
      .load()
      .then((f) => {
        document.fonts.add(f);
        fontReady = true;
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
};

const SECTIONS: Line["section"][] = ["word", "meaning", "example", "recap"];

const SectionBar: React.FC<{ clip: Clip; t: number }> = ({ clip, t }) => {
  const spans = SECTIONS.map((s) => {
    const ls = clip.lines.filter((l) => l.section === s);
    return { s, a: ls[0].t, b: ls[ls.length - 1].end };
  });
  const segW = (SAFE_W - 3 * 10) / 4;
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top + 34, width: SAFE_W, display: "flex", gap: 10 }}>
      {spans.map(({ s, a, b }) => {
        const fill = ease(t, a, b, Easing.linear);
        const active = window01(t, a, b, 0.3, 0.2);
        return (
          <div key={s} style={{ width: segW }}>
            <div style={{ height: 4, borderRadius: 2, background: FAINT, overflow: "hidden" }}>
              <div style={{ height: 4, width: `${fill * 100}%`, background: INK, borderRadius: 2 }} />
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: interpolateColors(active, [0, 1], [DIM, INK]),
              }}
            >
              {s}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TargetWord: React.FC<{ clip: Clip; t: number; text: string }> = ({ clip, t, text }) => {
  const on = focusOf(clip, t, "word");
  const settle = interpolate(t, [0, 0.9], [1.07, 1], { ...clamp, easing: Easing.spring({ damping: 11 }) });
  const breathe = 1 + 0.012 * Math.sin(t * 1.4);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 78,
        width: SAFE_W,
        textAlign: "center",
        fontSize: 104,
        fontWeight: 800,
        letterSpacing: -2,
        lineHeight: 1,
        color: interpolateColors(on, [0, 1], [INK, ACCENT]),
        scale: String(settle * breathe),
      }}
    >
      {text}
    </div>
  );
};

const Card: React.FC<{ line: Line; t: number }> = ({ line, t }) => {
  const inP = spring01(t, line.t, 0.75, 12);
  const outP = ease(t, line.end - 0.28, line.end, EASE_IN);
  if (t < line.t || t > line.end) return null;
  const words = line.card.split(" ");
  const acc = (line.accent ?? "").split(" ").filter(Boolean);
  let hit = -1;
  for (let k = 0; k + acc.length <= words.length; k++) {
    if (acc.length && words.slice(k, k + acc.length).join(" ").toLowerCase() === acc.join(" ").toLowerCase()) hit = k;
  }
  const accOn = ease(t, line.t + 0.25, line.t + 0.55, EASE_OUT) * (1 - outP);
  const pop = spring01(t, line.t + 0.25, 0.6, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE_W,
        bottom: H - CARD_BOTTOM,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, inP * 1.6) * (1 - outP),
        translate: `0px ${mix(22, 0, inP) - 22 * outP}px`,
        scale: String(mix(0.92, 1, inP) - 0.03 * outP),
      }}
    >
      <div
        style={{
          maxWidth: SAFE_W,
          padding: "20px 28px",
          borderRadius: 22,
          background: PANEL,
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          fontSize: 43,
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: "center",
          color: INK,
        }}
      >
        {words.map((w, k) => {
          const isAcc = hit >= 0 && k >= hit && k < hit + acc.length;
          return (
            <span
              key={k}
              style={{
                display: "inline-block",
                marginRight: k < words.length - 1 ? "0.26em" : 0,
                color: isAcc ? interpolateColors(accOn, [0, 1], [INK, ACCENT]) : INK,
                translate: isAcc ? `0px ${mix(12, 0, pop)}px` : undefined,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Slow push-in. `zoom` is the total drift, kept inside 2-5 %. */
export const Camera: React.FC<{ t: number; total: number; zoom?: number; children: React.ReactNode }> = ({
  t,
  total,
  zoom = 0.04,
  children,
}) => {
  const p = ease(t, 0, total, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${CX}px 560px`,
        scale: String(1 + zoom * p),
        translate: `${mix(0, -4, p)}px ${mix(0, -6, p)}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const SafeOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: SAFE.top, background: "rgba(255,40,80,0.28)" }} />
    <div style={{ position: "absolute", left: 0, top: SAFE.bottom, width: W, height: H - SAFE.bottom, background: "rgba(255,40,80,0.28)" }} />
    <div style={{ position: "absolute", left: SAFE.right, top: SAFE.top, width: W - SAFE.right, height: SAFE.bottom - SAFE.top, background: "rgba(255,40,80,0.28)" }} />
    <div style={{ position: "absolute", left: 0, top: SAFE.top, width: SAFE.left, height: SAFE.bottom - SAFE.top, background: "rgba(255,40,80,0.28)" }} />
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, width: SAFE_W, height: SAFE.bottom - SAFE.top, outline: "2px dashed rgba(255,80,110,0.9)" }} />
  </AbsoluteFill>
);

export type ClipProps = { safe?: boolean };

/** The shared frame: background, credit, section bar, target word, scene and cards. */
export const Frame: React.FC<{
  id: string;
  word?: string;
  safe?: boolean;
  zoom?: number;
  children: (ctx: { clip: Clip; t: number; fps: number; frame: number }) => React.ReactNode;
}> = ({ id, word = "agent", safe, zoom, children }) => {
  useOutfit();
  const { frame, fps, t, total } = useT();
  const clip = timeline[id];
  const { line } = lineAt(clip, t);
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, color: INK }}>
      <Camera t={t} total={total} zoom={zoom}>
        <AbsoluteFill style={{ background: "radial-gradient(circle 420px at 45% 44%, #172235 0%, rgba(10,15,26,0) 100%)" }} />
        <TargetWord clip={clip} t={t} text={word} />
        <svg
          width={SCENE.w}
          height={SCENE.h}
          viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
          style={{ position: "absolute", left: SCENE.x, top: SCENE.y, overflow: "visible" }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <clipPath id="scene-safe">
              <rect x={SCENE_CLIP_INSET} y={-60} width={SCENE.w - 2 * SCENE_CLIP_INSET} height={SCENE.h + 60} />
            </clipPath>
          </defs>
          <g clipPath="url(#scene-safe)">{children({ clip, t, fps, frame })}</g>
        </svg>
      </Camera>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 3,
          color: SOFT,
        }}
      >
        {CREDIT} · {clip.title.toUpperCase()}
      </div>
      <SectionBar clip={clip} t={t} />
      <Card line={line} t={t} />
      <Audio src={staticFile(`${id}.wav`)} />
      {safe && <SafeOverlay />}
    </AbsoluteFill>
  );
};
