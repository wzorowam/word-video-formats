import type { ComponentType } from "react";
import { Composition } from "remotion";
import { AltScreen } from "../alt-screen/Video";
import { Clamp } from "../clamp/Video";
import { HiddenUses } from "../hidden-uses/Video";
import { PassingHand } from "../passing-hand/Video";
import { SameCord } from "../same-cord/Video";
import { ShoveTest } from "../shove-test/Video";
import { TimeMachine } from "../time-machine/Video";
import { UnderTheLabel } from "../under-the-label/Video";
import { WordTree } from "../word-tree/Video";
import { DURATION, FPS, HEIGHT, WIDTH } from "./kit";

const clip = (
  id: string,
  component: ComponentType,
) => (
  <Composition
    id={id}
    component={component}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

export const RemotionRoot = () => (
  <>
    {clip("WordTree", WordTree)}
    {clip("Clamp", Clamp)}
    {clip("PassingHand", PassingHand)}
    {clip("AltScreen", AltScreen)}
    {clip("ShoveTest", ShoveTest)}
    {clip("TimeMachine", TimeMachine)}
    {clip("UnderTheLabel", UnderTheLabel)}
    {clip("SameCord", SameCord)}
    {clip("HiddenUses", HiddenUses)}
  </>
);
