import type { ComponentType } from "react";
import { Composition } from "remotion";
import { AiAgent } from "../ai-agent/source";
import { ChangeAgent } from "../change-agent/source";
import { ChemicalAgent } from "../chemical-agent/source";
import { FreeAgent } from "../free-agent/source";
import { GrammaticalAgent } from "../grammatical-agent/source";
import { SecretAgent } from "../secret-agent/source";
import { ServiceAgent } from "../service-agent/source";
import { SomeonesAgent } from "../someones-agent/source";
import { TalentAgent } from "../talent-agent/source";
import { DURATION, FPS, HEIGHT, WIDTH } from "./kit";

const clip = (id: string, component: ComponentType) => (
  <Composition id={id} component={component} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);

export const RemotionRoot = () => (
  <>
    {clip("AiAgent", AiAgent)}
    {clip("SecretAgent", SecretAgent)}
    {clip("TalentAgent", TalentAgent)}
    {clip("ChemicalAgent", ChemicalAgent)}
    {clip("FreeAgent", FreeAgent)}
    {clip("ChangeAgent", ChangeAgent)}
    {clip("GrammaticalAgent", GrammaticalAgent)}
    {clip("SomeonesAgent", SomeonesAgent)}
    {clip("ServiceAgent", ServiceAgent)}
  </>
);
