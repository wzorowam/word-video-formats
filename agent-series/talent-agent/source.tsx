import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, TRAVEL, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#FF2E96";
const spec = raw["talent-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const TalentAgent = () => (
  <Stage slug="talent-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = pop(frame, fps, 135);
  const fly = pop(frame, fps, 330, TRAVEL);
  const open = pop(frame, fps, 400);
  const who = Math.max(0, gate(frame, fps, 135, 330) + gate(frame, fps, 615));
  const cardHot = Math.max(0, gate(frame, fps, 330, 615));
  const ink = mixHex(who, ACCENT, STEEL);
  const fill = mixHex(who, ACCENT, PANEL);
  const card = mixHex(cardHot, ACCENT, STEEL);
  const y = 232 + bob(frame, 26, 3);
  const cx = 132 + fly * 236;
  const cy = 168 + fly * 8;
  const part = open * 36;

  return (
    <Field>
      <ellipse cx="168" cy="372" rx="92" ry="16" fill="none" stroke={STEEL} strokeWidth="3" />
      <path d="M 330 360 V 150 Q 420 48 510 150 V 360" fill="none" stroke={STEEL} strokeWidth="4" />
      <polygon
        points="168,48 250,310 86,310"
        fill={ACCENT}
        opacity={Math.max(0, Math.min(0.16, gate(frame, fps, 615) * 0.16))}
      />
      <rect x={346 - part} y="148" width="72" height="190" rx="4" fill="#10141B" stroke={STEEL} strokeWidth="3" />
      <rect x={418 + part} y="148" width="72" height="190" rx="4" fill="#10141B" stroke={STEEL} strokeWidth="3" />
      <g transform={`translate(${cx} ${cy}) rotate(${-8 + fly * 6}) scale(${0.94 + Math.max(fly, 0) * 0.06})`}>
        <rect x="-46" y="-30" width="92" height="60" rx="8" fill={PANEL} stroke={card} strokeWidth="4" />
        <line x1="-28" y1="-8" x2="28" y2="-8" stroke={card} strokeWidth="3" strokeLinecap="round" />
        <line x1="-28" y1="8" x2="16" y2="8" stroke={card} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform={`translate(168 ${y})`}>
        <circle r={86 + Math.max(ring, 0) * 6} fill="none" stroke={ink} strokeWidth="3" opacity={Math.min(1, Math.max(0, ring))} />
        <circle cy="-36" r="22" fill={fill} stroke={ink} strokeWidth="4" />
        <path d="M -28 8 Q 0 -16 28 8 V 78 H -28 Z" fill={fill} stroke={ink} strokeWidth="4" />
        <line x1="28" y1="20" x2="58" y2="6" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <circle cx="66" cy="-2" r="12" fill={PANEL} stroke={ink} strokeWidth="4" />
      </g>
    </Field>
  );
}
