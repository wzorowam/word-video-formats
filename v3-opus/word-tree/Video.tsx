import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
  BG,
  byId,
  DIM,
  EASE_OUT,
  ease,
  focusOf,
  Frame,
  INK,
  mix,
  PANEL,
  type ClipProps,
  ring,
  SOFT,
  spring01,
  SvgTag,
  tone,
  window01,
} from "../src/kit";

type Branch = { key: "bleach" | "secret" | "free"; d: string; len: number; tip: [number, number]; tag: [number, number]; text: string };

const TRUNK = "M268 392 C268 330 262 260 268 150";
const BRANCHES: Branch[] = [
  { key: "bleach", d: "M267 290 C220 270 170 250 118 214", len: 170, tip: [104, 198], tag: [110, 300], text: "bleaching agent" },
  { key: "secret", d: "M266 214 C310 190 360 160 412 118", len: 185, tip: [430, 100], tag: [410, 212], text: "secret agent" },
  { key: "free", d: "M268 320 C320 312 370 300 420 268", len: 170, tip: [438, 254], tag: [410, 350], text: "free agent" },
];

const Glow: React.FC<{ d: string; on: number }> = ({ d, on }) =>
  on > 0.01 ? <path d={d} stroke={ACCENT} strokeWidth={22} opacity={0.16 * on} /> : null;

const Bottle: React.FC<{ on: number; tilt: number; pour: number; t: number }> = ({ on, tilt, pour, t }) => (
  <g>
    <g transform={`rotate(${tilt} 0 18)`} stroke={tone(on, INK)} strokeWidth={3.5} fill={PANEL}>
      <rect x={-9} y={-44} width={18} height={14} rx={3} />
      <path d="M-20 -30 H20 V30 C20 40 -20 40 -20 30 Z" />
      <path d="M-12 -6 H12" stroke={SOFT} strokeWidth={2.5} />
    </g>
    {pour > 0.01 && (
      <circle cx={-44} cy={mix(-10, 52, (t * 1.6) % 1)} r={5} fill={tone(on, INK)} opacity={pour} />
    )}
  </g>
);

const Cloth: React.FC<{ white: number }> = ({ white }) => (
  <path
    d="M-36 64 Q-18 56 0 64 T36 64 V96 Q18 104 0 96 T-36 96 Z"
    fill={interpolateColors(white, [0, 1], ["#5A4F3C", "#F5F7FA"])}
    stroke={SOFT}
    strokeWidth={2.5}
  />
);

const Spy: React.FC<{ on: number; tip: number }> = ({ on, tip }) => {
  const c = tone(on, INK);
  return (
    <g strokeWidth={3.5} stroke={c}>
      <path d="M-30 46 C-30 18 30 18 30 46" fill={PANEL} />
      <path d="M-10 22 L0 40 L10 22" />
      <circle cx={0} cy={0} r={18} fill={PANEL} />
      <path d="M-14 -2 H-3 M3 -2 H14" strokeWidth={5} />
      <g transform={`translate(0 ${-14 - 10 * tip}) rotate(${-24 * tip} 16 0)`} fill={PANEL}>
        <path d="M-28 0 H28" strokeWidth={4} />
        <path d="M-15 0 C-15 -22 15 -22 15 0" />
      </g>
    </g>
  );
};

const Jersey: React.FC<{ on: number; swing: number }> = ({ on, swing }) => (
  <g transform={`rotate(${swing} 0 -30)`} stroke={tone(on, INK)} strokeWidth={3.5} fill={PANEL}>
    <path d="M-10 -30 L-34 -20 L-42 2 L-28 8 L-26 34 H26 L28 8 L42 2 L34 -20 L10 -30 C6 -22 -6 -22 -10 -30 Z" />
    <path d="M-6 -2 H6 V20" stroke={SOFT} strokeWidth={3} fill="none" />
  </g>
);

export const WordTree: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="word-tree" safe={safe}>
    {({ clip, t }) => {
      const bleach = byId(clip, "bleach");
      const secret = byId(clip, "secret");
      const free = byId(clip, "free");
      const recap = byId(clip, "recap");

      const trunkGrow = ease(t, 0, 1.3, EASE_OUT);
      const grow: Record<Branch["key"], number> = {
        bleach: ease(t, bleach.t, bleach.t + 0.9, EASE_OUT),
        secret: ease(t, secret.t, secret.t + 0.9, EASE_OUT),
        free: ease(t, free.t, free.t + 0.9, EASE_OUT),
      };
      const pop: Record<Branch["key"], number> = {
        bleach: spring01(t, bleach.t + 0.6, 0.7, 11),
        secret: spring01(t, secret.t + 0.6, 0.7, 11),
        free: spring01(t, free.t + 0.6, 0.7, 11),
      };
      const sweep = (k: number) => window01(t, recap.t + 0.05 + k * 0.78, recap.t + 0.85 + k * 0.78, 0.2, 0.2);
      const on: Record<Branch["key"], number> = {
        bleach: Math.max(focusOf(clip, t, "bleach"), sweep(0)),
        secret: Math.max(focusOf(clip, t, "secret"), sweep(1)),
        free: Math.max(focusOf(clip, t, "free"), sweep(2)),
      };
      const onTrunk = Math.max(
        focusOf(clip, t, "trunk"),
        window01(t, recap.t + 2.4, recap.end, 0.3, 0.25),
      );

      const tilt = mix(0, -62, ease(t, bleach.t + 1.0, bleach.t + 1.5)) * (1 - ease(t, bleach.end - 0.4, bleach.end + 0.2));
      const pour = window01(t, bleach.t + 1.4, bleach.end, 0.2, 0.3);
      const white = ease(t, bleach.t + 1.5, bleach.t + 2.6);
      const hatTip = spring01(t, secret.t + 1.2, 0.5, 9) * (1 - spring01(t, secret.t + 2.0, 0.6, 9));
      const swing = ring(t, free.t + 1.3, 12, 1.3, 2.4) + 2 * Math.sin(t * 1.7);
      const sway = 1.2 * Math.sin(t * 0.9);

      const buds = 1 - Math.max(grow.bleach, grow.secret, grow.free) * 0;
      return (
        <g transform={`rotate(${sway} 268 392)`}>
          <path d="M150 392 H386" stroke={DIM} strokeWidth={3} />
          <Glow d={TRUNK} on={onTrunk} />
          <path
            d={TRUNK}
            stroke={tone(onTrunk, INK)}
            strokeWidth={9}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - trunkGrow}
          />
          {BRANCHES.map((b) => (
            <g key={b.key}>
              <Glow d={b.d} on={on[b.key] * grow[b.key]} />
              <path d={b.d} stroke={FAINT_OR(b, grow)} strokeWidth={6} strokeDasharray="2 12" opacity={0.6 * buds * (1 - grow[b.key])} />
              <path
                d={b.d}
                stroke={tone(on[b.key], INK)}
                strokeWidth={6}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - grow[b.key]}
              />
            </g>
          ))}

          <g transform={`translate(${BRANCHES[0].tip[0]} ${BRANCHES[0].tip[1] - 40}) scale(${pop.bleach})`} opacity={Math.min(1, pop.bleach * 2)}>
            <Bottle on={on.bleach} tilt={tilt} pour={pour} t={t} />
            <g transform="translate(-48 0)">
              <Cloth white={white} />
            </g>
          </g>
          <g transform={`translate(${BRANCHES[1].tip[0]} ${BRANCHES[1].tip[1] - 30}) scale(${pop.secret})`} opacity={Math.min(1, pop.secret * 2)}>
            <Spy on={on.secret} tip={hatTip} />
          </g>
          <g transform={`translate(${BRANCHES[2].tip[0] + 10} ${BRANCHES[2].tip[1]}) scale(${pop.free})`} opacity={Math.min(1, pop.free * 2)}>
            <Jersey on={on.free} swing={swing} />
          </g>

          {BRANCHES.map((b) => (
            <SvgTag
              key={b.key}
              x={b.tag[0]}
              y={b.tag[1]}
              text={b.text}
              on={0}
              show={spring01(t, ({ bleach, secret, free } as const)[b.key].t + 0.8, 0.6, 12)}
            />
          ))}
          <circle cx={268} cy={150} r={mix(0, 9, trunkGrow)} fill={tone(onTrunk, INK)} stroke={BG} strokeWidth={3} />
        </g>
      );
    }}
  </Frame>
);

const FAINT_OR = (_b: Branch, _g: Record<string, number>) => DIM;
