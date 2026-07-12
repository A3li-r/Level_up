# Level Up — Project Context (for autonomous agents)

Level Up (formerly LifeOS) is an Arabic, RPG-style personal-development & learning web app.
Live site: https://levelup-533c4.web.app

## Stack
- **Frontend:** React 18 + Vite + TypeScript + framer-motion. Source in `frontend/`.
- **Backend:** Node + Express + Prisma + SQLite. Source in `backend/` (Prisma schema at `backend/prisma/schema.prisma`, SQLite at `backend/prisma/dev.db`).
- **Hosting:** Firebase Hosting (project `levelup-533c4`). Deploy via `bash /opt/data/level-up/deploy.sh`.

## Key frontend files
- `frontend/src/pages/SkillTree.tsx` — the visual skill tree (trunk → paths → branches → skills → tasks). Holds the rich `paths` data (`branches[].skills[].tasks[]`, colors, xp, rewards, connections). Layout is **bottom-up vertical**; root at bottom.
- `frontend/src/pages/DevPaths.tsx` — simpler `paths` list (`id, title, duration, steps[], color, difficulty, xp, description`).
- `frontend/src/pages/Roadmap.tsx` — `roadmapSteps` (الأساسيات / المتقدم / التخصص / احترافي) with tasks + progress %.
- Other pages (Dashboard, Challenges, AIAdvice, etc.) live in `frontend/src/pages/`; routing in `frontend/src/App.tsx`.

## Build & deploy (NEVER skip the build check)
- **Build:** `cd /opt/data/level-up/frontend && npm run build` → runs `tsc -b && vite build`. Must exit 0 with zero TS errors.
- **Deploy:** `bash /opt/data/level-up/deploy.sh` (builds + deploys to Firebase). The script sets `GOOGLE_APPLICATION_CREDENTIALS` from `/tmp/creds_path.txt`. **Do NOT modify `deploy.sh` or any credentials.**
- **Backend dev:** `cd /opt/data/level-up/backend && npm run dev`.

## Conventions
- **UI text is Arabic** (Modern Standard / Iraqi-friendly). Keep all user-facing strings Arabic. Code, comments, identifiers in English.
- **Color palette** encodes categories — reuse it: purple `#a855f7`, blue `#3b82f6`, cyan `#22d3ee`, green `#34d399`, yellow `#facc15`, pink `#f472b6`.
- Use framer-motion for animation; keep transitions smooth (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Data is currently **hardcoded typed arrays** inside the `.tsx` files. Add entries by extending those arrays with the same shape (match the existing `Path` / `RoadmapStep` TypeScript interfaces).

## Autonomous work plan
See `AUTONOMOUS_ROADMAP.md` — the persistent backlog. Read it at the start of every run, pick the top un-done item, implement incrementally, update its status, then build + smoke-test + deploy.

## Skills & references (for the autonomous agent)
The cron agent has these skills available — load them when relevant:
- `rpg-learning-app` — THIS project IS the "Level Up" pattern. Do NOT attach its full SKILL.md (too large); instead load just the reference files you need via `skill_view`:
  - `skill_view('rpg-learning-app','references/career-paths-v2.md')` → 15 researched career paths with Arabic names, `afterComplete` outcomes, salary, demand, and per-skill XP/tier. **USE THIS as the source of truth when adding paths.**
  - `skill_view('rpg-learning-app','references/free-courses.md')` → verified free course/resource links for skills.
  - `skill_view('rpg-learning-app','references/data-model.md')` → Prisma schema (User, Skill, UserSkill, Quest, Achievement, Resource, FocusSession, SkillSynergy…) for the AI/backend features.
  - `skill_view('rpg-learning-app','references/modern-ui-patterns.md')` → CSS variables, reusable classes, Framer Motion patterns.
- `firebase-hosting-deploy` — non-interactive Firebase deploy (already handled by `deploy.sh`; `skill_view('firebase-hosting-deploy','references/levelup-deploy.md')` for project specifics).
- `dogfood` — exploratory QA: find bugs with evidence. Use during the SCAN step.
- `requesting-code-review` — pre-commit security/quality gate. Run before deploy.
- `systematic-debugging` — 4-phase root-cause debugging. Use when fixing errors.
- `react-visual-tree` — building interactive SVG trees (the SkillTree). Use when enhancing the tree.

## External data source
- roadmap.sh: per-topic JSON at `https://roadmap.sh/<topic>.json` (e.g. `frontend`, `backend`, `devops`, `ai-engineer`) — confirmed reachable (HTTP 200). Use it (or the `rpg-learning-app` career-paths reference) as the source of truth when adding paths/branches/courses.
