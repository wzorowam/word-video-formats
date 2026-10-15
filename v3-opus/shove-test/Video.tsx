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
} from "../src/kit";

const GROUND = 372;
const HINGE = 424;
const DOOR_W = 118;
const DOOR_TOP = 132;
const rad = (d: number) => (d * Math.PI) / 180;

type Shove = { start: number; wind: number; amp: number; hold: number };
const impactOf = (s: Shove) => s.start + s.wind + 0.24;

const poseP = (t: number, s: Shove) => {
  if (t < s.start) return 0;
  const hit = impactOf(s);
  if (t < s.start + s.wind) return -s.amp * ease(t, s.start, s.start + s.wind, EASE_IO);
  if (t < hit) return mix(-s.amp, 1.14 * s.amp, ease(t, s.start + s.wind, hit, EASE_IN));
  const settle = mix(1.14 * s.amp, s.amp, spring01(t, hit, 0.6, 12));
  return settle * (1 - ease(t, hit + s.hold, hit + s.hold + 0.8, EASE_IO));
};

const doorOpen = (t: number, s: Shove) => {
  const hit = impactOf(s);
  if (t < hit - 0.02) return 0;
  const dt = t - hit;
  const out = ease(t, hit - 0.02, hit + 0.22, EASE_OUT);
  const back = dt < 0.45 ? 1 : Math.exp(-3.2 * (dt - 0.45)) * Math.abs(Math.cos(Math.PI * 1.5 * (dt - 0.45)));
  return s.amp * out * back;
};

type P = [number, number];
const mayaGeom = (p: number, t: number) => {
  const fw = Math.max(0, p);
  const bk = Math.max(0, -p);
  const lean = 15 * fw - 13 * bk + 1.2 * Math.sin(t * 1.8);
  const hip: P = [178 + 14 * fw - 6 * bk, 266];
  const sh: P = [hip[0] + 94 * Math.sin(rad(lean)), hip[1] - 94 * Math.cos(rad(lean))];
  const head: P = [sh[0] + 36 * Math.sin(rad(lean)), sh[1] - 36 * Math.cos(rad(lean))];

  const a1 = 16 + 74 * fw - 78 * bk;
  const b = 12 - 12 * fw + 98 * bk;
  const elbow: P = [sh[0] + 60 * Math.sin(rad(a1)), sh[1] + 60 * Math.cos(rad(a1))];
  const a2 = a1 + b;
  const wrist: P = [elbow[0] + 58 * Math.sin(rad(a2)), elbow[1] + 58 * Math.cos(rad(a2))];

  const c1 = -12 - 28 * fw + 22 * bk;
  const elbow2: P = [sh[0] + 56 * Math.sin(rad(c1)), sh[1] + 56 * Math.cos(rad(c1))];
  const wrist2: P = [elbow2[0] + 52 * Math.sin(rad(c1 + 24)), elbow2[1] + 52 * Math.cos(rad(c1 + 24))];

  const backFoot: P = [hip[0] - 34 - 16 * fw, GROUND];
  const frontFoot: P = [hip[0] + 30 + 22 * fw, GROUND];
  const knee = (f: P, dir: number): P => [(hip[0] + f[0]) / 2 + 9 * dir, (hip[1] + f[1]) / 2];

  return { hip, sh, head, elbow, wrist, elbow2, wrist2, backFoot, frontFoot, knee, a2, fw };
};

const Maya: React.FC<{ p: number; on: number; handOn: number; t: number }> = ({ p, on, handOn, t }) => {
  const { hip, sh, head, elbow, wrist, elbow2, wrist2, backFoot, frontFoot, knee, a2, fw } = mayaGeom(p, t);
  const c = tone(on, INK);
  const pts = (a: [number, number][]) => a.map((q) => q.join(" ")).join(" L");
  const ringR = 22 + 3 * Math.sin(t * 6);
  return (
    <g strokeWidth={9} stroke={c}>
      <path d={`M${pts([hip, knee(backFoot, 1), backFoot])}`} />
      <path d={`M${pts([sh, elbow2, wrist2])}`} opacity={0.75} />
      <path d={`M${pts([hip, sh])}`} strokeWidth={12} />
      <path d={`M${pts([hip, knee(frontFoot, 1), frontFoot])}`} />
      <circle cx={head[0]} cy={head[1]} r={24} fill={BG} strokeWidth={7} />
      <path d={`M${head[0] - 22} ${head[1] - 6} C${head[0] - 18} ${head[1] - 34} ${head[0] + 24} ${head[1] - 30} ${head[0] + 20} ${head[1] - 4}`} strokeWidth={6} fill="none" />
      <path d={`M${head[0] - 20} ${head[1] - 4} C${head[0] - 34} ${head[1] + 6} ${head[0] - 30} ${head[1] + 26} ${head[0] - 20} ${head[1] + 30}`} strokeWidth={7} fill="none" />
      <path d={`M${pts([sh, elbow, wrist])}`} />
      {handOn > 0.01 && (
        <>
          <circle cx={wrist[0] + 4} cy={wrist[1]} r={ringR + 10} fill={ACCENT} opacity={0.12 * handOn} stroke="none" />
          <circle cx={wrist[0] + 4} cy={wrist[1]} r={ringR} stroke={ACCENT} strokeWidth={4} opacity={handOn} fill="none" />
        </>
      )}
      <g transform={`translate(${wrist[0]} ${wrist[1]}) rotate(${a2 - 90 + 90 * (1 - Math.min(1, fw * 1.4))})`} stroke={interpolateColors(handOn, [0, 1], [c, ACCENT])}>
        <rect x={-2} y={-12} width={18} height={24} rx={7} fill={interpolateColors(handOn, [0, 1], [PANEL, "#3A2A08"])} strokeWidth={5} />
      </g>
    </g>
  );
};

export const ShoveTest: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="shove-test" safe={safe}>
    {({ clip, t }) => {
      const meaning = byId(clip, "meaning");
      const shove = byId(clip, "shove");
      const door = byId(clip, "door");
      const hand = byId(clip, "hand");
      const recap = byId(clip, "recap");

      const shoves: Shove[] = [
        { start: shove.t + 0.25, wind: 0.75, amp: 1, hold: 1.6 },
        { start: hand.t + 0.1, wind: 0.36, amp: 0.7, hold: 1.4 },
        { start: recap.t + 0.3, wind: 0.42, amp: 1, hold: 1.8 },
      ];
      const point = 0.42 * ease(t, meaning.t + 0.1, meaning.t + 0.7, EASE_IO) * (1 - ease(t, meaning.end - 0.5, meaning.end + 0.1, EASE_IO));
      const p = point + shoves.reduce((acc, s) => acc + poseP(t, s), 0);
      const g = mayaGeom(p, t);
      const doorWob = Math.exp(-3 * Math.max(0, t - door.t - 0.3)) * Math.sin(Math.max(0, t - door.t - 0.3) * 16) * 0.12 * (t > door.t + 0.3 ? 1 : 0);
      const o = Math.max(0, Math.min(1, shoves.reduce((acc, s) => acc + doorOpen(t, s), 0) + Math.abs(doorWob)));
      const ang = rad(78 * o);
      const edgeX = HINGE - DOOR_W * Math.cos(ang);
      const skew = 18 * Math.sin(ang);

      const onMaya = focusOf(clip, t, "maya");
      const onDoor = focusOf(clip, t, "door");
      const onHand = focusOf(clip, t, "hand");
      const onStart = focusOf(clip, t, "start");

      const arrow = ease(t, meaning.t + 0.3, meaning.t + 1.2, EASE_OUT) * (1 - ease(t, meaning.end - 0.3, meaning.end + 0.2, EASE_IN));
      const originPulse = 1 + 0.25 * Math.sin(t * 7);
      const ox = g.wrist[0] + 20;
      const oy = g.wrist[1];
      const reachLen = Math.max(0, HINGE - DOOR_W - 26 - ox);

      const doorFill = interpolateColors(onDoor, [0, 1], [PANEL, "#3A2A08"]);
      return (
        <>
          <path d="M20 372 H516" stroke={DIM} strokeWidth={3} />
          <rect x={HINGE - DOOR_W - 6} y={DOOR_TOP - 6} width={DOOR_W + 12} height={GROUND - DOOR_TOP + 6} fill="#06090F" stroke={DIM} strokeWidth={3} />
          <path
            d={`M${HINGE} ${DOOR_TOP} L${edgeX} ${DOOR_TOP - skew} L${edgeX} ${GROUND + skew * 0.4} L${HINGE} ${GROUND} Z`}
            fill={doorFill}
            stroke={tone(onDoor, INK)}
            strokeWidth={4}
          />
          <circle cx={mix(edgeX, HINGE, 0.16)} cy={(DOOR_TOP + GROUND) / 2 + 6} r={6} fill={tone(onDoor, INK)} />

          {arrow > 0.01 && (
            <g opacity={arrow}>
              <path
                d={`M${ox} ${oy} L${ox + reachLen * arrow} ${oy}`}
                stroke={SOFT}
                strokeWidth={5}
                strokeDasharray="10 9"
              />
              <path d={`M${ox + reachLen * arrow} ${oy - 10} l14 10 l-14 10`} stroke={SOFT} strokeWidth={5} />
            </g>
          )}

          <Maya p={p} on={onMaya} handOn={onHand} t={t} />
          {onStart > 0.01 && (
            <circle cx={g.wrist[0] + 6} cy={oy} r={11 * originPulse} fill={ACCENT} opacity={onStart} />
          )}

          <SvgTag x={HINGE - 60} y={DOOR_TOP - 40} text="just moves" on={0} show={spring01(t, door.t + 0.5, 0.6, 12) * (1 - ease(t, door.end - 0.3, door.end))} />
          <SvgTag x={150} y={44} text="agent" on={onHand} show={spring01(t, hand.t + 1.6, 0.6, 11)} />
        </>
      );
    }}
  </Frame>
);
