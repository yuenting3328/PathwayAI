

Guided next actions.

1.2 JobsDiscoveryScreen
(Career Matching, “Why this job?”, Watchlist)
Primary content blocks
Filter bar
Target role, location (HK districts), salary range slider.
Suggested roles carousel
Based on profile/personality.
Job/Role list
Ranked by match score.
Saved & Watchlisted roles strip
Quick access to starred roles.
UI components
SearchFilterBar (chips + filter icon)
RoleSuggestionCarousel
JobCard list (each with: title, company, district, salary band, match %)
FloatingActionButton for “Refine matches” or “Ask Coach”.
Job card microcopy
Title: "Data Analyst"
Match: "Match: 82%" / "配對度：82%"
Explanation chip: "Why this job?" / "點解適合你？"
Empty state
"No strong matches yet. Try widening your salary range or target district." / "暫時未有好嘅配對，可以試下放寬薪金或地區。"
Information hierarchy
Filters (control).
Highest-value suggestions.
Full ranked list.
Saved/watchlist.

1.3 JobDetailScreen
(Explainable matching + apply flow)
Primary content blocks
Role header
Job title, company, location, salary band.
Match & fit summary
Match score, “Good because…” bullets, risk factors.
Responsibilities & requirements
Fit breakdown tabs
Skills, experience, education, personality fit.
Actions row
Apply, Save, Ask Coach.
UI components
HeaderSection
MatchScoreBadge
WhyThisJobAccordion
TabBar (Skills / Experience / Education / Personality)
PrimaryButton “Apply” / “申請職位”
SecondaryButton “Ask Coach about this role”
Key microcopy
Match explainer:
"Strong fit: You already have 4 of 6 key skills." / "非常匹配：你已經擁有 6 項關鍵技能入面嘅 4 項。"
"Risk: Most hires have 1–2 years of SQL experience." / "風險位：大部分受聘者都有 1–2 年 SQL 經驗。"
Error (failed apply deep-link):
"We couldn’t open the application page. Try again or save and apply later." / "未能開啟申請頁面，可以再試一次，或者先儲存之後再申請。"
Information hierarchy
Role basics + match score.
Why-fit explanation.
Detail content.
Actions.

1.4 CareerCoachScreen
(AI chat)
Primary content blocks
Conversation header
Showing coach name/state (Online) + language.
Chat history
Suggested prompts
Input area
UI components
AppBar (“Coach”)
MessageBubbleUser, MessageBubbleCoach
SuggestedPromptChips (“Review my CV”, “Help me prepare for interview”)
TextInput with send icon.
Microcopy
Input placeholder:
"Ask about jobs, CV, or your next step…" / "問我任何關於工作、CV 或下一步嘅問題…" 
System message (first visit):
"I use your profile and HK market data to give specific advice. I won’t share your messages with employers." / "我會根據你嘅資料同香港市場數據畀意見，唔會將你嘅對話內容分享畀僱主。"
Error handling
"I couldn’t complete that request. Let’s try again with a bit more detail." / "我未能完成你嘅請求，可以再講多少少細節試多次。"lineanddotstudio+2
Hierarchy
Ongoing conversation.
Shortcuts/prompts.
Input.

1.5 ProfileAndCvScreen
(3-Tap Setup, Smart CV, Recruiter Visibility)
Primary content blocks
Profile completeness meter
Steps: Education, Experience, Skills, Personality.
3-Tap profile wizard entry
CV preview & edit access
Recruiter visibility toggle
UI components
ProgressBar with %
StepList (“1. Education”, “2. Experience”… with status icons)
CvCard (thumbnail of CV + “Export PDF”)
ToggleRow for visibility
LanguagePreferenceRow
Microcopy
Wizard CTA: "Finish your profile in 3 quick steps." / "用三個簡單步驟完成個人資料。"
Recruiter visibility:
Label: "Let employers find you" / "允許僱主主動發現你"
Helper: "We only show limited info and you can turn this off anytime." / "我哋只會顯示有限資料，你可以隨時關閉。"
Empty state (no CV yet)
"You don’t have a CV yet. We’ll create one for you from your profile in under 2 minutes." / "你仲未有 CV，我哋可以根據你嘅資料喺兩分鐘內幫你生成。"thestyleofelements+3
Hierarchy
Completion status & quick win.
CV access.
Visibility controls.
Language setting.

1.6 CvEditorScreen
Primary content blocks
CV preview pane
Section navigation (Summary, Experience, Education, Skills)
Inline edit forms
AI feedback panel
UI components
DualPaneLayout (on mobile: stacked with preview above, editor below)
SectionTabBar
TextFields with helper text.
FeedbackChips (“Too long”, “Add results”, “Match description”).
Microcopy
Section title placeholder: "Summarise who you are in 2–3 lines." / "用 2–3 句簡短介紹你自己。"
Error (validation): "Please add at least one experience or project." / "請至少填寫一段工作經驗或項目。"
Hierarchy
Visual preview.
Section navigation.
Edits + feedback.

1.7 AnalyticsScreen
(Deep Career Analytics: application performance, match trends)
Primary content blocks
Headline metrics
Applications, interviews, offers, conversion rate.
Performance vs cohort
Match score trend chart
Funnel by role type
UI components
KpiCardRow
ComparisonBadge (“Above cohort average”, “Below”)
LineChart, FunnelChart
Microcopy
"You’ve applied to 14 roles. 3 led to interviews. That’s slightly above your cohort." / "你已申請 14 個職位，3 個得到面試，比同屆平均略高。"
Hierarchy
High-level performance.
Context vs peers.
Detailed trends.

1.8 MarketRadarScreen
(HK Market + Role Watchlist)
Primary content blocks
Top market signals strip
Skills–sector heatmap summary
Your watchlisted roles
UI components
MarketSignalCard (e.g., “FinTech hiring up 12%”)
HeatmapPreview (tap to expand)
WatchlistRoleCard
Microcopy
"Hot now: Cybersecurity roles in Central & Western." / "熱門：中西區網絡安全職位。"
Empty state (no watchlist):
"Star a role to track demand and salary changes here." / "標記你感興趣嘅職位，之後會喺呢度追蹤需求同薪金變化。"

1.9 SkillsNavigatorScreen
(Skill Gap, Course Recommendations, Skills-to-Curriculum)
Primary content blocks
Skill overview radar
Priority skills list
For each skill: actions
Uni modules, capstones, internships, external courses.
UI components
RadarChart
SkillPriorityListItem (name, gap level, impact)
ActionCardGroup under each skill (ModuleCard, CourseCard).
Microcopy
"Focus on these next" / "下一步優先改善呢幾項"
Skill card: "Data analysis – high impact gap for your target roles." / "資料分析：對你目標職位好關鍵，但現時有明顯差距。"
Empty state (no skill assessment yet)
"Take a 3-minute skills check to see where you stand." / "用 3 分鐘做技能評估，睇下自己而家水平。"

1.10 ProgrammesScreen
(Employer Programmes & Talent Pipelines)
Primary content blocks
Recommended programmes carousel
All programmes list (sorted by relevance).
Past success insights (for your degree).
UI components
ProgrammeCard (logo, name, deadline, typical salary, success rate badge).
FilterChips (sector, location, timeline).
Microcopy
"Fast lane opportunities for your degree" / "針對你學系嘅快速入行機會"
Programme card: "Last year, 18 students from your uni joined this programme." / "上年度有 18 位你學校學生加入此計劃。"

1.11 AlumniPathsScreen
(Alumni Trajectory Explorer)
Primary content blocks
Path archetype tiles
Path detail visual (flow)
Milestones list
UI components
ArchetypeCard (name, typical roles)
SankeyDiagramPreview
MilestoneList
Microcopy
Archetype: "Audit to Strategy" / "審計 → 策略路線"
"Most alumni take 2–3 years to move into this role." / "大多數畢業生需時約 2–3 年才到達此職位。"

1.12 CredentialsWalletScreen
(Smart Credentials, HEAR+ Sharing)
Primary content blocks
Credential categories
Individual credential cards
Sharing & tracking modal trigger
UI components
CredentialCategoryList (“Degree & transcript”, “HEAR”, “Certificates”, “Badges”)
CredentialCard (name, issuer, status)
ShareButton on each card
ShareModal with link options, expiry, and consent text.
Microcopy
Empty state: "Ask your university to connect your digital HEAR so we can store it securely here." / "聯絡你嘅大學將數碼 HEAR 連接到此帳戶，我哋會安全保存。"
Share modal:
Title: "Share with employer" / "分享畀僱主"
Description: "We’ll generate a secure link employers can use to verify this record. You can turn it off anytime." / "我哋會產生一條安全連結，畀僱主核實呢份紀錄，你可隨時停止使用。"

2. Navigation Structure & Flow
2.1 High-Level Navigation Model
Primary nav: bottom tab bar (4 items).
Secondary nav: in-screen tabs, lists, and deep links.
Global entry points:
HomeDashboardScreen (default).
System Back / edge gesture always takes user one level up.
2.2 Bottom Tabs and Entry Points
Home → HomeDashboardScreen
Jobs → JobsDiscoveryScreen (with access to JobDetail, Programmes)
Coach → CareerCoachScreen
Profile → ProfileAndCvScreen (with access to CV, skills, analytics, credentials)
(Justification in section 3.)

2.3 Screen-to-Screen Flows
From HomeDashboardScreen
Tap KPI “Applications / Offers” → AnalyticsScreen.
Tap “Market highlight” → MarketRadarScreen.
Tap “Next step: Update CV” → CvEditorScreen.
Tap “Next step: Close data analysis skill gap” → SkillsNavigatorScreen.
Back behavior:
Back from any of these returns to HomeDashboardScreen.
System back from HomeDashboardScreen exits app.

From JobsDiscoveryScreen
Tap JobCard → JobDetailScreen.
Tap “Why this job?” chip → expands explainer within JobDetailScreen.
Tap filter icon → FiltersModal (full-screen bottom sheet).
Tap watchlist star on role → role added; accessible in MarketRadar and Jobs “Saved” tab.
Back behavior:
From JobDetailScreen back → to JobsDiscoveryScreen with scroll position preserved.
From FiltersModal back/close → to JobsDiscoveryScreen, apply or discard changes.

From JobDetailScreen
Tap “Apply” → external browser/webview; on return, app shows toast: "Marked as applied."
Tap “Ask Coach about this role” → opens CareerCoachScreen with prefilled prompt and link back to role.
Back behavior:
Back from Coach returns to previous screen (JobDetail) if launched from there; otherwise to tab root.

From CareerCoachScreen
Tapping system back:
If opened via tab, return to last visited tab (state preserved per platform convention).nngroup
If opened as deep link (e.g., from JobDetail), back returns to source screen.

From ProfileAndCvScreen
Tap completion steps → opens appropriate sub-screen:
Education, Experience, Skills, Personality mini-forms (EditProfileSubScreens).
Tap CV card → CvEditorScreen.
Tap “Let employers find you” info icon → VisibilityInfoBottomSheet.
Tap “Language” row → LanguageSelectionModal.
Tap “Credentials & HEAR” → CredentialsWalletScreen.
Tap “Analytics & performance” link → AnalyticsScreen.
Tap “Skills & courses” → SkillsNavigatorScreen.
Back behavior:
From sub-screens back → ProfileAndCvScreen, with updated progress.
From Credentials/Skills/Analytics back → ProfileAndCvScreen.

From AnalyticsScreen
Tap segment controls (e.g., “By role type”) stays in-screen.
Tap “See matching programmes” for high-performing area → ProgrammesScreen filtered to relevant sector.

From MarketRadarScreen
Tap role in watchlist → JobDetailScreen (if role has specific postings) or RoleInfoSheet (generic role info).
Tap heatmap → full-screen heatmap display; back returns to radar.

From SkillsNavigatorScreen
Tap skill → expand row with recommended actions.
Tap module → opens ModuleInfoSheet (info pulled from institution).
Tap external course → in-app webview or external browser.
CTA “Ask Coach how to prioritise” → CareerCoachScreen with prefilled prompt.

From ProgrammesScreen
Tap programme card → ProgrammeDetailScreen.
On Programme detail:
“Apply” → external link.
“Prepare with Coach” → CareerCoachScreen with context.

From AlumniPathsScreen
Tap archetype → path detail.
Tap milestone → displays additional text in overlay; no major nav.

From CredentialsWalletScreen
Tap credential card → CredentialDetailScreen (view-only).
Tap “Share” → ShareModal.
In ShareModal, “Copy link” or “Share via…” → OS share sheet.
Back behavior:
Back from CredentialDetail or ShareModal → CredentialsWalletScreen.

2.4 Modal / Overlay Triggers & Content
FiltersModal (Jobs)
Fields: district, salary range, job type, remote/on-site.
Buttons: “Apply filters”, “Reset”.
Error copy (invalid salary range): "Minimum salary cannot be higher than maximum." / "最低薪金唔可以高過最高薪金。"
LanguageSelectionModal
Options: “English”, “繁體中文（廣東話介面）”.
Note: "You can switch languages any time. Your data stays the same." / "你可以隨時切換介面語言，資料唔會受影響。"
VisibilityInfoBottomSheet
Explains what “visible to employers” means, data shared, and how to turn off.
ShareModal (Credentials)
Options: “Generate link”, “Set expiry (7/30 days)”, “Copy link”
All modals must have explicit close buttons and respect system back (back = cancel/close).uxcontent+1

2.5 Potential Dead-Ends & Mitigations
Empty analytics / outcomes for early users
Mitigation: strong empty state education and CTA to start applying / complete profile.
No matches / jobs
Mitigation: suggestion text (“widen salary/district”), link to Coach and Market Radar.
Credentials wallet without connected HEAR
Mitigation: clear CTAs (“Connect via your university email”, “Learn more about digital records”).

3. App Bar & Navigation Bar Specification
3.1 Top App Bar (per screen)
Common patterns
Left: logo or screen title (no hamburger; navigation primarily via bottom tabs).
Right:
ProfileAvatarButton (on Home and Jobs) → ProfileAndCvScreen.
LanguageToggleIcon or entry to Language in overflow on Profile.
Optional HelpIcon on complex screens (opens FAQs/Coach).
Screen-specific actions
HomeDashboardScreen:
Title: "Home"
Right icons: Profile avatar, Help.
JobsDiscoveryScreen:
Title: "Jobs"
Right: Filter icon (opens FiltersModal).
CareerCoachScreen:
Title: "Coach"
No extra icons; keep focus on conversation.
ProfileAndCvScreen:
Title: "Profile & CV"
Overflow menu: Language, Account settings, Logout.
Detail screens (JobDetail, ProgrammeDetail, CredentialDetail):
Back arrow + screen-specific title (job title truncated, programme name, credential type).

3.2 Bottom Navigation Bar
Following best practices, we keep 4 primary destinations (3–5 recommended).designstudiouiux+3
Tabs
Home
Icon: house.
Label: “Home / 主頁”.
Rationale: entry point, cross-feature overview and guidance; visited every session.
Jobs
Icon: briefcase.
Label: “Jobs / 職位”.
Rationale: primary task during search; high-frequency usage.
Coach
Icon: chat bubble.
Label: “Coach / 職涯教練”.
Rationale: central differentiator; used for guidance across flows.
Profile
Icon: user.
Label: “Profile / 個人”.
Rationale: gateway to CV, skills, analytics, credentials, and account.
What not to put in bottom nav (and why)
Market radar, Programmes, Alumni paths, Credentials: important but secondary; reached contextually (from Home, Jobs, Profile) to avoid clutter and keep mental model simple.uxdesign+1
Behavior
Tapping current tab scrolls to top of that tab’s root screen.
State persists per tab: user returns to last scrolled position.
