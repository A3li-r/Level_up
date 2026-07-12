# Level Up — Autonomous R&D Roadmap (persistent)

This file is the single source of truth for the autonomous agent that runs every 3 hours.
The agent MUST read this file at the start of each run, update STATUS, and tick items as it progresses.
Do NOT delete completed items — mark them ✓ and keep history so progress is visible across runs.

## STATUS
- LAST RUN: (set by agent each run)
- LAST RESULT: (set by agent: what was done / errors fixed / deployed? yes/no)
- HEALTH: (build passing? live site OK? any console errors?)

## Vision (from the owner)
Turn Level Up into a polished, interactive, AI-assisted platform for individual development:
1. **Self-healing:** scan the site & codebase, detect and FIX errors (build, type, runtime/console).
2. **R&D:** continuously add interactivity & usability improvements for the public.
3. **AI:** add an AI module that analyzes user progress data, gives personalized advice, and moderates user-generated content (conduct / modesty).
4. **Content:** add new paths, branches, skills, tasks, challenges, and courses.
5. **Reach:** pull real specializations from roadmap.sh (and deep-search specializations) so the site becomes a credible, approved resource for self-development.

## Recurring (every run, before new work)
- [ ] **SCAN & SELF-HEAL:** run `npm run build` in `frontend/`; run `npx tsc --noEmit` in `backend/`; open https://levelup-533c4.web.app in the browser and capture console errors. Fix any errors found BEFORE doing new work. Log what you fixed in STATUS.

## Backlog (do 1–2 highest-priority un-done items per run; keep changes incremental & build-passing)
### Content expansion (paths / branches / courses)
- [ ] Add paths from roadmap.sh: fetch `https://roadmap.sh/<topic>` (e.g. frontend, backend, devops, ai-engineer, data-engineer, cybersecurity, ui-ux-design, mobile, game-developer, software-architect, cloud). Convert each into a DevPaths entry AND a SkillTree path (branches → skills → tasks). Add ~1 path per run; deep-search the specialization for accurate subtopics.
- [ ] Add "courses" linking to free resources (official docs, videos) for each skill/task.
- [ ] Add daily/weekly CHALLENGES and a streak/rewards system to boost engagement.

### AI features (backend + UI)
- [ ] Backend: `POST /api/ai/advice` — accepts a user's progress snapshot, returns personalized next-step advice (use OpenRouter if a key is available; otherwise a rule-based fallback).
- [ ] Backend: `POST /api/moderation` — checks user-generated content for conduct/modesty violations and flags/blocks.
- [ ] UI page `AIAdvice.tsx` — shows the user an AI analysis of their progress + advice.
- [ ] Persist user progress (localStorage now; backend + Prisma later) so the AI has data to analyze.

### Usability / interactivity
- [ ] Search & filter across paths/skills.
- [ ] Responsive / mobile layout pass.
- [ ] Smooth onboarding + progress dashboard improvements.
- [ ] Accessibility pass (contrast, focus, RTL correctness).

## Rules (hard)
- Never modify `deploy.sh`, firebase config, or credentials.
- Never touch files outside `/opt/data/level-up`.
- Only deploy after `npm run build` succeeds AND a smoke test (local `vite preview` or live curl) shows no errors.
- Keep changes SMALL and tested. If a change is large/risky, implement behind a feature flag, commit, but do NOT deploy — report instead.
- UI text stays Arabic; keep the color palette.
- Commit work to the `develop` branch and push `origin develop`. Keep `main` as the stable reference (merge develop → main only when verified).
- Update STATUS + tick items in THIS file every run.
- At the start, if `git status` is dirty, first commit the existing changes (likely from an interrupted previous run) with message `chore: checkpoint prior run` before starting new work.
