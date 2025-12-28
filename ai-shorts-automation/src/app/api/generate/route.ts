import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  niche: z.string().min(2, "Niche is required"),
  topic: z.string().optional(),
  tone: z.string().min(2, "Tone is required"),
  goal: z.string().optional(),
  durationSeconds: z.number().int().min(15).max(120).default(60),
  platform: z.string().default("youtube_shorts"),
  callToAction: z.string().optional(),
  includeCaptions: z.boolean().default(true),
  includeHashtags: z.boolean().default(true),
  includeShotList: z.boolean().default(true),
});

type GenerationPayload = z.infer<typeof requestSchema>;

type AIPlan = {
  conceptTitle: string;
  hook: string;
  outline: Array<{ beat: string; detail: string; approximateTime: number }>;
  script: Array<{ speaker: "host" | "narrator"; text: string; approximateTime: number }>;
  bRollPrompts: string[];
  captions: string[];
  hashtags: string[];
  automationChecklist: string[];
  publishTiming: { bestHourUTC: number; rationale: string };
};

const SYSTEM_INSTRUCTION = `
You are an experienced short-form video strategist helping a creator automate production for AI-generated YouTube Shorts.
Always respond with JSON that matches the schema provided by the user. Ensure timings add up to the requested duration.
Keep language concise, energetic, and accessible for global audiences.
`;

function getFallbackPlan(input: GenerationPayload): AIPlan {
  const baseTopic = input.topic?.trim() || `Trending tip in ${input.niche}`;
  const duration = input.durationSeconds;
  const beatLength = Math.max(5, Math.round(duration / 4));

  const outline = [
    {
      beat: "Hook",
      detail: `Pose a bold question about ${baseTopic.toLowerCase()}.`,
      approximateTime: Math.min(6, beatLength),
    },
    {
      beat: "Value Drop",
      detail: `Reveal a surprising ${input.niche.toLowerCase()} stat or tactic with fast pacing.`,
      approximateTime: beatLength,
    },
    {
      beat: "Execution Steps",
      detail: `Break the tactic into 2-3 punchy steps viewers can follow in under a minute.`,
      approximateTime: beatLength,
    },
    {
      beat: "CTA",
      detail: input.callToAction
        ? input.callToAction
        : "Encourage viewers to try it today and follow for more quick wins.",
      approximateTime: Math.max(4, duration - beatLength * 3),
    },
  ];

  const script: AIPlan["script"] = outline.map((step) => ({
    speaker: (step.beat === "Hook" ? "host" : "narrator") as "host" | "narrator",
    text:
      step.beat === "Hook"
        ? `Wait! Are you still ignoring ${baseTopic.toLowerCase()}? That ends now.`
        : step.detail,
    approximateTime: step.approximateTime,
  }));

  return {
    conceptTitle: `${baseTopic} (${input.niche} ${input.tone})`,
    hook: `You're missing out on ${baseTopic.toLowerCase()} – here's how to fix it in ${duration} seconds.`,
    outline,
    script,
    bRollPrompts: [
      `Dynamic text animation highlighting "${baseTopic}"`,
      `Close-up of creator demonstrating the tactic`,
      `Fast-cut montage related to ${input.niche.toLowerCase()} results`,
    ],
    captions: input.includeCaptions
      ? [
          `Hook: ${baseTopic}`,
          "Step 1: Start today",
          "Step 2: Keep it consistent",
          "Step 3: Share your results",
          input.callToAction ?? "Follow for more AI Shorts tactics",
        ]
      : [],
    hashtags: input.includeHashtags
      ? ["#YouTubeShorts", `#${input.niche.replace(/\s+/g, "")}`, "#CreatorTips", "#AIWorkflow"]
      : [],
    automationChecklist: [
      "Generate storyboard in favorite AI storyboard tool",
      "Use text-to-speech for narration and refine in audio editor",
      "Render b-roll clips with preferred video generator",
      "Assemble timeline in template project",
      "Schedule upload and auto-caption in YouTube Studio",
    ],
    publishTiming: {
      bestHourUTC: 16,
      rationale: "Optimized for after-school viewing window for global audience.",
    },
  };
}

async function generateWithOpenAI(input: GenerationPayload): Promise<AIPlan> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_output_tokens: 1200,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: SYSTEM_INSTRUCTION,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              schema: {
                type: "object",
                properties: {
                  conceptTitle: { type: "string" },
                  hook: { type: "string" },
                  outline: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        beat: { type: "string" },
                        detail: { type: "string" },
                        approximateTime: { type: "number" },
                      },
                      required: ["beat", "detail", "approximateTime"],
                    },
                  },
                  script: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        speaker: { type: "string", enum: ["host", "narrator"] },
                        text: { type: "string" },
                        approximateTime: { type: "number" },
                      },
                      required: ["speaker", "text", "approximateTime"],
                    },
                  },
                  bRollPrompts: { type: "array", items: { type: "string" } },
                  captions: { type: "array", items: { type: "string" } },
                  hashtags: { type: "array", items: { type: "string" } },
                  automationChecklist: { type: "array", items: { type: "string" } },
                  publishTiming: {
                    type: "object",
                    properties: {
                      bestHourUTC: { type: "number" },
                      rationale: { type: "string" },
                    },
                    required: ["bestHourUTC", "rationale"],
                  },
                },
                required: [
                  "conceptTitle",
                  "hook",
                  "outline",
                  "script",
                  "bRollPrompts",
                  "captions",
                  "hashtags",
                  "automationChecklist",
                  "publishTiming",
                ],
              },
              constraints: {
                durationSeconds: input.durationSeconds,
                niche: input.niche,
                tone: input.tone,
                goal: input.goal,
                callToAction: input.callToAction,
                platform: input.platform,
                includeCaptions: input.includeCaptions,
                includeHashtags: input.includeHashtags,
                includeShotList: input.includeShotList,
              },
            }),
          },
        ],
      },
    ],
  });

  const content = response.output_text;

  try {
    return JSON.parse(content) as AIPlan;
  } catch {
    throw new Error("Model returned malformed output");
  }
}

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const hasKey = Boolean(process.env.OPENAI_API_KEY);

    const plan = hasKey ? await generateWithOpenAI(input) : getFallbackPlan(input);

    return NextResponse.json({
      usingAI: hasKey,
      plan,
    });
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate automation plan" },
      { status: 500 },
    );
  }
}
