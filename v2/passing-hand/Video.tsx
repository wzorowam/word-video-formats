import { cuesFor } from "../audio/script";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, arrive, mixHex } from "../src/kit";

const ACCENT = "#2EE6A6";
export const STILL_FRAME = 352;

const CUES = cuesFor("passing-hand");

export const PassingHand = () => (
  <Stage slug="passing-hand" accent={ACCENT} cues={CUES}>
    <Counter />
  </Stage>
);

function Counter() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reach = interpolate(frame, [135, 300], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pull = interpolate(frame, [304, 330], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pass = arrive(frame, fps, 330);
  const bob = Math.sin(frame / 13) * 3.5;
  const handAmt = Math.max(0, arrive(frame, fps, 135) - arrive(frame, fps, 330));
  const ticketAmt = Math.max(0, arrive(frame, fps, 330) - arrive(frame, fps, 615));
  const roomAmt = arrive(frame, fps, 615);
  const base = 78 + reach * 36 - pull * 28;
  const ticketX = base + pass * 300;
  const handX = base + Math.min(pass, 1.05) * 210 - Math.max(0, pass - 0.72) * 40;
  const sign = mixHex(Math.min(roomAmt, 1), ACCENT, "#8E94A0");
  const frameStroke = mixHex(Math.min(roomAmt, 1), ACCENT, "#2A303A");

  return (
    <svg width="100%" height="100%" viewBox="0 0 560 470">
      <rect x={36} y={28} width={488} height={340} rx={18} fill="#12151C" stroke={frameStroke} strokeWidth={4} />
      <text
        x={280}
        y={128}
        textAnchor="middle"
        fill={sign}
        fontFamily="Outfit, sans-serif"
        fontSize={44}
        fontWeight={800}
        letterSpacing={2}
      >
        AGENCY
      </text>
      <rect x={420} y={292} width={70} height={28} rx={6} fill="#1C212C" stroke="#3A4150" strokeWidth={2} />
      <line x1={48} y1={328} x2={512} y2={328} stroke="#3A4150" strokeWidth={6} strokeLinecap="round" />
      <g transform={`translate(${ticketX} ${214 + bob})`}>
        <Ticket hot={ticketAmt} />
      </g>
      <g transform={`translate(${handX} ${236 + bob}) rotate(${-10 + Math.min(pass, 1) * 18})`}>
        <Hand hot={handAmt} />
      </g>
    </svg>
  );
}

function Hand({ hot }: { hot: number }) {
  const skin = "#E8C4A8";
  return (
    <g>
      <rect x={-6} y={26} width={22} height={11} rx={5} fill={skin} transform="rotate(-32 -6 30)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={8 + i * 13} y={-6} width={11} height={36} rx={5} fill={skin} />
      ))}
      <rect x={6} y={22} width={58} height={48} rx={16} fill={skin} />
      <rect
        x={-4}
        y={-14}
        width={74}
        height={92}
        rx={22}
        fill="none"
        stroke={ACCENT}
        strokeWidth={4}
        opacity={Math.min(1, hot)}
        transform={`scale(${0.92 + Math.min(hot, 1.15) * 0.08})`}
        style={{ transformOrigin: "34px 32px" }}
      />
    </g>
  );
}

function Ticket({ hot }: { hot: number }) {
  const stroke = mixHex(Math.min(hot, 1), ACCENT, "#C8C2B6");
  return (
    <g>
      <rect
        x={0}
        y={0}
        width={78}
        height={48}
        rx={7}
        fill="#F3EFE6"
        stroke={stroke}
        strokeWidth={hot > 0.2 ? 4 : 2}
      />
      <rect x={10} y={12} width={40} height={4} rx={2} fill="#1A1E28" />
      <rect x={10} y={22} width={28} height={4} rx={2} fill="#1A1E28" />
      <rect x={10} y={32} width={34} height={4} rx={2} fill="#1A1E28" />
    </g>
  );
}
