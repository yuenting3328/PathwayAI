1. High-Level Integration Strategy
1.1 Where each new feature lives
Map the six modules into the existing app architecture:
New feature module
Primary home in app
Secondary entry points
1. Personal Outcomes & Salary Benchmark Dashboard
HomeDashboardScreen → OutcomesDashboardScreen
Profile tab (“Analytics & Outcomes”), Coach suggestions
2. Skill Pathway Planner
SkillsNavigatorScreen (renamed)
CTA from Outcomes Dashboard, Coach, Job Detail
3. HEAR+ Credential Wallet & Share Tracker
CredentialsWalletScreen under Profile tab
CV screen, application flows (“attach HEAR”)
4. Employer & Programme Opportunity Hub
OpportunityHubScreen under Jobs tab
CTAs from Market Radar, Outcomes, Coach
5. Alumni Pathways Explorer & Transition Coach
AlumniPathsScreen under Profile tab (or nested under “Career Paths”)
CTA from Outcomes (“Where people like you end up”), Coach
6. HK Labour Market Radar & What‑If Simulator
MarketRadarScreen under Home tab (shortcut) or nested under Jobs
CTA from Jobs filters, Skill Planner (“What if I learn X?”)

Principle:
Home = personal “where I stand” (Outcomes + Market Radar).
Jobs = discovery & institutional opportunities (Employer Hub).
Coach = conversational glue.
Profile = CV, skills, credentials, analytics, alumni paths.
This keeps bottom nav stable (4 tabs) and uses one level of deep screens for advanced modules to avoid clutter.uxplanet+1

2. Feature-by-Feature Integration
2.1 Personal Outcomes & Salary Benchmark Dashboard
Placement
New screen: OutcomesDashboardScreen.
Entry points:
Tap “View details” on KPI cards in HomeDashboardScreen.
Link in Profile tab: “Analytics & Outcomes”.
Navigation flow
HomeDashboardScreen → tap “See full benchmarks” → OutcomesDashboardScreen.
Back: system back returns to Home, preserving scroll.
Data dependencies & flows
Inputs:
Institutional Outcomes Command Centre for programme-level employment, salary, time-to-offer, outcome distribution.Context.docx
HK Salary Observatory & labour data for HK-wide benchmarks.Context.docx
User profile (programme, cohort, GPA band, language mix, internships).
Individual metrics: CV score, skill gap scores, AI Coach usage to compute “Readiness index”.
Outputs:
“Competitiveness Snapshot” → drives pre-filled state in Skill Pathway Planner (priority skills).
“People Like You” roles → seeds recommendations in Jobs Discovery & Alumni Paths.
Information hierarchy
Header & context strip (“Your Outcomes Benchmarks” + programme/cohort pill, settings icon).
Top KPI cards in horizontal scroll (employment rate, median salary, time to first offer, % further study).
“People like you” block with filtered segments and typical roles.
Outcome distribution chart with “Compare to HK average” toggle.
Competitiveness snapshot (readiness bar + strengths/gaps).
CTA row → “Improve my chances” (Skill Planner), “Ask AI Coach”.
Integration hooks
Tapping a role in “People like you” → JobDetailScreen (if live postings exist) or role info sheet.
“Improve my chances” → SkillPathwayPlannerScreen with role and key gaps pre-selected.
“Ask AI Coach” → coach with prompt: “I’m at X readiness. What should I focus on this term?”

2.2 Skill Pathway Planner
Placement
Existing SkillsNavigatorScreen becomes SkillPathwayPlannerScreen.
Primary entry: Profile tab → “Skill plan & courses”.
Secondary entries:
From Outcomes dashboard “Improve my chances”.
From Jobs (“You’re missing these skills → ‘Plan how to close gap’”).
From Labour Radar “Add these skills to my plan”.
Navigation flow
ProfileAndCvScreen → “Skill Pathway Planner” row → SkillPathwayPlannerScreen.
Back → ProfileAndCvScreen.
Data dependencies & flows
Inputs:
Role requirements from Labour Market Observatory (skills and levels).Context.docx
Institutional curriculum mapping (modules, capstones, internships mapped to skills).Context.docx
Employer feedback on skills importance (where available).Context.docx
User’s current skill assessment & gaps (existing Skill Gap Analysis).
Outputs:
List of selected actions and timeline → “Skill plan” object used for reminders.
“Planned vs completed” actions → feeds back into Outcomes competitiveness index and Coach recommendations.
Information hierarchy
Role header (“Target role + demand chip”), changeable via chip bar.
Skill heatmap list (required vs your level, Gap/On track labels).
Recommended paths sections
From your degree
Beyond your degree
Practice & portfolio tasks
Timeline view (Now / This term / Next term / 12 months).
Progress & reminders controls.
Integration hooks
“Add to study plan” on module → simple local planner; optionally link out to university systems later.
“Ask AI Coach for guidance” on practice tasks → prefilled prompt referencing skill/role.
From scenario builder in Labour Radar, “Add these skills to my Pathway Plan” jumps here with skills preselected.

2.3 HEAR+ Credential Wallet & Share Tracker
Placement
CredentialsWalletScreen under Profile tab; dedicated row: “Credentials & HEAR+ wallet”.
Navigation flow
ProfileAndCvScreen → “Credentials & HEAR+ wallet” → CredentialsWalletScreen.
From CV or Apply flows: “Attach verified HEAR” → jumps to specific credential detail.
Data dependencies & flows
Inputs:
Institutional HEAR / transcript / certificate records via secure API (institutional HEAR+ system).Context.docx
Pathway-generated documents (CV versions, skills report).
Share/verification logs from HEAR+ Digital Credential Insights backend.Context.docx
Outputs:
Generated share links with selected content and access constraints.
View/verification events aggregated for user (“Shared with employers” list).
Information hierarchy
Wallet header + tabs (Verified by University / PathwayAI Documents).
Credential cards list under each tab.
Global “Share profile” CTA.
“Shared with employers” history.
Security & permissions toggles (and revoke all).
Privacy & security notes
PDPO + HEAR compliance:
Server handles verification and logging; mobile only displays aggregated info and does not store raw docs offline without explicit user opt-in.Context.docx
Clear bilingual microcopy around “What we share / What we never share”.
All share links must be revocable at server side; front-end uses status flags.

2.4 Employer & Programme Opportunity Hub
Placement
New OpportunityHubScreen under Jobs tab; segmented control in JobsDiscoveryScreen: “Matches / Opportunities”.
Could also be a dedicated tab inside Jobs, but keep within Jobs for IA simplicity.
Navigation flow
JobsDiscoveryScreen top segmented control → “Jobs” (default) / “Opportunities”.
Selecting “Opportunities” shows Employer & Programme Hub.
Back → returns to Jobs tab root, preserving chosen segment.
Data dependencies & flows
Inputs:
Employer CRM & pipelines from institutional SaaS: strategic partners, programmes, outcomes by programme.Context.docx
Upcoming events (career talks, assessment days) from Employer Partnerships page.Context.docx
User profile (programme, skills, target roles) for ranking.
Outputs:
Applications and registrations that update institutional programme funnels.
Engagement signals used in employer analytics (e.g., programme interest).
Information hierarchy
Search & filter bar (job/programme/company).
“Featured for you” carousel (co-branded with uni/employer).
“University-endorsed programmes” list.
“High-fit employers” list.
“Events & workshops” list.
Application tracker widget (summary + link to full tracker).
Integration hooks
From Outcomes dashboard (“People like you go to [Programme X]”) → deep link to this Hub with that programme highlighted.
From Alumni Paths (“Step 2: many alumni join [Scheme Y]”) → scroll to that programme.
From Application Tracker widget → full ApplicationStatusScreen (existing analytics).

2.5 Alumni Pathways Explorer & Transition Coach
Placement
AlumniPathsScreen under Profile tab > “Career paths from your degree”.
Navigation flow
Profile → “Career paths” → AlumniPathsScreen.
From Outcomes dashboard “Where people like you end up” → same screen with path filters pre-set.
Data dependencies & flows
Inputs:
Alumni & Graduate Continuity analytics: role progression sequences, years between steps, sector/geography, salary growth.Context.docx
User programme & optionally current job (if working student).
Outputs:
Selected “target path” stored with user preferences; influences Coach recommendations and Skill Planner.
Information hierarchy
“I am now…” / “I want to be…” selectors (pre-filled from profile).
List of path archetype cards (A/B/C).
Path detail sheet (on tap): step-by-step roles, timing, salary bands, skills.
“Ask Transition Coach” panel anchored at bottom.
Optional alumni events section relevant to selected path.
Integration hooks
“Ask Transition Coach” → Career Coach with full context (current state, target, chosen path).
Tapping skill badges within a step → open Skill Pathway Planner with those skills highlighted.
Event cards → registration flow in Opportunity Hub.

2.6 HK Labour Market Radar & What‑If Simulator
Placement
MarketRadarScreen accessible from:
Home: “Market snapshot” card → full radar.
Jobs: filter menu “Browse by market signals”.
Skill Planner: “See demand if you add this skill”.
Navigation flow
HomeDashboardScreen → tap “View market details” → MarketRadarScreen.
Back → Home.
Data dependencies & flows
Inputs:
HK Talent Demand & Salary Observatory: sector/role/district demand, salary, growth, shortage roles.Context.docx
Institutional data: your programme’s placement share in each role/sector.
User profile + skill profile.
Outputs:
Scenario result (demand/difficulty/salary) used to generate suggestions in Jobs and Skill Planner.
“What if I learn X” skill toggles feed directly into Skill Pathway Planner preselection.
Information hierarchy
View chips (Sector / Role / District).
Top signals cards (top growing sector, shortage role, etc.).
Scenario builder (role/sector/district + salary slider).
Scenario result card (demand, difficulty, salary, programme share).
“What if I learn X” skill toggle strip.
Quick insights strip (short text insights).
Integration hooks
“Add these skills to my Pathway Plan” → SkillPathwayPlannerScreen with skills flagged.
“View roles in this sector” → Jobs tab with sector filters pre-applied.

3. Structural Recommendations
3.1 Optimal IA & Navigation
Bottom nav (unchanged): Home / Jobs / Coach / Profile.
Within tabs:
Home
HomeDashboardScreen (summary KPIs, next steps, mini market preview)
Deep links: OutcomesDashboardScreen, MarketRadarScreen
Jobs
JobsDiscoveryScreen with segmented control: “Jobs / Opportunities”
Under “Opportunities”: OpportunityHubScreen
Coach
CareerCoachScreen (with context tags from other features)
Profile
ProfileAndCvScreen
Secondary screens: CvEditorScreen, SkillPathwayPlannerScreen, AnalyticsScreen (if separated from Outcomes), CredentialsWalletScreen, AlumniPathsScreen.
3.2 Primary user journeys
Competitiveness → Plan → Apply → Track
Home → Outcomes Dashboard (see benchmarks & competitiveness) → “Improve my chances” → Skill Pathway Planner → add modules/courses/tasks → Jobs → Opportunity Hub / Roles → Applications → Analytics.
Market-first exploration
Home → Market Radar → Scenario (“What if I work in Kowloon East as Data Analyst?”) → see demand & salary → “Add skills to plan” → Skill Pathway Planner → Jobs filtered by role/sector.
Credential-led journey
Profile → Credentials Wallet → share HEAR+ + CV for applications → share logs show employer interest → Coach / Jobs for follow-up.
Alumni-path-driven journey
Profile → Alumni Paths → choose target path → Transition Coach → Skill Pathway Planner → specific employer programmes in Opportunity Hub.
3.3 Unifying overlapping components
Patterns appearing in 3+ modules should be shared components:
Role selector
Used in Skill Planner, Market Radar, Jobs filters, Alumni Paths.
Standard RoleSelector with search, suggested roles, bilingual labels.
KPI cards
Outcomes Dashboard, Analytics, Hub trackers use the same KpiCard (number, label, delta arrow).
Segment/filter chips
Cohort/programme filters, view toggles (Role/Sector/District), GPA, language.
Single FilterChip style across app for consistency and reuse.
Progress bar/ring
Competitiveness index, skill plan progress, profile completion.
Single ProgressIndicator with configurable color and label.
Bottom sheets
Explainers (“Why this role?”, “What this metric means”), share modals, info sheets.
Shared InfoBottomSheet pattern with title, body, primary/secondary actions.
This reduces cognitive load and development effort while giving users a consistent mental model.uxdesign+1
3.4 MVP integration path
If you can’t ship all six at once:
Wave 1 (must-have, highest impact)
Personal Outcomes & Salary Dashboard (without all segment filters initially).
Skill Pathway Planner (basic: role header + skill gaps + “From your degree” section).
Employer & Programme Opportunity Hub (basic list + featured programmes).
Wave 2
Labour Market Radar (initially without full scenario builder; just signals + basic salary view).
HEAR+ Credential Wallet (read-only, share link without detailed tracking).
Wave 3
Alumni Paths Explorer & Transition Coach.
Advanced HEAR tracking + detailed share analytics.
What-if skill slider + integrated reminders.

4. Design & UX Consistency
4.1 Bilingual treatment
One global language setting in Profile; all modules read from it.
Core pattern: labels and explanatory copy fully bilingual, while proper nouns (programme names, employer names) remain as provided by institution/employer with optional translations.
For all new screens, key structures provide EN + 繁 side by side in headings and key CTA text, as in your specs for module titles and CTAs.
4.2 Shared UI library
Define and reuse these UI primitives:
KpiCard, MarketSignalCard, ProgrammeCard, EmployerRow, EventCard, CredentialCard, PathArchetypeCard, SkillListItem, TimelineItem.
FilterChip, SegmentedControl, TabBar, BottomSheet, ShareModal.
LineChart, BarChart, DonutChart, RadarChart, FunnelChart with consistent colour and axis styling.
Using a unified component library improves accessibility, performance, and translation re-use across screens.lineanddotstudio+2
4.3 Conflicting patterns & resolutions
Too many entry points to the same concept (e.g., skills)
Resolution: treat Skill Pathway Planner as the single canonical skill screen; other places (Jobs, Market, Alumni) always deep-link there with context.
Multiple progress indicators (profile, readiness, skill plan)
Resolution: always label clearly and use different colors where semantics differ (e.g., readiness = success-green, risk = amber/red, neutral progress = blue).
Charts overload on mobile
Resolution: default to one primary chart per screen above the fold, hide secondary charts behind “See more details” modals; use compact mini-charts in summaries.
4.4 Accessibility & performance
Prefer list-based visualisations over dense grids (as you already specified for skills heatmaps) to keep performance and tap targets reasonable.Context.docx
Cache heavy charts and compute aggregates server-side (Outcomes, Alumni paths, Market data) to avoid rendering lag on low-end devices.
Ensure all charted data has textual summaries (good for screen readers and quick scanning).

5. Technical & Data Considerations
5.1 Backend / API dependencies
Institutional outcomes & skills
API endpoints for: programme-level outcomes, outcomes by segment, curriculum-to-skill mappings, employer feedback metrics.Context.docx
Labour market data
HK Talent Demand & Salary Observatory: time-series by role/sector/district, shortage indicators.Context.docx
Employer & programmes
Employer list, programmes, pipelines, events, outcomes (hires, conversion rates).Context.docx
Alumni trajectories
Anonymised sequences of roles+timelines, aggregated by programme and basic segments.
HEAR+ credentials
Secure credential fetch, metadata, verification endpoints, share-link generation and revocation.Context.docx
5.2 Real-time vs cached
Real-time-ish (daily/weekly refresh):
Labour market indicators, employer postings, events, programme status.
Periodic (term/annual):
Outcomes data, alumni trajectories, skills-to-curriculum mapping updates.
Live from user actions:
Applications, CV changes, skill plan status, share link creation.
Use on-device caching for read-heavy screens (Outcomes, Radar, Alumni) with visible “Last updated” timestamps.
5.3 Privacy & security
Credential Wallet
No raw HEAR/degree documents stored unencrypted; ideally only short-lived URLs with token-based access.
All sharing built on short-lived, revocable tokens; UI prominently exposes “Revoke all links”.Context.docx
Benchmarking & “People like you”
Only display aggregate outcomes where cohort/segment N ≥ safe threshold (e.g., N ≥ 10); otherwise show generic programme-level stats.
Avoid showing any employer-specific salary/feedback at an individual level—stay at cohort or programme granularity.
GDPR/PDPO alignment
Clear microcopy for data usage (e.g., “We use your activity and institutional data to calculate readiness; we never share your individual score with employers”).
