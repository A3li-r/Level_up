# Level Up — Autonomous Development Roadmap

Persistent backlog for the **autonomous dev cron** (runs every 5h). The cron reads this
file at the start of every run, picks the top `pending` item, implements it, verifies the
build + deploy, then updates the status here and commits/pushes to `develop`.

## Principles
- **Mission:** evolve Level Up toward a *public launch* — add features & improvements each cycle.
- **Priority themes:** (1) per-user features, (2) a personalized UI that adapts to each user's
  choices & needs, (3) launch readiness (landing, legal, SEO, polish, performance).
- UI text is **Arabic** (MSA / Iraqi-friendly); code, comments, identifiers in **English**.
- Reuse the palette: purple `#a855f7`, blue `#3b82f6`, cyan `#22d3ee`, green `#34d399`,
  yellow `#facc15`, pink `#f472b6`. framer-motion transitions `cubic-bezier(0.22,1,0.36,1)`.
- **Build must pass** (`npm run build`, i.e. `tsc -b && vite build`) before any deploy.
- Deploy ONLY via `bash /opt/data/level-up/deploy.sh` (never edit it or the credentials).
- **Preserve the SkillTree "tree" concept** — enhancements, not removal.
- **Per-user personalization starts client-side (localStorage)** with a clean data layer
  shaped to later swap to the backend API. Reason: the Express/Prisma backend is NOT yet
  publicly deployed (Docker port-exposure blocker), so client-side state keeps the live
  Firebase site working now while staying backend-ready.

## Backlog
- [x] 1. **User preferences model + Settings screen** — theme color, layout density,
      default view (tree/grid/roadmap), language (AR/EN), visible branches, difficulty.
      Store client-side first (typed `UserPrefs`, localStorage persistence + context/provider).
      **DONE (2026-07-17):** `PreferencesContext` (userId-scoped localStorage), `Settings.tsx`,
      `i18n.ts`, wired into App. Accent + density + language are applied live app-wide;
      visibleBranches/difficulty are captured and ready for SkillTree consumption.
- [ ] 2. **Apply personalization dynamically** — theme, default view, filtered/highlighted
      branches reflect each user's prefs across all pages.
      (Partial: accent/density/lang already live via `PersonalizationLayer`; next: consume
      `visibleBranches` + `difficulty` inside `SkillTree` to highlight/filter paths.)
- [ ] 3. **Personalized onboarding wizard** (first run) — capture goals/needs/skill level →
      seeds prefs and recommends a starting branch/path.
- [ ] 4. **Enhance AI Advisor** to give personalized recommendations from user prefs/needs
      (extend the existing `مستشار` tab).
- [ ] 5. **Per-user progress / XP / streaks / achievements** wired to backend models
      (UserSkill/Quest/Achievement) when the backend becomes reachable; start client-side.
- [ ] 6. **Per-user notifications/reminders** — extend the existing daily cron/quest bar to be
      user-specific and configurable.
- [ ] 7. **i18n toggle (AR/EN)** across the app with a language switcher.
- [ ] 8. **Community / mentor features** — the Crown "guest" concept as user-selectable mentors
      per branch/path.
- [ ] 9. **Public-launch readiness** — landing page, About, Privacy & Terms, SEO meta tags,
      error boundaries, mobile polish, performance pass.
- [ ] 10. **Real user accounts & auth** (register/login/logout) backed by Express+Prisma
       once the backend can be deployed.
- [ ] 11. **Backend API integration** — replace hardcoded arrays with API calls
       (skills, progress, prefs) via the existing Prisma schema.
