import React from "react";
import { Composition } from "remotion";
import { H, timeline, W, type ClipProps } from "./kit";
import { WordTree } from "../word-tree/Video";
import { Clamp } from "../clamp/Video";
import { PassingHand } from "../passing-hand/Video";
import { AltScreen } from "../alt-screen/Video";
import { ShoveTest } from "../shove-test/Video";
import { TimeMachine } from "../time-machine/Video";
import { UnderTheLabel } from "../under-the-label/Video";
import { HiddenUses } from "../hidden-uses/Video";
import { SameCord } from "../same-cord/Video";

const FPS = 30;
const frames = (id: string) => Math.round(timeline[id].duration * FPS);
const defaults: ClipProps = { safe: false };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="WordTree" component={WordTree} durationInFrames={frames("word-tree")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="Clamp" component={Clamp} durationInFrames={frames("clamp")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="PassingHand" component={PassingHand} durationInFrames={frames("passing-hand")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="AltScreen" component={AltScreen} durationInFrames={frames("alt-screen")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="ShoveTest" component={ShoveTest} durationInFrames={frames("shove-test")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="TimeMachine" component={TimeMachine} durationInFrames={frames("time-machine")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="UnderTheLabel" component={UnderTheLabel} durationInFrames={frames("under-the-label")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="HiddenUses" component={HiddenUses} durationInFrames={frames("hidden-uses")} fps={FPS} width={W} height={H} defaultProps={defaults} />
    <Composition id="SameCord" component={SameCord} durationInFrames={frames("same-cord")} fps={FPS} width={W} height={H} defaultProps={defaults} />
  </>
);
