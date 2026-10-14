import raw from "../cues.json";

export type Cue = {
  t: number;
  beat: string;
  caption: string;
  voice?: string;
};

export type Pilot = {
  id: string;
  duration: number;
  owns: string;
  cues: Cue[];
};

export const pilots = raw as Record<string, Pilot>;

export const pilotOf = (id: string) => pilots[id];

export const at = (pilot: Pilot, t: number) => {
  const cues = pilot.cues;
  let i = 0;
  for (let k = 0; k < cues.length; k++) {
    if (t >= cues[k].t - 0.0001) i = k;
  }
  const cue = cues[i];
  const end = i + 1 < cues.length ? cues[i + 1].t : pilot.duration;
  const span = Math.max(0.001, end - cue.t);
  const p = Math.min(1, Math.max(0, (t - cue.t) / span));
  return { cue, p, end, i };
};

export const agentPulses = (pilot: Pilot) =>
  pilot.cues
    .filter((c) => c.voice && /\bagent\b/i.test(c.voice))
    .map((c) => c.t + 0.2);
