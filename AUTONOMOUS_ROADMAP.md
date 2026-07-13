# Level Up — Autonomous R&D Roadmap (persistent)

This file is the single source of truth for the autonomous agent that runs every 3 hours.
The agent MUST read this file at the start of each run, update STATUS, and tick items as it progresses.
Do NOT delete completed items — mark them ✓ and keep history so progress is visible across runs.

## STATUS
- LAST RUN: 2026-07-13 (cron run — enriched DevPaths with verified free-course resources + added "📚 مصادر وتعلم مجانية" modal section; build + deploy clean)
- LAST RESULT: SCAN clean (frontend `tsc -b && vite build` 0 errors; backend `tsc --noEmit` clean; live 0 console errors). IMPROVE: Added a `resources` (course-link) field to all 9 DevPaths + a "📚 مصادر وتعلم مجانية" section in the path detail modal. 34 links total (freeCodeCamp, JavaScript.info, Full Stack Open, React, Node.js, SQLBolt, Python tutorial, Automate the Boring Stuff, Andrew Ng ML, Fast.ai, Hugging Face NLP, Flutter/Dart docs, Linux Journey, Docker, Kubernetes, Git Immersion, Figma YouTube, AWS Skill Builder, Terraform, Unity Learn, OpenAI Cookbook, Anthropic, Google Generative AI, Selenium, Cypress, Postman…); every URL curl-verified HTTP 200 before linking; paid ones (Google UX, IxDF) badged "مدفوع", free ones "مجاني". Arabic UI throughout. Verified live: opening the Full Stack card renders 6 resource links (e.g. freecodecamp.org/learn/2022/responsive-web-design) with 0 console errors. Deploy ✔ (Firebase hosting, bundle `index-BmxBB7YL.js`).
- HEALTH: BUILD passing (0 errors). BACKEND tsc --noEmit clean. LIVE: 0 console errors; new markers `مصادر وتعلم مجانية`, `cookbook.openai.com` confirmed in live bundle; DevPaths modal serves verified course resources with 0 console errors.

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
**Added paths log:** ✓ UI/UX Designer (تصميم UI/UX) — deployed 2026-07-13 ✓ Cloud Architect (مهندس Cloud) — deployed 2026-07-13 ✓ AR/VR Developer (مطور AR/VR) — deployed 2026-07-13 ✓ Prompt Engineer (مهندس الـ Prompt) — deployed 2026-07-13 ✓ QA Automation (مهندس اختبار آلي) — added to DevPaths (id 9) 2026-07-13; already present in SkillTree as the `automation` path (`auto-qa` branch: Selenium/Cypress). All 15 reference paths now represented. NOTE (2026-07-13): a prior interrupted run had deployed an UNDOCUMENTED "verified free course tree" rewrite of SkillTree (branch/live divergence). That experiment is preserved on `experiment/course-tree-rewrite` (origin) for owner review; `develop` + live are back on the documented career-path tree. Also fixed a latent duplicate `design` path id (renamed UI/UX path → `design-uiux`).
- [ ] Add paths using the `rpg-learning-app` reference: `skill_view('rpg-learning-app','references/career-paths-v2.md')` has 15 researched career paths (Full Stack, AI/ML, Cybersecurity, Data Scientist, DevOps, Mobile, UI/UX, Cloud Architect, Game Dev, Blockchain, Embedded, QA, Prompt Engineer, Product Manager, AR/VR) with Arabic names, descriptions, `afterComplete` outcomes, salary, demand, and per-skill XP/tier. Pick ONE not-yet-added path each run; convert it into a DevPaths entry AND a SkillTree path (branches → skills → tasks) keeping the existing TypeScript shapes. Keep UI text Arabic.
- [x] Enrich DevPaths with real courses — added `resources` to all 9 paths + "📚 مصادر وتعلم مجانية" modal section (34 verified links, badged مجاني/مدفوع) — done 2026-07-13.
- [ ] Enrich the SkillTree `careerPaths` (branches→skills→tasks) with real course resources per skill/task, reusing `references/free-courses.md` (DevPaths already enriched; this extends the visual tree).
- [ ] Add daily/weekly CHALLENGES and a streak/rewards system to boost engagement (see `rpg-learning-app` SkillSynergy + Achievement patterns).

### AI features (backend + UI) — follow `rpg-learning-app` data model
- [ ] Backend schema: extend `backend/prisma/schema.prisma` per `skill_view('rpg-learning-app','references/data-model.md')` (User, Skill, UserSkill, Quest, Achievement, Resource, FocusSession, SkillSynergy, UserSettings). Keep Prisma v5 (`String[]`/Json NOT supported on SQLite — use comma-separated strings or junction tables). After changes: `rm -f backend/prisma/dev.db && npx prisma db push` then restart the tsx process.
- [ ] Backend: `POST /api/ai/advice` — accepts a user's progress snapshot, returns personalized next-step advice (use OpenRouter if a key is present; otherwise a solid rule-based fallback so it works offline). Note `rpg-learning-app` also defines `POST /api/ai/roadmap` for goal→skill-tree generation — reuse that pattern.
- [ ] Backend: `POST /api/moderation` — checks user-generated content for conduct/modesty violations and flags/blocks.
- [x] UI page `AIAdvice.tsx` — LIVE as a rule-based offline advisor ("✨ مستشار" tab) 2026-07-13: asks time/goal/level and recommends the top-3 paths with Arabic reasoning. (Full OpenRouter-backed analysis + localStorage progress persistence still pending.)

### Usability / interactivity
- [x] Search & filter across paths/skills (DevPaths search + difficulty filter added 2026-07-13; SkillTree already had search).
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
