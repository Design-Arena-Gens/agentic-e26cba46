'use client';

import { useState } from "react";
import type { GenerationResponse } from "@/types/plan";

type FormState = {
  niche: string;
  topic: string;
  tone: string;
  goal: string;
  durationSeconds: number;
  callToAction: string;
  includeCaptions: boolean;
  includeHashtags: boolean;
  includeShotList: boolean;
};

const defaultState: FormState = {
  niche: "AI productivity",
  topic: "Automating YouTube Shorts scripting",
  tone: "Energetic and motivating",
  goal: "Drive subscribers to a newsletter",
  durationSeconds: 60,
  callToAction: "Grab the free automation checklist in the description",
  includeCaptions: true,
  includeHashtags: true,
  includeShotList: true,
};

export function GenerationForm({
  onGenerated,
}: {
  onGenerated: (payload: GenerationResponse) => void;
}) {
  const [form, setForm] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unknown error");
      }

      const data = (await response.json()) as GenerationResponse;
      onGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <header className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Automation Brief
        </h2>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Describe the short you want to automate. The more context you provide, the smarter the
          workflow.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">Niche</span>
          <input
            value={form.niche}
            onChange={(event) => updateField("niche", event.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            placeholder="AI Productivity, finance, fitness..."
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">Tone & vibe</span>
          <input
            value={form.tone}
            onChange={(event) => updateField("tone", event.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            placeholder="High-energy, cinematic, minimal..."
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">Topic / angle</span>
        <input
          value={form.topic}
          onChange={(event) => updateField("topic", event.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="What is the short about?"
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">Campaign goal</span>
        <input
          value={form.goal}
          onChange={(event) => updateField("goal", event.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="Grow subscribers, drive sales, build authority..."
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">Call to action</span>
        <input
          value={form.callToAction}
          onChange={(event) => updateField("callToAction", event.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="Tell viewers exactly what to do next."
        />
      </label>

      <label className="grid gap-2 text-sm">
        <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-200">
          <span className="font-medium">Short length (seconds)</span>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {form.durationSeconds} sec
          </span>
        </div>
        <input
          type="range"
          min={15}
          max={120}
          value={form.durationSeconds}
          onChange={(event) => updateField("durationSeconds", Number(event.target.value))}
          className="accent-indigo-600 dark:accent-indigo-400"
        />
      </label>

      <fieldset className="grid gap-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-800 dark:bg-indigo-950/40">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
          Deliverables
        </legend>
        <label className="flex items-center gap-3 text-sm text-indigo-900 dark:text-indigo-100">
          <input
            type="checkbox"
            checked={form.includeShotList}
            onChange={(event) => updateField("includeShotList", event.target.checked)}
            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-700 dark:bg-indigo-900/40"
          />
          Shot plan & b-roll prompts
        </label>
        <label className="flex items-center gap-3 text-sm text-indigo-900 dark:text-indigo-100">
          <input
            type="checkbox"
            checked={form.includeCaptions}
            onChange={(event) => updateField("includeCaptions", event.target.checked)}
            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-700 dark:bg-indigo-900/40"
          />
          Caption overlays
        </label>
        <label className="flex items-center gap-3 text-sm text-indigo-900 dark:text-indigo-100">
          <input
            type="checkbox"
            checked={form.includeHashtags}
            onChange={(event) => updateField("includeHashtags", event.target.checked)}
            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-700 dark:bg-indigo-900/40"
          />
          Hashtag stack
        </label>
      </fieldset>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        {loading ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            Generating workflow…
          </>
        ) : (
          "Generate automation workflow"
        )}
      </button>
    </form>
  );
}

