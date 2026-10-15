import { cuesFor } from "../audio/script";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, arrive, gate, mixHex } from "../src/kit";

const ACCENT = "#FF4D8D";
export const STILL_FRAME = 680;

const CUES = cuesFor("same-cord");

export const SameCord = () => (
  <Stage slug="same-cord" accent={ACCENT} cues={CUES}>
    <CordScene />
  </Stage>
);

function CordScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chaos = arrive(frame, fps, 560, { damping: 13, stiffness: 42, mass: 1.25 });
  const hold = gate(frame, fps, 135, 330);
  const clips = [
    gate(frame, fps, 330, 410),
    gate(frame, fps, 410, 490),
    gate(frame, fps, 490, 560),
    Math.max(gate(frame, fps, 560, 615), arrive(frame, fps, 615)),
  ];
  const shows = [330, 410, 490, 560].map((at) => arrive(frame, fps, at));
  const sway = Math.sin(frame / 15);
  const bob = Math.sin(frame / 11) * (6 + chaos * 4);
  const endX = 250 + sway * (10 + chaos * 26);
  const endY = 430 + bob;
  const d = cordPath(sway, chaos, endX, endY);
  const cordColor = mixHex(Math.min(Math.max(chaos, clips[3]), 1), ACCENT, "#C5CAD3");
  const handColor = mixHex(Math.min(hold, 1), ACCENT, "#E8C4A8");

  return (
    <svg width="100%" height="100%" viewBox="0 0 560 470">
      <path d={d} fill="none" stroke={cordColor} strokeWidth={7} strokeLinecap="round" />
      {chaos > 0.25 ? (
        <path d={d} fill="none" stroke={ACCENT} strokeWidth={16} strokeLinecap="round" opacity={0.22 * Math.min(chaos, 1)} />
      ) : null}
      <Hand x={232} y={6} color={handColor} hot={hold} />
      {[
        ["sole", 330],
        ["mask", 188],
        ["change", 262],
        ["chaos", 330],
      ].map((item, i) => {
        const y = item[1] as number;
        const hot = clips[i];
        const show = shows[i];
        return (
          <g
            key={item[0] as string}
            transform={`translate(${318} ${y + bob * 0.35}) rotate(${chaos * (i - 1.5) * 22}) scale(${0.7 + Math.min(show, 1.16) * 0.35})`}
            opacity={Math.min(1, show * 2)}
          >
            <line x1={-58} y1={16} x2={-8} y2={16} stroke={mixHex(Math.min(hot, 1), ACCENT, "#8E96A3")} strokeWidth={3} />
            <rect
              x={0}
              y={0}
              width={86}
              height={36}
              rx={8}
              fill="#171A22"
              stroke={mixHex(Math.min(hot, 1), ACCENT, "#3A4150")}
              strokeWidth={3}
            />
            <Glyph kind={item[0] as string} hot={hot} />
          </g>
        );
      })}
      <g transform={`translate(${endX} ${endY}) rotate(${chaos * 28 + sway * 4})`}>
        <rect
          x={-28}
          y={-18}
          width={56}
          height={40}
          rx={6}
          fill="#E7EBF2"
          stroke={chaos > 0.4 ? ACCENT : "#C5CAD3"}
          strokeWidth={3}
        />
        <rect x={-8} y={-6} width={16} height={8} rx={2} fill="#1A1E28" />
      </g>
    </svg>
  );
}

function cordPath(sway: number, chaos: number, endX: number, endY: number) {
  const a = 14 + chaos * 54;
  const loop = chaos * 78;
  return [
    `M 250 28`,
    `C ${250 + sway * a} 90, ${250 - sway * a} 130, ${250 + sway * chaos * 16} 180`,
    `C ${250 - a - loop * 0.4} 230, ${250 + loop} 280, ${250 - sway * a} 330`,
    `C ${250 + loop * 0.5} 370, ${endX - loop * 0.25} ${endY - 40}, ${endX} ${endY}`,
  ].join(" ");
}

function Hand({ x, y, color, hot }: { x: number; y: number; color: string; hot: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={8} width={36} height={22} rx={8} fill={color} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={4 + i * 10} y={0} width={8} height={16} rx={3} fill={color} />
      ))}
      {hot > 0.2 ? <circle cx={18} cy={16} r={26} fill="none" stroke={ACCENT} strokeWidth={3} opacity={Math.min(1, hot)} /> : null}
    </g>
  );
}

function Glyph({ kind, hot }: { kind: string; hot: number }) {
  const ink = mixHex(Math.min(hot, 1), ACCENT, "#F6F3EC");
  if (kind === "sole") {
    return <circle cx={43} cy={18} r={8} fill="none" stroke={ink} strokeWidth={3} />;
  }
  if (kind === "mask") {
    return (
      <g fill="none" stroke={ink} strokeWidth={2.5}>
        <path d="M 28 10 Q 43 4 58 10 Q 56 28 43 30 Q 30 28 28 10" />
        <circle cx={36} cy={16} r={2} fill={ink} />
        <circle cx={50} cy={16} r={2} fill={ink} />
      </g>
    );
  }
  if (kind === "change") {
    return (
      <g fill="none" stroke={ink} strokeWidth={2.5}>
        <path d="M 30 14 A 12 12 0 0 1 52 14" />
        <path d="M 52 22 A 12 12 0 0 1 30 22" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={ink} strokeWidth={2.5}>
      <path d="M 30 22 C 36 8, 50 28, 56 12" />
    </g>
  );
}
