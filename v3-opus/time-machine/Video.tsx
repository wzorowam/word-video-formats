import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
  BG,
  byId,
  DIM,
  ease,
  focusOf,
  Frame,
  INK,
  mix,
  PANEL,
  type ClipProps,
  SANS,
  SOFT,
  spring01,
  tone,
} from "../src/kit";

const DIAL = { x: 268, y: 128, r: 104 };
const RAIL_Y = 318;
const STEP = 236;

const STOPS = [
  { big: "Latin", small: "agere: to do", focus: "latin" },
  { big: "before 1500", small: "a doer", focus: "doer" },
  { big: "1550s", small: "a force", focus: "force" },
  { big: "1590s", small: "a deputy", focus: "deputy" },
  { big: "today", small: "?", focus: "word" },
];

const Icon: React.FC<{ k: number; color: string }> = ({ k, color }) => {
  if (k === 0)
    return (
      <text x={0} y={14} textAnchor="middle" fontFamily="DejaVu Serif, Georgia, serif" fontStyle="italic" fontSize={40} fill={color}>
        agere
      </text>
    );
  if (k === 1)
    return (
      <g stroke={color} strokeWidth={5}>
        <circle cx={-22} cy={-26} r={9} />
        <path d="M-22 -16 L-12 10 M-12 10 L-24 34 M-12 10 L2 32 M-18 -4 L10 -6" />
        <rect x={12} y={-22} width={30} height={30} rx={4} />
        <path d="M-40 -2 h-12 M-42 10 h-10" strokeWidth={3} />
      </g>
    );
  if (k === 2) return <path d="M8 -38 L-16 4 H4 L-8 38 L22 -8 H2 Z" stroke={color} strokeWidth={5} />;
  if (k === 3)
    return (
      <g stroke={color} strokeWidth={5}>
        <circle cx={-6} cy={-24} r={11} />
        <path d="M-28 30 C-28 0 16 0 16 30" />
        <rect x={14} y={8} width={26} height={20} rx={4} />
        <path d="M22 8 v-5 h10 v5" strokeWidth={3} />
      </g>
    );
  return (
    <text x={0} y={18} textAnchor="middle" fontFamily={SANS} fontSize={54} fontWeight={800} fill={color}>
      ?
    </text>
  );
};

export const TimeMachine: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="time-machine" safe={safe}>
    {({ clip, t }) => {
      const moves = [
        { line: byId(clip, "latin"), to: 0, dur: 1.4 },
        { line: byId(clip, "doer"), to: 1, dur: 0.9 },
        { line: byId(clip, "force"), to: 2, dur: 0.9 },
        { line: byId(clip, "deputy"), to: 3, dur: 0.9 },
        { line: byId(clip, "recap"), to: 1, dur: 1.1 },
      ];
      let pos = 4;
      let prev = 4;
      for (const m of moves) {
        pos += (m.to - prev) * spring01(t, m.line.t + 0.1, m.dur, 13);
        prev = m.to;
      }
      const speed = Math.abs(pos - (() => {
        let p2 = 4;
        let pv = 4;
        for (const m of moves) {
          p2 += (m.to - pv) * spring01(t - 1 / 30, m.line.t + 0.1, m.dur, 13);
          pv = m.to;
        }
        return p2;
      })());
      const near = Math.max(0, Math.min(4, Math.round(pos)));
      const theta = -pos * 72 + 2 * Math.sin(t * 1.1);

      const focusFor = (k: number) => focusOf(clip, t, STOPS[k].focus);
      const iconOn = STOPS[near].focus === "word" ? 0 : focusFor(near);
      const settle = 1 - Math.min(1, Math.abs(pos - near) * 2.2);

      return (
        <>
          <g transform={`translate(${DIAL.x} ${DIAL.y})`}>
            <circle r={DIAL.r + 10} fill={PANEL} stroke={DIM} strokeWidth={3} />
            <g transform={`rotate(${theta})`}>
              {Array.from({ length: 60 }).map((_, k) => {
                const major = k % 12 === 0;
                const a = (k * 6 * Math.PI) / 180;
                const r1 = DIAL.r - (major ? 22 : 10);
                return (
                  <path
                    key={k}
                    d={`M${Math.sin(a) * r1} ${-Math.cos(a) * r1} L${Math.sin(a) * DIAL.r} ${-Math.cos(a) * DIAL.r}`}
                    stroke={major ? INK : DIM}
                    strokeWidth={major ? 4 : 2}
                  />
                );
              })}
            </g>
            <circle r={DIAL.r - 34} fill={BG} stroke={DIM} strokeWidth={2} />
            <g opacity={settle} transform={`scale(${mix(0.6, 1, settle)})`}>
              <Icon k={near} color={tone(iconOn, INK)} />
            </g>
            {speed > 0.01 && (
              <circle r={DIAL.r - 34} fill="none" stroke={SOFT} strokeWidth={3} strokeDasharray={`${8 + speed * 120} 16`} opacity={Math.min(0.6, speed * 8)} />
            )}
            <path d={`M-14 ${-DIAL.r - 26} L14 ${-DIAL.r - 26} L0 ${-DIAL.r - 4} Z`} fill={INK} />
          </g>

          <defs>
            <linearGradient id="tm-fade" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity={0} />
              <stop offset="0.16" stopColor="#fff" stopOpacity={1} />
              <stop offset="0.84" stopColor="#fff" stopOpacity={1} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id="tm-track">
              <rect x={0} y={RAIL_Y - 90} width={536} height={190} fill="url(#tm-fade)" />
            </mask>
          </defs>
          <g mask="url(#tm-track)">
          <path d={`M-30 ${RAIL_Y} H566`} stroke={DIM} strokeWidth={4} />
          {Array.from({ length: 40 }).map((_, k) => {
            const x = 268 + (k / 4 - pos) * STEP - 2 * STEP;
            if (x < -30 || x > 566) return null;
            return <path key={k} d={`M${x} ${RAIL_Y - 8} V${RAIL_Y + 8}`} stroke={DIM} strokeWidth={2} />;
          })}
          {STOPS.map((s, k) => {
            const x = 268 + (k - pos) * STEP;
            const dist = Math.abs(x - 268);
            if (dist > 420) return null;
            const fade = Math.max(0, 1 - dist / 330);
            const on = focusFor(k) * (k === near ? 1 : 0) * (s.focus === "word" ? 0 : 1);
            const scale = mix(0.72, 1, Math.max(0, 1 - dist / STEP));
            return (
              <g key={k} opacity={fade} transform={`translate(${x} ${RAIL_Y}) scale(${scale})`}>
                <circle r={11} fill={interpolateColors(on, [0, 1], [INK, ACCENT])} />
                <text y={-26} textAnchor="middle" fontFamily={SANS} fontSize={44} fontWeight={800} fill={interpolateColors(on, [0, 1], [INK, ACCENT])}>
                  {s.big}
                </text>
                <text y={58} textAnchor="middle" fontFamily={SANS} fontSize={30} fontWeight={600} fill={interpolateColors(on, [0, 1], [SOFT, ACCENT])}>
                  {s.small}
                </text>
              </g>
            );
          })}
          </g>
          <path d={`M268 ${RAIL_Y - 84} V${RAIL_Y - 70}`} stroke={DIM} strokeWidth={3} opacity={ease(t, 0, 0.5)} />
        </>
      );
    }}
  </Frame>
);
