import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
  BG,
  byId,
  DIM,
  EASE_IN,
  EASE_OUT,
  ease,
  focusOf,
  Frame,
  INK,
  mix,
  PANEL,
  type ClipProps,
  type Pt,
  ring,
  SANS,
  smoothPath,
  SOFT,
  spring01,
  SvgTag,
  tone,
} from "../src/kit";

const HX = 268;
const GRIP_Y = 92;
const LEN = 206;

const Fist: React.FC<{ x: number; y: number; open: number; on: number }> = ({ x, y, open, on }) => {
  const stroke = tone(on);
  const fill = interpolateColors(on, [0, 1], ["#1A2334", "#3A2A08"]);
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth={3} stroke={stroke} fill={fill}>
      <rect x={-30} y={-140} width={60} height={96} rx={10} fill={PANEL} />
      <rect x={-34} y={-60} width={68} height={14} rx={6} />
      <rect x={-42} y={-48} width={84} height={58} rx={22} />
      {[-27, -9, 9, 27].map((fx, k) => (
        <rect
          key={k}
          x={fx - 9}
          y={4}
          width={18}
          height={mix(26, 44, open)}
          rx={9}
          transform={`rotate(${mix(0, (fx < 0 ? -1 : 1) * (14 + Math.abs(fx) * 0.8), open)} ${fx} 6)`}
        />
      ))}
      <rect x={-56} y={-26} width={20} height={40} rx={10} transform={`rotate(${mix(-28, -70, open)} -46 -20)`} />
    </g>
  );
};

export const SameCord: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="same-cord" safe={safe}>
    {({ clip, t }) => {
      const change = byId(clip, "change");
      const chaos = byId(clip, "chaos");
      const recap = byId(clip, "recap");

      const letGo = chaos.t + 1.25;
      const regrab = recap.t + 0.15;
      const open = ease(t, letGo, letGo + 0.35, EASE_OUT) * (1 - ease(t, regrab + 0.45, regrab + 0.8, EASE_OUT));
      const lift =
        -150 * ease(t, letGo + 0.15, letGo + 0.9, EASE_IN) +
        8 * Math.sin(Math.PI * ease(t, letGo - 0.25, letGo + 0.15)) * (t < letGo + 0.2 ? 1 : 0);
      const back = spring01(t, regrab, 0.8, 11);
      const handY = GRIP_Y + (t < regrab ? lift : mix(-150, 0, back));

      const tangle = ease(t, letGo + 0.1, letGo + 1.4, EASE_OUT) * (1 - ease(t, regrab + 0.2, regrab + 1.3));

      const drop = spring01(t, 0, 1.0, 10);
      const swingAmp =
        mix(7, 4, ease(t, 3, 6)) + 12 * ease(t, change.t, change.t + 0.8) * (1 - ease(t, chaos.t, chaos.t + 0.8));
      const theta = (tt: number) => (swingAmp * Math.PI) / 180 * Math.sin(tt * 1.55);
      const th = theta(t);
      const dth = theta(t) - theta(t - 0.12);
      const len = mix(120, LEN, drop) + 6 * Math.sin(t * 2.3) + ring(t, change.t + 0.4, 10, 1.6, 2);
      const anchor: Pt = [HX, t < letGo ? handY : GRIP_Y];
      const boxTop: Pt = [
        HX + LEN * Math.sin(th) + tangle * 30 * Math.sin(t * 0.9),
        GRIP_Y + len * Math.cos(th) + tangle * (14 + 6 * Math.sin(t * 1.7)),
      ];
      const freeTop: Pt = [HX + 70 * Math.sin(t * 0.8), GRIP_Y + 20 + 14 * Math.sin(t * 1.3)];
      const top: Pt = [mix(anchor[0], freeTop[0], tangle), mix(anchor[1], freeTop[1], tangle)];

      const N = 30;
      const pts: Pt[] = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const sx = mix(top[0], boxTop[0], u) - dth * 260 * Math.sin(Math.PI * u);
        const sy = mix(top[1], boxTop[1], u) + 10 * Math.sin(Math.PI * u);
        const cx = mix(top[0], boxTop[0], 0.5);
        const cy = mix(top[1], boxTop[1], 0.45);
        const a = u * 13 + t * 1.1;
        const r = 44 + 30 * Math.sin(u * 7.3 + 1.2) + 10 * Math.sin(t * 2 + u * 4);
        const kx = cx + r * Math.cos(a) * 1.35 + 18 * Math.sin(u * 23);
        const ky = cy + r * Math.sin(a) * 0.9 + 12 * Math.cos(u * 17);
        const edge = Math.min(1, Math.min(u, 1 - u) * 6);
        pts.push([mix(sx, kx, tangle * edge), mix(sy, ky, tangle * edge)]);
      }

      const onHand = focusOf(clip, t, ["hand", "sole"]);
      const onChange = focusOf(clip, t, "change");
      const onChaos = focusOf(clip, t, "chaos");
      const boxTilt = (th * 180) / Math.PI * 0.6 + tangle * 18 * Math.sin(t * 1.4) + ring(t, change.t + 0.4, 6, 1.6, 2);

      const sole = byId(clip, "sole");
      const soleTag = spring01(t, sole.t + 0.2, 0.6, 12) * (1 - ease(t, sole.end - 0.25, sole.end));
      const changeTag = spring01(t, change.t + 0.2, 0.6, 12) * (1 - ease(t, change.end - 0.25, change.end));
      const chaosTag = spring01(t, chaos.t + 0.25, 0.6, 12) * (1 - ease(t, chaos.end - 0.25, chaos.end));

      const team = [0, 1, 2].map((k) => {
        const hit = spring01(t, change.t + 0.9 + k * 0.14, 0.8, 11) * (1 - ease(t, chaos.t + 0.6, chaos.t + 1.2));
        return { k, x: 420 + k * 40, rot: mix(32 - k * 22, 0, hit), dx: mix(0, 18, hit), on: onChange };
      });
      const teamShow = ease(t, change.t, change.t + 0.5, EASE_OUT) * (1 - ease(t, chaos.t + 0.6, chaos.t + 1.2));

      return (
        <>
          <defs>
            <clipPath id="sc-ceiling">
              <rect x={-60} y={6} width={656} height={420} />
            </clipPath>
          </defs>
          <path d="M150 6 H386" stroke={DIM} strokeWidth={3} />
          <path d={smoothPath(pts)} stroke={interpolateColors(onChaos, [0, 1], [INK, ACCENT])} strokeWidth={4} />
          <g
            transform={`translate(${boxTop[0]} ${boxTop[1]}) rotate(${boxTilt}) translate(0 ${mix(-40, 0, Math.min(1, drop))})`}
            opacity={Math.min(1, drop * 1.5)}
          >
            <rect x={-10} y={-6} width={20} height={14} rx={4} fill={BG} stroke={SOFT} strokeWidth={3} />
            <rect
              x={-74}
              y={8}
              width={148}
              height={88}
              rx={16}
              fill={interpolateColors(onChange, [0, 1], [PANEL, "#3A2A08"])}
              stroke={tone(onChange, INK)}
              strokeWidth={3}
            />
            <text x={0} y={64} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={36} fill={INK}>
              agent
            </text>
          </g>
          {team.map(({ k, x, rot, dx }) => (
            <g key={k} opacity={teamShow} transform={`translate(${x + dx} 372) rotate(${rot})`}>
              <rect x={-14} y={-14} width={28} height={28} rx={6} fill={PANEL} stroke={tone(onChange)} strokeWidth={3} />
            </g>
          ))}
          <g clipPath="url(#sc-ceiling)">
            <Fist x={HX} y={handY} open={open} on={onHand} />
          </g>
          <SvgTag x={HX + 150} y={60} text="one company" on={focusOf(clip, t, "sole")} show={soleTag} />
          <SvgTag x={4} y={190} anchor="start" text="change agent" on={0} show={changeTag} />
          <SvgTag x={4} y={190} anchor="start" text="nobody holds it" on={0} show={chaosTag} />
        </>
      );
    }}
  </Frame>
);
