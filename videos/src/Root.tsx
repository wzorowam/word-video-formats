import React from "react";
import { Composition } from "remotion";
import { pilots } from "./cue";
import { PassingHand } from "../passing-hand/Video";
import { WordTree } from "../word-tree/Video";
import { Clamp } from "../clamp/Video";
import { TimeMachine } from "../time-machine/Video";
import { UnderTheLabel } from "../under-the-label/Video";
import { HiddenUses } from "../hidden-uses/Video";
import { ShoveTest } from "../shove-test/Video";
import { SameCord } from "../same-cord/Video";
import { AltScreen } from "../alt-screen/Video";

const comps: Record<string, React.FC> = {
  "passing-hand": PassingHand,
  "word-tree": WordTree,
  clamp: Clamp,
  "time-machine": TimeMachine,
  "under-the-label": UnderTheLabel,
  "hidden-uses": HiddenUses,
  "shove-test": ShoveTest,
  "same-cord": SameCord,
  "alt-screen": AltScreen,
};

const ids: Record<string, string> = {
  "passing-hand": "PassingHand",
  "word-tree": "WordTree",
  clamp: "Clamp",
  "time-machine": "TimeMachine",
  "under-the-label": "UnderTheLabel",
  "hidden-uses": "HiddenUses",
  "shove-test": "ShoveTest",
  "same-cord": "SameCord",
  "alt-screen": "AltScreen",
};

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(comps).map(([key, Comp]) => (
      <Composition
        key={key}
        id={ids[key]}
        component={Comp}
        durationInFrames={Math.round(pilots[key].duration * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
