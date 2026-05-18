1. Navigation Flow & User Journey
1.1 Entry points into Profile Completion
Primary entries

Bottom tab: Profile → ProfileAndCvScreen

User taps Profile tab in bottom navigation.

Lands on ProfileAndCvScreen with a Profile Completion header at the top.

Guided prompts from Home & other features

HomeDashboardScreen shows prompts like:

“Complete your profile to unlock better matches.”

“Add your internships to improve your outcomes.”

Tapping these deep-links to the relevant step inside ProfileAndCvScreen (e.g., Experience step).

Contextual entry from other flows

From Jobs: “Add your GPA to improve match score” → opens Profile with Education step focused.

From Skill Planner: “We need your skills to build a plan” → opens Profile with Skills step.

1.2 High-level journey
User opens Profile tab.

Sees Profile Completion module at the top with progress (e.g., “Profile 60% complete”).

Taps into incomplete items via a step list or “Continue” button.

Completes each stage (Education → Experience → Skills → Personality → Career Goals → CV & Visibility → Credentials).

When completion reaches a threshold (e.g., ≥80%), the module shifts to maintenance mode (“Keep your profile up to date”).

Back navigation always returns one level up:

From sub-step screen → ProfileAndCvScreen.

From nested modals (e.g., add item) → that step’s main view.

2. Profile Completion: Steps & Content
The profile completion section should be structured as a wizard-like multi-step checklist, but all contained within ProfileAndCvScreen for simplicity.

2.1 Overview Module (on ProfileAndCvScreen)
Purpose: Give a quick sense of completion and direct access to remaining steps.

Content

Title: “Profile completion”

Subtitle: “Fill in the essentials to get stronger matches and better outcomes.”

Progress indicator: numeric + visual (e.g., “60% complete”).

Step list:

Basic Info

Education

Experience & Projects

Skills & Interests

Personality & Career Goals

CV & Recruiter Visibility

Credentials & Documents

Each step shows status: Done / In progress / Not started.

Components

Card container for the module.

ProgressBar or circular ProgressRing.

StepListItem rows with: step name, brief description, status icon, chevron.

Button: “Continue where you left off” (jumps to first incomplete step).

2.2 Step 1 – Basic Info
Purpose: Capture core identity fields needed for applications and outcomes mapping.

Content

Fields:

Full name

Preferred name (optional)

Email

Phone number

LinkedIn (optional)

Components

FormScreen with vertical layout.

TextInput fields with validation (email, phone).

Save button at bottom.

Inline validation messages (e.g., “Please enter a valid email address”).

Micro-interactions

On save: toast “Basic info updated”.

Completion logic: Step marked “Done” when required fields are valid and saved.

2.3 Step 2 – Education
Purpose: Map user to institutional data (programme, cohort) and improve outcomes benchmarking.

Content

Programme & institution (dropdown / search)

Degree level (e.g., Bachelor, Master)

Major / concentration

Cohort / graduation year

GPA or grade band (optional but strongly encouraged)

Components

SelectInput or search-based picker for institution and programme.

Dropdown for degree level.

NumberInput or band selector for GPA.

Save button + “Skip for now” link if GPA not ready.

Micro-interactions

Suggest programme based on institutional single sign-on or earlier onboarding (if available).

Completion: step considered “Done” when programme + graduation year are set (GPA can be optional but flagged as “Add GPA to boost match quality” later).

2.4 Step 3 – Experience & Projects
Purpose: Capture practical experience that drives both matches and outcomes.

Content

Experience list:

Role title

Company / organisation

Type (internship, part-time, full-time, volunteer)

Start/end dates

Short description (bullets)

Project list (for students without formal experience):

Project title

Context (course/capstone/personal)

Skills used

Components

ListWithAddButton:

Empty state card: “No experience added yet.”

“Add experience” button → ExperienceFormBottomSheet.

ExperienceCard items with edit/delete icons.

ProjectCard items (optional).

Micro-interactions

Empty state copy: “Add internships or projects so employers can see your practical experience.”

Step completion: at least one experience or project added.

2.5 Step 4 – Skills & Interests
Purpose: Power skill gap analysis, matching, and Skill Pathway Planner.

Content

Skill tags:

Hard skills (e.g., Python, Excel, SQL).

Soft skills (e.g., communication, teamwork).

Self-assessed proficiency (e.g., Beginner / Intermediate / Advanced).

Career interests:

Preferred sectors

Preferred role families (e.g., data, operations, finance)

Components

ChipSelector for skills (pre-populated suggestions + search).

SkillLevelSelector per selected skill (small inline dropdown).

ChipSelector or MultiSelectList for interests.

Button: “Run skill check” → triggers/links to Skill Gap Analysis flow if not already done.

Micro-interactions

Empty state: “Tell us what you’re good at and what you want to do. We’ll use this to find better roles.”

Completion: at least N skills selected and at least one interest chosen.

2.6 Step 5 – Personality & Career Goals
Purpose: Enable personality-informed pathing and long-term planning.

Content

Personality summary:

Short description derived from MBTI/other assessment (read-only summary).

Career goal fields:

Target role(s)

Preferred time horizon (e.g., “First job”, “3–5 years”)

Salary expectation band

Components

SummaryCard for personality profile with 2–3 bullet traits (e.g., “Analytical, structured, prefers clear goals”).

TextInput or RoleSelector for target role.

Dropdown for time horizon.

SalaryRangeSlider for expected starting salary.

Micro-interactions

If personality assessment not done yet: show CTA “Take quick personality check” (link to existing flow) with step still considered “In progress”.

Completion: target role + salary expectation provided.

2.7 Step 6 – CV & Recruiter Visibility
Purpose: Ensure user has a usable CV and control over visibility for employers.

Content

CV card:

“Your latest CV”

Last updated date

Actions: View, Edit, Export (PDF).

Visibility setting:

“Let employers find you” toggle.

Short explanation of what is shared.

Components

CvCard with thumbnail and buttons: Edit, Export.

ToggleRow for recruiter visibility.

InfoIcon opening bottom sheet explaining visibility details.

Micro-interactions

If CV not generated:

Empty state card: “You don’t have a CV yet. Generate one from your profile in under 2 minutes.”

Button: “Generate CV” → CV generator flow.

Completion: CV created (at least once). Visibility is optional but recommended.

2.8 Step 7 – Credentials & Documents
Purpose: Link to the HEAR+ Credential Wallet without overwhelming the user in the main completion flow.

Content

Summary line: “Securely store and share your degree and certificates.”

Display:

Count of verified credentials (from university).

Count of Pathway documents (CVs, skill reports).

Components

SummaryRow with label + counts + chevron.

Tap → opens CredentialsWalletScreen (full wallet experience).

Micro-interactions

Completion: not strictly required for “Profile completion 100%”; treat as “Bonus” step (e.g., step shows “Optional but recommended”).

3. Suggested Components & UI Elements by Section
For implementation consistency, use shared components and patterns:

3.1 Shared components
ProfileCompletionCard

Wraps progress bar + step list.

StepListItem

Props: title, description, status, onPress.

ProgressIndicator

Linear or radial.

FormSection

Standard padding, label styles, and field spacing.

3.2 Per-step component mapping (summary)
Basic Info

FormSection, TextInput, SaveButton.

Education

SelectInput (programme), Dropdown (degree), NumberInput (GPA), SaveButton.

Experience & Projects

ListWithAddButton, ExperienceCard, ProjectCard, BottomSheetForm for add/edit.

Skills & Interests

ChipSelector (skills and sectors), InlineSkillLevelSelector, SecondaryButton (“Run skill check”).

Personality & Career Goals

SummaryCard (personality), RoleSelector (target role), Dropdown (time horizon), SalaryRangeSlider.

CV & Recruiter Visibility

CvCard, ToggleRow, InfoBottomSheet.

Credentials & Documents

SummaryRow → navigates to CredentialsWalletScreen.

4. Overall Experience Within Profile Completion
User sees one place (Profile tab) to understand how complete they are and what’s missing.

Each tap into a step opens a focused, single-purpose screen with clear “Done/Save” and simple validation.

As steps are completed, the Profile Completion card updates immediately, unlocking stronger matches and richer analytics in the rest of the app.