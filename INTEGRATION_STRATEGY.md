# PathwayAI — Full-Stack Integration Strategy
> Based on direct analysis of source files in `PathwayAI App/` and `PathwayAI Institutional Platform/`

---

## 1. Current Architecture Assessment

### What Both Apps Are Today

Both apps are **pure React frontends with zero backend**. Every number, record, and chart is
hardcoded inside the component or in two data files:

| App | Data location | Persistence |
|-----|--------------|-------------|
| PathwayAI App | `src/app/data/mockData.ts`, `src/app/data/marketSignalData.ts` | `localStorage("targetRole")` only |
| Platform | Inline arrays inside each page component (`Dashboard.tsx`, `InstitutionalAnalytics.tsx`, etc.) | None |

### Key Entities Found in Source Code

#### PathwayAI App (`mockData.ts` + screens)

| Entity | Source | Fields confirmed in code |
|--------|--------|--------------------------|
| `Job` | `mockJobs[]` | id, title, company, district, salaryMin, salaryMax, matchScore, saved, responsibilities, requirements, skills[], skillsMatch{have,total}, experienceGap |
| `Skill` | `mockSkills[]` | id, name, level, gap, impact, description, actions[{type,title,provider}] |
| `Programme` | `mockProgrammes[]` | id, name, logo, deadline, salary, successRate, sector, location, studentsJoined, description |
| `AlumniPath` | `mockAlumniPaths[]` | id, name, typicalRoles[], timeToTransition, description |
| `Credential` | `mockCredentials[]` | id, category, name, issuer, status, date |
| `Analytics` | `mockAnalytics` | applications, interviews, offers, conversionRate, cohortComparison, matchScoreTrend[] |
| `MarketSignal` | `allMarketSignals[]` | id, tab, badge, title, metric, salary{low,mid,high}, details{openings, competition, topCompanies[], keySkills[], insight} |
| `Application` | `ApplicationsScreen.tsx` | id, company, position, status, appliedDate, interviewDate, stage |
| `User` | `BasicInfoScreen.tsx` | name, email, phone, university, major, graduationYear, preferredName |

#### PathwayAI Institutional Platform (page components)

| Entity | Source | Fields confirmed in code |
|--------|--------|--------------------------|
| `GraduateOutcome` | `InstitutionalAnalytics.tsx` (cohortRecords) | id, outcomeStatus, roleTitle, sector, salaryBand, location |
| `Programme` | `InstitutionalAnalytics.tsx` (programmePerformance) | id, programme, faculty, employmentRate, medianSalary, timeToOffer, targetRoles, satisfaction |
| `Department` | `InstitutionalAnalytics.tsx` (departmentSummary) | faculty, avgEmployment, avgSalary, benchmark, delta |
| `EmployerPartner` | `EmployerRelationship.tsx` (topPartnerships) | employer, type, students, events, satisfaction, value(tier) |
| `PipelineStage` | `Dashboard.tsx` + `EmployerRelationship.tsx` | stage, count, conversionRate |
| `AlumniRecord` | `Alumni.tsx` | employer, alumni count, sectors[], avgTenure |
| `CoachingMetric` | `Alumni.tsx` (coachingMetrics) | week, sessions, satisfaction, actionsTaken |
| `Credential (issued)` | `Dashboard.tsx` | issued count, shared, verified, downloadRate |
| `KPI` | `Dashboard.tsx` | employmentRate, HEARCredentials, activePartners, avgTimeToOffer |

### Data Flow Gaps (current state)

```
App User completes interview ──────────────────────────────► NOTHING
App User earns credential ─────────────────────────────────► NOTHING
Employer posts job on Platform ────────────────────────────► NOTHING (App has separate mockJobs)
Platform issues HEAR credential ───────────────────────────► NOTHING (App has separate mockCredentials)
App tracks 14 applications ────────────────────────────────► Platform shows "1,876 applications" (unrelated mock)
Platform tracks 3,458 coaching sessions (Alumni.tsx L9) ───► App Coach has no persistence
```

**Every number in both apps is disconnected.** Integration replaces all of these with live data.

---

## 2. Integration Requirements

### Data Flows Required (bi-directional)

```
PathwayAI App  ──────────────────────────►  Platform
  User profile & graduation data             Graduate record creation
  Job application submitted                  Student applications count (EmployerRelationship)
  Application status updated                 Cohort drilldown record update
  Credential shared by user                  Credential verification event
  Coach session completed                    AI Coaching Sessions KPI (Alumni.tsx L9)
  Skill assessment recorded                  Skills Supply metric (Dashboard skillsData)
  Target role set (localStorage → API)       Programme alignment data

Platform  ──────────────────────────────►  PathwayAI App
  Jobs posted by employer partners           mockJobs → live GET /api/jobs
  Programme data published                   mockProgrammes → live GET /api/programmes
  Alumni path data                           mockAlumniPaths → live GET /api/alumni-paths
  HEAR credential issued                     mockCredentials → live GET /api/credentials
  Market signal data curated                 allMarketSignals → live GET /api/market-signals
  Institution feature flags                  App branding/access control per university
```

### Shared Resources

| Resource | Owner (source of truth) | Consumer |
|----------|------------------------|----------|
| User identity | App (self-registered) | Platform reads via user_id |
| Job listings | Platform (employer-posted) | App displays in JobsDiscoveryScreen |
| Credentials | Platform (issues HEAR/badges) | App displays in CredentialsWalletScreen |
| Market signals | Platform (curated data team) | App MarketRadarScreen, Platform MarketIntelligence |
| Programme data | Platform (institution configures) | App ProgrammesScreen |
| Alumni paths | Platform (derived from graduate outcomes) | App AlumniPathsScreen |
| Application records | App (user submits) | Platform aggregate analytics |
| Coaching sessions | App (user initiates) | Platform Alumni coaching KPI |

### Sync Mode by Data Type

| Data | Mode | Rationale |
|------|------|-----------|
| Auth tokens | Synchronous (blocking) | Must resolve before any request |
| Job listings | REST polling (5-min cache) | Non-urgent, high read volume |
| Application status | Webhook from employer portal | User expects near-real-time update |
| Credential issuance | Event (Platform → App webhook) | Triggers App notification |
| Coaching session end | Async event (App → Platform) | Platform KPI updated within 15min |
| Analytics aggregates | Scheduled batch (nightly) | Dashboard charts, not real-time |
| Market signals | REST (24-hr cache) | Changes infrequently |
| User profile update | REST PUT (immediate) | User-triggered, synchronous |

### Conflicting Data Models

| Conflict | App field | Platform field | Resolution |
|----------|-----------|---------------|------------|
| Credential status | `status: 'verified' \| 'pending'` | issued/shared/verified counts | Add `credential_id` foreign key; Platform owns status |
| Salary format | `salaryMin/Max` (number) | `salaryBand` (string "HKD 22-26K") | Normalize to `salary_min_hkd` + `salary_max_hkd` integers in DB |
| Programme name | `name` string (App) | `programme` string (Platform) | Unified `programmes.name` field |
| Application stage | `stage` string ("Second Round") | Not tracked per-student | Map App stages to enum; Platform aggregates |
| User identifier | No persistent ID (no auth) | Anonymous ID "A001", "A002" | Introduce `user_id` UUID at auth layer |
| Institution | Hardcoded "CUHK" in Platform | No institution concept in App | Add `institution_id` to user profile |

---

## 3. Backend Architecture Design

### Recommended: Modular Monolith with Domain Services

A full microservices split is premature. A single deployable Node.js/TypeScript server with
clearly separated domain modules is faster to ship and easy to split later.

```
                    ┌──────────────────────────────────────┐
                    │           API Gateway Layer           │
                    │   JWT validation · Rate limiting      │
                    │   CORS (app origin + platform origin) │
                    └──────┬──────────────┬────────────────┘
                           │              │
              ┌────────────▼───┐    ┌─────▼──────────────┐
              │   App Domain   │    │  Platform Domain    │
              │                │    │                     │
              │  /auth         │    │  /institution       │
              │  /users        │    │  /graduates         │
              │  /jobs         │    │  /programmes        │
              │  /applications │    │  /employers         │
              │  /skills       │    │  /analytics         │
              │  /coach        │    │  /credentials/mgmt  │
              │  /credentials  │    │  /reports           │
              │  /market       │    │  /alumni            │
              │  /notifications│    │  /curriculum        │
              └────────┬───────┘    └──────────┬──────────┘
                       │                        │
                       └──────────┬─────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │      Shared Services         │
                   │  PostgreSQL (Prisma ORM)     │
                   │  Redis (cache + sessions)    │
                   │  Event Bus (BullMQ/Redis)    │
                   │  Notification service        │
                   └──────────────────────────────┘
```

### API Design

**Protocol:** REST for all CRUD. WebSocket for real-time notifications only.
**Format:** JSON, snake_case fields, ISO 8601 dates.
**Versioning:** `/api/v1/` prefix.
**Auth header:** `Authorization: Bearer <jwt>`

**Key endpoints mapped to current frontend data:**

```
# Replacing mockJobs in JobsDiscoveryScreen.tsx
GET  /api/v1/jobs?district=&sector=&level=&saved=

# Replacing mockSkills in SkillsNavigatorScreen.tsx
GET  /api/v1/users/:id/skills
PUT  /api/v1/users/:id/skills/:skillId

# Replacing mockProgrammes in ProgrammesScreen.tsx
GET  /api/v1/programmes?sector=&institution_id=

# Replacing mockAlumniPaths in AlumniPathsScreen.tsx
GET  /api/v1/alumni-paths?degree=&major=

# Replacing mockCredentials in CredentialsWalletScreen.tsx
GET  /api/v1/users/:id/credentials

# Replacing mockAnalytics in HomeDashboardScreen.tsx + AnalyticsScreen.tsx
GET  /api/v1/users/:id/analytics

# Replacing allMarketSignals in MarketRadarScreen.tsx
GET  /api/v1/market-signals?tab=sector|role|district

# Applications (ApplicationsScreen.tsx)
GET  /api/v1/users/:id/applications
POST /api/v1/users/:id/applications
PATCH /api/v1/applications/:id/status

# Coach sessions (CareerCoachScreen.tsx)
POST /api/v1/coach/sessions
GET  /api/v1/coach/sessions/:id
POST /api/v1/coach/sessions/:id/complete

# Platform: graduate outcomes (InstitutionalAnalytics.tsx)
GET  /api/v1/institutions/:id/analytics?cohort=&faculty=&level=&mode=&geography=

# Platform: employer relations (EmployerRelationship.tsx)
GET  /api/v1/institutions/:id/employers
POST /api/v1/institutions/:id/employers
GET  /api/v1/institutions/:id/employers/:id/pipeline

# Platform: credential management (CredentialManagement.tsx)
GET  /api/v1/institutions/:id/credentials
POST /api/v1/institutions/:id/credentials/issue

# Platform: reports (Report.tsx)
POST /api/v1/institutions/:id/reports/generate
GET  /api/v1/institutions/:id/reports/:id/download
```

### Authentication & Authorization

**Single JWT issuer** shared by both apps. Token payload:

```json
{
  "sub": "uuid-user-id",
  "email": "user@example.com",
  "role": "graduate" | "institution_admin" | "advisor" | "super_admin",
  "institution_id": "uuid-or-null",
  "programme_id": "uuid-or-null",
  "cohort_year": 2026,
  "iat": 1234567890,
  "exp": 1234567890
}
```

**RBAC rules:**

| Route | graduate | advisor | institution_admin |
|-------|----------|---------|-------------------|
| `GET /users/:id/*` | own id only | cohort members | all in institution |
| `GET /jobs` | ✓ | ✓ | ✓ |
| `POST /applications` | ✓ own | ✗ | ✗ |
| `GET /institutions/:id/analytics` | ✗ | own cohort | all programmes |
| `POST /credentials/issue` | ✗ | ✗ | ✓ |
| `GET /institutions/:id/employers` | ✗ | read | full CRUD |

**App login flow:**
```
User submits email/password
  → POST /auth/login → { access_token, refresh_token }
  → App stores access_token in memory, refresh_token in httpOnly cookie
  → All requests: Authorization: Bearer <access_token>
  → On 401: POST /auth/refresh → new access_token
```

**Platform login:** Same endpoint, same JWT. Role determines which UI is shown.

### Error Handling & Observability

```
Structured logs: JSON with { trace_id, user_id, institution_id, route, status, duration_ms }
Error taxonomy:
  400 → validation error (logged DEBUG)
  401 → token expired/invalid (logged INFO)
  403 → role insufficient (logged WARN + alert if repeated)
  404 → resource not found (logged DEBUG)
  500 → server error (logged ERROR + PagerDuty/Slack alert)

Middleware chain (every request):
  requestId → auth → rateLimit → validate → handler → errorHandler → responseLogger
```

---

## 4. Database Integration Strategy

### Recommended: Single PostgreSQL Instance, Schema-Separated

```
PostgreSQL 16
├── schema: identity    — users, sessions, refresh_tokens
├── schema: app         — profiles, jobs, applications, skills, coach_sessions, notifications
├── schema: platform    — institutions, programmes, graduates, employers, credentials_issued
└── schema: shared      — market_signals, alumni_paths, events
```

### Core Schema (Prisma DSL)

```prisma
// ── identity ──────────────────────────────────────────────
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  role          Role     @default(GRADUATE)
  created_at    DateTime @default(now())
  last_login_at DateTime?

  profile        Profile?
  institution_id String?
  institution    Institution? @relation(fields: [institution_id], references: [id])
  cohort_year    Int?

  @@schema("identity")
}

enum Role { GRADUATE ADVISOR INSTITUTION_ADMIN SUPER_ADMIN }

// ── app ───────────────────────────────────────────────────
model Profile {
  id                  String   @id @default(uuid())
  user_id             String   @unique
  user                User     @relation(fields: [user_id], references: [id])
  display_name        String?
  phone               String?
  university          String?
  major               String?
  graduation_year     Int?
  degree_level        String?  // 'bachelor' | 'master' | 'higher_diploma'
  target_role         String?  // replaces localStorage("targetRole")
  preferred_sectors   String[]
  desired_salary_min  Int?
  desired_salary_max  Int?
  working_mode        String?  // 'hybrid' | 'remote' | 'onsite'
  recruiter_visible   Boolean  @default(true)
  personality_profile Json?
  goals               Json?
  updated_at          DateTime @updatedAt

  experiences    Experience[]
  educations     Education[]
  projects       Project[]
  skill_records  UserSkill[]
  applications   Application[]
  credentials    UserCredential[]
  coach_sessions CoachSession[]

  @@schema("app")
}

model Job {
  id              String    @id @default(uuid())
  title           String
  company         String
  district        String
  sector          String
  salary_min      Int
  salary_max      Int
  experience_level String
  working_mode    String
  skills_required String[]
  responsibilities String
  requirements    String
  active          Boolean   @default(true)
  posted_at       DateTime  @default(now())
  closes_at       DateTime?
  employer_id     String?   // links to platform.Employer
  source          String    @default("manual")  // 'employer_portal' | 'manual'

  applications    Application[]
  saved_by        SavedJob[]

  @@schema("app")
}

model Application {
  id             String   @id @default(uuid())
  profile_id     String
  profile        Profile  @relation(fields: [profile_id], references: [id])
  job_id         String
  job            Job      @relation(fields: [job_id], references: [id])
  status         AppStatus @default(SUBMITTED)
  stage          String?   // 'First Round' | 'Second Round' | 'Technical Round'
  applied_at     DateTime  @default(now())
  interview_date DateTime?
  updated_at     DateTime  @updatedAt

  @@schema("app")
}

enum AppStatus { SUBMITTED UNDER_REVIEW INTERVIEW OFFER REJECTED CANCELLED }

model UserSkill {
  id         String   @id @default(uuid())
  profile_id String
  profile    Profile  @relation(fields: [profile_id], references: [id])
  skill_name String
  level      Int      // 0-100
  gap        String   // 'low' | 'medium' | 'high'
  impact     String   // 'low' | 'medium' | 'high'
  updated_at DateTime @updatedAt

  @@unique([profile_id, skill_name])
  @@schema("app")
}

model CoachSession {
  id           String   @id @default(uuid())
  profile_id   String
  profile      Profile  @relation(fields: [profile_id], references: [id])
  session_type String   // 'mock_interview' | 'career_advice' | 'skill_plan'
  questions    Json[]
  answers      Json[]
  feedback     Json?
  satisfaction Int?     // 1-10
  duration_sec Int?
  started_at   DateTime @default(now())
  completed_at DateTime?

  @@schema("app")
}

model UserCredential {
  id             String   @id @default(uuid())
  profile_id     String
  profile        Profile  @relation(fields: [profile_id], references: [id])
  credential_ref String?  // FK to platform.IssuedCredential.id
  category       String   // 'Degree & Transcript' | 'HEAR' | 'Certificates'
  name           String
  issuer         String
  status         String   @default("pending")  // 'pending' | 'verified'
  issued_date    DateTime?
  shared_at      DateTime?
  share_url      String?

  @@schema("app")
}

// ── platform ──────────────────────────────────────────────
model Institution {
  id         String   @id @default(uuid())
  name       String
  slug       String   @unique
  domain     String?  // 'cuhk.edu.hk'
  config     Json?    // branding, feature flags
  created_at DateTime @default(now())

  users        User[]
  programmes   Programme[]
  employers    Employer[]
  graduates    GraduateOutcome[]
  credentials  IssuedCredential[]

  @@schema("platform")
}

model Programme {
  id              String   @id @default(uuid())
  institution_id  String
  institution     Institution @relation(fields: [institution_id], references: [id])
  name            String
  faculty         String
  degree_level    String
  study_mode      String    // 'full_time' | 'part_time'
  cohort_year     Int
  employment_rate Decimal?
  median_salary   Int?
  time_to_offer   Int?      // days
  target_role_pct Decimal?
  satisfaction    Decimal?
  published       Boolean   @default(false)  // visible in App ProgrammesScreen when true
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  graduates   GraduateOutcome[]

  @@schema("platform")
}

model GraduateOutcome {
  id              String   @id @default(uuid())
  user_id         String?  // links to identity.User (nullable for imported alumni)
  institution_id  String
  institution     Institution @relation(fields: [institution_id], references: [id])
  programme_id    String
  programme       Programme @relation(fields: [programme_id], references: [id])
  cohort_year     Int
  outcome_status  OutcomeStatus
  role_title      String?
  sector          String?
  salary_min      Int?
  salary_max      Int?
  location        String?
  employer_name   String?
  time_to_offer   Int?     // days from graduation
  satisfaction    Int?     // 1-10 from survey
  recorded_at     DateTime @default(now())
  updated_at      DateTime @updatedAt

  @@schema("platform")
}

enum OutcomeStatus { EMPLOYED FURTHER_STUDY SEEKING OTHER }

model Employer {
  id              String   @id @default(uuid())
  institution_id  String
  institution     Institution @relation(fields: [institution_id], references: [id])
  name            String
  sector          String
  district        String?
  partnership_tier String?  // 'Standard' | 'Silver' | 'Gold' | 'Platinum'
  pipeline_stage  String   @default("Prospecting")
  satisfaction    Decimal?
  students_placed Int      @default(0)
  events_count    Int      @default(0)
  joined_at       DateTime?
  created_at      DateTime @default(now())

  job_postings    Job[]    // jobs this employer posted (links to app.Job)

  @@schema("platform")
}

model IssuedCredential {
  id              String   @id @default(uuid())
  institution_id  String
  institution     Institution @relation(fields: [institution_id], references: [id])
  user_id         String   // links to identity.User
  type            String   // 'HEAR' | 'degree' | 'badge' | 'certificate'
  programme_id    String?
  name            String
  issued_at       DateTime @default(now())
  verified        Boolean  @default(false)
  shared_count    Int      @default(0)
  download_count  Int      @default(0)

  @@schema("platform")
}

// ── shared ────────────────────────────────────────────────
model MarketSignal {
  id           String   @id @default(cuid())
  tab          String   // 'district' | 'role' | 'sector'
  badge        String
  badge_variant String
  title        String
  metric       String
  metric_label String
  description  String
  accent_variant String
  icon_name    String
  chart_color  String
  trend_data   Json     // Array<{month, value}>
  salary       Json     // {low, mid, high}
  details      Json     // {openings, competition, highlight, topCompanies[], keySkills[], insight}
  active       Boolean  @default(true)
  updated_at   DateTime @updatedAt

  @@schema("shared")
}

model AlumniPath {
  id                 String   @id @default(uuid())
  institution_id     String?  // null = universal
  degree_filter      String?  // filter by degree type
  name               String
  typical_roles      String[]
  time_to_transition String
  description        String
  alumni_percentage  Decimal?
  salary_range       String?
  active             Boolean  @default(true)
  updated_at         DateTime @updatedAt

  @@schema("shared")
}
```

### Data Consistency Strategy

| Scenario | Mechanism |
|----------|-----------|
| User applies for job (App) → Platform sees application count | Async event: `application.created` → Platform analytics worker increments count |
| Platform issues HEAR credential → App wallet shows it | Webhook: Platform POSTs to `/api/v1/internal/credentials/issued` → App creates `UserCredential` |
| Employer posts job (Platform) → appears in App job listing | Platform sets `job.active = true` → App queries same `job` table |
| Coach session ends → Platform KPI updates | Async event: `coach_session.completed` → BullMQ job → Platform increments `ai_coaching_sessions` counter |
| Graduate outcome recorded (Platform) → App alumni path updates | Nightly batch: aggregate `GraduateOutcome` → recompute `AlumniPath` statistics |
| User updates profile (App) → Platform graduate record | On `profile.updated`: if user has `institution_id`, sync relevant fields to `GraduateOutcome` |

---

## 5. Implementation Roadmap

### Phase 1 — Auth & User Identity (Weeks 1–3) `CRITICAL PATH`

Everything else blocks on this.

**Tasks:**
- Scaffold Node.js + TypeScript + Fastify project in `backend/`
- Install Prisma, configure PostgreSQL connection
- Run `prisma migrate dev` with `identity` schema (User, Role)
- Implement `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- Wire App's `BasicInfoScreen.tsx` to `POST /auth/register` + `PUT /users/:id/profile`
- Replace `localStorage("targetRole")` with `PATCH /users/:id/profile { target_role }`
- Add JWT middleware to all routes
- Wire Platform login to same auth endpoint (role: `INSTITUTION_ADMIN`)

**Verify:** User registers in App → logs into Platform with same credentials → role-appropriate UI shown.

---

### Phase 2 — Jobs & Applications (Weeks 4–6)

**Tasks:**
- Run migrations for `app.Job`, `app.Application`, `app.SavedJob`
- Seed `Job` table from `mockJobs` in `mockData.ts`
- Replace `JobsDiscoveryScreen.tsx` mock import → `GET /api/v1/jobs`
- Replace `JobDetailScreen.tsx` inline data → `GET /api/v1/jobs/:id`
- Wire `ApplicationsScreen.tsx` hardcoded array → `GET /api/v1/users/:id/applications`
- Wire Apply button → `POST /api/v1/users/:id/applications`
- Wire Platform `EmployerRelationship.tsx` talentHubData → `GET /api/v1/institutions/:id/talent-hub`

**Verify:** User applies for job in App → count appears in Platform employer dashboard within 15 minutes.

---

### Phase 3 — Skills, Credentials & Programmes (Weeks 7–9)

**Tasks:**
- Migrate `app.UserSkill`, `app.UserCredential`, `platform.IssuedCredential`, `platform.Programme`
- Seed `Programme` from Platform `programmePerformance` array
- Replace `SkillsNavigatorScreen.tsx` + `SkillDetailScreen.tsx` mock imports → live API
- Replace `CredentialsWalletScreen.tsx` mock → `GET /api/v1/users/:id/credentials`
- Replace `ProgrammesScreen.tsx` mock → `GET /api/v1/programmes`
- Implement `POST /api/v1/institutions/:id/credentials/issue`
- Platform credential issuance → webhook → App `UserCredential` created → notification pushed

**Verify:** Platform admin issues HEAR credential → App user sees it in wallet within 60 seconds.

---

### Phase 4 — Analytics, Coaching & Market Data (Weeks 10–12)

**Tasks:**
- Migrate `app.CoachSession`, `platform.GraduateOutcome`, `shared.MarketSignal`, `shared.AlumniPath`
- Seed `MarketSignal` from `allMarketSignals` in `marketSignalData.ts` (preserve all typed fields)
- Seed `AlumniPath` from `mockAlumniPaths`
- Replace `MarketRadarScreen.tsx` → `GET /api/v1/market-signals`
- Replace `AlumniPathsScreen.tsx` → `GET /api/v1/alumni-paths`
- Wire `CareerCoachScreen.tsx` session start/end to `POST /api/v1/coach/sessions`
- Replace `HomeDashboardScreen.tsx` mockAnalytics → `GET /api/v1/users/:id/analytics`
- Replace Platform `InstitutionalAnalytics.tsx` inline arrays → `GET /api/v1/institutions/:id/analytics`
- Replace Platform `Dashboard.tsx` kpiData, employmentTrends → live API
- Replace Platform `Alumni.tsx` coachingMetrics → aggregated from `CoachSession` table

**Verify:** Platform Dashboard KPIs match aggregated App user activity data.

---

### Phase 5 — Real-time Notifications & Platform Reports (Weeks 13–15)

**Tasks:**
- Add WebSocket server for App notifications (new job match, application status, credential issued)
- Replace `NotificationsScreen.tsx` hardcoded items → live WebSocket + `GET /api/v1/users/:id/notifications`
- Implement `POST /api/v1/institutions/:id/reports/generate` (PDF via Puppeteer/WeasyPrint)
- Wire Platform `Report.tsx` generate buttons to API
- Schedule nightly analytics batch job (BullMQ cron)
- Add Platform `Dashboard.tsx` AI insights feed → `GET /api/v1/institutions/:id/insights`
- Wire Platform AI Chat Assistant (`AIChatAssistant` in `App.tsx`) to Claude API

**Verify:** End-to-end: User completes coach session → Platform Alumni KPI updates → Platform admin generates UGC report containing real data.

---

### Technology Stack

| Layer | Choice | Justification |
|-------|--------|---------------|
| Runtime | Node.js 22 + TypeScript | Matches frontend ecosystem; strong async I/O |
| Framework | Fastify 5 | 2× faster than Express; built-in schema validation |
| ORM | Prisma 6 | Type-safe; schema-first; excellent migrations |
| Database | PostgreSQL 16 | ACID; JSONB for flexible fields (skill actions, signal details) |
| Cache | Redis 7 | Session store, BullMQ job queue, market signal cache |
| Job queue | BullMQ | Redis-backed; handles coach session events, analytics batch, notifications |
| Auth | jsonwebtoken + bcrypt | Lightweight; no vendor lock-in |
| Validation | Zod | Shared types between frontend and backend |
| File storage | AWS S3 / Cloudflare R2 | CV exports, credential PDFs, report files |
| Monitoring | Pino (logs) + OpenTelemetry | Structured JSON logs; trace IDs |
| Testing | Vitest + Supertest | Fast; compatible with Vite ecosystem |

### Frontend Wiring Pattern

Each screen should follow this pattern when replacing mock data:

```typescript
// Before (mockData.ts import)
import { mockJobs } from '../data/mockData';

// After (API hook)
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

const { data: jobs, isLoading } = useQuery({
  queryKey: ['jobs', filters],
  queryFn: () => apiClient.get('/jobs', { params: filters }),
  staleTime: 5 * 60 * 1000, // 5-min cache matches market data frequency
});
```

Add `@tanstack/react-query` + a thin `apiClient` (axios or fetch wrapper with JWT interceptor)
to both apps. This is the only new frontend dependency needed.

---

## 6. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Breaking existing UI while wiring API** — screens expect exact mock data shape | High | High | Keep `mockData.ts` imports initially; add API call alongside; switch when API returns same shape |
| **Platform's hardcoded CUHK identity** — `admin@cuhk.edu.hk` in `App.tsx:275` | High | Medium | Replace with `useAuth()` hook returning JWT payload; institution name from `institution.name` |
| **App's localStorage targetRole lost on auth migration** | Medium | Low | On first login, read `localStorage("targetRole")`, POST to profile, clear localStorage |
| **CoachSession volume** — 3,458/month sessions create large table quickly | Medium | Medium | Partition `coach_sessions` by `started_at` month; archive sessions > 12 months to cold storage |
| **GDPR / PDPO (Hong Kong) compliance** — cohort student records are personal data | High | Critical | Anonymise `GraduateOutcome` IDs in Platform (already done in mock: "A001"); encrypt PII fields; add data retention policy |
| **Bilingual support gap** — App has `LanguageContext` with `t()` function; backend returns English only | Medium | Medium | Add `Accept-Language` header support; store translatable strings in `{ en, zh_hk }` JSON columns for market signals and job descriptions |
| **Platform no-router architecture** — state-machine `activeView` prevents deep-linking and makes API-driven navigation harder | Medium | Medium | Keep state machine for now; don't refactor; just pass data via props or context to page components |
| **Cold start: no real users to seed** | High | Medium | Provide `pnpm db:seed` script that converts all mock data into real DB rows; ensures both frontends work Day 1 post-migration |
| **JWT secret rotation** | Low | Critical | Store secret in env var; implement `/auth/refresh` endpoint; use short (15-min) access token TTL from day one |

---

## Immediate Next Steps (this week)

1. `mkdir backend && cd backend && npm init -y` — scaffold the project
2. `pnpm add fastify @fastify/jwt @fastify/cors prisma @prisma/client zod bcrypt`
3. `npx prisma init` — creates `prisma/schema.prisma`
4. Paste the schema above, run `prisma migrate dev --name init`
5. Implement `POST /auth/register` and `POST /auth/login`
6. Add `Authorization` header support to both frontends via a shared `apiClient.ts`
7. Replace the `localStorage("targetRole")` single line in `SkillsNavigatorScreen.tsx` with an API call — this is the smallest possible backend integration and proves the plumbing works end-to-end
