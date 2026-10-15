import { cuesFor } from "../audio/script";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SNAP, Stage, arrive } from "../src/kit";

const ACCENT = "#FF3B6B";
export const STILL_FRAME = 382;

const CUES = cuesFor("shove-test");

export const ShoveTest = () => (
  <Stage slug="shove-test" accent={ACCENT} cues={CUES}>
    <Shove />
  </Stage>
);

function Shove() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wind = interpolate(frame, [150, 318], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const release = arrive(frame, fps, 330, SNAP);
  const open = arrive(frame, fps, 352, { damping: 12, stiffness: 220, mass: 0.45 });
  const back = arrive(frame, fps, 372, { damping: 7, stiffness: 140, mass: 0.55 });
  const pre = interpolate(frame, [344, 352], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arm = -18 - wind * 58 + release * 96;
  const lean = release * 24;
  const breath = Math.sin(frame / 15) * 2.4;
  const door = -pre * 4 * (1 - Math.min(open, 1)) + 34 * open * (1 - back);
  const hot = arrive(frame, fps, 135);

  return (
    <svg width="100%" height="100%" viewBox="0 0 560 470">
      <line x1={40} y1={400} x2={520} y2={400} stroke="#2A303A" strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${lean} ${breath})`}>
        <Maya arm={arm} hot={hot} />
      </g>
      <g transform={`translate(360 400) rotate(${door})`}>
        <rect x={0} y={-250} width={108} height={250} rx={8} fill="#D5DAE3" />
        <circle cx={22} cy={-120} r={5} fill="#1A1E28" />
        <g transform="translate(78 -124)">
          <Key />
        </g>
      </g>
    </svg>
  );
}

function Maya({ arm, hot }: { arm: number; hot: number }) {
  const skin = "#F0C8AE";
  const cloth = "#D7DCE6";
  return (
    <g>
      <rect x={124} y={292} width={16} height={78} rx={7} fill={cloth} />
      <rect x={156} y={292} width={16} height={78} rx={7} fill={cloth} />
      <rect x={116} y={186} width={64} height={118} rx={20} fill={cloth} />
      <circle cx={148} cy={150} r={34} fill={skin} />
      <path d="M 118 154 Q 148 96 182 150 Q 176 118 148 116 Q 122 120 118 154" fill="#2A303A" />
      <g transform={`translate(168 214) rotate(${arm})`}>
        <rect x={0} y={-9} width={92} height={18} rx={9} fill={skin} />
        <circle cx={100} cy={0} r={14} fill={skin} />
        <circle
          cx={100}
          cy={0}
          r={22 + Math.min(hot, 1) * 2}
          fill="none"
          stroke={ACCENT}
          strokeWidth={5}
          opacity={Math.min(1, Math.max(0, hot))}
        />
      </g>
    </g>
  );
}

function Key() {
  return (
    <g fill="none" stroke="#8E96A3" strokeWidth={3} strokeLinecap="round">
      <circle cx={0} cy={0} r={7} />
      <line x1={6} y1={0} x2={22} y2={0} />
      <line x1={16} y1={0} x2={16} y2={7} />
      <line x1={21} y1={0} x2={21} y2={6} />
    </g>
  );
}
