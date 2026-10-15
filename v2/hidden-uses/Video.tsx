import { cuesFor } from "../audio/script";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, arrive, gate, mixHex } from "../src/kit";

const ACCENT = "#C6FF3A";
export const STILL_FRAME = 580;

const CUES = cuesFor("hidden-uses");

const ROWS = [
  { y: 58, at: 330, off: 390, kind: "wet" as const },
  { y: 158, at: 390, off: 450, kind: "mix" as const },
  { y: 258, at: 450, off: 520, kind: "thick" as const },
  { y: 358, at: 520, off: 800, kind: "germ" as const },
];

export const HiddenUses = () => (
  <Stage slug="hidden-uses" accent={ACCENT} cues={CUES}>
    <Table />
  </Stage>
);

function Table() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dim = arrive(frame, fps, 548, { damping: 22, stiffness: 70, mass: 1 });
  const meaning = gate(frame, fps, 135, 330);
  const recap = arrive(frame, fps, 615);

  return (
    <svg width="100%" height="100%" viewBox="0 0 560 470">
      <line x1={48} y1={36} x2={48} y2={430} stroke="#2A303A" strokeWidth={4} strokeLinecap="round" />
      <circle cx={48} cy={36} r={8} fill={mixHex(Math.min(meaning, 1), ACCENT, "#C5CAD3")} />
      {ROWS.map((row) => {
        const grow = arrive(frame, fps, row.at);
        const isGerm = row.kind === "germ";
        const local = isGerm
          ? Math.max(gate(frame, fps, row.at), recap)
          : gate(frame, fps, row.at, row.off);
        const faded = isGerm ? 1 : 1 - Math.min(dim, 1) * 0.72;
        const hot = isGerm ? local : local * (1 - Math.min(dim, 1));
        const x2 = 70 + Math.min(grow, 1.12) * 210;
        const color = mixHex(Math.min(Math.max(hot, 0), 1), ACCENT, "#8E96A3");
        return (
          <g key={row.kind} opacity={faded}>
            <line
              x1={48}
              y1={row.y + 28}
              x2={x2}
              y2={row.y + 28}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <g
              transform={`translate(${300} ${row.y}) scale(${0.82 + Math.min(grow, 1.16) * 0.22})`}
              opacity={Math.min(1, grow * 1.8)}
            >
              <Icon kind={row.kind} color={color} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function Icon({ kind, color }: { kind: "wet" | "mix" | "thick" | "germ"; color: string }) {
  if (kind === "wet") {
    return <path d="M 28 8 C 28 8 8 28 8 40 A 20 20 0 0 0 48 40 C 48 28 28 8 28 8 Z" fill={color} />;
  }
  if (kind === "mix") {
    return (
      <g>
        <circle cx={20} cy={32} r={16} fill={color} />
        <circle cx={38} cy={26} r={14} fill={color} opacity={0.75} />
      </g>
    );
  }
  if (kind === "thick") {
    return <rect x={6} y={24} width={48} height={18} rx={9} fill={color} />;
  }
  return (
    <g fill={color}>
      <circle cx={18} cy={22} r={7} />
      <circle cx={34} cy={18} r={5} />
      <circle cx={30} cy={34} r={8} />
      <circle cx={46} cy={30} r={4} />
    </g>
  );
}
