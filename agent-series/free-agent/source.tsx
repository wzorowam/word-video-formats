import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, TRAVEL, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#FF8A1E";
const spec = raw["free-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const FreeAgent = () => (
  <Stage slug="free-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

function Shield({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x} ${y + 8} l 16 -10 l 16 10 v 20 l -16 12 l -16 -12 z`}
      fill={PANEL}
      stroke={STEEL}
      strokeWidth="3"
    />
  );
}

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const release = pop(frame, fps, 135);
  const run = pop(frame, fps, 330, TRAVEL);
  const dealHot = Math.max(0, gate(frame, fps, 135, 330));
  const playerHot = Math.max(0, gate(frame, fps, 330, 615));
  const deal = mixHex(dealHot, ACCENT, STEEL);
  const player = mixHex(playerHot, ACCENT, STEEL);
  const body = mixHex(playerHot, ACCENT, PANEL);
  const x = 150 + run * 150;
  const step = Math.sin(frame / 4) * Math.min(1, Math.max(0, run) * 2) * 16;
  const paperX = 118 + release * 36 + run * 150;
  const link = Math.max(0, 1 - release);

  return (
    <Field>
      <Shield x={78} y={36} />
      <Shield x={246} y={36} />
      <Shield x={414} y={36} />
      <line
        x1="110"
        y1="78"
        x2={118 + release * 20}
        y2={150}
        stroke={STEEL}
        strokeWidth="3"
        opacity={link}
        strokeLinecap="round"
      />
      <g transform={`translate(${paperX} 132) rotate(${-6 + release * 4})`}>
        <rect x="0" y="0" width="78" height="52" rx="6" fill={PANEL} stroke={deal} strokeWidth="4" />
        <line x1="12" y1="16" x2="64" y2="16" stroke={deal} strokeWidth="3" />
        <line x1="12" y1="30" x2="48" y2="30" stroke={deal} strokeWidth="3" />
      </g>
      <g transform={`translate(${x} ${248 + bob(frame, 22, 2)})`}>
        <circle cy="-48" r="18" fill={body} stroke={player} strokeWidth="4" />
        <path d="M -26 -16 h 52 v 46 h -52 z" fill={body} stroke={player} strokeWidth="4" />
        <line x1="-12" y1="30" x2={-16 - step} y2="78" stroke={player} strokeWidth="4" strokeLinecap="round" />
        <line x1="12" y1="30" x2={16 + step} y2="78" stroke={player} strokeWidth="4" strokeLinecap="round" />
        {([0, 1, 2, 3] as const).map((i) => {
          const pay = pop(frame, fps, 615 + i * 5);
          const mark = mixHex(Math.max(0, pay), ACCENT, STEEL);
          const fill = mixHex(Math.max(0, pay), ACCENT, PANEL);
          return (
            <circle
              key={i}
              cx={-27 + i * 18}
              cy="100"
              r={6 + Math.max(0, pay) * 1.5}
              fill={fill}
              stroke={mark}
              strokeWidth="3"
            />
          );
        })}
      </g>
      <line x1="40" y1="360" x2="490" y2="360" stroke={STEEL} strokeWidth="3" strokeLinecap="round" />
    </Field>
  );
}
