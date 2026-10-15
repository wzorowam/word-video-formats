import script from "./cues.json";

export type Cue = [number, string];

export function cuesFor(slug: string): Cue[] {
  const row = (script as unknown as Record<string, { cues: Cue[] }>)[slug];
  if (!row) {
    throw new Error(`missing cues for ${slug}`);
  }
  return row.cues;
}
