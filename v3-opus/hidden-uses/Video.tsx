import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
  BG,
  byId,
  DIM,
  EASE_IN,
  EASE_IO,
  EASE_OUT,
  ease,
  focusOf,
  Frame,
  INK,
  mix,
  PANEL,
  type ClipProps,
  SOFT,
  spring01,
  SvgTag,
  tone,
  window01,
} from "../src/kit";

type Key = "wet" | "mix" | "thick" | "germ";
const SPOTS: Record<Key, { x: number; y: number; tag: string }> = {
  wet: { x: 118, y: 126, tag: "wetting" },
  mix: { x: 418, y: 126, tag: "emulsifying" },
  thick: { x: 118, y: 300, tag: "thickening" },
  germ: { x: 418, y: 300, tag: "biological" },
};
const ORIGIN = { x: 268, y: -8 };

const Leaf: React.FC<{ c: string; spread: number; fall: number }> = ({ c, spread, fall }) => (
  <g stroke={c} strokeWidth={3.5}>
    <path d="M-48 20 C-30 -20 30 -24 50 -6 C34 30 -20 40 -48 20 Z" fill={PANEL} />
    <path d="M-44 18 C-10 6 20 -2 46 -6" strokeWidth={2.5} />
    {spread < 0.02 && (
      <path d={`M0 ${-60 + 52 * fall} c-8 12 -10 18 -10 22 a10 10 0 0 0 20 0 c0 -4 -2 -10 -10 -22 Z`} fill={c} opacity={fall > 0 ? 1 : 0.9} />
    )}
    {spread >= 0.02 && <ellipse cx={0} cy={6} rx={mix(9, 30, spread)} ry={mix(10, 4, spread)} fill={c} opacity={0.85} />}
  </g>
);

const Beaker: React.FC<{ c: string; mixP: number; t: number }> = ({ c, mixP, t }) => {
  const wave = 6 * Math.sin(t * 5) * (1 - mixP) + 2 * Math.sin(t * 3);
  const oil = interpolateColors(mixP, [0, 1], ["#8C7A42", "#6E6A5A"]);
  const water = interpolateColors(mixP, [0, 1], ["#2E4A6B", "#6E6A5A"]);
  return (
    <g>
      <path d="M-34 -42 V30 C-34 44 34 44 34 30 V-42" fill={water} stroke="none" />
      <path d={`M-34 -14 Q0 ${-14 + wave} 34 -14 V-42 H-34 Z`} fill={oil} opacity={1 - mixP * 0.0} />
      {mixP > 0.05 &&
        Array.from({ length: 9 }).map((_, k) => (
          <circle key={k} cx={-24 + (k % 3) * 24 + 4 * Math.sin(t * 2 + k)} cy={-30 + Math.floor(k / 3) * 24 + 3 * Math.cos(t * 2.4 + k)} r={4} fill="#D9D1B8" opacity={mixP} />
        ))}
      <path d="M-38 -48 H38 M-34 -48 V30 C-34 44 34 44 34 30 V-48" stroke={c} strokeWidth={3.5} />
    </g>
  );
};

const Pot: React.FC<{ c: string; thick: number; t: number }> = ({ c, thick, t }) => {
  const amp = mix(7, 1.5, thick);
  const spin = t * mix(260, 90, thick);
  const sx = 16 * Math.cos((spin * Math.PI) / 180);
  return (
    <g>
      <path
        d={`M-44 -8 Q-22 ${-8 - amp * Math.sin(t * 6)} 0 -8 T44 -8 V22 C44 40 -44 40 -44 22 Z`}
        fill={interpolateColors(thick, [0, 1], ["#7A3B2A", "#A2442A"])}
      />
      <path d={`M${sx} -52 L${sx * 0.6} -4`} stroke={SOFT} strokeWidth={5} />
      <path d="M-48 -14 H48 M-44 -14 V22 C-44 40 44 40 44 22 V-14 M-48 -4 H-60 M48 -4 H60" stroke={c} strokeWidth={3.5} />
      {thick < 0.9 && <circle cx={44} cy={mix(-6, 30, (t * mix(1.6, 0.3, thick)) % 1)} r={4} fill="#7A3B2A" opacity={1 - thick} />}
    </g>
  );
};

const Germ: React.FC<{ c: string; t: number; grow: number }> = ({ c, t, grow }) => (
  <g transform={`rotate(${t * 18}) scale(${grow})`} stroke={c} strokeWidth={3.5}>
    {Array.from({ length: 10 }).map((_, k) => {
      const a = (k / 10) * Math.PI * 2;
      const r1 = 30 + 2 * Math.sin(t * 4 + k);
      return (
        <g key={k}>
          <path d={`M${Math.cos(a) * 26} ${Math.sin(a) * 26} L${Math.cos(a) * (r1 + 10)} ${Math.sin(a) * (r1 + 10)}`} />
          <circle cx={Math.cos(a) * (r1 + 14)} cy={Math.sin(a) * (r1 + 14)} r={4.5} fill={c} />
        </g>
      );
    })}
    <circle r={28} fill={PANEL} />
    <circle cx={-8} cy={-6} r={5} fill={c} stroke="none" />
    <circle cx={10} cy={6} r={4} fill={c} stroke="none" />
  </g>
);

export const HiddenUses: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="hidden-uses" safe={safe}>
    {({ clip, t }) => {
      const meaning = byId(clip, "meaning");
      const wet = byId(clip, "wet");
      const mixL = byId(clip, "mix");
      const thick = byId(clip, "thick");
      const germ = byId(clip, "germ");
      const recap = byId(clip, "recap");

      const keys: Key[] = ["wet", "mix", "thick", "germ"];
      const enter = (k: number) => spring01(t, 0.1 + k * 0.12, 0.7, 12);
      const draw = (k: number) => ease(t, meaning.t + 0.2 + k * 0.22, meaning.t + 1.0 + k * 0.22, EASE_IO);
      const onLines = focusOf(clip, t, "lines");
      const recapHelp = window01(t, recap.t, recap.t + 1.4, 0.25, 0.25);
      const on: Record<Key, number> = {
        wet: Math.max(focusOf(clip, t, "wet"), recapHelp),
        mix: Math.max(focusOf(clip, t, "mix"), recapHelp),
        thick: Math.max(focusOf(clip, t, "thick"), recapHelp),
        germ: Math.max(window01(t, germ.t + 0.35, germ.end, 0.25, 0.25), window01(t, recap.t + 1.4, recap.end, 0.25, 0.25)),
      };
      const dimSafe = ease(t, germ.t + 0.4, germ.t + 0.9, EASE_OUT) * (1 - recapHelp);
      const germGrow = 1 + 0.22 * (spring01(t, germ.t + 0.35, 0.7, 9) - ease(t, recap.t - 0.4, recap.t, EASE_IN));

      const fall = ease(t, wet.t + 0.3, wet.t + 0.85, EASE_IN);
      const spread = spring01(t, wet.t + 0.85, 0.8, 12);
      const mixP = ease(t, mixL.t + 0.6, mixL.t + 2.2, EASE_IO);
      const thickP = ease(t, thick.t + 0.6, thick.t + 2.4, EASE_IO);

      const bob = (k: number) => 3 * Math.sin(t * 1.6 + k * 1.3);

      return (
        <>
          {keys.map((k, i) => {
            const s = SPOTS[k];
            const d = draw(i);
            const line = `M${ORIGIN.x} ${ORIGIN.y} C${ORIGIN.x} ${ORIGIN.y + 70} ${s.x} ${s.y - 120} ${s.x} ${s.y - 64}`;
            const lineOn = Math.max(onLines, on[k] * (t > meaning.end ? 1 : 0));
            const faded = k === "germ" ? 1 : 1 - 0.75 * dimSafe;
            return (
              <path
                key={k}
                d={line}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - d}
                stroke={interpolateColors(lineOn, [0, 1], [DIM, ACCENT])}
                strokeWidth={3}
                opacity={faded}
              />
            );
          })}
          {keys.map((k, i) => {
            const s = SPOTS[k];
            const e = enter(i);
            const c = tone(on[k], INK);
            const faded = k === "germ" ? 1 : 1 - 0.72 * dimSafe;
            return (
              <g key={k} opacity={Math.min(1, e * 2) * faded} transform={`translate(${s.x} ${s.y + bob(i)}) scale(${mix(0.6, 1, e)})`}>
                <circle r={62} fill={BG} stroke={interpolateColors(on[k], [0, 1], [DIM, ACCENT])} strokeWidth={on[k] > 0.01 ? 3 : 2} />
                {k === "wet" && <Leaf c={c} spread={spread} fall={fall} />}
                {k === "mix" && <Beaker c={c} mixP={mixP} t={t} />}
                {k === "thick" && <Pot c={c} thick={thickP} t={t} />}
                {k === "germ" && <Germ c={c} t={t} grow={germGrow} />}
              </g>
            );
          })}
          {keys.map((k) => {
            const line = byId(clip, k === "mix" ? "mix" : k);
            const s = SPOTS[k];
            const show = spring01(t, line.t + 0.3, 0.6, 12);
            const faded = k === "germ" ? 1 : 1 - 0.72 * dimSafe;
            return (
              <g key={`tag-${k}`} opacity={faded}>
                <SvgTag x={s.x} y={s.y + 86} text={s.tag} on={0} show={show} />
              </g>
            );
          })}
        </>
      );
    }}
  </Frame>
);
