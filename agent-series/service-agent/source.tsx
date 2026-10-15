import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, TRAVEL, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#FFC53D";
const spec = raw["service-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const ServiceAgent = () => (
  <Stage slug="service-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const call = pop(frame, fps, 135);
  const found = pop(frame, fps, 330, TRAVEL);
  const phoneHot = Math.max(0, gate(frame, fps, 135, 330));
  const cardHot = Math.max(0, gate(frame, fps, 330, 615));
  const personHot = Math.max(0, gate(frame, fps, 615));
  const phone = mixHex(phoneHot, ACCENT, STEEL);
  const card = mixHex(cardHot, ACCENT, STEEL);
  const person = mixHex(personHot, ACCENT, STEEL);
  const fill = mixHex(personHot, ACCENT, PANEL);
  const cardX = 78 + Math.max(0, found) * 330;
  const cardY = 86 + Math.max(0, found) * 210;
  const rot = -16 * (1 - Math.min(1, Math.max(0, found)));
  const phoneY = 300 - Math.max(0, call) * 118;
  const phoneRot = -28 + Math.max(0, call) * 24;

  return (
    <Field>
      <rect x="36" y="300" width="456" height="78" rx="16" fill={PANEL} stroke={STEEL} strokeWidth="4" />
      <path d="M 360 292 H 470 V 332 H 360 Z" fill="none" stroke={STEEL} strokeWidth="4" />
      <g transform={`translate(${cardX} ${cardY}) rotate(${rot}) scale(${0.92 + Math.max(found, 0) * 0.08})`}>
        <rect x="-40" y="-28" width="80" height="56" rx="8" fill={PANEL} stroke={card} strokeWidth="4" />
        <line x1="-22" y1="-8" x2="22" y2="-8" stroke={card} strokeWidth="3" />
        <line x1="-22" y1="6" x2="10" y2="6" stroke={card} strokeWidth="3" />
      </g>
      <g transform={`translate(176 ${214 + bob(frame, 28, 2)})`}>
        <circle cy="-36" r="20" fill={fill} stroke={person} strokeWidth="4" />
        <path d="M -34 -58 Q 0 -92 34 -58" fill="none" stroke={person} strokeWidth="4" strokeLinecap="round" />
        <circle cx="-24" cy="-36" r="6" fill={PANEL} stroke={person} strokeWidth="3" />
        <circle cx="24" cy="-36" r="6" fill={PANEL} stroke={person} strokeWidth="3" />
        <path d="M 24 -30 Q 40 -8 18 4" fill="none" stroke={person} strokeWidth="3" strokeLinecap="round" />
        <rect x="-28" y="-8" width="56" height="52" rx="8" fill={fill} stroke={person} strokeWidth="4" />
      </g>
      <g transform={`translate(210 ${phoneY}) rotate(${phoneRot})`}>
        <rect x="-16" y="-28" width="32" height="64" rx="12" fill={PANEL} stroke={phone} strokeWidth="4" />
        <circle cy="16" r="4" fill={phone} />
      </g>
    </Field>
  );
}
