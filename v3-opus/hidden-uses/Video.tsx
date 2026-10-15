import React from "react";
import { Frame, type ClipProps } from "../src/kit";
export const HiddenUses: React.FC<ClipProps> = ({ safe }) => <Frame id="hidden-uses" safe={safe}>{() => null}</Frame>;
