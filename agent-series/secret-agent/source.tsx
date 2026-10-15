import raw from "../audio/cues.json";
import { Field, GROUND, PANEL, STEEL, Stage, TRAVEL, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#FF3B55";
const spec = raw["secret-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const SecretAgent = () => (
  <Stage slug="secret-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = pop(frame, fps, 135, TRAVEL);
  const back = pop(frame, fps, 615, TRAVEL);
  const hide = pop(frame, fps, 330, TRAVEL);
  const figHot = Math.max(0, gate(frame, fps, 135, 330) + gate(frame, fps, 615));
  const noteHot = Math.max(0, gate(frame, fps, 330, 615));
  const fig = mixHex(figHot, ACCENT, STEEL);
  const note = mixHex(noteHot, ACCENT, STEEL);
  const figFill = mixHex(figHot, ACCENT, PANEL);
  const x = 118 + Math.max(0, step - back) * 78;
  const y = 214 + bob(frame, 28, 2.5);
  const nx = 140 + hide * 130;
  const ny = 220 + hide * 90;
  const rot = -14 + hide * 10;

  return (
    <Field>
      <g transform={`translate(${nx} ${ny}) rotate(${rot})`}>
        <rect x="-36" y="-24" width="72" height="48" rx="4" fill={note} />
        <path d="M 18 -24 L 36 -6 L 18 -6 Z" fill={GROUND} />
        <line x1="-20" y1="-4" x2="8" y2="-4" stroke={GROUND} strokeWidth="2" />
        <line x1="-20" y1="6" x2="14" y2="6" stroke={GROUND} strokeWidth="2" />
      </g>
      <rect x="286" y="36" width="176" height="268" rx="8" fill="#10141B" stroke={STEEL} strokeWidth="4" />
      <circle cx="374" cy="120" r="26" fill="#0C0E12" stroke={STEEL} strokeWidth="3" />
      <rect x="240" y="322" width="260" height="40" fill={GROUND} />
      <line x1="230" y1="326" x2="510" y2="326" stroke={STEEL} strokeWidth="3" strokeLinecap="round" />
      <g transform={`translate(${x} ${y})`}>
        <ellipse cx="0" cy="118" rx="34" ry="8" fill="#000" opacity="0.35" />
        <path d="M -30 18 L -40 112 L 40 112 L 30 18 Q 0 40 -30 18 Z" fill={figFill} stroke={fig} strokeWidth="4" />
        <circle cy="-6" r="18" fill={figFill} stroke={fig} strokeWidth="4" />
        <path d="M -12 8 L 0 22 L 12 8" fill="none" stroke={fig} strokeWidth="3" strokeLinecap="round" />
      </g>
    </Field>
  );
}
