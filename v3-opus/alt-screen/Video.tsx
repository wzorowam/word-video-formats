import React from "react";
import { Frame, type ClipProps } from "../src/kit";
export const AltScreen: React.FC<ClipProps> = ({ safe }) => <Frame id="alt-screen" safe={safe}>{() => null}</Frame>;
