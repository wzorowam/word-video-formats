import { cuesFor } from "../audio/script";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SNAP, Stage, arrive, gate, mixHex } from "../src/kit";

const ACCENT = "#FF4A1C";
export const STILL_FRAME = 560;

const CUES = cuesFor("clamp");

export const Clamp = () => (
  <Stage slug="clamp" accent={ACCENT} cues={CUES}>
    <Slot />
  </Stage>
);

function Slot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lock = arrive(frame, fps, 100, { damping: 11, stiffness: 48, mass: 1.1 });
  const release = arrive(frame, fps, 615, SNAP);
  const strain = gate(frame, fps, 500, 615, { damping: 14, stiffness: 90, mass: 0.7 });
  const wobble = Math.sin(frame * 0.85) * 9 * Math.min(strain, 1);
  const idle = Math.sin(frame / 16) * (1 - Math.min(lock, 1)) * 3;
  const topY = 18 + idle + lock * 58 - release * 96 + wobble;
  const botY = 424 - idle - lock * 64 + release * 96 - wobble;
  const barsHot = Math.max(gate(frame, fps, 135, 330), strain, release);
  const bar = mixHex(Math.min(barsHot, 1), ACCENT, "#8E96A3");
  const novel = gate(frame, fps, 330, 390);
  const policy = gate(frame, fps, 390, 450);
  const photo = gate(frame, fps, 450, 500);
  const novelIn = arrive(frame, fps, 330);
  const policyIn = arrive(frame, fps, 348);
  const photoIn = arrive(frame, fps, 366);
  const wind = (frame * 9) % 48;
  const wordPunch = 1 + Math.max(0, lock - 1) * 0.45 - Math.min(release, 1) * 0.04;

  return (
    <svg width="100%" height="100%" viewBox="0 0 560 470">
      <rect x={156} y={92} width={248} height={286} rx={22} fill="#141820" stroke={LINE} strokeWidth={3} />
      {strain > 0.15
        ? [0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={40 + ((wind + i * 36) % 160)}
              y1={120 + i * 48}
              x2={120 + ((wind + i * 36) % 160)}
              y2={100 + i * 48}
              stroke={ACCENT}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.35 + strain * 0.5}
            />
          ))
        : null}
      <g transform={`translate(0 ${wobble * 0.4}) scale(${wordPunch})`} style={{ transformOrigin: "280px 230px" }}>
        <text
          x={280}
          y={246}
          textAnchor="middle"
          fill="#F6F3EC"
          fontFamily="Outfit, sans-serif"
          fontSize={48}
          fontWeight={800}
        >
          agent
        </text>
      </g>
      <Icon x={196} y={300} hot={novel} show={novelIn} kind="novel" shake={wobble} />
      <Icon x={280} y={300} hot={policy} show={policyIn} kind="policy" shake={wobble * 0.8} />
      <Icon x={364} y={300} hot={photo} show={photoIn} kind="photo" shake={wobble * 1.1} />
      <Bar y={topY} color={bar} tilt={wobble * 0.35} />
      <Bar y={botY} color={bar} tilt={-wobble * 0.35} />
    </svg>
  );
}

const LINE = "#2C313C";

function Bar({ y, color, tilt }: { y: number; color: string; tilt: number }) {
  return (
    <rect
      x={132}
      y={y}
      width={296}
      height={24}
      rx={7}
      fill={color}
      transform={`rotate(${tilt} 280 ${y + 12})`}
    />
  );
}

function Icon({
  x,
  y,
  hot,
  show,
  kind,
  shake,
}: {
  x: number;
  y: number;
  hot: number;
  show: number;
  kind: "novel" | "policy" | "photo";
  shake: number;
}) {
  const scale = (0.55 + Math.min(show, 1.2) * 0.55) * (1 + Math.min(hot, 1.15) * 0.18);
  const ink = mixHex(Math.min(hot, 1), ACCENT, "#D5DAE3");
  const enter = Easing.out(Easing.cubic)(Math.min(1, Math.max(0, show)));
  return (
    <g transform={`translate(${x + shake} ${y}) scale(${scale * (0.7 + enter * 0.3)})`} opacity={Math.min(1, show * 2)}>
      {kind === "novel" ? <Book ink={ink} /> : null}
      {kind === "policy" ? <Policy ink={ink} /> : null}
      {kind === "photo" ? <Photo ink={ink} /> : null}
    </g>
  );
}

function Book({ ink }: { ink: string }) {
  return (
    <g fill={ink}>
      <path d="M -26 -16 L -3 -16 L -3 18 L -26 14 Z" />
      <path d="M 3 -16 L 26 -16 L 26 14 L 3 18 Z" />
    </g>
  );
}

function Policy({ ink }: { ink: string }) {
  return (
    <g>
      <rect x={-18} y={-22} width={36} height={44} rx={3} fill={ink} />
      <rect x={-10} y={-12} width={20} height={3} fill="#141820" />
      <rect x={-10} y={-4} width={16} height={3} fill="#141820" />
      <rect x={-10} y={4} width={18} height={3} fill="#141820" />
    </g>
  );
}

function Photo({ ink }: { ink: string }) {
  return (
    <g fill="none" stroke={ink} strokeWidth={3}>
      <rect x={-22} y={-16} width={44} height={34} rx={3} />
      <circle cx={-8} cy={-4} r={4} fill={ink} stroke="none" />
      <path d="M -16 14 L -2 2 L 8 12 L 16 6 L 18 14" fill={ink} stroke="none" />
    </g>
  );
}
