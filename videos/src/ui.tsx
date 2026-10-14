import React from "react";
import { agentPulses, pilots, type Pilot } from "./cue";

export const SANS = "Liberation Sans, Arial, sans-serif";
export const MONO = "JetBrains Mono, Liberation Mono, monospace";
export const CREDIT = "CA.EYE agents";

export const Cap: React.FC<{ text: string; light?: boolean; top?: number }> = ({
  text,
  light,
  top = 1468,
}) => (
  <div
    style={{
      position: "absolute",
      left: 64,
      width: 860,
      top,
      minHeight: 78,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 44,
      lineHeight: 1.15,
      color: light ? "#f6f1e7" : "#14120f",
      background: light ? "rgba(10,10,12,0.78)" : "rgba(255,252,247,0.94)",
      borderRadius: 18,
      padding: "12px 18px",
      boxSizing: "border-box",
    }}
  >
    {text}
  </div>
);

export const AgentWord: React.FC<{
  pilot: Pilot;
  t: number;
  text?: string;
  style?: React.CSSProperties;
}> = ({ pilot, t, text = "AGENT", style }) => {
  const pulses = agentPulses(pilot);
  let scale = 1;
  for (const p of pulses) {
    const dt = t - p;
    if (dt >= 0 && dt < 0.42) {
      scale = 1 + 0.16 * Math.sin((dt / 0.42) * Math.PI);
    }
  }
  return (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 800,
        letterSpacing: -1,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const Bottle: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={18} y={0} width={28} height={18} rx={4} fill="#d9e4ef" stroke="#1d2430" strokeWidth={4} />
    <rect x={0} y={16} width={64} height={92} rx={10} fill="#9fd0ea" stroke="#1d2430" strokeWidth={4} />
    <path d="M8 70 H56" stroke="#f4efe6" strokeWidth={8} />
  </g>
);

export const Spy: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={32} cy={28} rx={26} ry={10} fill="#1b1b1f" />
    <circle cx={32} cy={48} r={16} fill="#f0d2b4" stroke="#1b1b1f" strokeWidth={4} />
    <path d="M8 78 H56 L48 120 H16 Z" fill="#2a2a32" stroke="#1b1b1f" strokeWidth={4} />
  </g>
);
