# PathwayAI Ecosystem — Project Memory

Quick-reference context for anyone picking up this codebase.

---

## Origin

The project began as `aipathway.lovable.app` — a single-app prototype built with React + Vite + Supabase + Stripe, targeted at HK students (18–25) navigating career decisions. The prototype shipped: personalised career matching (23 profiles), bilingual AI career coach (EN / 繁中), interview and salary negotiation simulators, career switch analyzer, HK utilities (Tax Wizard, MPF Calculator, CEF Tracker, Certifications Dictionary), CV builder, freemium monetisation (HK$12/month), and Capacitor mobile packaging.

During ideation, the team recognised that student outcomes depend on data held by institutions and recruiters that a student-only app cannot reach. This led to the three-platform ecosystem concept.

---

## What This Codebase Is

**PathwayAI Ecosystem** — an MVP proving the three-platform architecture. One shared Fastify 5 backend serves three separate React SPAs:

| Platform | Port | Demo login |
|---|---|---|
| Student App | 5177 | `student@cuhk.edu.hk` / `student123` |
| Institutional Platform | 5178 | `admin@cuhk.edu.hk` / `admin123456` |
| Recruiter Platform | 5179 | `recruiter@hsbc.com` / `recruiter123` |

Backend runs on port `4000`. Database: PostgreSQL via Prisma 6. AI coaching: Anthropic Claude SDK.

---

## Business Model

| Tier | Price | Access |
|---|---|---|
| **Student** | Free | Job discovery, applications, AI coaching, credentials |
| **Recruiter** | HK$2,400 / month per seat | Job posting, candidate pipeline, analytics, campus events |
| **Institution** | HK$480,000 / year per licence | Full platform access for institution admin team |

---

## What Comes Next

Integrate the prototype's feature set into the ecosystem Student App — now backed by live shared data. Priority items:

1. Bilingual UI (`LanguageContext` with `t(en, zh)` helper)
2. Personalised career matching engine
3. Interview & salary negotiation simulators
4. HK utilities (Tax Wizard, MPF Calculator, CEF Tracker)
5. CV builder (5 templates, PDF export)
6. Gamification (XP, badge tiers)
7. Freemium gates + Stripe subscription

Full integration plan: [`INTEGRATION_STRATEGY.md`](INTEGRATION_STRATEGY.md)

---

## Key Documents

| Document | Purpose |
|---|---|
| [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) | Full project history, PRD, architecture, challenges, iterations, lessons learned, future opportunities |
| [`INTEGRATION_STRATEGY.md`](INTEGRATION_STRATEGY.md) | Step-by-step plan to wire all mock data to live backend; DB schema; API design; 5-phase roadmap |
| [`AGENTS.md`](AGENTS.md) | Claude Code skill shortcuts for security audit, code review, QA, and feature builds |

---

## Architecture in One Line

```
Student App (5177) + Institutional Platform (5178) + Recruiter Platform (5179)
  → Fastify 5 backend (4000) → PostgreSQL (Prisma) + Anthropic Claude SDK
```

Real-time events (recruiter status change → student notification) via Node.js EventEmitter SSE. JWT auth (15-min access tokens, 7-day refresh tokens). CORS covers ports 5173–5180.

---

## Recurring Pitfalls

- **Backend changes require rebuild + restart.** `npm run build && pkill -f "node dist/index.js" && npm start`. A running process ignores source edits.
- **CORS:** Vite allocates ports sequentially. If 5173–5176 are taken, apps land on 5177–5179. Backend CORS covers 5173–5180.
- **Match score:** Must be computed server-side in both `GET /api/v1/jobs` AND `GET /api/v1/jobs/:id`. Omitting it from the detail endpoint causes `undefined%` in the UI.
- **Institutional admin password** is `admin123456` (not `admin123`). The login screen shows the hint.
