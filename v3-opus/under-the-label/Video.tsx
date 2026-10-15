import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
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
  SANS,
  SOFT,
  spring01,
  window01,
} from "../src/kit";

const BASE = 176;
const TAPE = { x: 34, y: 78, w: 128, h: 128 };
const TAPE_FACE = "#CFC6B2";
const TAPE_BACK = "#EDE6D6";

const Glyph: React.FC<{ x: number; y?: number; text: string; color: string; size?: number; opacity?: number }> = ({
  x,
  y = BASE,
  text,
  color,
  size = 100,
  opacity = 1,
}) => (
  <text x={x} y={y} fontFamily={SANS} fontSize={size} fontWeight={800} fill={color} opacity={opacity}>
    {text}
  </text>
);

export const UnderTheLabel: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="under-the-label" safe={safe}>
    {({ clip, t }) => {
      const meaning = byId(clip, "meaning");
      const peel = byId(clip, "peel");
      const an = byId(clip, "an");
      const three = byId(clip, "three");
      const recap = byId(clip, "recap");

      const tease = 0.06 * (0.5 + 0.5 * Math.sin(t * 3.2)) * (1 - ease(t, peel.t, peel.t + 0.2));
      const p = Math.max(tease, ease(t, peel.t + 0.2, peel.t + 1.5, EASE_IO));
      const fly = ease(t, peel.t + 1.5, peel.t + 2.2, EASE_IN);
      const xp = TAPE.x + TAPE.w * p;
      const L = TAPE.w * p;
      const v = { x: -L * 0.72, y: -L * 0.5 };
      const tapeOn = focusOf(clip, t, "peel");

      const drop = spring01(t, an.t + 1.5, 0.75, 8);
      const slide = spring01(t, an.t + 1.45, 0.7, 12);
      const vowel = window01(t, an.t + 0.3, an.t + 1.5, 0.25, 0.25);
      const onN = Math.max(focusOf(clip, t, "n") * ease(t, an.t + 1.5, an.t + 1.7), window01(t, recap.t, recap.t + 1.4, 0.25, 0.25));
      const aX = mix(66, 56, slide);
      const nX = 112;
      const agentX = mix(150, 196, slide);

      const row2 = ease(t, three.t + 0.2, three.t + 0.7, EASE_OUT);
      const sDrop = spring01(t, three.t + 1.4, 0.75, 8);
      const onRow2 = Math.max(focusOf(clip, t, "s"), window01(t, recap.t + 1.4, recap.end, 0.25, 0.25));

      const counts = [0, 1, 2].map((k) => spring01(t, meaning.t + 0.5 + k * 0.4, 0.6, 10) * (1 - ease(t, meaning.end - 0.3, meaning.end + 0.2, EASE_IN)));
      const onCount = focusOf(clip, t, "count");

      const labelTilt = -1.5 + 0.6 * Math.sin(t * 0.8);

      return (
        <>
          <g transform={`rotate(${labelTilt} 268 140)`}>
            <rect x={24} y={40} width={488} height={196} rx={20} fill={PANEL} stroke={SOFT} strokeWidth={3} />
            <rect x={38} y={54} width={460} height={168} rx={12} stroke={DIM} strokeWidth={2} strokeDasharray="6 8" />

            <Glyph x={aX} text="a" color={interpolateColors(onN, [0, 1], [INK, ACCENT])} />
            {drop > 0.001 && (
              <Glyph x={nX} y={BASE - mix(150, 0, drop)} text="n" color={interpolateColors(onN, [0, 1], [INK, ACCENT])} opacity={Math.min(1, drop * 3)} />
            )}
            <text x={agentX} y={BASE} fontFamily={SANS} fontSize={100} fontWeight={800} fill={INK}>
              <tspan fill={interpolateColors(vowel, [0, 1], [INK, ACCENT])}>a</tspan>gent
            </text>

            {fly < 1 && (
              <g opacity={1 - fly} transform={`translate(${-120 * fly} ${-60 * fly}) rotate(${-25 * fly} ${xp} ${TAPE.y})`}>
                <rect x={xp} y={TAPE.y} width={Math.max(0, TAPE.x + TAPE.w - xp)} height={TAPE.h} fill={TAPE_FACE} />
                {[0.25, 0.5, 0.75].map((f) =>
                  TAPE.x + TAPE.w * f > xp ? (
                    <path key={f} d={`M${TAPE.x + TAPE.w * f} ${TAPE.y + 6} v${TAPE.h - 12}`} stroke="#B9AF98" strokeWidth={2} />
                  ) : null,
                )}
                {p > 0.02 && (
                  <>
                    <path
                      d={`M${xp} ${TAPE.y} L${xp + v.x} ${TAPE.y + v.y} L${xp + v.x} ${TAPE.y + TAPE.h + v.y} L${xp} ${TAPE.y + TAPE.h} Z`}
                      fill={TAPE_BACK}
                      stroke={interpolateColors(tapeOn, [0, 1], ["#A89F8A", ACCENT])}
                      strokeWidth={tapeOn > 0.01 ? 4 : 2}
                    />
                    <path d={`M${xp} ${TAPE.y + TAPE.h} L${xp + v.x} ${TAPE.y + TAPE.h + v.y}`} stroke="#00000055" strokeWidth={8} />
                    <rect x={xp - 9} y={TAPE.y - 4} width={18} height={TAPE.h + 8} rx={9} fill="#B7AD95" />
                    <rect x={xp - 4} y={TAPE.y - 2} width={6} height={TAPE.h + 4} rx={3} fill="#F6F1E6" opacity={0.8} />
                  </>
                )}
                {p <= 0.02 && <rect x={TAPE.x} y={TAPE.y} width={TAPE.w} height={TAPE.h} fill="none" stroke={tapeOn > 0.01 ? ACCENT : "#A89F8A"} strokeWidth={tapeOn > 0.01 ? 4 : 2} />}
              </g>
            )}
          </g>

          {counts.map((c, k) => (
            <g key={k} opacity={Math.min(1, c * 2)} transform={`translate(${178 + k * 90} 316) scale(${c})`}>
              <circle r={32} fill={interpolateColors(onCount, [0, 1], [PANEL, ACCENT])} />
              <text y={13} textAnchor="middle" fontFamily={SANS} fontSize={38} fontWeight={800} fill={interpolateColors(onCount, [0, 1], [INK, "#1A1100"])}>
                {k + 1}
              </text>
            </g>
          ))}

          {row2 > 0.001 && (
            <g opacity={row2} transform={`translate(0 ${mix(24, 0, row2)})`}>
              <text x={60} y={344} fontFamily={SANS} fontSize={72} fontWeight={800} fill={interpolateColors(onRow2, [0, 1], [INK, ACCENT])}>
                three agent
              </text>
              {sDrop > 0.001 && (
                <Glyph x={446} y={344 - mix(130, 0, sDrop)} size={72} text="s" color={interpolateColors(onRow2, [0, 1], [INK, ACCENT])} opacity={Math.min(1, sDrop * 3)} />
              )}
            </g>
          )}
        </>
      );
    }}
  </Frame>
);
