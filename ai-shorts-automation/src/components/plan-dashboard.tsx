'use client';

import { useMemo, useState } from "react";
import type { AIPlan } from "@/types/plan";

type Props = {
  plan: AIPlan;
  usingAI: boolean;
};

function secondsToTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
}

export function PlanDashboard({ plan, usingAI }: Props) {
  const [selectedBeat, setSelectedBeat] = useState<number | null>(0);

  const totalTime = useMemo(
    () => plan.script.reduce((acc, segment) => acc + segment.approximateTime, 0),
    [plan.script],
  );

  return (
    <div className="space-y-8">
      <header className="grid gap-2 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white p-6 shadow-sm dark:border-indigo-700 dark:from-indigo-950/60 dark:via-zinc-950 dark:to-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-indigo-900 dark:text-indigo-100">
            {plan.conceptTitle}
          </h2>
          <span className="rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
            {usingAI ? "Live AI plan" : "Offline planner"}
          </span>
        </div>
        <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">{plan.hook}</p>
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Runtime: {secondsToTimestamp(totalTime)}
        </p>
      </header>

      <section className="grid gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Beat timeline
        </h3>
        <div className="grid gap-3">
          {plan.outline.map((item, index) => {
            const isActive = selectedBeat === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedBeat(index)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-indigo-400 bg-indigo-50 shadow-sm dark:border-indigo-600 dark:bg-indigo-950/60"
                    : "border-zinc-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                    {item.beat}
                  </span>
                  <span className="text-xs font-medium text-indigo-500 dark:text-indigo-300">
                    {secondsToTimestamp(item.approximateTime)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
                  {item.detail}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Script board
        </h3>
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          {plan.script.map((segment, index) => (
            <div
              key={index}
              className={`grid gap-1 rounded-xl border px-4 py-3 shadow-sm transition ${
                selectedBeat === index
                  ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/60"
                  : "border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
              }`}
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <span>{segment.speaker === "host" ? "On-camera" : "Voiceover"}</span>
                <span className="text-indigo-500 dark:text-indigo-300">
                  {secondsToTimestamp(segment.approximateTime)}
                </span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-200">{segment.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            B-roll prompts
          </h3>
          <ul className="space-y-2">
            {plan.bRollPrompts.map((prompt, index) => (
              <li
                key={index}
                className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Automation checklist
          </h3>
          <ol className="space-y-2">
            {plan.automationChecklist.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Caption overlays
          </h3>
          {plan.captions.length ? (
            <ul className="space-y-2">
              {plan.captions.map((caption, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
                >
                  {caption}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Caption overlays disabled for this run.
            </p>
          )}
        </div>
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Hashtag stack
          </h3>
          {plan.hashtags.length ? (
            <div className="flex flex-wrap gap-2">
              {plan.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Hashtag automation disabled for this run.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Publish intelligence
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 font-semibold text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
            <span className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
              Best hour (UTC)
            </span>
            <span className="text-base">{plan.publishTiming.bestHourUTC}:00</span>
          </div>
          <p className="max-w-xl leading-6">{plan.publishTiming.rationale}</p>
        </div>
      </section>
    </div>
  );
}

