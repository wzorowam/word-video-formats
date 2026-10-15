import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
  ACCENT_INK,
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
  ring,
  SANS,
  SOFT,
  spring01,
  SvgTag,
  tone,
  window01,
} from "../src/kit";

const WIN = { x: 150, y: 96, w: 300, h: 208 };
const SLOT_Y = 252;
const COUNTER_Y = 304;

/** Right hand seen from the side, palm down, reaching left. Origin at the wrist. */
const Hand: React.FC<{ on: number; grip: number }> = ({ on, grip }) => {
  const c = tone(on, INK);
  const fill = interpolateColors(on, [0, 1], ["#1C2638", "#3A2A08"]);
  const curl = mix(0, 7, grip);
  return (
    <g stroke={c} strokeWidth={3.5} fill={fill}>
      <rect x={-6} y={-30} width={190} height={60} rx={8} fill={PANEL} />
      <rect x={-14} y={-32} width={20} height={64} rx={6} fill={BG} />
      <path
        d={`M-14 -22 C-34 -28 -58 -30 -78 -27 L-126 ${-22 + curl} C-138 ${-21 + curl} -140 ${-8 + curl} -128 ${-6 + curl} L-84 -4
            C-90 2 -104 10 -110 ${18 - curl} C-114 ${26 - curl} -104 ${30 - curl} -96 ${26 - curl} L-60 12 C-40 18 -26 22 -14 22 Z`}
      />
      <path d={`M-80 -15 L-124 ${-13 + curl}`} strokeWidth={2.5} fill="none" />
      <path d={`M-80 -9 L-118 ${-7 + curl}`} strokeWidth={2} fill="none" opacity={0.7} />
      <path d="M-44 -26 C-46 -18 -46 -10 -42 -4" strokeWidth={2} fill="none" opacity={0.6} />
    </g>
  );
};

const Ticket: React.FC<{ x: number; y: number; rot: number; on: number; stamp: number; stampOn: number }> = ({
  x,
  y,
  rot,
  on,
  stamp,
  stampOn,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-52} y={-30} width={104} height={60} rx={8} fill="#E9EDF3" stroke={tone(on, INK)} strokeWidth={on > 0.01 ? 4 : 2} />
    <path d="M-30 -30 V30" stroke="#9AA4B2" strokeWidth={2} strokeDasharray="4 5" />
    <text x={12} y={-4} textAnchor="middle" fontFamily={SANS} fontSize={20} fontWeight={800} fill="#121826">
      JOB
    </text>
    <text x={12} y={18} textAnchor="middle" fontFamily={SANS} fontSize={14} fontWeight={600} fill="#4A5568">
      flight
    </text>
    {stamp > 0.01 && (
      <g transform={`rotate(-12) scale(${mix(1.9, 1, stamp)})`} opacity={Math.min(1, stamp * 2)}>
        <rect x={-50} y={-16} width={100} height={32} rx={6} fill={interpolateColors(stampOn, [0, 1], ["#2A3446", ACCENT])} />
        <text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontSize={20} fontWeight={800} fill={interpolateColors(stampOn, [0, 1], [INK, ACCENT_INK])}>
          BOOKED
        </text>
      </g>
    )}
  </g>
);

export const PassingHand: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="passing-hand" safe={safe}>
    {({ clip, t }) => {
      const meaning = byId(clip, "meaning");
      const ticket = byId(clip, "ticket");
      const booked = byId(clip, "booked");
      const room = byId(clip, "room");
      const recap = byId(clip, "recap");

      const tk = ticket.t;
      const push = ease(t, tk + 0.2, tk + 0.9, EASE_IO);
      const reach = spring01(t, tk + 0.8, 0.7, 13);
      const carry = ease(t, tk + 1.6, tk + 2.5, EASE_IO);
      const settle = ring(t, tk + 2.5, 5, 1.8, 4);
      const give = ease(t, recap.t + 1.4, recap.t + 2.3, EASE_IO);
      const giveBack = ease(t, recap.t + 2.5, recap.t + 3.2, EASE_IO);

      const restWrist = 452;
      const reachWrist = 300;
      const HS = 1.22;
      const wave = ring(t, meaning.t + 0.3, 7, 1.6, 2.5);
      const bob = 2 * Math.sin(t * 2.1);
      let wristX = restWrist;
      if (t < tk + 1.6) wristX = mix(restWrist, reachWrist, reach);
      else if (t < recap.t + 1.4) wristX = mix(reachWrist, restWrist, carry) + settle;
      else wristX = mix(restWrist, reachWrist + 20, give) + mix(0, restWrist - reachWrist - 20, giveBack);
      const grip = t < tk + 1.45 ? 0 : t < recap.t + 2.3 ? 1 : 1 - ease(t, recap.t + 2.3, recap.t + 2.5);

      const tipX = wristX - 128 * HS;
      const yourX = mix(76, 112, push);
      const held = t >= tk + 1.45 && t < recap.t + 2.35;
      const ty = SLOT_Y + 22 - (held ? 6 : 0);
      const released = recap.t + 2.35;
      const ticketX = held
        ? tipX - 30
        : t >= released
          ? mix(reachWrist + 20 - 128 * HS - 30, 84, ease(t, released, released + 0.45, EASE_OUT))
          : yourX;

      const onHand = Math.max(
        focusOf(clip, t, "hand"),
        window01(t, tk + 1.3, ticket.end, 0.3, 0.25),
        window01(t, recap.t, recap.t + 1.6, 0.3, 0.3),
      );
      const onTicket = window01(t, tk + 0.1, tk + 1.3, 0.3, 0.25);
      const onSign = Math.max(focusOf(clip, t, "sign"), window01(t, recap.t + 1.6, recap.end, 0.3, 0.3));
      const stamp = spring01(t, booked.t + 0.45, 0.55, 10);
      const stampOn = focusOf(clip, t, "booked");
      const signPop = 1 + 0.06 * Math.sin(Math.PI * ease(t, room.t + 0.2, room.t + 0.7));
      const roomGlow = focusOf(clip, t, "sign");

      return (
        <>
          <rect x={18} y={COUNTER_Y} width={500} height={18} rx={6} fill={PANEL} stroke={DIM} strokeWidth={2} />
          <rect
            x={WIN.x}
            y={WIN.y}
            width={WIN.w}
            height={WIN.h}
            rx={10}
            fill="#0E1522"
            stroke={interpolateColors(onSign, [0, 1], [DIM, ACCENT])}
            strokeWidth={mix(4, 5, onSign)}
          />
          {roomGlow > 0.01 && <rect x={WIN.x - 8} y={WIN.y - 8} width={WIN.w + 16} height={WIN.h + 16} rx={16} stroke={ACCENT} strokeWidth={14} opacity={0.12 * roomGlow} />}
          <g stroke={DIM} strokeWidth={3} transform={`translate(0 ${1.5 * Math.sin(t * 1.3)})`}>
            <circle cx={WIN.x + 214} cy={WIN.y + 62} r={24} />
            <path d={`M${WIN.x + 168} ${SLOT_Y - 24} C${WIN.x + 168} ${WIN.y + 100} ${WIN.x + 260} ${WIN.y + 100} ${WIN.x + 260} ${SLOT_Y - 24}`} />
          </g>
          <path d={`M${WIN.x + 26} ${WIN.y + 18} L${WIN.x + 70} ${WIN.y + 18} M${WIN.x + 26} ${WIN.y + 34} L${WIN.x + 50} ${WIN.y + 34}`} stroke={DIM} strokeWidth={3} />

          <g transform={`translate(${268} ${48}) scale(${signPop}) translate(${-268} ${-48})`}>
            <rect x={160} y={20} width={216} height={56} rx={10} fill={interpolateColors(onSign, [0, 1], [PANEL, ACCENT])} stroke={interpolateColors(onSign, [0, 1], [SOFT, ACCENT])} strokeWidth={3} />
            <text x={268} y={59} textAnchor="middle" fontFamily={SANS} fontSize={32} fontWeight={800} letterSpacing={6} fill={interpolateColors(onSign, [0, 1], [INK, ACCENT_INK])}>
              AGENCY
            </text>
          </g>

          <defs>
            <clipPath id="ph-room">
              <rect x={-200} y={WIN.y + 4} width={WIN.x + WIN.w - 4 + 200} height={WIN.h - 4} />
            </clipPath>
          </defs>
          <g clipPath="url(#ph-room)">
            <g transform={`translate(${wristX} ${SLOT_Y + 14 + bob}) rotate(${wave}) scale(${HS})`}>
              <Hand on={onHand} grip={grip} />
            </g>
          </g>
          <Ticket x={ticketX} y={ty} rot={held ? -4 : mix(0, -3, push)} on={onTicket} stamp={stamp} stampOn={stampOn} />
          <rect x={WIN.x + 4} y={WIN.y + 4} width={WIN.w - 8} height={SLOT_Y - WIN.y - 26} rx={6} fill="#9FB4D0" opacity={0.08} />
          <path d={`M${WIN.x + 4} ${SLOT_Y - 22} H${WIN.x + WIN.w - 4}`} stroke={SOFT} strokeWidth={3} />

          <SvgTag x={62} y={COUNTER_Y + 62} text="you" on={0} show={ease(t, 0.2, 0.8, EASE_OUT)} />
          <SvgTag x={WIN.x + WIN.w - 70} y={COUNTER_Y + 62} text="agent" on={window01(t, recap.t, recap.t + 1.6, 0.3, 0.3)} show={spring01(t, meaning.t + 0.3, 0.6, 12)} />
          <SvgTag x={16} y={150} anchor="start" text="the room" on={0} show={spring01(t, room.t + 0.6, 0.6, 12) * (1 - ease(t, recap.end - 0.5, recap.end, EASE_IN))} />
        </>
      );
    }}
  </Frame>
);
