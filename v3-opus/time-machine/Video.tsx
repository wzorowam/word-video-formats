import React from "react";
import { Frame, type ClipProps } from "../src/kit";
export const TimeMachine: React.FC<ClipProps> = ({ safe }) => <Frame id="time-machine" safe={safe}>{() => null}</Frame>;
