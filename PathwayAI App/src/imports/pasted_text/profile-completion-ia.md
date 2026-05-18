1. High-Level Page Hierarchy
1.1 App level (relevant branch)
Bottom Tab: Profile

ProfileAndCvScreen

ProfileCompletionModule (within this screen)

Step 1: BasicInfoScreen

Step 2: EducationScreen

Step 3: ExperienceAndProjectsScreen

Step 4: SkillsAndInterestsScreen

Step 5: PersonalityAndGoalsScreen

Step 6: CvAndVisibilityScreen

Step 7: CredentialsSummarySection → CredentialsWalletScreen (full wallet lives here, but only summarized in completion flow)

Everything below is about the Profile branch and its nested profile-completion structure.

2. ProfileCompletionModule – Overview IA
2.1 ProfileAndCvScreen (Profile tab root)
A. Sections on this screen (top → bottom)

Profile Header (outside completion, but context)

Avatar / initials

Name

Programme + graduation year

“View public profile” (optional)

ProfileCompletionModule

ProfileCompletionCard

Title text: “Profile completion”

Subtitle: “Fill in the essentials to get stronger matches and better outcomes.”

ProgressIndicator (linear bar and/or percentage)

Value: computed from completion of Steps 1–7

StepList (7 steps)

Each StepListItem:

Step name (e.g., “Education”)

Short description (e.g., “Degree, programme, and graduation year”)

Status icon (Done / In progress / Not started)

Chevron indicating tapable row

PrimaryButton:

Label: “Continue where you left off”

Action: navigates to first incomplete step

Other Profile Sections (siblings, not part of completion)

CV & exports

Application analytics

Skills planner

Credentials wallet (also referenced from Step 7)

B. Core components on ProfileAndCvScreen

ProgressIndicator (horizontal)

StepListItem (7 rows)

PrimaryButton (“Continue…”)

Divider elements between sections

3. Step-Level IA (Sub-Pages and Components)
Each step is either a dedicated screen or a focused sub-section accessible from ProfileAndCvScreen.

3.1 Step 1 – BasicInfoScreen
Hierarchy

Parent: ProfileAndCvScreen

Child: BasicInfoScreen (full-screen or full-height sheet)

Content

Title: “Basic info”

Description: “Tell us who you are so we can personalise your profile and applications.”

Fields (all in one form):

Full name (required)

Preferred name (optional)

Email (required)

Phone number (required)

LinkedIn URL (optional)

Components

FormSection container

TextInput x 5

PrimaryButton: “Save”

SecondaryTextButton: “Cancel” (navigates back without saving)

Inline validation labels:

“Please enter a valid email address.”

“Please enter a valid phone number.”

Navigation & Journey

Entry:

Tap Step 1 in ProfileCompletionModule

Or deep-link from other parts of app if basic info missing

Exit:

Save → update local and server data, mark Step 1 as “Done”, navigate back to ProfileAndCvScreen

Cancel / back → navigate back, step status unchanged

3.2 Step 2 – EducationScreen
Hierarchy

Parent: ProfileAndCvScreen

Child: EducationScreen

Content

Title: “Education”

Description: “Link your degree so we can benchmark you against outcomes from your programme.”

Fields:

Institution (search + select)

Programme (search + select; filtered by institution)

Degree level (dropdown, e.g., Bachelor, Master)

Major / concentration (text/select)

Graduation year

GPA or grade band (optional but weighted)

Components

SearchableSelectInput for institution and programme

Dropdown for degree level

TextInput or SelectInput for major

NumberInput or band SegmentedControl for GPA

PrimaryButton: “Save”

SecondaryTextButton: “Skip GPA for now”

Helper text: “You can add GPA later to improve match quality.”

Navigation & Journey

Entry: tap Step 2 in ProfileCompletionModule

Exit: Save → mark Step 2 as Done; Skip → mark Partially complete but allow progress

Dependencies: institution + programme + graduation year required for full completion

3.3 Step 3 – ExperienceAndProjectsScreen
Hierarchy

Parent: ProfileAndCvScreen

Child: ExperienceAndProjectsScreen

Nested: ExperienceFormSheet

Nested: ProjectFormSheet

Content

Title: “Experience & projects”

Description: “Add internships or projects to show what you’ve done.”

Sections:

Experience list

Zero or more items: role, company, dates, description

Projects list (optional fallback)

Zero or more items: title, context, skills used

Components

EmptyStateCard when no experience:

Copy: “No experience yet. Add internships, part-time work, or volunteering to stand out.”

Button: “Add experience”

ExperienceCard list

Fields displayed: Role title, organisation, dates, 1-line summary

Icons: edit, delete

ProjectCard list

FloatingActionButton or PrimaryButton at bottom:

“Add experience”

Secondary link: “Add project”

ExperienceFormSheet

TextInput: Role title

TextInput: Company

Dropdown: Type (Internship / Part-time / Full-time / Volunteer)

DatePickers: Start date, End date (or “Present” toggle)

Multi-line TextInput: Responsibilities, achievements

Buttons: “Save experience”, “Cancel”

ProjectFormSheet

TextInput: Project title

TextInput: Context (course / capstone / personal)

Multi-line TextInput: Description

TagSelector: Skills used

Buttons: “Save project”, “Cancel”

Completion Rule

Step considered “Done” if:

At least one Experience or Project saved.

Navigation & Journey

Entry: tap Step 3

User adds items in sheets, returns to list

Back from list → ProfileAndCvScreen

3.4 Step 4 – SkillsAndInterestsScreen
Hierarchy

Parent: ProfileAndCvScreen

Child: SkillsAndInterestsScreen

Content

Title: “Skills & interests”

Description: “Tell us what you’re good at and what you’re interested in so we can match you better.”

Sections:

Skills

Suggested skills list (chips) + search

For each selected skill: level (Basic / Intermediate / Advanced)

Interests

Preferred sectors (e.g., Banking, Tech)

Preferred role families (e.g., Data, Operations, Finance)

Components

ChipSelector for skills (multi-select)

SkillLevelSelector inline (small dropdown or segmented control)

ChipSelector or MultiSelectList for sectors and role types

PrimaryButton: “Save”

Optional CTA: “Run skill check” → deep links to Skill Gap Analysis flow

Completion Rule

At least N (e.g., 5) skills selected and at least one interest (sector or role family) chosen.

Navigation & Journey

Entry: tap Step 4

Exit: Save → update skill profile; back → ProfileAndCvScreen

3.5 Step 5 – PersonalityAndGoalsScreen
Hierarchy

Parent: ProfileAndCvScreen

Child: PersonalityAndGoalsScreen

Optional child: PersonalityAssessmentScreen (if not already completed)

Content

Title: “Personality & career goals”

Description: “Use your personality and goals to guide your long-term path.”

Sections:

Personality summary

Read-only summary card from prior assessment (if available)

If unavailable: CTA to take quick assessment

Career goals

Target role(s)

Time horizon (e.g., First job, 3–5 years)

Salary expectation band

Components

SummaryCard:

Title: e.g., “You tend to be analytical and structured.”

2–3 bullets of traits

PrimaryButton (if assessment not done): “Take quick personality check”

RoleSelector input for target role (search-based)

Dropdown for time horizon

SalaryRangeSlider or two number inputs

PrimaryButton: “Save”

Completion Rule

Target role and time horizon and salary expectation provided.

Personality assessment considered a bonus; if missing, step can be “In progress” but still allow next steps.

Navigation & Journey

Entry: tap Step 5

Optional branch to assessment; back returns to same screen

Save → ProfileAndCvScreen

3.6 Step 6 – CvAndVisibilityScreen
Hierarchy

Parent: ProfileAndCvScreen

Child: CvAndVisibilityScreen

Child: CvEditorScreen

Child: VisibilityInfoBottomSheet

Content

Title: “CV & visibility”

Sections:

CV block

Preview card for current CV

Status (e.g., “Updated 3 days ago”)

Actions: View, Edit, Export

Visibility block

Toggle: “Let employers find you”

Short explanation + info icon

Components

CvCard:

Thumbnail (small representation)

Text: last updated & size

Buttons:

“View CV” (opens viewer)

“Edit CV” (opens CvEditorScreen)

Secondary “Export PDF”

ToggleRow:

Label: “Let employers find you”

Toggle control (on/off)

InfoIcon → VisibilityInfoBottomSheet explaining what’s shared and how opt-out works

If no CV:

EmptyStateCard with “Generate CV” button

Completion Rule

CV has been created at least once (even if not perfect).

Visibility toggle is optional.

Navigation & Journey

Entry: tap Step 6

Tap “Edit CV” → CvEditorScreen (existing CV workflow)

Back from CV Editor → CvAndVisibilityScreen

Back → ProfileAndCvScreen

3.7 Step 7 – CredentialsSummarySection → CredentialsWalletScreen
Hierarchy

Parent: ProfileAndCvScreen

Section (inline) not a full-screen step; acts as completion “bonus” step

Child: CredentialsWalletScreen for full HEAR+ experience

Content

On ProfileAndCvScreen:

Section title: “Credentials & documents”

Short text: “Securely store and share your degree and certificates.”

Summary chips:

“Verified credentials: X”

“Documents: Y”

Chevron row: tap to open full Credentials wallet

Components

SummaryRow:

Label + small counts

Chevron icon

CredentialsWalletScreen (elsewhere in app IA, not detailed here)

Completion Rule

Not required for profile to hit 100%; treat as optional upgrade.

4. Navigation Flows & Relationships
4.1 Primary Profile Completion Journey (linear)
User taps Profile tab → ProfileAndCvScreen.

Sees ProfileCompletionModule at the top.

Taps “Continue where you left off” → jumps to first incomplete step (e.g., EducationScreen).

Completes step, taps Save → returned to ProfileAndCvScreen, progress updated.

Repeats for subsequent steps until all required ones are Done.

Once threshold reached, ProfileCompletionModule message changes to “Your profile is ready. Keep it up to date.”

4.2 Non-linear/contextual journeys
From Home / Jobs / Skill Planner

If user attempts advanced features with missing essentials (e.g., no education or skills), they receive a prompt:

“Add your degree to see outcomes and benchmarks” → EducationScreen.

“Add your skills so we can build a plan” → SkillsAndInterestsScreen.

“Generate a CV to share with employers” → CvAndVisibilityScreen.

Back behavior across the module

System back from any step screen → ProfileAndCvScreen.

System back from ProfileAndCvScreen → previous tab state (or app back stack).

4.3 Relationships with other major features
Outcomes & Benchmarks

Depend on Step 2 (Education) for programme/cohort.

Quality improved by Step 3 (Experience) and Step 4 (Skills).

Skill Pathway Planner

Depends on Step 4 (Skills & interests) and Step 5 (goals) for role and skill priorities.

Employer & Programme Hub

Uses Education, Experience, and Skills for relevance ranking, but does not require 100% completion.

Credential Wallet

Step 7 summary points into full wallet; wallet itself uses institutional HEAR+ data.

