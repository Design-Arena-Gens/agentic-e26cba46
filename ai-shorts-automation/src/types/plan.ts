export type OutlineBeat = {
  beat: string;
  detail: string;
  approximateTime: number;
};

export type ScriptSegment = {
  speaker: "host" | "narrator";
  text: string;
  approximateTime: number;
};

export type AIPlan = {
  conceptTitle: string;
  hook: string;
  outline: OutlineBeat[];
  script: ScriptSegment[];
  bRollPrompts: string[];
  captions: string[];
  hashtags: string[];
  automationChecklist: string[];
  publishTiming: {
    bestHourUTC: number;
    rationale: string;
  };
};

export type GenerationResponse = {
  usingAI: boolean;
  plan: AIPlan;
};

