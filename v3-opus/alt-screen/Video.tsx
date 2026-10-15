import React from "react";
import { interpolateColors } from "remotion";
import {
  ACCENT,
  byId,
  DIM,
  EASE_IN,
  ease,
  focusOf,
  Frame,
  INK,
  type Line,
  mix,
  PANEL,
  type ClipProps,
  SANS,
  SOFT,
  spring01,
  window01,
} from "../src/kit";

const MONO = "JetBrains Mono, DejaVu Sans Mono, monospace";
const PAD = 28;
const ROW_H = 54;

type Row = { a: string; b: string; on: number };

const Rows: React.FC<{ x: number; y: number; w: number; rows: Row[] }> = ({ x, y, w, rows }) => (
  <>
    {rows.map((r, k) => {
      const ry = y + k * ROW_H;
      return (
        <g key={k}>
          {r.on > 0.01 && (
            <>
              <rect x={x - 6} y={ry - 34} width={w + 12} height={ROW_H - 6} rx={8} fill={ACCENT} opacity={0.13 * r.on} />
              <rect x={x - 6} y={ry - 34} width={w + 12} height={ROW_H - 6} rx={8} stroke={ACCENT} strokeWidth={10} opacity={0.08 * r.on} />
              <rect x={x - 6} y={ry - 34} width={6} height={ROW_H - 6} rx={3} fill={ACCENT} opacity={r.on} />
            </>
          )}
          <text x={x + 10} y={ry} fontFamily={MONO} fontSize={27} fontWeight={700} fill={interpolateColors(r.on, [0, 1], [SOFT, ACCENT])}>
            {r.a}
          </text>
          <text x={x + 10 + r.a.length * 16.2 + 20} y={ry} fontFamily={MONO} fontSize={27} fill={interpolateColors(r.on, [0, 1], [INK, ACCENT])}>
            {r.b}
          </text>
        </g>
      );
    })}
  </>
);

const Win: React.FC<{ t: number; a: number; b: number; title: string; children: React.ReactNode }> = ({ t, a, b, title, children }) => {
  if (t < a || t > b) return null;
  const inP = spring01(t, a, 0.34, 15);
  const outP = ease(t, b - 0.16, b, EASE_IN);
  const s = mix(0.9, 1, inP) - 0.05 * outP;
  return (
    <g opacity={Math.min(1, inP * 2.2) * (1 - outP)} transform={`translate(268 200) scale(${s}) translate(-268 ${-200 + mix(16, 0, inP)})`}>
      <rect x={PAD} y={58} width={536 - 2 * PAD} height={316} rx={14} fill="#0D1320" stroke={INK} strokeWidth={2.5} />
      <rect x={PAD} y={58} width={536 - 2 * PAD} height={40} rx={14} fill={PANEL} />
      <text x={PAD + 20} y={85} fontFamily={MONO} fontSize={19} fontWeight={700} fill={SOFT}>
        {title}
      </text>
      {children}
    </g>
  );
};

/** Split a line's voiced time into n beats, the last one held to the card's end. */
const beats = (l: Line, n: number, fr: number[]) => fr.slice(0, n).map((f, k) => [l.t + f * l.voiceDur, k === n - 1 ? l.end : l.t + fr[k + 1] * l.voiceDur]);

export const AltScreen: React.FC<ClipProps> = ({ safe }) => (
  <Frame id="alt-screen" safe={safe}>
    {({ clip, t }) => {
      const meaning = byId(clip, "meaning");
      const header = byId(clip, "header");
      const chat = byId(clip, "chat");
      const keeps = byId(clip, "keeps");
      const recap = byId(clip, "recap");

      const typed = "agent".slice(0, Math.max(1, Math.ceil(ease(t, 0, 0.7, (x) => x) * 5)));
      const blink = (start: number) => (t < start ? 0 : 0.5 + 0.5 * Math.max(-1, Math.min(1, 3 * Math.cos((t - start) * Math.PI * 2 * 1.05))));
      const onPrompt = focusOf(clip, t, "prompt");
      const chatClose = chat.t + 2.2;
      const promptBack = spring01(t, chatClose + 0.05, 0.35, 15) * (1 - ease(t, keeps.t, keeps.t + 0.1));

      const loopRows = (l: Line, fr: number[]): Row[] => {
        const [b0, b1, b2] = beats(l, 3, fr);
        return [
          { a: "look", b: "read files", on: window01(t, b0[0], b0[1], 0.12, 0.1) },
          { a: "tool", b: "run tests", on: window01(t, b1[0], b1[1], 0.12, 0.1) },
          { a: "look", b: "check result", on: window01(t, b2[0], b2[1], 0.12, 0.1) },
        ];
      };
      const cycle = (start: number, period: number): Row[] => {
        const k = Math.floor(Math.max(0, t - start) / period) % 3;
        const ph = ((t - start) % period) / period;
        const on = t < start ? 0 : Math.min(1, ph * 6, (1 - ph) * 6);
        return [
          { a: "look", b: "read files", on: k === 0 ? on : 0 },
          { a: "tool", b: "run tests", on: k === 1 ? on : 0 },
          { a: "look", b: "check result", on: k === 2 ? on : 0 },
        ];
      };
      const round = 2 + Math.floor(Math.max(0, t - keeps.t - 0.3) / (3 * 0.62));

      const onHeader = focusOf(clip, t, "header") * ease(t, header.t + 0.35, header.t + 0.6);
      const reply = spring01(t, chat.t + 0.5, 0.4, 14);
      const onReply = focusOf(clip, t, "chat") * ease(t, chat.t + 0.6, chat.t + 0.9);

      return (
        <>
          <rect x={18} y={20} width={500} height={370} rx={18} fill="#080C15" stroke={DIM} strokeWidth={2.5} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={36 + k * 22} cy={42} r={6} fill={DIM} />
          ))}
          <text x={110} y={48} fontFamily={MONO} fontSize={18} fill={DIM}>
            ~/project — zsh
          </text>
          <text x={28} y={112} fontFamily={MONO} fontSize={34} fontWeight={700} fill={SOFT}>
            ${" "}
            <tspan fill={interpolateColors(onPrompt, [0, 1], [INK, ACCENT])}>{typed}</tspan>
          </text>
          <rect x={28 + (2 + typed.length) * 20.4 + 4} y={84} width={18} height={36} fill={INK} opacity={t < meaning.t ? blink(0.7) : 0} />
          <g opacity={promptBack}>
            <text x={28} y={300} fontFamily={MONO} fontSize={34} fontWeight={700} fill={SOFT}>
              $
            </text>
            <rect x={28 + 2 * 20.4 + 4} y={272} width={18} height={36} fill={INK} opacity={blink(chatClose + 0.2)} />
          </g>

          <Win t={t} a={meaning.t + 0.05} b={header.t} title="agent · session">
            <Rows x={46} y={150} w={444} rows={loopRows(meaning, [0, 0.3, 0.62])} />
          </Win>
          <Win t={t} a={header.t + 0.05} b={chat.t} title="request headers">
            <Rows
              x={46}
              y={146}
              w={444}
              rows={[
                { a: "GET", b: "/home", on: 0 },
                { a: "Host:", b: "shop.example", on: 0 },
                { a: "User-Agent:", b: "Firefox/131", on: onHeader },
                { a: "Accept:", b: "text/html", on: 0 },
              ]}
            />
          </Win>
          <Win t={t} a={chat.t + 0.05} b={chatClose} title="chatbot">
            <Rows x={46} y={150} w={444} rows={[{ a: "you ›", b: "what's an agent?", on: 0 }]} />
            <g opacity={Math.min(1, reply * 2)} transform={`translate(0 ${mix(14, 0, reply)})`}>
              <Rows x={46} y={150 + ROW_H} w={444} rows={[{ a: "bot ›", b: "One answer. Done.", on: onReply }]} />
            </g>
          </Win>
          <Win t={t} a={keeps.t + 0.05} b={recap.t} title={`agent · round ${round}`}>
            <Rows x={46} y={150} w={444} rows={cycle(keeps.t + 0.3, 0.62)} />
          </Win>
          <Win t={t} a={recap.t + 0.05} b={recap.end + 1} title="agent · session">
            <Rows x={46} y={150} w={444} rows={loopRows(recap, [0, 0.3, 0.6])} />
          </Win>
          <text x={518} y={378} textAnchor="end" fontFamily={SANS} fontSize={16} fill={DIM}>
            alt screen
          </text>
        </>
      );
    }}
  </Frame>
);
