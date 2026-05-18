# Pathway Institutional SaaS — UI Design System

**Version:** 1.0  
**Last Updated:** May 11, 2026  
**Platform:** Analytics and Management Platform for Hong Kong Universities

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Dashboard Layouts](#dashboard-layouts)
7. [Navigation Structure](#navigation-structure)
8. [Data Visualization](#data-visualization)
9. [Interaction Patterns](#interaction-patterns)
10. [Accessibility Guidelines](#accessibility-guidelines)

---

## Design Principles

### Core Values

**1. Clarity Over Complexity**
- Prioritize information hierarchy in data-dense environments
- Use progressive disclosure to prevent cognitive overload
- Clear labeling and contextual help for all metrics

**2. Multi-Stakeholder Design**
- Role-based interfaces (Administrators, Department Heads, Students, Alumni)
- Contextual views that adapt to user permissions
- Consistent patterns across stakeholder journeys

**3. Privacy-First Visualization**
- Anonymized, aggregated data display by default
- Clear visual indicators for data sensitivity levels
- Compliant with institutional privacy standards

**4. Data-Driven Decision Making**
- Actionable insights at-a-glance
- Comparative visualizations (cohort, temporal, benchmark)
- Export and reporting workflows integrated seamlessly

**5. Institutional Trust**
- Professional, enterprise-grade aesthetic
- Regulatory compliance indicators (UGC/HKQA)
- Audit trails and data provenance transparency

---

## Color System

### Foundation Palette

```css
/* Primary Colors */
--color-primary-50: #EEF2FF;
--color-primary-100: #E0E7FF;
--color-primary-200: #C7D2FE;
--color-primary-300: #A5B4FC;
--color-primary-400: #818CF8;
--color-primary-500: #6366F1;  /* Primary Brand */
--color-primary-600: #4F46E5;
--color-primary-700: #4338CA;
--color-primary-800: #3730A3;
--color-primary-900: #312E81;

/* Secondary Colors */
--color-secondary-50: #FFFBEB;
--color-secondary-100: #FEF3C7;
--color-secondary-200: #FDE68A;
--color-secondary-300: #FCD34D;
--color-secondary-400: #FBBF24;  /* Secondary Brand */
--color-secondary-500: #F59E0B;
--color-secondary-600: #D97706;
--color-secondary-700: #B45309;
--color-secondary-800: #92400E;
--color-secondary-900: #78350F;

/* Semantic Colors */
--color-success-400: #4ADE80;
--color-success-500: #34D399;  /* Success */
--color-success-600: #22C55E;

--color-danger-400: #FB7185;
--color-danger-500: #F43F5E;   /* Danger */
--color-danger-600: #E11D48;

--color-info-400: #38BDF8;
--color-info-500: #0EA5E9;     /* Info */
--color-info-600: #0284C7;

--color-warning-400: #FACC15;
--color-warning-500: #EAB308;
--color-warning-600: #CA8A04;
```

### Dark Mode Palette (Default)

```css
/* Background Layers */
--bg-base: #0A0A0F;           /* Base canvas */
--bg-surface: #141419;        /* Card/panel background */
--bg-surface-hover: #1C1C24;  /* Hover states */
--bg-surface-active: #232330; /* Active/pressed states */
--bg-elevated: #1F1F28;       /* Modal/dropdown overlays */

/* Border & Divider */
--border-subtle: #2A2A36;
--border-default: #3A3A48;
--border-strong: #4A4A58;

/* Text Hierarchy */
--text-primary: #FFFFFF;      /* Headers, primary content */
--text-secondary: #B4B4C8;    /* Secondary content */
--text-tertiary: #8A8A9E;     /* Tertiary content, labels */
--text-disabled: #5A5A6E;     /* Disabled states */
--text-inverse: #0A0A0F;      /* Text on colored backgrounds */

/* Chart & Visualization Colors */
--chart-color-1: #6366F1;     /* Primary metric */
--chart-color-2: #0EA5E9;     /* Secondary metric */
--chart-color-3: #34D399;     /* Positive metric */
--chart-color-4: #FBBF24;     /* Highlight metric */
--chart-color-5: #A78BFA;     /* Purple variant */
--chart-color-6: #2DD4BF;     /* Teal variant */
--chart-color-7: #FB923C;     /* Orange variant */
--chart-color-8: #F472B6;     /* Pink variant */
```

### Color Usage Guidelines

**Primary (#6366F1)** → Primary actions, key metrics, active states  
**Secondary (#FBBF24)** → Highlights, warnings, secondary actions  
**Success (#34D399)** → Positive trends, completions, growth indicators  
**Danger (#F43F5E)** → Negative trends, alerts, critical actions  
**Info (#0EA5E9)** → Informational content, tooltips, guides

---

## Typography

### Font Stack

```css
/* Primary Font Family */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Monospace (for data, code, IDs) */
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 
             'Courier New', monospace;
```

### Type Scale

```css
/* Display */
--text-display-2xl: 72px / 1.1 / -0.02em;  /* Weight: 700 */
--text-display-xl: 60px / 1.1 / -0.02em;   /* Weight: 700 */
--text-display-lg: 48px / 1.2 / -0.01em;   /* Weight: 600 */
--text-display-md: 36px / 1.2 / -0.01em;   /* Weight: 600 */

/* Heading */
--text-h1: 30px / 1.3 / -0.01em;           /* Weight: 600 */
--text-h2: 24px / 1.3 / -0.005em;          /* Weight: 600 */
--text-h3: 20px / 1.4 / 0;                 /* Weight: 600 */
--text-h4: 18px / 1.4 / 0;                 /* Weight: 600 */
--text-h5: 16px / 1.5 / 0;                 /* Weight: 500 */
--text-h6: 14px / 1.5 / 0;                 /* Weight: 500 */

/* Body */
--text-body-xl: 20px / 1.6 / 0;            /* Weight: 400 */
--text-body-lg: 18px / 1.6 / 0;            /* Weight: 400 */
--text-body-md: 16px / 1.6 / 0;            /* Weight: 400 */
--text-body-sm: 14px / 1.5 / 0;            /* Weight: 400 */
--text-body-xs: 12px / 1.5 / 0;            /* Weight: 400 */

/* Label */
--text-label-lg: 14px / 1.4 / 0.01em;      /* Weight: 500, uppercase */
--text-label-md: 12px / 1.4 / 0.02em;      /* Weight: 500, uppercase */
--text-label-sm: 10px / 1.4 / 0.03em;      /* Weight: 500, uppercase */

/* Monospace */
--text-mono-lg: 16px / 1.5 / 0;            /* Weight: 400 */
--text-mono-md: 14px / 1.5 / 0;            /* Weight: 400 */
--text-mono-sm: 12px / 1.5 / 0;            /* Weight: 400 */
```

### Font Weights

- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Labels, secondary headings
- **Semibold (600)**: Headings, emphasis, primary buttons
- **Bold (700)**: Display text, data highlights

---

## Spacing & Layout

### Spacing Scale

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Grid System

**Desktop (≥1280px)**
- 12-column grid
- Column width: flexible
- Gutter: 24px
- Margin: 40px

**Tablet (768px–1279px)**
- 8-column grid
- Gutter: 20px
- Margin: 32px

**Mobile (<768px)**
- 4-column grid
- Gutter: 16px
- Margin: 16px

### Layout Containers

```css
/* Max Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
--container-full: 100%;

/* Common Dashboard Layout */
--sidebar-width: 280px;
--header-height: 64px;
--sub-header-height: 56px;
```

---

## Component Library

### 1. Buttons

#### Primary Button
```
Size: Medium (40px height)
Padding: 12px 24px
Background: var(--color-primary-500)
Text: var(--text-primary), 14px, weight 600
Border-radius: 8px
Hover: var(--color-primary-600)
Active: var(--color-primary-700)
Focus: 4px outline var(--color-primary-500) at 20% opacity
```

**Variants:**
- **Secondary**: Background transparent, border 1.5px var(--border-strong), text var(--text-primary)
- **Tertiary**: Background transparent, no border, text var(--color-primary-400)
- **Danger**: Background var(--color-danger-500)
- **Success**: Background var(--color-success-500)

**Sizes:**
- Small: 32px height, 10px 16px padding, 12px text
- Medium: 40px height, 12px 24px padding, 14px text
- Large: 48px height, 14px 28px padding, 16px text

**States:**
- Disabled: 40% opacity, cursor not-allowed
- Loading: Spinner icon, text hidden

---

### 2. Cards

#### Metric Card
```
Background: var(--bg-surface)
Border: 1px solid var(--border-subtle)
Border-radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.3)
Hover: border-color var(--border-default), shadow elevation
```

**Anatomy:**
- Label (12px, uppercase, var(--text-tertiary))
- Value (36px, weight 600, var(--text-primary))
- Change indicator (+12.5%, with arrow, colored by sentiment)
- Sparkline chart (optional, 60px height)
- Timestamp (10px, var(--text-tertiary))

#### Dashboard Panel Card
```
Background: var(--bg-surface)
Border: 1px solid var(--border-subtle)
Border-radius: 12px
Padding: 0
Shadow: 0 1px 3px rgba(0,0,0,0.3)
```

**Anatomy:**
- Header (padding 20px 24px, border-bottom 1px var(--border-subtle))
  - Title (18px, weight 600)
  - Actions (icon buttons, filters)
- Body (padding 24px)
- Footer (padding 16px 24px, border-top 1px var(--border-subtle), optional)

---

### 3. Data Tables

#### Standard Table
```
Background: var(--bg-surface)
Border: 1px solid var(--border-subtle)
Border-radius: 12px
Font: 14px, Inter
```

**Table Header:**
- Background: var(--bg-base)
- Padding: 12px 16px
- Text: 12px, weight 600, uppercase, var(--text-tertiary)
- Border-bottom: 2px solid var(--border-default)
- Sortable columns: Hover cursor pointer, show sort icon

**Table Row:**
- Padding: 16px
- Border-bottom: 1px solid var(--border-subtle)
- Hover: background var(--bg-surface-hover)
- Active/Selected: background var(--bg-surface-active), border-left 3px var(--color-primary-500)

**Table Cell Types:**
- Text: var(--text-primary)
- Number: Monospace font, right-aligned
- Status badge: Pill-shaped, colored background
- Action: Icon buttons, show on row hover

**Pagination:**
- Footer bar, 48px height
- Page numbers, previous/next buttons
- Rows per page selector

---

### 4. Filters & Search

#### Filter Bar
```
Background: var(--bg-surface)
Border: 1px solid var(--border-subtle)
Border-radius: 10px
Padding: 16px
Display: Flex row, gap 12px
Margin-bottom: 24px
```

**Filter Components:**
- **Search input**: Icon left, 40px height, 240px width
- **Dropdown select**: Multi-select with checkboxes
- **Date range picker**: Calendar overlay
- **Quick filters**: Chip buttons (All, Faculty, Cohort, etc.)
- **Clear filters**: Text button, right-aligned

#### Search Input
```
Height: 40px
Padding: 10px 16px 10px 40px
Background: var(--bg-base)
Border: 1px solid var(--border-default)
Border-radius: 8px
Icon: Search icon (20px) at left, var(--text-tertiary)
Placeholder: var(--text-disabled)
Focus: border var(--color-primary-500), shadow 0 0 0 4px primary at 10% opacity
```

---

### 5. Dropdowns & Selects

#### Dropdown Menu
```
Background: var(--bg-elevated)
Border: 1px solid var(--border-default)
Border-radius: 10px
Padding: 8px
Shadow: 0 10px 40px rgba(0,0,0,0.5)
Min-width: 200px
Max-height: 320px (scrollable)
```

**Menu Item:**
- Padding: 10px 12px
- Border-radius: 6px
- Hover: background var(--bg-surface-hover)
- Active: background var(--bg-surface-active), text var(--color-primary-400)
- Icon: 20px, left-aligned
- Keyboard focus: outline var(--color-primary-500)

**Multi-Select:**
- Checkbox: 18px, left-aligned
- "Select All" option at top
- Selected count badge in trigger button

---

### 6. Charts & Visualizations

#### Line Chart
```
Height: 320px (default)
Background: Transparent
Grid: Horizontal lines, var(--border-subtle), dashed
Axes: var(--text-tertiary), 12px
Data line: 2.5px stroke, var(--chart-color-1)
Data points: 6px circle, show on hover
Tooltip: var(--bg-elevated), 12px text, multi-line for comparisons
```

**Multi-Series:**
- Legend: Top-right, 12px, color-coded dots
- Lines: Different colors from chart palette
- Area fill: 15% opacity gradient

#### Bar Chart
```
Height: 280px
Bar width: Auto (responsive)
Bar fill: var(--chart-color-1)
Bar spacing: 8px
Hover: Increase bar opacity to 100%, show value label
Axes: Same as line chart
```

**Stacked Bar:**
- Segment colors: Chart palette in order
- Hover: Highlight segment, show tooltip with breakdown

#### Donut/Pie Chart
```
Diameter: 200px
Stroke width: 32px (donut), N/A (pie)
Segment colors: Chart palette
Center label (donut): Metric value, 24px weight 600
Legend: Right-aligned, vertical list
Hover: Enlarge segment slightly, show percentage tooltip
```

#### Heatmap
```
Cell size: 40px × 40px
Cell border: 1px var(--border-subtle)
Color scale: 5-step gradient from var(--chart-color-2) to var(--chart-color-3)
Labels: Row/column headers, 12px
Tooltip: Value + context on hover
```

---

### 7. Navigation Components

#### Sidebar Navigation
```
Width: 280px
Background: var(--bg-surface)
Border-right: 1px solid var(--border-subtle)
Padding: 24px 16px
```

**Logo Area:**
- Height: 64px
- Padding: 16px
- Pathway logo + wordmark

**Nav Item:**
- Height: 44px
- Padding: 10px 16px
- Border-radius: 8px
- Icon: 22px, left-aligned, 12px margin-right
- Text: 15px, weight 500
- Hover: background var(--bg-surface-hover)
- Active: background var(--color-primary-500), text white

**Nav Group:**
- Group label: 11px, uppercase, weight 600, var(--text-tertiary), 24px margin-top
- Collapsible: Chevron icon, rotate on expand

#### Top Bar
```
Height: 64px
Background: var(--bg-surface)
Border-bottom: 1px solid var(--border-subtle)
Padding: 0 32px
Display: Flex, justify space-between
```

**Left Section:**
- Page title: 20px, weight 600
- Breadcrumbs: 14px, var(--text-secondary), separated by "/"

**Right Section:**
- Notification bell (icon button, badge for count)
- User avatar (32px circle)
- Settings icon button

---

### 8. Modals & Overlays

#### Modal
```
Background: var(--bg-elevated)
Border: 1px solid var(--border-default)
Border-radius: 16px
Shadow: 0 20px 60px rgba(0,0,0,0.6)
Max-width: 600px (medium), 900px (large)
Padding: 0
```

**Modal Header:**
- Padding: 24px
- Border-bottom: 1px solid var(--border-subtle)
- Title: 20px, weight 600
- Close button: Top-right, icon 24px

**Modal Body:**
- Padding: 24px
- Max-height: 60vh, scrollable

**Modal Footer:**
- Padding: 16px 24px
- Border-top: 1px solid var(--border-subtle)
- Actions: Right-aligned, gap 12px

**Backdrop:**
- Background: rgba(0,0,0,0.75)
- Blur: 4px

---

### 9. Forms

#### Text Input
```
Height: 40px
Padding: 10px 14px
Background: var(--bg-base)
Border: 1px solid var(--border-default)
Border-radius: 8px
Font: 14px
Color: var(--text-primary)
Placeholder: var(--text-disabled)
```

**States:**
- Focus: border var(--color-primary-500), shadow 0 0 0 4px primary at 10%
- Error: border var(--color-danger-500), helper text var(--color-danger-400)
- Disabled: background var(--bg-surface), opacity 50%

**Label:**
- Font: 14px, weight 500, var(--text-primary)
- Margin-bottom: 8px
- Required asterisk: var(--color-danger-400)

**Helper Text:**
- Font: 12px, var(--text-tertiary)
- Margin-top: 6px

#### Checkbox
```
Size: 20px
Border: 2px solid var(--border-strong)
Border-radius: 4px
Background: var(--bg-base)
Checked: background var(--color-primary-500), white checkmark
Hover: border var(--color-primary-400)
```

#### Radio Button
```
Size: 20px
Border: 2px solid var(--border-strong)
Border-radius: 50%
Background: var(--bg-base)
Checked: border var(--color-primary-500), inner dot 10px var(--color-primary-500)
```

#### Toggle Switch
```
Width: 44px
Height: 24px
Border-radius: 12px
Background off: var(--border-strong)
Background on: var(--color-primary-500)
Knob: 18px circle, white, 3px offset
Transition: 200ms ease
```

---

### 10. Badges & Tags

#### Status Badge
```
Height: 24px
Padding: 4px 10px
Border-radius: 12px (pill)
Font: 12px, weight 500
Display: inline-flex, align-items center
```

**Variants:**
- **Success**: background var(--color-success-500) at 15%, text var(--color-success-400), border var(--color-success-500) at 30%
- **Warning**: background var(--color-warning-500) at 15%, text var(--color-warning-400)
- **Danger**: background var(--color-danger-500) at 15%, text var(--color-danger-400)
- **Info**: background var(--color-info-500) at 15%, text var(--color-info-400)
- **Neutral**: background var(--bg-surface-hover), text var(--text-secondary)

#### Tag (Filter/Category)
```
Height: 28px
Padding: 6px 12px
Border-radius: 6px
Background: var(--bg-surface-hover)
Border: 1px solid var(--border-default)
Font: 13px, weight 500
Hover: border var(--color-primary-500)
Removable: Close icon (×) right-aligned, 16px, clickable
```

---

### 11. Icons

**Icon Library:** Lucide React (consistent, modern, open-source)

**Sizes:**
- XS: 16px
- SM: 20px
- MD: 24px
- LG: 28px
- XL: 32px

**Usage Guidelines:**
- Navigation: 22px
- Buttons: 20px (medium button), 18px (small), 22px (large)
- Tables: 18px
- Status indicators: 16px
- Page headers: 24px

**Color:**
- Default: var(--text-tertiary)
- Interactive: var(--text-secondary), hover var(--color-primary-400)
- Active: var(--color-primary-500)

---

### 12. Tooltips

```
Background: var(--bg-elevated)
Border: 1px solid var(--border-default)
Border-radius: 6px
Padding: 8px 12px
Font: 13px, var(--text-primary)
Shadow: 0 4px 12px rgba(0,0,0,0.4)
Max-width: 240px
Arrow: 6px, color-matched to background
Delay: 300ms on hover
```

---

### 13. Loading States

#### Spinner
```
Size: 24px (medium)
Stroke: 3px
Color: var(--color-primary-500)
Animation: 800ms linear infinite rotation
```

#### Skeleton Loader
```
Background: linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-surface-hover) 50%, var(--bg-surface) 100%)
Border-radius: Match component (8px for cards, 4px for text)
Animation: 1.5s shimmer infinite
```

**Common Skeletons:**
- Text line: height 16px, width 100%
- Card: height 200px, border-radius 12px
- Avatar: 40px circle
- Button: height 40px, width 120px

#### Progress Bar
```
Height: 6px
Background: var(--bg-surface-hover)
Border-radius: 3px
Fill: var(--color-primary-500)
Animated fill: 1s ease-in-out
Indeterminate: 1.5s sliding animation
```

---

### 14. Alerts & Notifications

#### Alert Banner
```
Padding: 16px 20px
Border-radius: 10px
Border-left: 4px solid (variant color)
Display: Flex, align-items center
Gap: 12px
```

**Variants:**
- **Info**: background var(--color-info-500) at 10%, border-left var(--color-info-500)
- **Success**: background var(--color-success-500) at 10%, border-left var(--color-success-500)
- **Warning**: background var(--color-warning-500) at 10%, border-left var(--color-warning-500)
- **Danger**: background var(--color-danger-500) at 10%, border-left var(--color-danger-500)

**Anatomy:**
- Icon: 22px, left-aligned, color-matched
- Title: 14px, weight 600
- Description: 14px, var(--text-secondary)
- Close button: Icon 20px, right-aligned

#### Toast Notification
```
Width: 360px
Position: Fixed top-right, 24px offset
Background: var(--bg-elevated)
Border: 1px solid var(--border-default)
Border-radius: 10px
Padding: 16px
Shadow: 0 8px 24px rgba(0,0,0,0.5)
Animation: Slide in from right, 300ms
Auto-dismiss: 5s (configurable)
```

---

### 15. Empty States

```
Display: Flex column, center-aligned
Padding: 80px 40px
Text-align: center
```

**Anatomy:**
- Illustration: 200px SVG, var(--text-tertiary) color
- Title: 20px, weight 600, var(--text-primary)
- Description: 15px, var(--text-secondary), max-width 400px
- CTA button: Primary button, 16px margin-top

**Scenarios:**
- No data available: "No data yet" + "Import data" CTA
- No search results: "No results found" + "Clear filters" CTA
- No permissions: "Access restricted" + "Request access" CTA

---

## Dashboard Layouts

### 1. Institutional Analytics Dashboard

**Layout Structure:**
```
[Header: 64px]
[Filter Bar: Auto height, 16px margin-bottom]
[Metric Cards Row: 4 columns, equal width, 24px gap]
[Charts Section: 2 columns (8:4 split), 24px gap]
  - Left: Employment Rate Trends (Line chart, 400px height)
  - Right: Salary Band Distribution (Bar chart, 400px height)
[Data Table: Full width, auto height]
```

**Key Metrics Cards:**
1. **Overall Employment Rate**: 87.5% (+2.3% vs last year)
2. **Average Time-to-First-Offer**: 45 days (-8 days vs last year)
3. **Median Starting Salary**: HKD $18,500 (+5.2%)
4. **Active Job Seekers**: 1,247 students

**Filter Options:**
- Faculty dropdown (multi-select)
- Cohort year range
- Employment status
- Date range

---

### 2. Employer & Market Intelligence Dashboard

**Layout Structure:**
```
[Header with breadcrumb: "Insights > Market Intelligence"]
[Quick Stats: 3 columns]
[Sector Demand Index: Full width heatmap, 320px height]
[Two-column layout: 6:6]
  - Left: District Salary Benchmarks (Choropleth map)
  - Right: Top Hiring Employers (Ranked list with logos)
[Competency Feedback Section: Full width table]
```

**Sector Demand Index:**
- Rows: Finance, IT, Professional Services, Education, Healthcare, Retail
- Columns: Q1, Q2, Q3, Q4
- Color scale: Low demand (blue) → High demand (amber)
- Interactive: Click cell to drill into sector details

**District Salary Benchmarks:**
- Map of Hong Kong districts
- Color-coded by median salary range
- Tooltip: District name, median salary, quartile ranges
- Filter by job category

---

### 3. Curriculum Alignment Interface

**Layout Structure:**
```
[Header: "Curriculum Insights"]
[Skills Gap Overview: 2 large metric cards]
  - Underdeveloped Competencies Count
  - Curriculum Alignment Score
[Skills Matrix: Full width, 500px height]
  - Heatmap: Rows = Competencies, Columns = Programs
  - Cell color: Alignment strength
[Recommendations Panel: Right sidebar, 320px width]
  - Micro-credential suggestions
  - Industry certification alignment
  - Capstone project briefs
[Action Items Table: Full width]
```

**Skills Matrix:**
- 15+ competencies (Communication, Data Analysis, Digital Literacy, etc.)
- Programs: BBA, BEng, BSc, BA, etc.
- Hover: Show current vs. required proficiency level
- Click: Navigate to competency detail page

---

### 4. Alumni Continuity Dashboard

**Layout Structure:**
```
[Header: "Alumni Career Tracking"]
[Engagement Metrics: 4 cards]
[Career Trajectory Visualization: Full width, 600px height]
  - Sankey diagram: Education → First Job → Current Role → Sectors
[AI Career Coaching Section: 2 columns]
  - Left: Recent coaching sessions (list)
  - Right: Coaching impact metrics (success rate, satisfaction)
[Digital Credentials: Grid layout, 3 columns]
  - Badge cards with institution logo, credential name, issue date
```

**Career Trajectory Viz:**
- Start: Graduation year cohort
- Flow: Job transitions over 5-10 years
- End: Current industry/role
- Filter: Faculty, graduation year, current salary range

---

### 5. Relationship Management (ERM) Workspace

**Layout Structure:**
```
[Header: "Employer Relations"]
[CRM Summary: 3 metric cards]
  - Active Partnerships
  - Pipeline Value
  - Upcoming Events
[Kanban Board: Full width, 600px height]
  - Columns: Lead, Engaged, Partnered, Inactive
  - Cards: Employer cards with logo, contact, last interaction
[Event Calendar: Right sidebar, 400px width]
[Recent Activity Feed: Left sidebar, 400px width]
```

**Employer Card (Kanban):**
- Employer logo (48px)
- Company name (16px, weight 600)
- Contact person + role
- Last interaction timestamp
- Tags: Industry, partnership type
- Quick actions: Email, call, schedule meeting

---

### 6. Reporting & Compliance Dashboard

**Layout Structure:**
```
[Header: "Reports & Compliance"]
[Compliance Status: 2 cards]
  - UGC Reporting Status (traffic light system)
  - HKQA Alignment Score
[Report Templates: Grid, 3 columns]
  - Template cards: Icon, name, description, "Generate" button
[Recent Reports: Table with columns]
  - Report name, generated date, generated by, status, download link
[Scheduled Reports: Calendar view]
```

**Report Template Card:**
- Icon: Document icon with color-coding by type
- Template name: "Annual Employment Report"
- Description: One-liner about content
- Regulatory alignment badge: "UGC Compliant"
- "Generate Report" primary button
- "Customize" secondary button

---

## Navigation Structure

### Information Architecture

```
Pathway Institutional SaaS
│
├── Dashboard (Home)
│   └── Executive summary, key metrics overview
│
├── Analytics
│   ├── Employment Insights
│   ├── Salary Trends
│   ├── Time-to-Hire Analysis
│   └── Cohort Comparisons
│
├── Market Intelligence
│   ├── Sector Demand
│   ├── Employer Directory
│   ├── Salary Benchmarks
│   └── Competency Feedback
│
├── Curriculum
│   ├── Skills Mapping
│   ├── Gap Analysis
│   ├── Micro-Credentials
│   └── Capstone Projects
│
├── Alumni
│   ├── Career Tracking
│   ├── AI Coaching Portal
│   ├── Digital Credentials
│   └── Alumni Directory
│
├── Employer Relations
│   ├── CRM Workspace
│   ├── Partnership Pipeline
│   ├── Event Management
│   └── Talent Hub Configuration
│
├── Reports
│   ├── Template Library
│   ├── Generated Reports
│   ├── Scheduled Reports
│   └── Compliance Dashboard
│
└── Settings
    ├── User Management
    ├── Permissions
    ├── Data Privacy
    ├── Integrations
    └── System Preferences
```

### Navigation Patterns

**Primary Navigation:** Left sidebar (always visible on desktop)  
**Secondary Navigation:** Top bar with breadcrumbs  
**Contextual Navigation:** Tabs within page sections  
**Quick Actions:** Floating action button (bottom-right) for common tasks

**Mobile Navigation:**
- Hamburger menu (top-left) reveals sidebar overlay
- Bottom tab bar for top-level sections
- Swipe gestures for drill-down navigation

---

## Data Visualization

### Chart Selection Guide

| Data Type | Recommended Chart | Use Case |
|-----------|------------------|----------|
| Trends over time | Line chart | Employment rates, salary growth |
| Comparisons | Bar chart (vertical) | Faculty-wise placement rates |
| Proportions | Donut/Pie chart | Job sector distribution |
| Distributions | Histogram | Salary ranges |
| Relationships | Scatter plot | GPA vs. starting salary |
| Hierarchies | Treemap | Skills taxonomy |
| Flows | Sankey diagram | Career trajectory paths |
| Geographic data | Choropleth map | District salary benchmarks |
| Multi-dimensional | Heatmap | Skills-curriculum alignment |

### Visualization Best Practices

**1. Always Provide Context**
- Comparison benchmarks (vs. last year, vs. regional average)
- Sample sizes displayed
- Data collection period noted

**2. Use Color Purposefully**
- Green for positive trends, red for negative
- Consistent color mapping across dashboards
- Accessible contrast ratios (WCAG AA minimum)

**3. Enable Drill-Down**
- Click chart element → filter dashboard
- Hover → detailed tooltip
- Right-click → export data segment

**4. Responsive Charts**
- Desktop: Full interactivity, legends, annotations
- Tablet: Simplified legends, touch-optimized
- Mobile: Vertical bar charts, simplified axes

---

## Interaction Patterns

### Filtering & Search

**Multi-Level Filtering:**
1. Quick filters (chips) → Instant visual feedback
2. Advanced filters (dropdown) → Apply button required
3. Search → Debounced, shows results count
4. Active filters → Displayed as removable tags above content

**Filter Persistence:**
- URL parameters encode filter state
- Shareable dashboard links
- Save filter presets ("Saved Views")

---

### Drill-Down Navigation

**Pattern:**
1. Overview metric card → Click → Detailed page
2. Chart data point → Click → Filtered view
3. Table row → Click → Entity detail modal
4. Breadcrumb trail always visible

**Example Flow:**
Dashboard "Overall Employment: 87.5%" 
→ Click → Employment Analytics page (all faculties)
→ Click "Business School" bar in chart
→ Business School employment detail view
→ Click student cohort row
→ Cohort detail modal with individual student records (anonymized)

---

### Export & Sharing

**Export Options:**
- **CSV**: Data tables, filtered results
- **PDF**: Formatted report with charts
- **PNG**: Individual chart export
- **Link**: Shareable URL with current filters

**Share Workflow:**
1. Click "Share" button (top-right of dashboard)
2. Modal appears with options:
   - Copy link (preserves filters)
   - Email report (schedule/one-time)
   - Download PDF
   - Export data (CSV)
3. Permission check (data sensitivity warning if applicable)

---

### Responsive Behaviors

**Desktop (≥1280px):**
- Sidebar navigation always visible
- Multi-column dashboard layouts
- Hover tooltips
- Drag-and-drop interactions

**Tablet (768px–1279px):**
- Collapsible sidebar (hamburger menu)
- 2-column layouts become single column
- Touch-friendly tap targets (44px minimum)
- Swipe gestures for navigation

**Mobile (<768px):**
- Bottom tab bar navigation
- Single-column stacked layouts
- Metric cards: 2 columns → 1 column
- Charts: Simplified, vertical orientation
- Tables: Horizontal scroll or card view

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on background: Minimum 4.5:1 (body), 3:1 (large text)
- Interactive elements: 3:1 against adjacent colors
- Chart data: Not reliant on color alone (use patterns, labels)

**Keyboard Navigation:**
- All interactive elements focusable (tab order logical)
- Focus indicators: 4px outline, var(--color-primary-500)
- Skip links: "Skip to main content" at page top
- Escape key closes modals/dropdowns

**Screen Reader Support:**
- Semantic HTML (nav, main, article, aside)
- ARIA labels for icon buttons
- Live regions for dynamic updates (toast notifications)
- Chart data tables (hidden, accessible alternative)

**Motion & Animation:**
- Respect `prefers-reduced-motion` media query
- Disable auto-play carousels
- Provide pause controls for auto-updating dashboards

---

### Inclusive Design

**Multi-Stakeholder Considerations:**

**Administrators:**
- High-density information displays
- Bulk actions on tables
- Advanced filtering options

**Department Heads:**
- Faculty-specific default views
- Comparison tools (vs. other departments)
- Export capabilities for presentations

**Students:**
- Personalized dashboards (own career data)
- Privacy-first (opt-in data sharing)
- Simplified language, tooltips for jargon

**Alumni:**
- Career progression visualizations
- AI coaching interface with conversational UI
- Professional credential management

---

## Implementation Notes

### Technology Stack

**Recommended:**
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4 (custom config for design tokens)
- **Charts**: Recharts (built on D3.js, React-native)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table (advanced filtering, sorting, pagination)
- **State Management**: Zustand or React Query
- **Animations**: Framer Motion (Motion package)

### Design Tokens

Convert this design system into CSS variables or Tailwind config:

```css
/* Example: Tailwind v4 theme.css */
@theme {
  --color-primary-500: #6366F1;
  --color-secondary-500: #FBBF24;
  /* ... all tokens from Color System section */
  
  --font-family-primary: Inter, system-ui, sans-serif;
  --font-size-body-md: 1rem;
  --line-height-body-md: 1.6;
  /* ... all tokens from Typography section */
  
  --space-4: 1rem;
  --space-6: 1.5rem;
  /* ... all tokens from Spacing section */
}
```

---

### Component File Structure

```
src/
├── components/
│   ├── buttons/
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   └── ButtonGroup.tsx
│   ├── cards/
│   │   ├── MetricCard.tsx
│   │   ├── DashboardCard.tsx
│   │   └── EmployerCard.tsx
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   └── Heatmap.tsx
│   ├── tables/
│   │   ├── DataTable.tsx
│   │   ├── PaginationControls.tsx
│   │   └── TableFilters.tsx
│   ├── navigation/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── Breadcrumbs.tsx
│   ├── forms/
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   └── DatePicker.tsx
│   └── layouts/
│       ├── DashboardLayout.tsx
│       ├── PageHeader.tsx
│       └── FilterBar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Analytics/
│   ├── MarketIntelligence/
│   ├── Curriculum/
│   ├── Alumni/
│   ├── EmployerRelations/
│   └── Reports/
└── styles/
    ├── tokens.css
    ├── components.css
    └── utilities.css
```

---

## Figma Design Files Checklist

When translating this to Figma for design handoff:

- [ ] Create component library with all variants
- [ ] Set up color styles (dark mode palette)
- [ ] Set up text styles (typography scale)
- [ ] Create auto-layout components for responsive behavior
- [ ] Include hover/focus/active states for all interactive components
- [ ] Add component documentation (when to use, properties)
- [ ] Create page templates for each dashboard type
- [ ] Include real data samples in designs
- [ ] Annotate spacing using Figma dev mode
- [ ] Export icon assets as SVG
- [ ] Create responsive breakpoint frames (mobile, tablet, desktop)
- [ ] Add accessibility annotations (focus order, ARIA labels)

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-11 | Initial design system specification |

---

**Design System Owner:** Pathway Product Design Team  
**Contact:** design@pathway.edu.hk  
**Last Review:** 2026-05-11

---

*This design system is a living document. As the Pathway platform evolves, update this specification to reflect new patterns, components, and best practices.*
