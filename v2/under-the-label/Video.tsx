import { cuesFor } from "../audio/script";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, arrive, gate, mixHex } from "../src/kit";

const ACCENT = "#FF2BD6";
export const STILL_FRAME = 468;

const CUES = cuesFor("under-the-label");

export const UnderTheLabel = () => (
  <Stage slug="under-the-label" accent={ACCENT} cues={CUES}>
    <Peel />
  </Stage>
);

function Peel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pre = interpolate(frame, [310, 330], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const peel = arrive(frame, fps, 330, { damping: 12, stiffness: 55, mass: 1.05 });
  const angle = pre * 10 + peel * 82;
  const curl = Math.min(peel, 1.15) * 36;
  const drop = arrive(frame, fps, 450, { damping: 9, stiffness: 180, mass: 0.55 });
  const hover = interpolate(frame, [432, 450], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nY = -120 - hover * 14 + drop * 134;
  const nHot = Math.max(gate(frame, fps, 450, 540), arrive(frame, fps, 615));
  const countHot = Math.max(gate(frame, fps, 540, 615), arrive(frame, fps, 615) * 0.001 + (frame >= 615 ? arrive(frame, fps, 615) : 0));
  const chipsOn = frame >= 540 ? arrive(frame, fps, 540) : 0;
  const meaning = gate(frame, fps, 135, 330);
  const nColor = mixHex(Math.min(nHot, 1), ACCENT, "#F6F3EC");

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", fontFamily: "Outfit, sans-serif" }}>
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 118,
          width: 488,
          height: 132,
          borderRadius: 18,
          background: "#171A22",
          border: "2px solid #2C313C",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 214,
          width: 46,
          height: 5,
          borderRadius: 4,
          background: ACCENT,
          opacity: Math.min(1, meaning),
          transform: `scaleX(${0.4 + Math.min(meaning, 1) * 0.6})`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 146,
          fontSize: 64,
          fontWeight: 800,
          color: "#F6F3EC",
          letterSpacing: -1,
        }}
      >
        a
        <span style={{ display: "inline-block", width: 52, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 6,
              top: nY,
              color: nColor,
            }}
          >
            n
          </span>
        </span>
        agent
      </div>
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 168,
          width: 86,
          height: 48,
          perspective: 420,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: "0% 60%",
            transform: `rotateY(${-angle}deg) rotateZ(${-angle * 0.22}deg)`,
            background: "linear-gradient(180deg, #F4EFE4 0%, #D5CDBE 100%)",
            borderRadius: 3,
            boxShadow: `${6 + peel * 10}px ${8 + peel * 8}px 14px rgba(0,0,0,0.35)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 28,
              height: "100%",
              transformOrigin: "left center",
              transform: `translateY(${-curl}px) rotateZ(${-curl}deg)`,
              background: "linear-gradient(180deg, #E7E0D2, #C9C0B0)",
              borderRadius: "0 10px 10px 0",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {[1, 2, 3].map((n, i) => {
          const s = arrive(frame, fps, 540 + i * 7);
          const on = Math.max(chipsOn, countHot);
          return (
            <div
              key={n}
              style={{
                width: 74,
                height: 74,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 800,
                color: on > 0.4 ? "#141018" : "#F6F3EC",
                background: mixHex(Math.min(Math.max(on, 0), 1), ACCENT, "#171A22"),
                border: "2px solid #2C313C",
                transform: `translateY(${(1 - s) * 28}px) scale(${0.86 + Math.min(s, 1.18) * 0.16})`,
                opacity: Math.min(1, s * 1.6),
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
