import { cuesFor } from "../audio/script";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, arrive, gate, mixHex } from "../src/kit";

const ACCENT = "#D6FF3F";
export const STILL_FRAME = 470;

const CUES = cuesFor("word-tree");

export const WordTree = () => (
  <Stage slug="word-tree" accent={ACCENT} cues={CUES}>
    <Tree />
  </Stage>
);

function Tree() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sway = Math.sin(frame / 18) * 1.7;
  const trunk = gate(frame, fps, 135, 330);
  const bleachOn = gate(frame, fps, 330, 420);
  const secretOn = gate(frame, fps, 420, 510);
  const freeOn = gate(frame, fps, 510, 615);
  const recap = arrive(frame, fps, 615, { damping: 14, stiffness: 90, mass: 0.8 });
  const bleachGrow = arrive(frame, fps, 330);
  const secretGrow = arrive(frame, fps, 420);
  const freeGrow = arrive(frame, fps, 510);
  const tip = arrive(frame, fps, 448, { damping: 7, stiffness: 120, mass: 0.48 });
  const whiten = arrive(frame, fps, 360, { damping: 16, stiffness: 70, mass: 0.9 });
  const snap = arrive(frame, fps, 530, { damping: 8, stiffness: 220, mass: 0.42 });

  const bleachHot = Math.max(bleachOn, recap);
  const secretHot = Math.max(secretOn, recap);
  const freeHot = Math.max(freeOn, recap);

  return (
    <svg width="100%" height="100%" viewBox="0 0 560 470">
      <g transform={`rotate(${sway} 280 430)`}>
        <ellipse cx="280" cy="432" rx="78" ry="14" fill="#1A1E28" />
        <Branch
          d="M 280 430 L 280 300"
          hot={trunk}
          grow={1}
        />
        <Branch
          d="M 280 340 C 230 300, 160 260, 118 196"
          hot={bleachHot}
          grow={bleachGrow}
        />
        <Branch
          d="M 280 328 C 340 280, 410 240, 452 176"
          hot={secretHot}
          grow={secretGrow}
        />
        <Branch
          d="M 280 318 C 250 240, 300 160, 286 92"
          hot={freeHot}
          grow={freeGrow}
        />
        <Bottle x={118} y={186} hot={bleachHot} show={bleachGrow} whiten={whiten} />
        <Cloth x={168} y={228} whiten={whiten} hot={bleachOn} />
        <Spy x={452} y={168} hot={secretHot} show={secretGrow} tip={tip} />
        <FreeFigure x={286} y={86} hot={freeHot} show={freeGrow} snap={snap} />
      </g>
    </svg>
  );
}

function Branch({ d, hot, grow }: { d: string; hot: number; grow: number }) {
  const draw = Math.max(0, Math.min(1, grow));
  const color = mixHex(Math.min(hot, 1), ACCENT, "#3A4150");
  return (
    <g>
      {hot > 0.2 ? (
        <path
          d={d}
          fill="none"
          stroke={ACCENT}
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          opacity={0.35 * Math.min(hot, 1)}
        />
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </g>
  );
}

function Bottle({
  x,
  y,
  hot,
  show,
  whiten,
}: {
  x: number;
  y: number;
  hot: number;
  show: number;
  whiten: number;
}) {
  const s = 0.2 + Math.min(show, 1.2) * 0.8;
  const liquid = mixHex(Math.min(hot, 1), ACCENT, "#9AA3B2");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-7} y={-36} width={14} height={12} rx={2} fill="#E7EBF2" />
      <rect
        x={-16}
        y={-24}
        width={32}
        height={52}
        rx={7}
        fill="#E7EBF2"
        stroke={hot > 0.35 ? ACCENT : "none"}
        strokeWidth={3}
      />
      <rect x={-10} y={-2} width={20} height={22} rx={3} fill={liquid} opacity={0.35 + whiten * 0.65} />
    </g>
  );
}

function Cloth({ x, y, whiten, hot }: { x: number; y: number; whiten: number; hot: number }) {
  const fill = mixHex(Math.min(whiten, 1), "#F4F1EA", "#2C3140");
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M -26 -8 C -10 -18, 14 -16, 28 -4 C 18 16, -8 20, -26 8 Z"
        fill={fill}
        stroke={hot > 0.4 ? ACCENT : "#1A1E28"}
        strokeWidth={2}
      />
    </g>
  );
}

function Spy({
  x,
  y,
  hot,
  show,
  tip,
}: {
  x: number;
  y: number;
  hot: number;
  show: number;
  tip: number;
}) {
  const s = 0.2 + Math.min(show, 1.18) * 0.8;
  const hat = -8 - tip * 28 + Math.sin(tip * 8) * 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -18 18 Q 0 4 22 20" fill="none" stroke="#C5CAD3" strokeWidth={4} strokeLinecap="round" />
      <circle cx={0} cy={6} r={12} fill="#E8C4A8" />
      <g transform={`rotate(${hat} 0 2)`}>
        <ellipse cx={0} cy={2} rx={24} ry={6} fill="#1B1E27" stroke={hot > 0.35 ? ACCENT : "#1B1E27"} strokeWidth={3} />
        <path d="M -12 2 Q -10 -18 0 -20 Q 12 -18 12 2 Z" fill="#1B1E27" stroke={hot > 0.35 ? ACCENT : "#1B1E27"} strokeWidth={3} />
      </g>
    </g>
  );
}

function FreeFigure({
  x,
  y,
  hot,
  show,
  snap,
}: {
  x: number;
  y: number;
  hot: number;
  show: number;
  snap: number;
}) {
  const s = 0.2 + Math.min(show, 1.18) * 0.8;
  const ink = mixHex(Math.min(hot, 1), ACCENT, "#C5CAD3");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={-36} y1={18} x2={-8 - snap * 18} y2={8 - snap * 6} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      <line x1={-6 + snap * 10} y1={6 + snap * 10} x2={8} y2={14} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      <circle cx={16} cy={8} r={10} fill="none" stroke={ink} strokeWidth={3} />
      <path d="M 16 20 L 16 40 M 16 28 L 2 36 M 16 28 L 30 34 M 16 40 L 8 54 M 16 40 L 26 54" fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}
