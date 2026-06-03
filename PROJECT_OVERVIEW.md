# PathwayAI Multi-Platform System — Project Overview

> **Scope:** Three-platform full-stack application built on a shared Fastify 5 backend with separate React frontends for students, institution administrators, and recruiters. Developed iteratively in a single AI-assisted coding session using Claude Code.

---

## Origin & Ecosystem Vision

PathwayAI began as an early web application prototype (`aipathway.lovable.app`) — a single mobile-first experience exploring how HK students and fresh graduates could navigate career decisions with AI-powered guidance. During ideation, the team explored how different user account types — each with distinct roles and permissions — could coexist within a single application. That exploration raised a broader question: what kind of fully launched, extensible product could be built around these differentiated user experiences?

From that question emerged the idea of a **three-platform ecosystem** designed to connect the key stakeholders in the career and education space:

| Platform | Users | Purpose |
|---|---|---|
| **Student App** | Students & graduates | Mobile-first experience to navigate career pathways, track applications, build skills, and receive AI coaching |
| **Institutional Platform** | University career services & admins | Portal to manage graduate cohorts, monitor employment outcomes, issue credentials, and maintain employer relationships |
| **Recruiter Platform** | Hiring professionals | Tools to post roles, discover and shortlist matched candidates, manage interview pipelines, and run campus events |

The current MVP (PathwayAI Ecosystem) demonstrates the feasibility of this three-platform architecture at a foundational level — proving that a single backend can serve all three audiences with live data, real-time events, and role-appropriate access control. The **next phase** of development aims to integrate the earlier prototype's features and functionality into this ecosystem architecture, transforming the concept from a proof-of-concept into a fully operational, production-ready product.

---

## Table of Contents

1. [Workflow](#1-workflow)
2. [Documents](#2-documents)
3. [PRD — Product Requirements Document](#3-prd--product-requirements-document)
4. [Project Tech Architecture and Tools Used](#4-project-tech-architecture-and-tools-used)
5. [Key Challenges Encountered](#5-key-challenges-encountered)
6. [Iteration Progress, Explaining What Was Improved](#6-iteration-progress-explaining-what-was-improved)
7. [Lessons Learned](#7-lessons-learned)
8. [Future Opportunities for Improvement](#8-future-opportunities-for-improvement)

---

## 1. Workflow

### Phase 0 — Prototype and Ecosystem Ideation (`aipathway.lovable.app`)
1. **Identified the target problem:** HK students and fresh graduates (18–25) across HKU, CUHK, HKUST, PolyU, CityU, and BU face information overload navigating career decisions, tax obligations, MPF, CEF, professional certifications, and employer hierarchies — with no single personalised tool.
2. **Built the prototype:** A React + Vite + TypeScript SPA backed by Supabase (auth, PostgreSQL, Deno edge functions) and Stripe. Key features shipped:
   - **Career matching engine** — affinity scoring across 23 hand-authored HK career profiles using weighted vectors (major, skills, interests, concerns, education level, experience years); scores clamped 40–99.
   - **Bilingual AI chat** — SSE-streaming multi-turn career advisor injecting HK market context; language-aware (EN / 繁中); guest session tracking with a 3-message cap.
   - **Interview Simulator** — 5 HK-specific questions across difficulty levels, AI STAR-framework scoring, gamified XP progression.
   - **Salary Negotiation Simulator** — multi-turn AI HR persona, HK salary benchmarks, XP rewards.
   - **Career Switch Analyzer** — feasibility reports with skill gap analysis and HK market demand outlook.
   - **HK Utilities** — Tax Wizard (BIR60 CSS replica), MPF Calculator, CEF Tracker (HK$25,000 ceiling), Certifications Dictionary (120+ certifications), Uni Hub (rankings, grad scheme tracker).
   - **CV Builder** — 5 template variants, PDF export via html2canvas + jsPDF.
   - **Freemium model** — Guest (3 AI messages/session) → Free (3 lifetime trial tokens for premium features) → Premium (HK$12/month, Stripe Embedded Checkout).
   - **i18n** — 200+ translation keys across all pages, bilingual feature guides and walkthroughs.
   - **Mobile** — Capacitor iOS/Android packaging, safe-area insets, bottom navigation bar.
3. **Explored multi-role architecture:** During ideation, the team examined how university administrators, recruiters, and graduates each require fundamentally different views, permissions, and data flows — a complexity that a single-app model cannot serve well at depth.
4. **Defined the ecosystem:** From that analysis emerged the three-platform architecture — Student App, Institutional Platform, and Recruiter Platform — each purpose-built for its audience and connected through a shared backend. This is the architecture implemented in the current MVP.
5. **Identified the integration backlog:** The prototype's feature set — AI coaching, personalised career matching, credential tracking, market intelligence, HK utilities, CV builder, gamification, bilingual UX — represents the feature roadmap to be integrated into the ecosystem in the next development phase.

### Phase 1 — Feature Scoping and Rollback
1. Identified request to implement two advanced features: career match suggestions and interview simulation inside the student app.
2. Explored existing screen files to understand the routing structure and authentication context.
3. Scaffolded both features across multiple files (screens, API hooks, backend routes).
4. Discovered the features conflicted with the existing demo flow and exceeded the stable prototype boundary.
5. Performed a full git rollback (`git restore`) to the last clean pushed commit, removing all changes from both features.
6. Confirmed rollback success by restarting all three frontend dev servers and verifying the student app loaded correctly.

### Phase 2 — Progress Report Documentation
1. Reviewed all source files across backend, student app, institutional platform, and recruiter platform.
2. Produced an academic progress report (`PathwayAI_Progress_Report.md`) covering PRD, 37 user stories across 8 epics, 6 system flowcharts, 40+ acceptance criteria, tech stack assessment, Business Model Canvas (HKD pricing), and GenAI architecture appendix.
3. Confirmed report audience: GenAI master's degree course professors and students.
4. Updated the report in May 2026 to incorporate the ecosystem origin story (`aipathway.lovable.app`), a prototype feature integration table (Feature 9) mapping all prototype-proven features to their integration status, a revised out-of-scope classification distinguishing deferred items from prototype-proven items awaiting next-phase porting, and an updated status line ("Active Development — Ecosystem MVP Phase").

### Phase 3 — Platform Startup and CORS Diagnosis
1. Started all three Vite dev servers and the Fastify backend concurrently using background processes.
2. Identified that Vite sequentially allocated ports 5177, 5178, 5179 (5173–5176 already in use by other processes).
3. Confirmed backend CORS allowlist only covered ports 5173–5175, blocking all three running frontends.
4. Added ports 5176–5180 to the CORS origin array in `backend/src/index.ts`, rebuilt, and restarted the backend.
5. Validated fix with `curl` CORS preflight checks returning `204` on all three ports.

### Phase 4 — Match Score Bug Investigation and Fix
1. Received report: job detail page showed "%" with no numeric value in the Match Score circle.
2. Attempted three UI-layer fixes targeting element sizing and font scale — all rolled back by user after confirming the percentage digit was still absent.
3. Re-examined backend route `GET /api/v1/jobs/:id` and discovered the single-job endpoint computed `skillsMatch` but never computed or returned `matchScore`.
4. The list endpoint `GET /api/v1/jobs` correctly computed and returned `matchScore`; the detail endpoint did not.
5. Added the two-line computation to the detail endpoint in `backend/src/routes/jobs.ts`, rebuilt the backend.
6. Confirmed the job detail page rendered the correct numeric percentage (e.g. 87%).

### Phase 5 — Push Notification System Implementation
1. Read all relevant backend and frontend files: `schema.prisma`, `events.ts`, `sse.ts`, `recruiters.ts`, `notifications.ts`, `NotificationsScreen.tsx`, `ApplicationDetailScreen.tsx`, `useSSE.ts`, and the frontend `api.ts` type definitions.
2. Identified all gaps:
   - `Notification` model lacked `applicationId` field (needed for tap-to-navigate)
   - `events.ts` had no `STAGE_CHANGE` event type
   - `sse.ts` had no user-scoped channel; only institution-scoped and credential-level channels existed
   - `recruiters.ts` PATCH endpoint did not emit SSE; REJECTED status had no notification at all
   - `NotificationsScreen.tsx` notifications were not tappable
   - `ApplicationDetailScreen.tsx` back button always went to history, not to `/notifications`
3. Added `applicationId String?` to `Notification` in schema, ran `prisma db push`.
4. Added `STAGE_CHANGE` event type to `events.ts` with `userId`, `applicationId`, `title`, `message`; updated `emit()` to fire on `user:{userId}` channel.
5. Updated `sse.ts` to subscribe each student SSE connection to their personal `user:{userId}` EventBus channel.
6. Updated `recruiters.ts` PATCH to: store `applicationId` in the created notification, add REJECTED notification (previously missing), emit `STAGE_CHANGE` SSE event immediately after DB write.
7. Added `applicationId?: string` to `Notification` interface in frontend `api.ts`.
8. Rewrote `NotificationsScreen.tsx` to open an SSE connection on mount, refresh notification list on `STAGE_CHANGE` event, and navigate to `/applications/:applicationId` with `{ from: 'notification' }` router state on tap.
9. Updated `ApplicationDetailScreen.tsx` to detect `location.state.from === 'notification'` and route back to `/notifications` instead of `navigate(-1)`.
10. Rebuilt backend, restarted, verified backend logs showed clean startup.

### Phase 6 — Additional Bug Fixes and Feature Additions
1. **Cohort Drilldown anonymisation (then reversal):** Nulled `studentName` in existing DB records and changed backend/frontend to show only `cohortRef`. Later reversed this after user clarified they wanted real names shown to institution admins, and repopulated names via reverse-lookup on the `cohortRef` pattern.
2. **Offer Details tab switcher:** Added a two-tab switcher ("Offer Details" / "Job Details") to `ApplicationDetailScreen.tsx` visible only when `status === 'OFFERED'`. Offer Details tab shows Title, Salary, Start Date (To be confirmed), and Terms (Full-time, Permanent).
3. **Top Matches filter:** Fixed `JobsDiscoveryScreen.tsx` to filter `jobList` by `matchScore > 80` before slicing the top-2 cards for the "Top Matches for You" horizontal scroll section.
4. **Skill score denominator fix:** Fixed `Candidates.tsx` in the recruiter platform — skill scores displayed as `{level}/10` but the underlying values are 0–100; corrected to `{level}/100`.
5. **Demo login fix:** Verified all three demo account passwords and confirmed CORS was blocking login after backend was rebuilt without extended port range. Re-applied CORS fix and validated with `curl` preflights.
6. **Student name in Cohort Drilldown:** After the earlier anonymisation reversal, restored `studentName: profile?.name ?? null` to the outcomes write path and `o.studentName ?? o.cohortRef` to the frontend display. Repopulated 8 DB records for Alex Chan via a Node.js reverse-lookup script.

### Phase 7 — Git Branch Management and Push
1. Staged all 12 modified files across backend, student app, institutional platform, and recruiter platform.
2. Created new branch `feature/notifications-and-fixes` from `feature/recruiter-institutional-updates`.
3. Committed with a structured message describing all changes.
4. Pushed to `origin/feature/notifications-and-fixes` on GitHub (`yuenting3328/PathwayAI`).

---

## 2. Documents

### Backend Source Files

| File | Purpose |
|---|---|
| `backend/src/index.ts` | Main Fastify app entry point: CORS configuration, JWT plugin, multipart plugin, `authenticate` decorator, route prefix registration, health check, demo seed/reset endpoints, Neon keep-alive pinger |
| `backend/src/events.ts` | Node.js EventEmitter-based event bus (200 max listeners); defines `AppEvent` union type (`OUTCOME_REPORTED`, `CREDENTIAL_ISSUED`, `STAGE_CHANGE`); `emit()` routes to institution or user channels |
| `backend/src/routes/auth.ts` | `POST /register`, `POST /login`, `POST /refresh`, `GET /me`, `PATCH /me/profile`, `POST /alumni-transition` — bcryptjs hashing, JWT sign/verify |
| `backend/src/routes/jobs.ts` | `GET /` (list with filters + match score + saved status + applied exclusion), `GET /:id` (single job with match score), `POST /:id/save` (toggle saved) |
| `backend/src/routes/applications.ts` | Full CRUD for job applications, status transitions, interview date tracking, stats aggregation |
| `backend/src/routes/skills.ts` | List user skills, fetch skill gaps, update skill proficiency level |
| `backend/src/routes/credentials.ts` | List, submit, and generate expiring share links for user credentials |
| `backend/src/routes/coaching.ts` | AI coaching via Anthropic Claude SDK: chat, session recording, message history, coach health check |
| `backend/src/routes/programmes.ts` | List graduate programmes, alumni career paths, alumni events |
| `backend/src/routes/analytics.ts` | Student personal analytics, institution-level KPIs, cohort benchmarks |
| `backend/src/routes/market.ts` | Market signals, salary benchmarks, sector trends, district salaries, skills shortage, demand forecasts |
| `backend/src/routes/institution.ts` | Institution admin endpoints: programmes, graduate outcomes (filtered), credentials, snapshots, insights, alumni, partnership pipeline |
| `backend/src/routes/employers.ts` | Employer list, employer detail, employer relationship management |
| `backend/src/routes/outcomes.ts` | `POST /` — graduate self-reports accepted offer; creates `GraduateOutcome` with `studentName`, updates application stage to "Offer Accepted", emits `OUTCOME_REPORTED` SSE event |
| `backend/src/routes/recruiters.ts` | Recruiter job CRUD, candidate list/detail, `PATCH /candidates/:id` (status update + notification + SSE emit), campus events CRUD, recruiter analytics |
| `backend/src/routes/sse.ts` | SSE stream endpoint; subscribes per-connection to institution channel, credential channel, and user-specific `STAGE_CHANGE` channel; 25s keep-alive ping |
| `backend/src/routes/notifications.ts` | `GET /` (list for user), `PATCH /mark-read` (mark all read) |
| `backend/prisma/schema.prisma` | 35+ Prisma models: `User`, `Profile`, `Job`, `Application`, `Skill`, `UserSkill`, `Notification` (with `applicationId`), `Institution`, `Programme`, `GraduateOutcome`, `CoachSession`, `ChatMessage`, `UserCV`, `Employer`, `CampusEvent`, `IssuedCredential`, and 20+ analytics/time-series models |
| `backend/prisma/seed.ts` | Seeds 3 demo users, 15 employers, 15 jobs, 44 skills, 10 user skills, 9 applications, 3 credentials, 30 graduate outcomes, and full institution analytics data |
| `backend/prisma/seed-recruiter.ts` | Seeds recruiter-specific demo data |

### Student App Source Files

| File | Purpose |
|---|---|
| `PathwayAI App/src/app/App.tsx` | React Router 7 route table with 32 screen entries; `AuthProvider` wrapping; protected route guards |
| `PathwayAI App/src/app/lib/api.ts` | Typed API client: all `fetch` wrappers, token management, interface definitions for all domain types |
| `PathwayAI App/src/app/lib/useSSE.ts` | Generic SSE hook with exponential backoff reconnect; token passed as query param |
| `PathwayAI App/src/app/contexts/AuthContext.tsx` | Auth state, login/logout, token persistence to `localStorage` |
| `PathwayAI App/src/app/contexts/LanguageContext.tsx` | Bilingual EN/繁中 context; `t(en, zh)` helper used across all screens |
| `PathwayAI App/src/app/screens/HomeDashboardScreen.tsx` | Dashboard with stats, upcoming interviews, quick actions; SSE subscription for real-time credential and stage-change updates |
| `PathwayAI App/src/app/screens/JobsDiscoveryScreen.tsx` | Job list with filters, "Top Matches for You" (score > 80% only), horizontal card scroll, save toggle |
| `PathwayAI App/src/app/screens/JobDetailScreen.tsx` | Single job detail: match score circle, skill tabs, responsibilities, apply button, success bottom sheet |
| `PathwayAI App/src/app/screens/ApplicationsScreen.tsx` | All user applications with status badges and stage labels |
| `PathwayAI App/src/app/screens/ApplicationDetailScreen.tsx` | Application detail with Offer Details/Job Details tab switcher (OFFERED status only); accept offer flow; notification-aware back navigation |
| `PathwayAI App/src/app/screens/NotificationsScreen.tsx` | SSE-connected notification list; tap-to-navigate to application detail; mark-all-read |
| `PathwayAI App/src/app/screens/CareerCoachScreen.tsx` | Claude-powered AI chat interface |
| `PathwayAI App/src/app/screens/SkillsNavigatorScreen.tsx` | Browse skills, view gaps, access learning resources |
| `PathwayAI App/src/app/screens/CredentialsWalletScreen.tsx` | Credential list, submit, share via expiring link |
| `PathwayAI App/src/app/screens/AnalyticsScreen.tsx` | Personal analytics: conversion rate, skill trend, coach sessions |
| `PathwayAI App/src/app/screens/MarketRadarScreen.tsx` | Market signals, salary benchmarks, sector trends |

### Institutional Platform Source Files

| File | Purpose |
|---|---|
| `PathwayAI Institutional Platform/src/app/pages/Dashboard.tsx` | KPI band, employment trend chart, programme leaderboard, credential activity, insights |
| `PathwayAI Institutional Platform/src/app/pages/InstitutionalAnalytics.tsx` | Cohort Drilldown & Student Records table, programme drilldown panel, department summary, competency gap chart; live-updates via SSE on `OUTCOME_REPORTED` |
| `PathwayAI Institutional Platform/src/app/pages/CredentialManagement.tsx` | Issue HEAR credentials, track verification status |
| `PathwayAI Institutional Platform/src/app/pages/MarketIntelligence.tsx` | Market signals, salary benchmarks, skills shortage, demand forecasts |
| `PathwayAI Institutional Platform/src/app/pages/Alumni.tsx` | Alumni career stages, salary trajectory, engagement metrics |
| `PathwayAI Institutional Platform/src/app/pages/EmployerRelationship.tsx` | Employer tier management (Platinum/Gold/Silver), satisfaction trends, partnership pipeline |
| `PathwayAI Institutional Platform/src/app/pages/Curriculum.tsx` | Curriculum content mapped to market demand |
| `PathwayAI Institutional Platform/src/app/pages/Report.tsx` | Analytics export |

### Recruiter Platform Source Files

| File | Purpose |
|---|---|
| `PathwayAI Recruiter Platform/src/app/pages/Dashboard.tsx` | Recruiter KPIs, 6-month pipeline trend chart, applications by role |
| `PathwayAI Recruiter Platform/src/app/pages/Jobs.tsx` | Post, edit, close jobs; view applicant count per posting |
| `PathwayAI Recruiter Platform/src/app/pages/Candidates.tsx` | Candidate pipeline view; status update (Shortlisted / Interview / Offered / Rejected); skill score display (`{level}/100`) |
| `PathwayAI Recruiter Platform/src/app/pages/Competency.tsx` | Submit competency feedback scores to institution |
| `PathwayAI Recruiter Platform/src/app/pages/Events.tsx` | Create and manage campus recruiting events |

### Generated / Config Files

| File | Purpose |
|---|---|
| `backend/dist/` | Compiled TypeScript output (tsc); served by `node dist/index.js` in production |
| `backend/prisma/migrations/` | Prisma migration history |
| `PathwayAI_Progress_Report.md` | Academic progress report for GenAI Master's Programme covering PRD, 37 user stories across 8 epics, 6 system flowcharts, 40+ acceptance criteria, tech stack recommendations, Business Model Canvas (HKD pricing), and GenAI architecture appendix; updated to include ecosystem origin, prototype feature integration table (Feature 9), and revised out-of-scope classification distinguishing deferred vs prototype-proven items |
| `.git/` | Single git repository tracking all four platforms; remote: `github.com/yuenting3328/PathwayAI` |

---

## 3. PRD — Product Requirements Document

### Problem Statement
Hong Kong universities and their graduate employers operate in silos. Students lack real-time visibility into where their applications stand; recruiters manage candidate pipelines manually; institutions have no live view of graduate employment outcomes. The result is slow hiring, opaque decisions, and delayed outcome data that prevents institutions from improving their programmes.

The first iteration of PathwayAI (`aipathway.lovable.app`) validated strong student demand for personalised AI career guidance. Students engaged deeply with AI coaching, practised mock interviews, used HK-specific tools (MPF, Tax Wizard, CEF), and adopted the freemium subscription. However, the prototype also revealed that the most impactful student outcomes — getting shortlisted, receiving offers, having credentials verified — depend entirely on data and decisions held by institutions and recruiters. A student-only app cannot close that loop. This insight drove the three-sided ecosystem architecture: connecting all three parties so data flows where it needs to go, in real time.

### Vision
A unified, three-sided platform connecting students, recruiters, and institutions — with real-time data flowing between all three so every party has the information they need, exactly when they need it.

The current MVP (PathwayAI Ecosystem) establishes this three-platform architecture at a foundational level. The next phase integrates the depth of the `aipathway.lovable.app` prototype — AI coaching, career matching, HK-specific utilities, CV builder, market intelligence, and bilingual UX — into the ecosystem to deliver a production-ready product.

### Target Users

| User Type | Description |
|---|---|
| **Students / Graduates** | CUHK graduates and students seeking employment, tracking applications, developing skills, and communicating with an AI career coach |
| **Recruiters / HR** | HSBC and similar employers managing job postings, shortlisting candidates, scheduling interviews, and advancing offer pipelines |
| **Institution Admins** | CUHK career services administrators monitoring graduate employment outcomes, credential issuance, employer relationships, and programme performance |

### Objectives
1. Reduce the information gap between application submission and recruiter decision for students.
2. Enable recruiters to manage their full candidate pipeline in one place, with status changes propagating to students in real time.
3. Give institutions live employment outcome data as students accept offers, eliminating manual outcome surveys.
4. Surface personalised job recommendations ranked by skill match score to guide students toward suitable roles.
5. Provide an AI career coach accessible 24/7 for interview preparation, role research, and career planning.

### Scope

**In Scope:**
- Student job discovery with skill-based match scoring (0–100%) and filters (district, sector, salary, search)
- Job application tracking with stage-level granularity and recruiter-driven status updates
- Real-time push notifications from recruiter → student via Server-Sent Events (SSE) when status changes to Shortlisted, Moving to Interview, Offer Made, or Rejected
- Notification tap-through navigation directly to the relevant application detail page
- Offer Details view (Title, Salary, Start Date, Terms) on the application detail page when status is OFFERED
- AI career coaching powered by Anthropic Claude with persistent chat history
- Skills navigator with gap analysis against job requirements
- Credentials wallet with HEAR, degree, and certificate tracking and expiring share links
- Recruiter job posting and management (CRUD)
- Recruiter candidate pipeline with stage advancement and rejection
- Recruiter campus event creation and management
- Recruiter analytics (pipeline trend, sector breakdown, time-to-hire, top university)
- Institution analytics: graduate outcome tracking, programme performance, employer relationship management, market intelligence
- Real-time institution dashboard updates when graduates accept offers (SSE `OUTCOME_REPORTED`)
- Cohort Drilldown table showing student names alongside role, employer, sector, and salary band
- Bilingual interface (English / Traditional Chinese) across all student-facing screens
- Three separate Vite-based SPAs sharing one backend API

**Out of Scope — Ecosystem v1.0:**
- Mobile push notifications (APNS/FCM) — SSE used instead
- Multi-institution support (single CUHK institution in demo)
- Student-to-recruiter direct messaging
- CV parsing beyond upload storage
- Offer letter document generation
- Voice answer mode for Interview Simulator — requires real-time speech-to-text pipeline
- Third-party ATS integrations (Workday, Greenhouse) — enterprise dependency not needed for first pilot
- Alumni mentorship matching — requires critical mass of alumni accounts; later-phase network-effects feature

**Prototype-proven, planned for next phase integration:**
- iOS / Android native apps — shipped in `aipathway.lovable.app` via Capacitor; porting to ecosystem Student App is a next-phase priority
- In-app payment / subscription (Stripe) — Stripe Embedded Checkout, trial token system, and guest usage caps fully built in `aipathway.lovable.app` (HK$12/month); Stripe integration planned for ecosystem
- Personalised career matching — affinity scoring across 23 HK career profiles shipped in `aipathway.lovable.app`; porting is a next-phase priority
- HK utilities (Tax Wizard, MPF Calculator, CEF Tracker, Certifications Dictionary) — all shipped in `aipathway.lovable.app`; will be ported as standalone utility screens
- CV Builder (5 templates, PDF export) — form-based builder with html2canvas + jsPDF shipped in `aipathway.lovable.app`; ecosystem currently upload-only
- Bilingual UX (EN / 繁中) — 200+ translation keys and `LanguageContext` shipped in `aipathway.lovable.app`; ecosystem Student App is English-only at v1.0
- Interview & Salary Negotiation Simulators — STAR-scored simulator and multi-turn AI HR negotiation shipped in `aipathway.lovable.app`; ecosystem coaching route provides the backend foundation

### Key Functional Requirements

| # | Requirement |
|---|---|
| FR-01 | Job list endpoint must exclude jobs the student has already applied to |
| FR-02 | Match score must be computed server-side for both job list and job detail endpoints |
| FR-03 | Recruiter status changes must create a `Notification` record with `applicationId` and emit a `STAGE_CHANGE` SSE event to the student within the same request handler |
| FR-04 | Student SSE stream must be authenticated via JWT query param (EventSource API cannot set headers) |
| FR-05 | "Top Matches for You" section must only show jobs with `matchScore > 80` |
| FR-06 | Skill proficiency levels are stored and displayed on a 0–100 scale |
| FR-07 | Tapping a notification with an `applicationId` must navigate to `/applications/:id` with `{ from: 'notification' }` state |
| FR-08 | Back button on Application Detail must return to `/notifications` when opened from a notification |
| FR-09 | CORS must allow all ports that Vite may allocate (5173–5180) to support varying dev environments |
| FR-10 | Graduate outcome records must store `studentName` (not anonymised) so institution admins can identify graduates by name |

### Business Model
- **Institutions:** HK$480,000/year per institution licence — full platform access for institution admin team
- **Recruiters:** HK$2,400/month per recruiter seat — job posting, candidate management, analytics
- **Students:** Always free — job discovery, applications, coaching, credentials

---

## 4. Project Tech Architecture and Tools Used

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                 │
│  Student App        Institutional        Recruiter Platform     │
│  (React, port 5177) Platform             (React, port 5179)    │
│                     (React, port 5178)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │  REST + SSE over HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FASTIFY BACKEND (port 4000)                 │
│                                                                 │
│  JWT Auth  │  Zod Validation  │  Prisma ORM  │  EventBus SSE   │
│                                                                 │
│  15 Route Modules  │  Anthropic Claude SDK (AI coaching)        │
└─────────────────────────────┬───────────────────────────────────┘
                              │  Prisma Client
                              ▼
                    ┌─────────────────────┐
                    │  PostgreSQL 16       │
                    │  (local dev)         │
                    └─────────────────────┘
```

### Backend

| Component | Technology | Version | Notes |
|---|---|---|---|
| HTTP Framework | Fastify | 5.x | Plugin-based, schema-aware, high throughput |
| Language | TypeScript | 5.9 | Compiled to ESM via `tsc` |
| Runtime | Node.js | 22+ | ESM modules (`"type": "module"`) |
| ORM | Prisma | 6.19 | Schema-first, type-safe query builder |
| Database | PostgreSQL | 16 | Primary data store |
| Authentication | @fastify/jwt | 9.x | HS256 JWT; 15-minute access tokens, 7-day refresh tokens |
| CORS | @fastify/cors | 11.x | Origin whitelist: ports 5173–5180 + 3000 |
| File Upload | @fastify/multipart | — | 5 MB limit; used for CV upload |
| Password Hashing | bcryptjs | — | 12 salt rounds |
| Validation | Zod | — | Request body/query parsing throughout all routes |
| AI / LLM | @anthropic-ai/sdk | 0.96+ | Claude model; career coaching chat and session scoring |
| PDF Parsing | pdf-parse | — | Extract text from uploaded CV PDFs |
| DOCX Parsing | mammoth | — | Extract text from Word CVs |
| Real-time | Node.js EventEmitter | built-in | EventBus with 200 max listeners; SSE over PassThrough streams |
| Dev runner | tsx | 4.19 | Watch mode for TypeScript without explicit compile |

### Frontend (All Three Platforms)

| Component | Technology | Version | Notes |
|---|---|---|---|
| UI Framework | React | 18.3.1 | Functional components, hooks throughout |
| Routing | React Router | 7.13.0 | File-based declarative routes |
| Build Tool | Vite | 6.3.5 | HMR, fast builds, ESM-native |
| Styling | Tailwind CSS | 4.1.12 | Utility-first; dark theme via CSS custom properties |
| Component Library | Radix UI | Various | Accessible unstyled primitives (30+ components) |
| Icons | Lucide React | 0.487 | Consistent icon set across all three apps |
| Charts | Recharts | 2.15.2 | Line, bar, pie, area charts for analytics dashboards |
| Animation | Motion (Framer Motion) | 12.23 | Page transitions, card hover effects, bottom sheets |
| Forms | React Hook Form | 7.55 | Recruiter job posting forms |
| Notifications (UI) | Sonner | 2.0.3 | Toast notifications |
| Carousel | Embla Carousel | 8.6.0 | Horizontal job card scroll on discovery screen |
| Markdown | — | — | AI chat responses rendered as plain text with manual formatting |

### Student App Specific

| Feature | Implementation |
|---|---|
| Real-time SSE | `useSSE` custom hook with exponential backoff reconnect |
| Token storage | `localStorage` (`pathwayai_token`, `pathwayai_refresh_token`) |
| Bilingual | `LanguageContext` with `t(en, zh)` helper; 200+ translation strings |
| Auth guard | `AuthContext` wrapping; unauthenticated users redirected to `LoginScreen` |
| Notification tap | `navigate('/applications/:id', { state: { from: 'notification' } })` pattern |

### Infrastructure and Tooling

| Tool | Purpose |
|---|---|
| Git | Version control; single monorepo for all four platforms |
| GitHub | Remote: `github.com/yuenting3328/PathwayAI`; three branches: `main`, `feature/recruiter-institutional-updates`, `feature/notifications-and-fixes` |
| pnpm | Package manager (student app and institutional platform); npm (backend) |
| npx prisma | Schema push, migration, client generation |
| curl | Manual API testing and CORS preflight validation |
| `/tmp/*.log` | Background process log capture for backend and all three Vite servers |

---

## 5. Key Challenges Encountered

### Challenge 1 — CORS Port Mismatch (Recurring)
**What happened:** Vite allocates ports sequentially starting from its configured default. When ports 5173–5176 were already occupied by other processes, Vite assigned the three apps to ports 5177, 5178, and 5179. The backend CORS allowlist only covered 5173–5175. Every browser request triggered a CORS preflight failure, blocking all logins across all three platforms.

**Why it was hard:** The backend had previously been extended to cover 5176–5180, but a `git restore` on `backend/src/index.ts` reverted that change. A subsequent backend rebuild (for the match score fix) compiled the reverted source, making the compiled `dist/` match the restricted source again. The symptom — login silently failing — did not clearly indicate a CORS cause from the browser's perspective.

**Impact:** Complete loss of demo functionality across all three platforms until diagnosed and fixed.

**Resolution:** Added ports 5173–5180 to the CORS origin array, rebuilt, restarted backend, and validated with `curl -X OPTIONS` preflight checks before reporting the fix.

---

### Challenge 2 — Match Score Showing Only "%" (Three Misdiagnoses)
**What happened:** The job detail page displayed the Match Score circle with "%" and no number. The correct percentage was visible on the job list card.

**Why it was hard:** The natural first assumption was a rendering issue — the circle was too small, the font was too large, or the value was being truncated. Three UI-only fixes were attempted (adjusting `text-xl`, resizing the container, changing font weight and line height), all of which the user correctly rolled back because the number was still missing.

**Root cause:** The backend `GET /api/v1/jobs/:id` endpoint computed `skillsMatch` (`{ have, total }`) but never computed `matchScore`. The list endpoint `GET /api/v1/jobs` computed both. The frontend rendered `{job.matchScore}%` where `job.matchScore` was `undefined`, which JSX renders as an empty string — so the output was literally just `%`.

**Impact:** Three wasted iterations and three rollbacks before the backend was inspected. Added significant friction to the session.

**Resolution:** Added `matchScore` computation to the single-job endpoint in `backend/src/routes/jobs.ts`, rebuilt, and restarted.

**Lesson:** Always inspect the API response in the browser network tab before touching UI code.

---

### Challenge 3 — Real-Time Notification Architecture
**What happened:** Implementing recruiter-to-student push notifications required changes across six files in two codebases. The existing SSE infrastructure only supported institution-scoped and credential-level channels — there was no concept of a user-scoped channel for arbitrary events.

**Why it was hard:** The changes were tightly coupled: the schema needed `applicationId` before the route could write it; the event type needed defining before SSE could subscribe to it; the SSE subscription needed to exist before the frontend could listen. A mistake in any layer would break the whole flow silently (no error, just no notification arriving).

**Impact:** Required careful sequencing — schema push first, then event type, then SSE subscription, then route emit, then frontend changes — with a backend rebuild and restart before the frontend could be tested.

**Resolution:** Methodically read all six files first to map the full dependency graph, then made changes bottom-up (schema → events → SSE → route → frontend).

---

### Challenge 4 — Student Name vs. Anonymisation Reversal
**What happened:** The user asked to "clean up the Alex Chan record" in the Cohort Drilldown table. This was interpreted as a request to anonymise the data, leading to: setting `studentName = null` in the backend write path, clearing names from 6 DB records, and changing the frontend to always show `cohortRef`. The user then immediately requested the opposite: display student names, not student numbers.

**Impact:** Required a three-step reversal: restore the backend write, restore the frontend display, and repopulate the DB names. The repopulation required a custom Node.js script to reverse-lookup user IDs from the `cohortRef` pattern (`G${userId.slice(-6).toUpperCase()}`).

**Resolution:** Wrote an inline Node.js ESM script using Prisma Client to find all null-name outcomes, extract the ID suffix from each `cohortRef`, query the matching `User`, and update the record. Restored 8 records (all Alex Chan's accepted-offer records).

---

### Challenge 5 — Demo Account Password Discrepancy
**What happened:** The institutional admin demo login (`admin@cuhk.edu.hk`) consistently returned "Invalid credentials". The password being tested was `admin123`.

**Root cause:** The seed file (`seed.ts`) hashed `admin123456`, not `admin123`. The institutional platform's own login screen displayed the correct hint (`Demo: admin@cuhk.edu.hk / admin123456`), confirming the seed was correct and the test password was wrong.

**Impact:** Institution admin demo was completely inaccessible during CORS debugging, making it unclear whether the failure was CORS or credentials.

**Resolution:** Confirmed correct password by reading the seed file and the institutional platform login screen hint, then validated directly with `curl`.

---

## 6. Iteration Progress, Explaining What Was Improved

### Iteration 1 — Feature Attempt and Rollback
**Changes attempted:** Career match suggestion screen and interview simulation screen in the student app, with supporting backend routes.

**Problem:** Features exceeded the stable prototype boundary. The demo flow broke and authentication state behaved unexpectedly with the new routes.

**Decision:** Full rollback via `git restore` to `feature/recruiter-institutional-updates` HEAD. The codebase was confirmed clean by restarting servers and verifying the student app loaded correctly.

**Why this was right:** Shipping unstable features in a demo-first product damages credibility more than the absence of features. A clean rollback cost one iteration but protected demo reliability.

---

### Iteration 2 — Backend Match Score Fix
**Before:** `GET /api/v1/jobs/:id` returned `{ ...job, saved, skillsMatch }`. `matchScore` was absent. JSX rendered `{undefined}%` → `%`.

**After:** Added to the detail endpoint:
```typescript
const have = job.skills.filter(s => userSkillNames.has(s.toLowerCase())).length;
const matchScore = job.skills.length ? Math.round((have / job.skills.length) * 100) : 0;
return { ...job, saved: !!saved, skillsMatch: { have, total: job.skills.length }, matchScore };
```

**Impact:** Job detail page now shows the correct percentage (e.g. 87%) in the match score circle. The data was always correct server-side for the list endpoint; this brought the detail endpoint into parity.

---

### Iteration 3 — CORS Extended Port Range
**Before:** `origin: ['http://localhost:5173', ..., 'http://localhost:5175', 'http://localhost:3000']`

**After:** Added `5176` through `5180` to cover any port Vite may allocate when lower ports are occupied.

**Impact:** All three demo platforms can log in regardless of which ports Vite happens to assign at startup. This is a durable fix for the dev environment without requiring manual port management.

---

### Iteration 4 — Push Notification System (Full Stack)
**Before:** Recruiter status changes created a `Notification` DB record (except for REJECTED). No SSE event was emitted. Student notification screen polled on mount only. Notification cards were not tappable. Back button on Application Detail always went to browser history.

**After (6 changes across 2 codebases):**

| Layer | Change |
|---|---|
| DB Schema | Added `applicationId String?` to `Notification` |
| Event Bus | Added `STAGE_CHANGE` event type; `emit()` fires on `user:{userId}` channel |
| SSE route | Each student connection subscribes to `user:{userId}` EventBus channel |
| Recruiter route | PATCH stores `applicationId` in notification; adds REJECTED case; emits SSE immediately |
| Notification screen | Opens EventSource on mount; refreshes list on `STAGE_CHANGE`; tapping navigates to application detail |
| Application Detail | Detects `location.state.from === 'notification'`; routes back to `/notifications` |

**Impact:** When a recruiter clicks "Shortlist", "Move to Interview", "Offer Made", or "Reject" in the recruiter platform, the student sees a push notification within seconds, can tap it to open the exact application, and the back button returns them to their notification centre.

---

### Iteration 5 — Offer Details Tab Switcher
**Before:** Application Detail for an OFFERED application showed a flat page of job information — the same layout as PENDING or INTERVIEW status.

**After:** Added a pill-style tab switcher visible only when `status === 'OFFERED'` (or post-acceptance). "Offer Details" tab (default) shows Title, Salary, Start Date, and Terms in a clean list card. "Job Details" tab shows the existing content (key info grid, responsibilities, requirements, skills, notes).

**Impact:** Students with an offer can immediately see the offer-specific information without scrolling through job description content. The switcher defaults to "Offer Details" on load, foregrounding the most relevant information at that stage.

---

### Iteration 6 — Top Matches Filter
**Before:** `jobList.slice(0, 2)` — the first two jobs returned by the API, regardless of match score.

**After:** `jobList.filter(j => j.matchScore > 80).slice(0, 2)` — only jobs the student has a strong skill match for appear in the "Top Matches for You" section.

**Impact:** The section now delivers on its name. A student with a 45% match against all available jobs will see an empty "Top Matches" section rather than misleading low-match cards presented as top picks. Combined with the match score backend fix, the scores are now reliable inputs for this filter.

---

### Iteration 7 — Skill Score Denominator Fix
**Before:** Recruiter candidate profile showed skill badges as `{name} · {level}/10` (e.g., "SQL · 75/10").

**After:** `{name} · {level}/100` (e.g., "SQL · 75/100").

**Impact:** Minor but meaningful — the underlying values are always 0–100 integers. Displaying `/10` implied a maximum of 10, making a score of 75 look implausible and undermining recruiter trust in the data.

---

### Iteration 8 — Student Name Restoration in Cohort Drilldown
**Before (post-mistaken anonymisation):** All outcome records showed cohort references (e.g., `GJ3CU1O`) instead of student names. `studentName` was being set to `null` on every new outcome write.

**After:** `studentName: profile?.name ?? null` restored in `outcomes.ts`. Frontend display restored to `o.studentName ?? o.cohortRef`. DB repopulation script ran to restore "Alex Chan" across 8 live records.

**Impact:** Institution admins can identify graduates by name in the Cohort Drilldown table. The cohort reference (`A001`–`A030` for seeded historical data) remains the fallback for anonymised seed records that have no linked user account.

---

## 7. Lessons Learned

### 1. Inspect the API before touching the UI
The match score bug cost three full iterations because the symptom (missing number) was assumed to be a display issue. The root cause was a missing field in the API response. A 30-second check of the browser Network tab — or a `curl` call to `GET /jobs/:id` — would have surfaced the missing `matchScore` field immediately.

**Practice going forward:** For any value that renders blank or incorrect, confirm its presence and value in the raw API response before writing any frontend code.

---

### 2. Backend rebuilds must be followed by restarts
When TypeScript source changes, `npm run build` compiles to `dist/`. Without a process restart, the running Node.js process continues executing the old compiled code. Every code change to the backend requires: `build` → `pkill -f "node dist/index.js"` → `npm start`. CORS fixes and route changes that appear to have no effect are almost always caused by a stale running process.

**Practice going forward:** Treat build + restart as a single atomic operation. Never test a backend change without confirming the new process is running (check PID in startup log).

---

### 3. CORS must account for dynamic port allocation
Vite's port allocation is sequential and non-deterministic if other processes are already listening on the configured port. A fixed allowlist of `5173`–`5175` is brittle in a dev environment where multiple projects run simultaneously. The fix (allowing `5173`–`5180`) is low risk and high value.

**Practice going forward:** In any multi-app dev environment, widen the CORS port range generously or use a pattern match. Never assume Vite will get the configured port.

---

### 4. Interpret ambiguous requests carefully before acting
"Clean up the Alex Chan record" was ambiguous — it could mean remove the name (anonymise) or fix something wrong about the record. Acting on the first interpretation without asking caused a three-step reversal that consumed a full iteration.

**Practice going forward:** When a request involves data deletion or irreversible modification, ask a clarifying question first, especially when the intent could have two opposite meanings.

---

### 5. SSE changes require the full dependency chain to be in order
Adding a new SSE event type required coordinated changes across schema, event bus, SSE route, recruiter route, and frontend — in that exact order. Making changes out of order (e.g. emitting an event type before the subscriber exists) results in silent failure that is very difficult to debug.

**Practice going forward:** For SSE or event-driven features, always map the full dependency graph before writing a single line of code. Build bottom-up: data layer → event definition → emitter → subscriber → UI.

---

### 6. Rollbacks are a legitimate product tool, not a failure
The first iteration — attempting career match and interview simulation — was rolled back cleanly rather than shipped broken. This was the correct decision. A clean, working demo with fewer features is worth more than a broken demo with more features.

**Practice going forward:** Treat rollback as a first-class operation. The git workflow (feature branches, clean commits) made rollback fast and safe. Maintain this discipline.

---

### 7. Always validate the demo end-to-end after any backend change
Every backend change — even a one-line fix — can affect CORS, authentication, or data shapes in ways that break the demo flow. After any backend modification, the minimum validation is: login works on all three platforms, the changed endpoint returns the correct shape, and the primary demo path executes without errors.

---

## 8. Future Opportunities for Improvement

### 8.0 Next Phase — Integrating the Prototype Feature Set
**Current state:** The PathwayAI Ecosystem MVP establishes the three-platform infrastructure: authentication, job discovery, application tracking, real-time notifications, candidate pipeline management, and institution analytics. However, the student experience is relatively thin compared to the prototype (`aipathway.lovable.app`), which had a significantly richer feature set built specifically around student needs.

**Opportunity:** Integrate the following prototype features into the ecosystem Student App, now backed by the live shared backend:

| Feature (from prototype) | Current MVP state | Integration work |
|---|---|---|
| AI Career Coaching (Claude, SSE streaming) | Basic chat exists | Extend with session scoring, history, HK-specific context injection |
| Personalised Career Matching (23 profiles, affinity scoring) | Not in ecosystem | Port matching engine; surface top matches on student dashboard |
| Interview Simulator (STAR scoring, XP, difficulty levels) | Not in ecosystem | Build screen, wire to coaching backend route |
| Salary Negotiation Simulator (AI HR persona, benchmarks) | Not in ecosystem | New coaching session type |
| Career Switch Analyzer (feasibility + skill gap) | Not in ecosystem | New screen + Claude prompt |
| CV Builder (5 templates, PDF export) | Upload only (no builder) | Port form + templates; connect to student profile |
| HK Tax Wizard (BIR60, Salaries Tax logic) | Not in ecosystem | Static utility; port directly |
| MPF Calculator (5% cap, progressive brackets) | Not in ecosystem | Static utility; port directly |
| CEF Tracker (HK$25,000 ceiling) | Not in ecosystem | Static utility; port directly |
| Certifications Dictionary (120+ certifications) | Not in ecosystem | Static or API-backed |
| Bilingual UI — EN / 繁中 (`t()` helper) | Not in ecosystem | Add `LanguageContext` to Student App |
| Gamification (XP, badge tiers) | Not in ecosystem | Add XP events to coaching and application milestones |
| Freemium / subscription model (Stripe) | Not in ecosystem | Add premium gates; integrate Stripe |

**Impact:** This integration transforms the PathwayAI Ecosystem from a technical proof-of-concept into a fully operational product — combining the three-sided data architecture of the ecosystem with the student-facing depth of the prototype.

---

### 8.1 Real Mobile Push Notifications
**Current state:** Notifications are delivered via SSE, which requires an open browser tab. If the student closes the student app, they receive no notification until they reopen it.

**Opportunity:** Integrate Apple Push Notification Service (APNS) and Firebase Cloud Messaging (FCM) for true background push delivery. The backend would need a device token registration endpoint and a push dispatch layer. Libraries: `node-apn` (iOS), `firebase-admin` (Android/web).

**Impact:** High — students would receive offer and interview notifications on their lock screen, dramatically improving engagement with time-sensitive status changes.

---

### 8.2 Replace SSE with WebSockets for Lower Latency Bidirectionality
**Current state:** SSE is one-directional (server → client) and uses HTTP long-polling semantics. The EventBus is in-process, limiting horizontal scaling.

**Opportunity:** Replace SSE with WebSockets (e.g. via `ws` or `socket.io`) and an external pub/sub layer (Redis Pub/Sub or Upstash Redis). This would enable bidirectional events, allow multiple backend instances, and support client-acknowledged delivery.

**Impact:** Medium — essential before moving to production with multiple backend replicas. Not urgent for single-instance demo.

---

### 8.3 Offer Details as First-Class Data
**Current state:** The "Offer Details" tab shows Start Date as "To be confirmed" and Terms as "Full-time, Permanent" — both hardcoded placeholders because the data model has no offer-specific fields.

**Opportunity:** Add `offerStartDate DateTime?`, `offerTerms String?`, and `offerExpiry DateTime?` to the `Application` model. Add a recruiter UI to fill these fields when setting status to OFFERED. Surface them in the student Offer Details tab and trigger a reminder notification when `offerExpiry` approaches.

**Impact:** Medium — makes the offer flow genuinely useful rather than cosmetic. Connects to a real recruiter workflow.

---

### 8.4 Multi-Institution Support
**Current state:** The backend implicitly assumes one institution (CUHK). Institution lookup is by `user.institutionId` and all seed data belongs to a single institution record.

**Opportunity:** Add institution-level routing, multi-tenant data isolation (all analytics queries already filter by `institutionId`), and an institution onboarding flow. Each institution would have its own admin account, employer relationships, and programme data.

**Impact:** High for commercial viability — the business model is institutional licences at HK$480,000/year, so supporting multiple institutions is the path to revenue.

---

### 8.5 AI-Powered Candidate Ranking for Recruiters
**Current state:** Recruiters see candidates ordered by `appliedDate desc` with a manually computed match score.

**Opportunity:** Use Claude to generate a ranked shortlist with reasoning — ingesting the job requirements, the candidate's skills/GPA/credentials, and their coaching session history to produce a fit narrative alongside the score. This would surface in the Candidates page as an AI Rank column with expandable reasoning.

**Impact:** High differentiator — distinguishes PathwayAI from generic ATS platforms and delivers direct recruiter value.

---

### 8.6 CV Parsing and Auto-Profile Population
**Current state:** Students can upload a CV (PDF/DOCX), which is parsed and stored as raw text in `UserCV.rawText`. The parsed text is not used to populate profile fields or skills.

**Opportunity:** After upload, send the extracted text to Claude with a structured extraction prompt to populate `Profile` fields (name, university, faculty, GPA, graduation year) and `UserSkill` entries automatically. Show a confirmation screen letting the student approve or edit the extracted data before saving.

**Impact:** Medium — significantly reduces onboarding friction. Students currently fill in profile data manually across multiple screens.

---

### 8.7 Addressing Technical Debt

| Item | Description | Priority |
|---|---|---|
| CORS port range | Port range `5173–5180` is still a fixed whitelist. Replace with an environment variable or regex origin function. | Low |
| Token refresh flow | Access tokens expire in 15 minutes. The frontend does not currently auto-refresh using the refresh token — users get logged out silently. Implement an Axios/fetch interceptor to call `/auth/refresh` on 401. | High |
| Skill score normalisation | Skill levels (0–100) are integers in the DB but the recruiter PATCH endpoint for advancing candidates does not validate or update skill levels. Levels only change via `PUT /api/v1/skills/:id`. | Low |
| Offer start date and terms | Hardcoded in frontend. Needs DB fields, backend write, and recruiter UI input. | Medium |
| `_seed` and `_reset-demo` endpoints | Exposed without authentication in `index.ts`. Should be protected by a secret header or removed in production. | High (security) |
| SSE per-process EventBus | `eventBus` is an in-process `EventEmitter`. In a horizontally scaled deployment, a student's SSE connection on server A will not receive events emitted on server B. Replace with Redis Pub/Sub before going multi-instance. | High (scaling) |
| Vite target ports | The three apps have default ports `5173`, `5174`, `5175` in `vite.config.ts`, but other processes typically occupy these. Document the expected port assignment or add `.env` overrides. | Low |

---

### 8.8 Analytics and Observability
**Current state:** No application-level observability. Errors are `console.error`-only. No request tracing, no error aggregation, no uptime monitoring.

**Opportunity:**
- **Error tracking:** Sentry (Node.js SDK for backend, React SDK for frontends) — captures stack traces, request context, user ID
- **Analytics:** PostHog — product analytics for student engagement, feature adoption, funnel conversion
- **Uptime:** Better Uptime or Checkly — endpoint monitoring and on-call alerting
- **Structured logging:** The backend already uses Fastify's pino logger (JSON format). Add a log drain to Datadog or Logtail for searchable, alertable log aggregation

**Impact:** Essential before any real-user deployment. Silent errors in a career platform erode trust rapidly.
