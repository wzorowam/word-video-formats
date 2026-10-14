import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { agentPulses, type Pilot } from "./cue";

export const BG = "#070B14";
export const CYAN = "#22D3EE";
export const WHITE = "#F4F7FB";
export const MUTED = "#8E99A8";
export const BLOCK = "#161E2C";
export const BLOCK_LINE = "#2A3548";
export const SANS = "Outfit, Liberation Sans, Arial, sans-serif";
export const CREDIT = "CA.EYE agents";

export const CARD = { x: 150, y: 390, w: 780, h: 460 };

let fontReady = false;

export const useOutfit = () => {
  const [handle] = useState(() => delayRender("Outfit"));
  useEffect(() => {
    if (fontReady) {
      continueRender(handle);
      return;
    }
    const face = new FontFace("Outfit", `url(${staticFile("fonts/Outfit.ttf")})`, {
      weight: "100 900",
    });
    face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        fontReady = true;
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
};

export const Eye: React.FC<{ size?: number }> = ({ size = 132 }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 120 74" fill="none">
    <path
      d="M8 37 C28 8 92 8 112 37 C92 66 28 66 8 37 Z"
      stroke={CYAN}
      strokeWidth={2.4}
    />
    <circle cx={60} cy={37} r={14} stroke={CYAN} strokeWidth={2.4} />
    <circle cx={60} cy={37} r={5} fill={CYAN} />
  </svg>
);

const Bracket: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: 28,
      height: 28,
      borderColor: CYAN,
      borderStyle: "solid",
      borderWidth: 0,
      ...style,
    }}
  />
);

export const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: 36,
      padding: "0 12px",
      background: CYAN,
      color: "#062028",
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {text}
  </div>
);

export const GreyBlock: React.FC<{
  top: number;
  left: number;
  width: number;
  height: number;
  lines?: number;
  active?: boolean;
  label?: string;
}> = ({ top, left, width, height, lines = 3, active, label }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      width,
      height,
      borderRadius: 18,
      background: BLOCK,
      boxShadow: active ? `0 0 0 2px ${CYAN}, 0 0 32px rgba(34,211,238,0.25)` : "none",
    }}
  >
    {label && (
      <div style={{ position: "absolute", left: 18, top: -18 }}>
        <Tag text={label} />
      </div>
    )}
    <div style={{ padding: "28px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 12,
            width: i === lines - 1 ? "58%" : "100%",
            borderRadius: 6,
            background: BLOCK_LINE,
          }}
        />
      ))}
    </div>
  </div>
);

export const Stage: React.FC<{
  caption: string;
  tag: string;
  numeral: string;
  heading: React.ReactNode;
  children?: React.ReactNode;
}> = ({ caption, tag, numeral, heading, children }) => {
  useOutfit();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: BG,
        fontFamily: SANS,
        color: WHITE,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          color: MUTED,
          fontSize: 22,
          letterSpacing: 3.2,
          fontWeight: 500,
        }}
      >
        {CREDIT}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 18,
              width: 180,
              height: 64,
              transform: "translateX(-50%)",
              background: CYAN,
              filter: "blur(26px)",
              opacity: 0.35,
            }}
          />
          <Eye />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 390,
          top: 196,
          width: 300,
          height: 230,
          background: "linear-gradient(180deg, rgba(34,211,238,0.42), rgba(34,211,238,0))",
          clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
          filter: "blur(0.5px)",
        }}
      />
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h }}>
        <Bracket style={{ left: -8, top: -8, borderTopWidth: 2, borderLeftWidth: 2 }} />
        <Bracket style={{ right: -8, top: -8, borderTopWidth: 2, borderRightWidth: 2 }} />
        <Bracket style={{ left: -8, bottom: -8, borderBottomWidth: 2, borderLeftWidth: 2 }} />
        <Bracket style={{ right: -8, bottom: -8, borderBottomWidth: 2, borderRightWidth: 2 }} />
        <div style={{ position: "absolute", left: 0, top: -18 }}>
          <Tag text={tag} />
        </div>
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960,
          textAlign: "center",
          color: CYAN,
          fontWeight: 700,
          fontSize: 112,
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        {numeral}
      </div>
      <div
        style={{
          position: "absolute",
          left: 400,
          top: 1092,
          width: 280,
          height: 3,
          background: CYAN,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1120,
          textAlign: "center",
          color: WHITE,
          fontWeight: 700,
          fontSize: 64,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {heading}
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 1560,
          textAlign: "center",
          color: MUTED,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.25,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

export const AgentWord: React.FC<{
  pilot: Pilot;
  t: number;
  text?: string;
}> = ({ pilot, t, text = "AGENT" }) => {
  const pulses = agentPulses(pilot);
  let scale = 1;
  for (const p of pulses) {
    const dt = t - p;
    if (dt >= 0 && dt < 0.4) scale = 1 + 0.06 * Math.sin((dt / 0.4) * Math.PI);
  }
  return <span style={{ display: "inline-block", transform: `scale(${scale})` }}>{text}</span>;
};

export const stepNo = (i: number) => String(i + 1).padStart(2, "0");
