import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
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
  ring,
  SANS,
  SOFT,
  spring01,
  tone,
} from "../src/kit";

const BLOCK = { x: 108, y: 150, w: 320, h: 104 };
const JAW_H = 78;

const Person: React.FC<{ color: string }> = ({ color }) => (
  <g stroke={color} strokeWidth={4}>
    <circle cx={0} cy={-14} r={12} />
    <path d="M-22 22 C-22 2 22 2 22 22" />
  </g>
);

const Storm: React.FC<{ color: string }> = ({ color }) => (
  <g stroke={color} strokeWidth={4}>
    <path d="M-24 4 C-34 4 -34 -14 -20 -14 C-18 -28 4 -30 8 -18 C20 -24 32 -12 24 2 Z" />
    <path d="M-2 6 L-10 20 H2 L-6 32" />
  </g>
);

const Lock: React.FC<{ color: string }> = ({ color }) => (
  <g stroke={color} strokeWidth={4}>
    <rect x={-18} y={-4} width={36} height={28} rx={6} />
    <path d="M-10 -4 V-14 C-10 -28 10 -28 10 -14 V-4" />
  </g>
);

const Jaw: React.FC<{
  y: number;
  dx: number;
  dy: number;
  rot: number;
  text: string;
  color: string;
  opacity: number;
  flip?: boolean;
}> = ({ y, dx, dy, rot, text, color, opacity, flip }) => {
  const lip = flip ? `M24 ${y} V${y - 16} M512 ${y} V${y - 16}` : `M24 ${y + JAW_H} V${y + JAW_H + 16} M512 ${y + JAW_H} V${y + JAW_H + 16}`;
  return (
    <g opacity={opacity} transform={`translate(${dx} ${dy}) rotate(${rot} 268 ${y + JAW_H / 2})`}>
      <rect x={28} y={y} width={480} height={JAW_H} rx={14} fill={PANEL} stroke={color} strokeWidth={4} />
      <path d={lip} stroke={color} strokeWidth={8} />
      <text x={268} y={y + 50} textAnchor="middle" fontFamily={SANS} fontSize={32} fontWeight={600} fill={INK}>
        {text}
      </text>
    </g>
  );
};

export const Clamp: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="clamp" safe={safe}>
    {({ clip, t }) => {
      const meaning = byId(clip, "meaning");
      const novel = byId(clip, "novel");
      const storm = byId(clip, "storm");
      const letgo = byId(clip, "letgo");
      const fin = byId(clip, "final");

      const set1In = spring01(t, meaning.t + 0.2, 0.8, 12);
      const set1Out = ease(t, storm.t - 0.05, storm.t + 0.3, EASE_IN);
      const set2In = spring01(t, storm.t + 0.25, 0.8, 12);
      const snapAt = letgo.t + 0.15;
      const anticip = Math.sin(Math.PI * ease(t, snapAt - 0.2, snapAt)) * (t < snapAt ? 1 : 0);
      const snap = spring01(t, snapAt, 0.7, 10);
      const set2Fade = 1 - 0.65 * ease(t, snapAt + 0.4, snapAt + 1.2);
      const set2Gone = ease(t, fin.t - 0.1, fin.t + 0.25, EASE_IN);
      const set3In = spring01(t, fin.t + 0.15, 0.8, 12);

      const press = (tIn: number) => 6 * spring01(t, tIn + 0.55, 0.5, 9);
      const strainOn = ease(t, storm.t + 0.9, storm.t + 1.3) * (1 - ease(t, snapAt - 0.3, snapAt));
      const shake = strainOn * (3.2 * Math.sin(t * 61) + 2 * Math.sin(t * 37));
      const bulge = strainOn * (10 + 5 * Math.sin(t * 13));

      const onJaws = focusOf(clip, t, ["clamps", "letgo"]);
      const onNovel = focusOf(clip, t, "novel");
      const onStorm = focusOf(clip, t, "storm");
      const onLock = focusOf(clip, t, "clamps") * ease(t, fin.t, fin.t + 0.3);
      const jawColor = tone(onJaws * (t >= fin.t ? 0 : 1), DIM);

      const iconSwap = (a: number, b: number) => spring01(t, a, 0.6, 12) * (1 - ease(t, b - 0.25, b, EASE_IN));
      const ghost = t < novel.t ? 0.55 + 0.25 * Math.sin(t * 3) : 0;
      const ghostA = t < novel.t ? (Math.sin(t * 2.2) > 0 ? 1 : 0) : 0;
      const pIcon = iconSwap(novel.t + 0.6, storm.t);
      const sIcon = iconSwap(storm.t + 0.9, snapAt + 0.05);
      const qIcon = spring01(t, snapAt + 0.2, 0.6, 12) * (1 - ease(t, fin.t, fin.t + 0.2));
      const lIcon = spring01(t, fin.t + 0.7, 0.6, 10);

      const rain = strainOn + ease(t, storm.t + 0.3, storm.t + 0.9) * (1 - ease(t, snapAt, snapAt + 0.6));
      const flash = Math.max(0, Math.sin(Math.PI * ease(t, storm.t + 1.6, storm.t + 1.9))) * strainOn;

      const top1 = { dx: mix(-720, 0, set1In) - 600 * set1Out, dy: press(meaning.t + 0.2) };
      const bot1 = { dx: mix(720, 0, set1In) + 600 * set1Out, dy: -press(meaning.t + 0.2) };
      const top2 = {
        dx: mix(-720, 0, set2In) + shake - 18 * snap,
        dy: press(storm.t + 0.25) + 2 * anticip - 46 * snap + ring(t, snapAt + 0.5, 6, 1.4, 3),
        rot: -7 * snap,
      };
      const bot2 = {
        dx: mix(720, 0, set2In) - shake + 18 * snap,
        dy: -press(storm.t + 0.25) - 2 * anticip + 46 * snap - ring(t, snapAt + 0.5, 6, 1.4, 3),
        rot: 7 * snap,
      };

      const blockScale = 1 + 0.03 * Math.sin(Math.PI * spring01(t, meaning.t + 0.75, 0.4, 20)) + strainOn * 0.01 * Math.sin(t * 40);

      return (
        <>
          {rain > 0.01 &&
            Array.from({ length: 18 }).map((_, k) => {
              const x = (k * 37 + 11) % 536;
              const y = ((t * 520 + k * 67) % 460) - 40;
              return <path key={k} d={`M${x} ${y} l-8 22`} stroke={SOFT} strokeWidth={2} opacity={0.35 * rain} />;
            })}
          <rect x={0} y={-10} width={536} height={420} rx={24} fill={ACCENT} opacity={0.05 * flash} />

          <g transform={`translate(${268} ${BLOCK.y + BLOCK.h / 2}) scale(${blockScale}) translate(${-268} ${-(BLOCK.y + BLOCK.h / 2)})`}>
            <rect x={BLOCK.x} y={BLOCK.y} width={BLOCK.w} height={BLOCK.h} rx={18} fill="#0F1624" stroke={SOFT} strokeWidth={3} />
            <text x={BLOCK.x + 196} y={BLOCK.y + 68} textAnchor="middle" fontFamily={SANS} fontSize={54} fontWeight={800} fill={INK}>
              agent
            </text>
            <g transform={`translate(${BLOCK.x + 58} ${BLOCK.y + 52})`}>
              <g opacity={ghost * ghostA}>
                <Person color={DIM} />
              </g>
              <g opacity={ghost * (1 - ghostA)}>
                <Storm color={DIM} />
              </g>
              <g opacity={pIcon} transform={`scale(${mix(0.4, 1, pIcon)})`}>
                <Person color={tone(onNovel)} />
              </g>
              <g opacity={sIcon} transform={`scale(${mix(0.4, 1, sIcon)})`}>
                <Storm color={tone(onStorm)} />
              </g>
              <g opacity={qIcon}>
                <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontSize={48} fontWeight={800} fill={SOFT}>
                  ?
                </text>
              </g>
              <g opacity={lIcon} transform={`scale(${mix(0.4, 1, lIcon)})`}>
                <Lock color={interpolateColors(onLock, [0, 1], [SOFT, ACCENT])} />
              </g>
            </g>
          </g>

          {strainOn > 0.01 && (
            <g stroke={DIM} strokeWidth={6} opacity={strainOn}>
              <path d={`M8 ${BLOCK.y - 50} Q${8 - bulge} ${BLOCK.y + 52} 8 ${BLOCK.y + BLOCK.h + 50}`} />
              <path d={`M528 ${BLOCK.y - 50} Q${528 + bulge} ${BLOCK.y + 52} 528 ${BLOCK.y + BLOCK.h + 50}`} />
            </g>
          )}

          <Jaw y={BLOCK.y - JAW_H - 8} dx={top1.dx} dy={top1.dy} rot={0} text="Mina is the" color={jawColor} opacity={(1 - set1Out) * (set1In > 0.001 ? 1 : 0)} />
          <Jaw y={BLOCK.y + BLOCK.h + 8} dx={bot1.dx} dy={bot1.dy} rot={0} text="for this novel." color={jawColor} opacity={(1 - set1Out) * (set1In > 0.001 ? 1 : 0)} flip />

          <Jaw
            y={BLOCK.y - JAW_H - 8}
            dx={top2.dx}
            dy={top2.dy}
            rot={top2.rot}
            text="The storm was the"
            color={jawColor}
            opacity={set2Fade * (1 - set2Gone) * (set2In > 0.001 ? 1 : 0)}
          />
          <Jaw
            y={BLOCK.y + BLOCK.h + 8}
            dx={bot2.dx}
            dy={bot2.dy}
            rot={bot2.rot}
            text="of the damage."
            color={jawColor}
            opacity={set2Fade * (1 - set2Gone) * (set2In > 0.001 ? 1 : 0)}
            flip
          />

          <Jaw
            y={BLOCK.y - JAW_H - 8}
            dx={mix(-720, 0, set3In)}
            dy={press(fin.t + 0.15)}
            rot={0}
            text="the sentence"
            color={DIM}
            opacity={set3In > 0.001 ? 1 : 0}
          />
          <Jaw
            y={BLOCK.y + BLOCK.h + 8}
            dx={mix(720, 0, set3In)}
            dy={-press(fin.t + 0.15)}
            rot={0}
            text="is the lock"
            color={DIM}
            opacity={set3In > 0.001 ? 1 : 0}
            flip
          />
        </>
      );
    }}
  </Frame>
);
