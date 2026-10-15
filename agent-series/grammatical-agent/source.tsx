import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, TRAVEL, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#6AA4FF";
const spec = raw["grammatical-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const GrammaticalAgent = () => (
  <Stage slug="grammatical-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chase = pop(frame, fps, 330, TRAVEL);
  const dogHot = Math.max(0, gate(frame, fps, 135));
  const ink = mixHex(dogHot, ACCENT, STEEL);
  const fill = mixHex(dogHot, ACCENT, PANEL);
  const dogX = 110 + Math.max(0, chase) * 190;
  const ballX = 250 + Math.max(0, chase) * 170;
  const run = Math.min(1, Math.max(0, chase) * 1.4);
  const step = Math.sin(frame / 3.5) * run * 18;
  const wag = Math.sin(frame / 5) * (10 + run * 8);

  return (
    <Field>
      <line x1="36" y1="340" x2="492" y2="340" stroke={STEEL} strokeWidth="3" strokeLinecap="round" />
      <g transform={`translate(${ballX} 316) rotate(${ballX})`}>
        <circle r="18" fill={PANEL} stroke={STEEL} strokeWidth="4" />
        <path d="M -12 -4 Q 0 10 12 -4" fill="none" stroke={STEEL} strokeWidth="3" />
      </g>
      <g transform={`translate(${dogX} ${292 + bob(frame, 30, 2)})`}>
        <ellipse cx="0" cy="8" rx="58" ry="30" fill={fill} stroke={ink} strokeWidth="4" />
        <circle cx="50" cy="-22" r="22" fill={fill} stroke={ink} strokeWidth="4" />
        <ellipse cx="62" cy="-40" rx="8" ry="14" fill={fill} stroke={ink} strokeWidth="3" />
        <circle cx="58" cy="-24" r="2.5" fill={ink} />
        <line x1="-24" y1="32" x2={-28 + step} y2="58" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <line x1="8" y1="32" x2={12 - step} y2="58" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <line x1="-52" y1="-4" x2="-86" y2={-18 + wag} stroke={ink} strokeWidth="4" strokeLinecap="round" />
      </g>
    </Field>
  );
}
