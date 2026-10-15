import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, TRAVEL, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#2EE6B0";
const spec = raw["someones-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const SomeonesAgent = () => (
  <Stage slug="someones-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

const SIGN = "M 18 48 C 40 12, 52 70, 74 36 S 118 16, 150 44";

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const formIn = pop(frame, fps, 135);
  const draw = pop(frame, fps, 330, TRAVEL);
  const joHot = Math.max(0, gate(frame, fps, 135, 330) + gate(frame, fps, 615));
  const signHot = Math.max(0, gate(frame, fps, 330, 615));
  const jo = mixHex(joHot, ACCENT, STEEL);
  const joFill = mixHex(joHot, ACCENT, PANEL);
  const ink = mixHex(signHot, ACCENT, STEEL);
  const pen = Math.max(0, Math.min(1.15, draw));
  const penX = 18 + pen * 132;
  const penY = 48 + Math.sin(pen * Math.PI) * -18;

  return (
    <Field>
      <g transform="translate(48 168)" fill="none" stroke={STEEL} strokeWidth="4" strokeLinejoin="round">
        <path d="M 16 28 H 86 V 118 H 16 Z" />
        <path d="M 16 28 V 4 H 86 V 28" />
        <line x1="28" y1="118" x2="28" y2="156" />
        <line x1="74" y1="118" x2="74" y2="156" />
      </g>
      <g transform={`translate(188 ${128 + (1 - Math.min(formIn, 1)) * 16}) scale(${0.94 + Math.max(formIn, 0) * 0.06})`}>
        <rect x="0" y="0" width="176" height="120" rx="10" fill={PANEL} stroke={STEEL} strokeWidth="4" />
        <line x1="18" y1="28" x2="150" y2="28" stroke={STEEL} strokeWidth="3" />
        <line x1="18" y1="48" x2="120" y2="48" stroke={STEEL} strokeWidth="3" />
        <path
          d={SIGN}
          fill="none"
          stroke={ink}
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={180}
          strokeDasharray="180"
          strokeDashoffset={180 * (1 - Math.max(0, Math.min(1, draw)))}
        />
        <g transform={`translate(${penX} ${penY})`} opacity={draw > 0.04 ? 1 : 0}>
          <rect x="-3" y="-16" width="6" height="20" rx="2" fill={ink} />
        </g>
      </g>
      <g transform={`translate(430 ${236 + bob(frame, 26, 2.5)})`}>
        <circle cy="-52" r="18" fill={joFill} stroke={jo} strokeWidth="4" />
        <path d="M -26 -20 H 26 V 48 H -26 Z" fill={joFill} stroke={jo} strokeWidth="4" />
        <line x1="-8" y1="48" x2="-12" y2="92" stroke={jo} strokeWidth="4" strokeLinecap="round" />
        <line x1="10" y1="48" x2="14" y2="92" stroke={jo} strokeWidth="4" strokeLinecap="round" />
      </g>
    </Field>
  );
}
