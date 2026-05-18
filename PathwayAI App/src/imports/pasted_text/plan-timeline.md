1. Navigation Flow & Entry
1.1 Trigger
From SkillPathwayPlannerScreen (where user chooses target role, sees skills and recommended actions):

User taps the timeline strip / “View full plan timeline” CTA inside the “Timeline View” section (Now / This Term / Next Term / 12 months).

1.2 Navigation
SkillPathwayPlannerScreen → PlanTimelineScreen

Back button on PlanTimelineScreen → returns to SkillPathwayPlannerScreen with state preserved (selected role, skills, actions).

2. PlanTimelineScreen – Content & Structure
2.1 Screen purpose
Give the user a calendar-like, time-bucketed view of all actions in their skill plan (modules, external courses, practice tasks, events), and let them manage them: mark complete, reschedule, or inspect details—similar to planner/timeline UX in task apps.

2.2 Layout (top → bottom)
Header

Title: “Skill plan timeline”

Subtext: “See and manage all your planned actions over the next 12 months.”

Back arrow → SkillPathwayPlannerScreen.

Role & period context bar

Small strip with:

Target role (e.g., “Investment Banking Analyst”).

Time horizon label: “Now → 12 months”.

Optional “Change role” link → returns to planner (not needed inside this screen).

Time range selector

SegmentedControl:

“All”

“Now”

“This term”

“Next term”

“12 months”

Switching segment filters the list below (no navigation).

Filter chips row

FilterChips:

Types: “Modules”, “External courses”, “Practice tasks”, “Events”.

Skills: top 2–3 key skills in plan (e.g., “Excel modelling”, “Presentation”).

Status: “Planned”, “In progress”, “Completed”.

Used to quickly focus the timeline (borrowed from task planner patterns).

Timeline list (grouped by time bucket) Use a vertical, grouped list rather than complex Gantt for mobile:

Group headers:

“Now (0–4 weeks)”

“This term”

“Next term”

“Within 12 months”

Under each header, a list of Action cards:

ActionCard content (per item):

Title:

For module: “Corporate Finance I (Module)”

For course: “Excel for Finance (Online course)”

For task: “Build 2‑page cash flow model”

For event: “Banking networking night”

Meta line:

Date or period: “Week 3–4”, “Term 2”, “Q4”.

Duration/effort: e.g., “6 hours”, “1 evening”.

Skills chips:

e.g., [Excel modelling], [Valuation basics].

Status chip:

“Planned” (default), “In progress”, “Completed”, “Skipped”.

Colour-coded.

Icons:

Small icon by type (book, laptop, checklist, calendar).

Right chevron to open detail.

Progress & reminders strip (bottom)

Progress bar or ring:

“Planned actions: 7 · Completed: 2”.

Toggle: “Enable reminders for this plan”.

If on, the backend schedules notifications based on dates/time buckets.

Add custom action (optional)

Floating action button (FAB) or button at bottom:

“Add custom action”

Opens a short form to add user-defined tasks (e.g., “Meet alumni in finance”).

3. Detailed UI Flow & Components
3.1 Tapping an ActionCard → TimelineItemDetailSheet
Purpose: Let user inspect and adjust a specific item without leaving the timeline context.

Content in detail sheet

Header:

Title + type icon.

Status chip (editable; tap to change status).

Timing:

Planned time bucket (dropdown): Now / This term / Next term / 12 months.

Optional specific date or week (DatePicker or simple “Week 3–4” picker).

Details:

Description (short paragraph).

Skills targeted (chips).

Source:

“From your degree” / “External course” / “Practice task” / “Event”.

For module:

Module code and faculty; “More info” link to ModuleInfoSheet.

For course:

Provider, link to course page.

For event:

Date/time, location, “Register” button (deep-links to Opportunity Hub / event detail).

Controls:

PrimaryButton: “Mark as completed” / “Mark as in progress”.

OutlineButton: “Reschedule” (focuses the timing inputs).

TextButton: “Remove from plan”.

Components

BottomSheet (or full-screen modal on small devices).

StatusChip with dropdown or selection popup.

DateRangeSelector or bucket selector.

SkillChipGroup.

LinkRow for module/course/event.

Flow

User taps card → opens sheet.

User edits status/timing → Save automatically (or via small “Save” button).

Closing sheet returns to PlanTimelineScreen with updated card.

3.2 Adding a Custom Action → AddCustomActionSheet
Trigger

Tap “Add custom action” FAB/bottom button.

Content

Title: “Add custom action”

Fields:

Title (e.g., “Book 1:1 with career advisor”).

Type selector: Practice / Course / Event / Other.

Time bucket: Now / This term / Next term / 12 months.

Optional specific date (DatePicker).

Skills (chips; optional).

Notes (free text).

Buttons:

PrimaryButton: “Add to plan”

TextButton: “Cancel”

After save

New ActionCard appears under the chosen time group with status “Planned”.

3.3 Reminder toggle & notification preferences
Location

At bottom of PlanTimelineScreen: “Enable reminders for this plan” toggle.

Behaviour

ON:

App schedules notifications for upcoming actions based on their time bucket and any specific dates.

OFF:

No plan-based notifications (can still use generic app notifications).

Components

ToggleRow: label + toggle + short helper text (“We’ll remind you about upcoming modules, courses and tasks in your plan.”).

4. Relationships & Flows to Other Features
4.1 From Timeline → Skill Pathway Planner (parent)
Back arrow simply returns to SkillPathwayPlannerScreen, where:

Actions list and skill heatmap reflect any changes made in timeline (completed/rescheduled items).

Planner uses timeline data to:

Update “Planned vs completed” counts.

Potentially adjust “Readiness” score in Outcomes Dashboard.

4.2 From Timeline → Opportunity Hub
Timeline actions that represent events or employer programmes:

Tapping “Register” in detail sheet:

Opens OpportunityHubScreen with that event/programme highlighted.

Status updates (e.g., “Registered”) can sync back to Hub.

4.3 From Timeline → Credentials / Outcomes (future)
Completed items that correspond to micro-credentials or HEAR-reportable achievements:

Could show a hint in detail sheet: “This may be added to your credentials later” (no immediate navigation required).

5. Component Summary
On PlanTimelineScreen

AppBar

Back arrow

Title “Skill plan timeline”

ContextBar

Role + time horizon

SegmentedControl

All / Now / This term / Next term / 12 months

FilterChipRow

Type, Skill, Status filters

SectionHeader

“Now (0–4 weeks)”, “This term”, etc.

ActionCard (shared component)

Title, type icon, time, effort, skills chips, status chip, chevron

ProgressIndicator and counts

ToggleRow for reminders

FloatingActionButton or bottom PrimaryButton for “Add custom action”

Sub-elements

TimelineItemDetailSheet

AddCustomActionSheet

DatePicker / bucket selector

SkillChipGroup

StatusChip