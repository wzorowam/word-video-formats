import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#E08BFF";
const spec = raw["change-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const ChangeAgent = () => (
  <Stage slug="change-agent" accent={ACCENT} cues={spec.cues}>
    <Scene />
  </Stage>
);

const XS = [54, 156, 258, 360, 462];

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rises = [
    pop(frame, fps, 366),
    pop(frame, fps, 342),
    pop(frame, fps, 135),
    pop(frame, fps, 342),
    pop(frame, fps, 366),
  ];
  const groupHot = Math.max(0, gate(frame, fps, 330, 615));
  const leadHot = Math.max(0, gate(frame, fps, 135, 330) + gate(frame, fps, 615));
  const gather = pop(frame, fps, 330);
  const points = XS.map((x, i) => {
    const cluster = (258 - x) * Math.max(0, gather) * 0.22;
    const rise = i === 2 ? Math.max(0, rises[i]) * 150 : Math.max(0, rises[i]) * 108;
    return {
      x: x + cluster,
      y: 300 - rise + bob(frame, 26 + i, 2),
      hot: i === 2 ? Math.max(leadHot, groupHot) : groupHot,
    };
  });

  return (
    <Field>
      {points.slice(0, -1).map((p, i) => (
        <line
          key={i}
          x1={p.x}
          y1={p.y + 8}
          x2={points[i + 1].x}
          y2={points[i + 1].y + 8}
          stroke={STEEL}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      {points.map((p, i) => {
        const stroke = mixHex(Math.max(0, p.hot), ACCENT, STEEL);
        const fill = mixHex(Math.max(0, p.hot), ACCENT, PANEL);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle cy="-18" r="12" fill={fill} stroke={stroke} strokeWidth="3" />
            <path d="M -18 20 Q 0 -4 18 20" fill={fill} stroke={stroke} strokeWidth="3" />
          </g>
        );
      })}
    </Field>
  );
}
