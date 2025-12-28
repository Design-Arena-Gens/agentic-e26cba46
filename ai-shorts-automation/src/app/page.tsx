'use client';

import { useState } from "react";
import { GenerationForm } from "@/components/generation-form";
import { PlanDashboard } from "@/components/plan-dashboard";
import type { GenerationResponse } from "@/types/plan";

export default function Home() {
  const [result, setResult] = useState<GenerationResponse | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-indigo-50 pb-16 pt-24 font-sans dark:from-black dark:via-zinc-950 dark:to-indigo-950/40">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:flex-row md:gap-8">
        <div className="md:w-[420px]">
          <GenerationForm onGenerated={setResult} />
        </div>
        <div className="flex-1">
          {result ? (
            <PlanDashboard plan={result.plan} usingAI={result.usingAI} />
          ) : (
            <div className="grid h-full min-h-[520px] place-content-center rounded-3xl border border-dashed border-zinc-300 bg-white/70 p-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-700 dark:text-zinc-200">
                  Your Shorts automation blueprint
                </h2>
                <p className="text-sm leading-6">
                  Generate a complete workflow covering hooks, scripts, b-roll prompts, captions, and
                  automation steps for YouTube Shorts powered by AI.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
