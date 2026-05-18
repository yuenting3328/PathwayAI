1. High-Level Flow Overview
Screens in order:

InterviewSessionSetupScreen

InterviewPracticeScreen (live session)

InterviewPauseOrEndSheet (if user quits mid-way)

InterviewSummaryScreen (results & next steps)

Flow:

MyInterviewScreen → tap Start Practice Session on AI Interview Coach card
→ InterviewSessionSetupScreen (configure session)
→ tap Begin session
→ InterviewPracticeScreen (AI asks questions, user answers)
→ session completes or user ends early
→ InterviewSummaryScreen (scores, insights, recommended next steps).

Back navigation:

From Setup: back → MyInterviewScreen.

From Practice: back/close → InterviewPauseOrEndSheet → confirm end or resume.

From Summary: back → MyInterviewScreen (with last session listed).

2. InterviewSessionSetupScreen – Session Configuration
2.1 Screen purpose
Help user configure a focused, role-specific mock interview quickly before starting the AI session, similar to other AI practice tools that tailor questions to target roles.

2.2 Content blocks (top → bottom)
Header

Title: “Start practice session”

Subtext: “Set up a mock interview for a specific role.”

Selected role & company block

If user has saved applications:

“Interview for” row with role + company (pre-filled from a selected job or target role).

“Change” link → opens RoleSelectorSheet (search job title or pick from recent applications).

If no saved applications:

Single RoleSelector field (required).

Interview type selector

Options (radio or segmented control):

“Screening / General fit”

“Behavioural (STAR)”

“Role-specific / Technical”

Brief one-line hint under each when selected.

Format & duration

Format options:

“Question-by-question (recommended)”

(Optional) “Continuous conversation” (if supported later).

Duration:

Slider or pills: 10 min / 20 min / 30 min.

Focus areas

Multi-select chips:

Common weaknesses (e.g., “Tell me about yourself”, “Strengths & weaknesses”, “Past projects”, “Motivation & cultural fit”).

Additional chips using user’s skill gaps: “Data analysis”, “Stakeholder communication”.

Answer mode

Toggle/selector:

“Voice answers”

“Text answers”

Short note: “We record your responses only to generate feedback. They’re not shared with employers.”

Session preview & actions

Short preview text: “You’ll get ~X questions and instant feedback at the end.”

Primary button: Begin session

Secondary button: “Cancel” (returns to MyInterviewScreen).

2.3 Key components
AppBar with back arrow + title.

RoleSelectorRow (label + value + “Change”).

SegmentedControl or radio group for interview type and format.

DurationChips or slider.

ChipGroup for Focus areas.

ToggleGroup for answer mode.

InfoText for brief privacy & usage note.

PrimaryButton (“Begin session”), SecondaryButton (“Cancel”).

3. InterviewPracticeScreen – Live AI Interview
3.1 Screen purpose
Deliver a realistic Q&A experience: AI asks questions, user responds; system transcribes, times, and later scores responses, in line with AI interview practice tools that provide natural conversations and instant feedback.

3.2 Layout & content (top → bottom)
Sticky header

Left: back/close icon (X) → opens InterviewPauseOrEndSheet.

Center: step indicator (“Question 1 of 8”).

Right: countdown or elapsed time (depending on format).

Context strip

Small bar showing:

Role (e.g., “Data Analyst”) and company if selected.

Interview type label (e.g., “Behavioural · 20 min”).

AI question area

Question text in a prominent card:

e.g., “Tell me about a time you handled conflicting priorities.”

Optional subtitle: hint like “Use STAR: Situation, Task, Action, Result.”

Answer input area (depends on mode) A. Voice mode

Central RecordButton (round mic) with label:

“Tap to start answering” / “Tap to stop”.

When recording:

Animated waveform or pulsing mic icon.

Small timer showing current answer duration.

Live transcription line (optional, if supported) showing text as user speaks.

B. Text mode

Multi-line TextInput box.

Placeholder: “Type your answer here…”

Character counter (optional).

Controls row

Buttons:

“Replay question” (if audio question), or “See hint” (opens short guidance bottom sheet).

“Skip question” (moves to next; flagged for review).

“Next” (enabled after an answer is recorded/entered).

Progress/feedback micro-state (inline)

Example messages:

“Good, now wrap up your answer with a clear result.”

“You’ve spoken for 2 minutes—try summarising.”

(These are lightweight hints during the session, with deeper feedback later.)

3.3 Components
AppBar with close icon + step indicator.

ContextBar (role + interview type).

QuestionCard (text).

RecordButton + waveform, or MultilineTextInput.

Timer component.

ActionButtonRow:

OutlineButton (“Skip”), PrimaryButton (“Next”), IconButton for help/hint.

Optional BottomSheet for hints:

Title: “How to answer this question”

2–3 bullet guidelines.

3.4 Flow inside this screen
For each question:

Show question.

User answers (voice or text).

User taps Next:

Answer is saved + timestamped.

Backend can score or store for later evaluation.

If more questions:

Transition animation to next question (with a subtle progress change).

On last question:

Next → triggers “Analysing your responses…” state → InterviewSummaryScreen.

4. InterviewPauseOrEndSheet – When user taps close/back
4.1 Content
Title: “End practice session?”

Summary:

“You’ve answered 3 of 8 questions.”

Options:

Primary: “End and view feedback so far”

Secondary: “Continue session”

4.2 Components
BottomSheet with:

Title text

Short descriptive text

PrimaryButton (“End session”)

TextButton (“Continue”)

Flow:

“Continue session” → dismiss sheet, return to InterviewPracticeScreen.

“End session” → go to InterviewSummaryScreen with partial results.

5. InterviewSummaryScreen – Feedback & Next Steps
5.1 Screen purpose
Provide instant, structured feedback and connect to other app capabilities (Skill Pathway Planner, AI Coach, application analytics), similar to how AI interview tools show scoring and improvement suggestions.

5.2 Content blocks (top → bottom)
Header & status

Title: “Session summary”

Subtext: “Here’s how you did in this practice interview.”

Badge: “Completed” or “Ended early (3 of 8 questions)”.

Overall score & rating

Large score (0–100) or star-based rating.

Label: “Overall performance” with short interpretation text:

“Good structure, can improve on concise answers.”

Dimension breakdown cards

Small ScoreCard list:

“Communication clarity” (score + colour)

“Structure (STAR)”

“Relevance to role”

“Confidence & tone” (only if voice used)

Each card can be tappable to expand for 1–2 bullet tips.

Question-by-question review

Collapsible list:

For each question:

Question text

Status: answered / skipped

Short comment (e.g., “Strong example, but result could be more quantifiable.”)

Link: “View answer”

If text: shows user’s original text.

If voice: partial transcript plus optional playback (if supported).

Key improvement suggestions

A concise “Next 3 things to practice” section:

Example items:

“Shorten your introductions to ~60 seconds.”

“Use more specific metrics when describing results.”

“Practice questions about conflict with stakeholders.”

Each suggestion can have a small “Practice this” CTA.

Follow-up CTAs (integration points)

“Add to skill plan”

Opens Skill Pathway Planner with relevant skills (e.g., “communication”, “stakeholder management”) flagged.

“Ask AI Coach for a follow-up plan”

Opens Coach with a pre-filled prompt like:

“I just did a mock interview for Data Analyst and scored low in structure. Help me practice STAR answers.”

“Schedule another session” (optional)

Jumps back to InterviewSessionSetupScreen with same role/preference pre-filled.

Session meta & logging

Small section: “Session details”

Role, company (if any)

Interview type

Date/time

Duration / number of questions answered

This allows the My Interview page to list past sessions with summary stats.

5.3 Components
ScoreHeader (large score + label).

ScoreCardRow (for dimension breakdown).

CollapsibleList for questions.

ImprovementList (3 bullet rows with icon).

PrimaryButton: “Add to skill plan”

SecondaryButton: “Ask AI Coach”

TertiaryButton: “Start another session”

6. Data & Integration (for product/engineering)
6.1 Data captured per session
Config:

Role, company, interview type, format, duration, focus areas, answer mode.

Behaviour:

Questions asked, answers (text or transcript), timestamps, skips.

Scoring:

Overall score, per-dimension scores, key improvements.

6.2 How this connects to existing app
MyInterviewScreen

Shows list of past sessions with:

Role, type, date, overall score, quick trend (“↑ vs last time”).

Skill Pathway Planner

Uses dimension scores to emphasise relevant skills (e.g., communication, storytelling) and suggests practice tasks or courses.

AI Coach

Uses last session metadata to guide conversation and suggestions (e.g., “You’ve struggled with behavioural answers; let’s practice STAR”).

Career Analytics

Future: correlate interview practice frequency and score improvements with offer rates.

