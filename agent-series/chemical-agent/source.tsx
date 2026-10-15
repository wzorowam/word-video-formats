import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#D6FF3F";
const spec = raw["chemical-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const ChemicalAgent = () => (
  <Stage slug="chemical-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const form = pop(frame, fps, 330);
  const fallT = Math.min(1, Math.max(0, (frame - 352) / 18));
  const fall = fallT * fallT;
  const splash = pop(frame, fps, 370);
  const lift = pop(frame, fps, 374);
  const liquidHot = Math.max(0, gate(frame, fps, 135, 330) + gate(frame, fps, 615));
  const dropHot = Math.max(0, gate(frame, fps, 330, 615));
  const liquid = mixHex(liquidHot, ACCENT, "#8E97A6");
  const drop = mixHex(dropHot, ACCENT, STEEL);
  const stainScale = 1 - Math.max(0, lift) * 0.72;
  const dropX = 168 + fall * 176;
  const dropY = 108 + fall * 214;
  const dropOp = frame < 370 ? Math.min(1, Math.max(0, form) * 1.3) : Math.max(0, 1 - splash);
  const ringOp = Math.max(0, Math.min(1, splash) * (1 - Math.min(1, Math.max(0, (frame - 420) / 30))));

  return (
    <Field>
      <defs>
        <clipPath id="chem-bottle">
          <rect x="96" y="118" width="100" height="150" rx="24" />
        </clipPath>
      </defs>
      <rect x="210" y="250" width="280" height="160" rx="16" fill={PANEL} stroke={STEEL} strokeWidth="4" />
      <path d="M 236 276 Q 340 310 460 280" fill="none" stroke={STEEL} strokeWidth="2" opacity="0.7" />
      <g transform={`translate(344 328) scale(${Math.max(0.12, stainScale)})`}>
        <ellipse rx="58" ry="36" fill="#3A3036" />
      </g>
      <g opacity={ringOp} transform={`translate(344 332) scale(${0.35 + Math.max(splash, 0) * 0.9})`}>
        <circle r="34" fill="none" stroke={drop} strokeWidth="4" />
      </g>
      <rect x="124" y="28" width="32" height="34" rx="4" fill={PANEL} stroke={STEEL} strokeWidth="4" />
      <rect x="96" y="60" width="88" height="34" rx="8" fill={PANEL} stroke={STEEL} strokeWidth="4" />
      <rect x="86" y="92" width="108" height="176" rx="28" fill={PANEL} stroke={STEEL} strokeWidth="4" />
      <g clipPath="url(#chem-bottle)">
        <rect x="86" y={150 + bob(frame, 20, 2)} width="120" height="140" fill={liquid} />
      </g>
      <circle cx={dropX} cy={dropY} r={8 + Math.max(0, form) * 3} fill={drop} opacity={dropOp} />
    </Field>
  );
}
