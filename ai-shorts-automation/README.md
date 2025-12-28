## AI Shorts Automation Studio

Spin up complete YouTube Shorts workflows powered by AI. Feed the planner your niche, tone, and goals and instantly receive:

- Hooks, outlines, and voiceover scripts aligned to your runtime
- B-roll prompts and caption overlays ready for templated editors
- Automation checklists for text-to-video, audio, and scheduling tools
- Posting intelligence with best-hour recommendations

The app can run in two modes:

1. **Live AI** – set `OPENAI_API_KEY` in your environment and the planner will call OpenAI's API for bespoke content.
2. **Offline Planner** – without a key, the app still creates a structured baseline plan so teams can experiment.

## Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start ideating.

## Environment Variables

Create a `.env.local` file at the project root when you want live AI responses:

```
OPENAI_API_KEY=sk-your-key
```

## Production

The project ships with a Vercel-ready configuration. Build with:

```bash
npm run build
```
