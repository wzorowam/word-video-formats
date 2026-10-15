import raw from "../audio/cues.json";
import { Field, PANEL, STEEL, Stage, bob, gate, mixHex, pop, type Line } from "../src/kit";
import { useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#3EE0FF";
const spec = raw["ai-agent"] as { cues: Line[]; voice: Line[]; sfx: Line[] };

export const AiAgent = () => <Stage slug="ai-agent" accent={ACCENT} cues={spec.cues}><Scene /></Stage>;

function Scene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const look = pop(frame, fps, 135) - pop(frame, fps, 615);
  const toolP = pop(frame, fps, 230);
  const read = pop(frame, fps, 330);
  const reply = pop(frame, fps, 470);
  const eyeHot = Math.max(0, gate(frame, fps, 135, 230) + gate(frame, fps, 615));
  const toolHot = Math.max(0, gate(frame, fps, 230, 330));
  const clockHot = Math.max(0, gate(frame, fps, 330, 470));
  const replyHot = Math.max(0, gate(frame, fps, 470, 615));
  const eye = mixHex(eyeHot, ACCENT, STEEL);
  const tool = mixHex(toolHot, ACCENT, STEEL);
  const clock = mixHex(clockHot, ACCENT, STEEL);
  const bubble = mixHex(replyHot, ACCENT, STEEL);
  const px = look * 18 + Math.sin(frame / 22) * 2;
  const py = look * -12 + Math.cos(frame / 27) * 1.5;
  const tx = 196 + toolP * 176;
  const ty = 292 - toolP * 168;
  const minute = -30 + read * 150 + frame * 0.18;
  const hour = 20 + read * 40;

  return (
    <Field>
      <g transform={`translate(400 118)`}>
        <circle r="64" fill={PANEL} stroke={clock} strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const inner = i % 3 === 0 ? 46 : 50;
          return (
            <line
              key={i}
              x1={Math.sin(a) * inner}
              y1={-Math.cos(a) * inner}
              x2={Math.sin(a) * 56}
              y2={-Math.cos(a) * 56}
              stroke={clock}
              strokeWidth={i % 3 === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
        <line x1="0" y1="0" x2="0" y2="-28" stroke={clock} strokeWidth="4" strokeLinecap="round" transform={`rotate(${hour})`} />
        <line x1="0" y1="0" x2="0" y2="-42" stroke={clock} strokeWidth="3" strokeLinecap="round" transform={`rotate(${minute})`} />
        <circle r="4" fill={clock} />
      </g>
      <g transform={`translate(156 ${228 + bob(frame, 26, 3)})`}>
        <circle r="78" fill={PANEL} stroke={eye} strokeWidth="4" />
        <circle r="30" fill="#0C0E12" stroke={eye} strokeWidth="3" />
        <circle cx={px} cy={py} r="11" fill={eye} />
      </g>
      <g transform={`translate(${tx} ${ty}) rotate(${-30 + toolP * 18})`}>
        <rect x="-7" y="-40" width="14" height="62" rx="7" fill={PANEL} stroke={tool} strokeWidth="4" />
        <circle cy="-46" r="9" fill={tool} />
      </g>
      <g transform={`translate(250 348) scale(${0.82 + Math.max(reply, 0) * 0.18})`} opacity={Math.min(1, Math.max(0, reply) * 1.4)}>
        <rect x="0" y="0" width="150" height="62" rx="20" fill={PANEL} stroke={bubble} strokeWidth="4" />
        <circle cx="40" cy="31" r="5" fill={bubble} />
        <circle cx="75" cy="31" r="5" fill={bubble} />
        <circle cx="110" cy="31" r="5" fill={bubble} />
      </g>
    </Field>
  );
}
