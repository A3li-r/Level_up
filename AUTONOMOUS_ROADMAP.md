# Level Up — Autonomous R&D Roadmap (persistent)

This file is the single source of truth for the autonomous agent that runs every 3 hours.
The agent MUST read this file at the start of each run, update STATUS, and tick items as it progresses.
Do NOT delete completed items — mark them ✓ and keep history so progress is visible across runs.

## STATUS
- LAST RUN: 2026-07-13 (cron run — Prompt Engineer path added + deployed)
- LAST RESULT: SCAN clean (frontend build 0 errors, backend tsc clean, live 0 console errors). Added **Prompt Engineer (مهندس الـ Prompt)** path to both DevPaths.tsx (id 8) and SkillTree.tsx (id 'prompt', 3 branches → 6 skills → 12 tasks) with a cross-link إلى AI/ML (connectsTo: ['ai']). Build ✓, independent code-review ✓ (no security/logic issues), smoke test ✓ (markers مهندس الـ Prompt + prompt-foundations in bundle), deploy ✓. Live SkillTree now renders 255 connectors (was 233) and the new node is present.
- HEALTH: BUILD passing (tsc -b && vite build, 0 errors). BACKEND tsc --noEmit clean. LIVE: 0 console errors, new content verified served (مهندس الـ Prompt + prompt-foundations in live bundle).

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
**Added paths log:** ✓ UI/UX Designer (تصميم UI/UX) — deployed 2026-07-13 ✓ Cloud Architect (مهندس Cloud) — deployed 2026-07-13 ✓ AR/VR Developer (مطور AR/VR) — deployed 2026-07-13 ✓ Prompt Engineer (مهندس الـ Prompt) — deployed 2026-07-13. Remaining not-yet-in-SkillTree from the 15-path reference: **QA Automation (مهندس اختبار آلي)** (Full Stack/AI/ML/Cybersecurity/Data Scientist/DevOps/Mobile/UI-UX/Cloud/Game/Blockchain/Embedded/Product/Prompt Engineer/AR-VR now present). Add one per run.
- [ ] Add paths using the `rpg-learning-app` reference: `skill_view('rpg-learning-app','references/career-paths-v2.md')` has 15 researched career paths (Full Stack, AI/ML, Cybersecurity, Data Scientist, DevOps, Mobile, UI/UX, Cloud Architect, Game Dev, Blockchain, Embedded, QA, Prompt Engineer, Product Manager, AR/VR) with Arabic names, descriptions, `afterComplete` outcomes, salary, demand, and per-skill XP/tier. Pick ONE not-yet-added path each run; convert it into a DevPaths entry AND a SkillTree path (branches → skills → tasks) keeping the existing TypeScript shapes. Keep UI text Arabic.
- [ ] Enrich each added path with real courses: `skill_view('rpg-learning-app','references/free-courses.md')` has verified free links (freeCodeCamp, JS.info, Full Stack Open, PortSwigger, Fast.ai, Andrew Ng…). Link them as resources per skill/task.
- [ ] Add daily/weekly CHALLENGES and a streak/rewards system to boost engagement (see `rpg-learning-app` SkillSynergy + Achievement patterns).

### AI features (backend + UI) — follow `rpg-learning-app` data model
- [ ] Backend schema: extend `backend/prisma/schema.prisma` per `skill_view('rpg-learning-app','references/data-model.md')` (User, Skill, UserSkill, Quest, Achievement, Resource, FocusSession, SkillSynergy, UserSettings). Keep Prisma v5 (`String[]`/Json NOT supported on SQLite — use comma-separated strings or junction tables). After changes: `rm -f backend/prisma/dev.db && npx prisma db push` then restart the tsx process.
- [ ] Backend: `POST /api/ai/advice` — accepts a user's progress snapshot, returns personalized next-step advice (use OpenRouter if a key is present; otherwise a solid rule-based fallback so it works offline). Note `rpg-learning-app` also defines `POST /api/ai/roadmap` for goal→skill-tree generation — reuse that pattern.
- [ ] Backend: `POST /api/moderation` — checks user-generated content for conduct/modesty violations and flags/blocks.
- [ ] UI page `AIAdvice.tsx` — shows the user an AI analysis of their progress + advice. Persist user progress (localStorage now; backend + Prisma later) so the AI has data to analyze.

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
