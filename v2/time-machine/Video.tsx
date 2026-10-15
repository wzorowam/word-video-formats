import { cuesFor } from "../audio/script";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, arrive, gate, mixHex } from "../src/kit";

const ACCENT = "#8B6CFF";
export const STILL_FRAME = 570;

const CUES = cuesFor("time-machine");

const LABELS = ["doer before 1500", "a force, the 1550s", "a deputy, the 1590s"];

export const TimeMachine = () => (
  <Stage slug="time-machine" accent={ACCENT} cues={CUES}>
    <Dial />
  </Stage>
);

function Dial() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = arrive(frame, fps, 330);
  const s2 = arrive(frame, fps, 430);
  const s3 = arrive(frame, fps, 520);
  const scroll = 250 * (1 - s1) - 290 * s2 - 290 * s3;
  const pointer = gate(frame, fps, 135, 330);
  const big = [
    Math.max(gate(frame, fps, 330, 430), arrive(frame, fps, 615)),
    gate(frame, fps, 430, 520),
    gate(frame, fps, 520, 615),
  ];
  const spin = frame * 1.15;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox="0 0 560 470">
        <g transform={`rotate(${spin} 280 132)`}>
          <circle cx={280} cy={132} r={86} fill="none" stroke="#3A4150" strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={280}
              y1={58}
              x2={280}
              y2={i % 3 === 0 ? 74 : 68}
              stroke="#C5CAD3"
              strokeWidth={i % 3 === 0 ? 4 : 2}
              transform={`rotate(${i * 30} 280 132)`}
            />
          ))}
        </g>
        <circle cx={280} cy={132} r={8} fill="#C5CAD3" />
        <polygon
          points="280,34 270,52 290,52"
          fill={mixHex(Math.min(pointer, 1), ACCENT, "#C5CAD3")}
        />
        <line x1={30} y1={360} x2={530} y2={360} stroke="#3A4150" strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          height: 120,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", height: "100%", transform: `translateX(${scroll}px)` }}>
          {LABELS.map((label, i) => {
            const amount = big[i];
            const scale = 1 + Math.min(amount, 1.2) * 0.28;
            const border = mixHex(Math.min(amount, 1), ACCENT, "#3A4150");
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: 145 + i * 290,
                  top: 18,
                  width: 250,
                  transform: `scale(${scale})`,
                  transformOrigin: "50% 50%",
                  textAlign: "center",
                  color: "#F6F3EC",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  lineHeight: 1.15,
                  padding: "14px 8px",
                  borderRadius: 14,
                  border: `3px solid ${border}`,
                  background: "#141820",
                  boxShadow: amount > 0.35 ? `0 0 16px ${ACCENT}` : "none",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
