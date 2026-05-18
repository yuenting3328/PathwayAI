# Pathway Institutional SaaS — Complete UI Design System

**Version:** 1.0  
**Created:** May 11, 2026  
**Platform:** Analytics and Management Platform for Hong Kong Universities

---

## 📋 Overview

This repository contains a **production-ready UI design system** for Pathway's Institutional SaaS platform—an analytics and management system serving Hong Kong universities. The design system supports six core feature areas:

1. **Institutional Analytics** — Employment rates, salary trends, time-to-offer metrics
2. **Employer & Market Intelligence** — Sector demand, salary benchmarks, competency feedback
3. **Curriculum Alignment** — Skills-to-curriculum mapping, gap analysis
4. **Alumni Continuity** — Career trajectory tracking, AI coaching, digital credentials
5. **Employer Relations (ERM)** — CRM workspace, partnership pipeline, event management
6. **Reporting & Compliance** — Automated exports, regulatory templates (UGC/HKQA)

---

## 📦 What's Included

### Core Documentation

| File | Description |
|------|-------------|
| **[PATHWAY_DESIGN_SYSTEM.md](./PATHWAY_DESIGN_SYSTEM.md)** | Complete design specification (34KB) — color system, typography, spacing, component library, dashboard layouts, navigation structure, accessibility guidelines |
| **[COMPONENT_SHOWCASE.md](./COMPONENT_SHOWCASE.md)** | React + Tailwind implementation examples for all components with code snippets |
| **[DESIGN_PATTERNS.md](./DESIGN_PATTERNS.md)** | Practical design patterns for dashboards, data visualization, filtering, responsive design, interactions |
| **[README_DESIGN_SYSTEM.md](./README_DESIGN_SYSTEM.md)** | This file — overview and navigation guide |

### Live Implementation

| File | Description |
|------|-------------|
| **[src/app/App.tsx](./src/app/App.tsx)** | Working demo of Institutional Analytics Dashboard with all key components |
| **[src/styles/theme.css](./src/styles/theme.css)** | CSS custom properties for Pathway brand colors and design tokens |
| **[src/styles/index.css](./src/styles/index.css)** | Global styles with dark mode enabled by default |

---

## 🎨 Design Principles

### 1. Clarity Over Complexity
Prioritize information hierarchy in data-dense environments without cognitive overload.

### 2. Multi-Stakeholder Design
Role-based interfaces for administrators, department heads, students, and alumni.

### 3. Privacy-First Visualization
Anonymized, aggregated data display with clear sensitivity indicators.

### 4. Data-Driven Decision Making
Actionable insights at-a-glance with comparative visualizations.

### 5. Institutional Trust
Professional, enterprise-grade aesthetic with regulatory compliance indicators.

---

## 🌈 Color Palette

### Brand Colors

```css
Primary:   #6366F1  (Indigo)   — Primary actions, key metrics, active states
Secondary: #FBBF24  (Amber)    — Highlights, warnings, secondary actions
Success:   #34D399  (Emerald)  — Positive trends, completions, growth
Danger:    #F43F5E  (Rose)     — Negative trends, alerts, critical actions
Info:      #0EA5E9  (Cyan)     — Informational content, tooltips, guides
```

### Dark Mode (Default)

```css
Background Layers:
  Base:    #0A0A0F  — Canvas background
  Surface: #141419  — Card/panel background
  Hover:   #1C1C24  — Hover states
  Active:  #232330  — Active/pressed states
  Elevated:#1F1F28  — Modal/dropdown overlays

Text Hierarchy:
  Primary:   #FFFFFF  — Headers, primary content
  Secondary: #B4B4C8  — Secondary content
  Tertiary:  #8A8A9E  — Labels, captions
  Disabled:  #5A5A6E  — Disabled states

Borders:
  Subtle:  #2A2A36
  Default: #3A3A48
  Strong:  #4A4A58
```

---

## 📐 Component Library

### Navigation
- ✅ Sidebar navigation (280px width, collapsible on mobile)
- ✅ Top bar with breadcrumbs and user profile
- ✅ Active state indicators
- ✅ Responsive hamburger menu

### Cards
- ✅ Metric cards (with icons, values, trends)
- ✅ Dashboard panel cards (with headers, borders, shadows)
- ✅ Hover and focus states

### Data Tables
- ✅ Sortable columns
- ✅ Row hover states
- ✅ Pagination controls
- ✅ Status badges
- ✅ Responsive card view on mobile

### Charts (Recharts)
- ✅ Line charts (trends over time)
- ✅ Bar charts (distributions, comparisons)
- ✅ Pie/Donut charts (proportions)
- ✅ Custom tooltips with dark theme
- ✅ Responsive containers

### Forms & Inputs
- ✅ Text inputs with icons
- ✅ Select dropdowns
- ✅ Search inputs
- ✅ Checkboxes
- ✅ Radio buttons
- ✅ Toggle switches
- ✅ Date pickers
- ✅ Error states and validation

### Buttons
- ✅ Primary, secondary, tertiary variants
- ✅ Icon buttons
- ✅ Loading states
- ✅ Disabled states
- ✅ Sizes: Small (32px), Medium (40px), Large (48px)

### Feedback
- ✅ Alert banners (info, success, warning, danger)
- ✅ Toast notifications
- ✅ Status badges
- ✅ Loading spinners
- ✅ Skeleton loaders
- ✅ Progress bars

### Overlays
- ✅ Modals with backdrop blur
- ✅ Dropdowns
- ✅ Tooltips
- ✅ Popovers

---

## 📊 Dashboard Layouts

### 1. Institutional Analytics Dashboard (Implemented)
- Filter bar with search and multi-select dropdowns
- 4-column metric card grid
- Multi-chart section (line, bar, donut)
- Detailed data table with pagination

**View**: Open `/src/app/App.tsx` to see the live implementation

### 2. Employer & Market Intelligence (Specified)
- Sector demand heatmap
- District salary map
- Top hiring employers list
- Competency feedback table

**View**: `PATHWAY_DESIGN_SYSTEM.md` → Dashboard Layouts → Section 2

### 3. Curriculum Alignment (Specified)
- Skills gap overview metrics
- Skills-to-curriculum heatmap matrix
- Recommendations sidebar
- Action items table

**View**: `PATHWAY_DESIGN_SYSTEM.md` → Dashboard Layouts → Section 3

### 4. Alumni Continuity (Specified)
- Career trajectory Sankey diagram
- AI coaching sessions list
- Digital credentials grid
- Engagement metrics

**View**: `PATHWAY_DESIGN_SYSTEM.md` → Dashboard Layouts → Section 4

### 5. Employer Relations (Specified)
- Kanban board for partnership pipeline
- Event calendar sidebar
- Activity feed
- CRM summary metrics

**View**: `PATHWAY_DESIGN_SYSTEM.md` → Dashboard Layouts → Section 5

### 6. Reporting & Compliance (Specified)
- Compliance status cards
- Report template grid
- Recent reports table
- Scheduled reports calendar

**View**: `PATHWAY_DESIGN_SYSTEM.md` → Dashboard Layouts → Section 6

---

## 🚀 Quick Start

### View the Live Demo

1. **Open the app**:
   ```bash
   # The dev server is already running
   # The dashboard is visible in the preview pane
   ```

2. **Navigate the demo**:
   - Sidebar navigation showcases all feature areas
   - Dashboard displays institutional analytics with real charts
   - Filter bar demonstrates search and dropdown interactions
   - Metric cards show trend indicators
   - Data table includes pagination and status badges

### Explore the Documentation

| To learn about... | Read... |
|-------------------|---------|
| Color palette, typography, spacing | `PATHWAY_DESIGN_SYSTEM.md` → Sections 1-4 |
| Component specifications | `PATHWAY_DESIGN_SYSTEM.md` → Section 5 |
| Dashboard layout patterns | `PATHWAY_DESIGN_SYSTEM.md` → Section 6 |
| Code examples for components | `COMPONENT_SHOWCASE.md` |
| Design patterns for features | `DESIGN_PATTERNS.md` |

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Styling** | Tailwind CSS | 4.1.12 |
| **Charts** | Recharts | 2.15.2 |
| **Icons** | Lucide React | 0.487.0 |
| **UI Primitives** | Radix UI | Multiple packages |
| **Animations** | Motion (Framer Motion) | 12.23.24 |
| **Forms** | React Hook Form | 7.55.0 |
| **Package Manager** | pnpm | Latest |

---

## 📱 Responsive Design

The design system is **mobile-first and fully responsive**:

### Breakpoints
```css
Mobile:        < 768px   (1 column layouts, bottom nav)
Tablet:   768px - 1279px (2-3 column layouts, collapsible sidebar)
Desktop:      ≥ 1280px   (Multi-column layouts, persistent sidebar)
```

### Adaptive Patterns
- **Tables → Cards**: Tables convert to stacked cards on mobile
- **Sidebar**: Collapses to hamburger menu on tablet/mobile
- **Charts**: Simplify on small screens (fewer data points, vertical orientation)
- **Metric Cards**: 4 columns → 2 columns → 1 column

---

## ♿ Accessibility

The design system meets **WCAG 2.1 AA** standards:

### Color Contrast
- Text on background: ≥ 4.5:1 (body), ≥ 3:1 (large text)
- Interactive elements: ≥ 3:1 against adjacent colors
- Charts: Not reliant on color alone (use labels, patterns)

### Keyboard Navigation
- All interactive elements are focusable
- Logical tab order
- Visible focus indicators (4px outline, primary color)
- Skip links provided

### Screen Readers
- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels on icon buttons
- Live regions for dynamic updates
- Alternative text for charts (data tables)

### Motion
- Respects `prefers-reduced-motion` media query
- No auto-play carousels
- Pause controls for auto-updating dashboards

---

## 📖 How to Use This Design System

### For Designers

1. **Review the specifications**: `PATHWAY_DESIGN_SYSTEM.md` contains all design tokens, component specs, and layout patterns
2. **Create Figma components**: Use the specifications to build a Figma component library
3. **Apply design patterns**: Reference `DESIGN_PATTERNS.md` when designing new features
4. **Maintain consistency**: Use the color palette, typography scale, and spacing system consistently

### For Developers

1. **Explore the live demo**: `src/app/App.tsx` shows working implementations
2. **Copy component code**: `COMPONENT_SHOWCASE.md` provides ready-to-use React + Tailwind snippets
3. **Use design tokens**: All colors, spacing, and typography are defined in `src/styles/theme.css`
4. **Follow patterns**: Reference `DESIGN_PATTERNS.md` for responsive design, filtering, data viz

### For Product Managers

1. **Understand feature areas**: `PATHWAY_DESIGN_SYSTEM.md` → Dashboard Layouts (Section 6)
2. **Plan feature development**: Each dashboard layout is documented with wireframes and component lists
3. **Review navigation structure**: Information architecture is defined with full menu hierarchy
4. **Prioritize accessibility**: All components meet WCAG AA standards

---

## 🗂️ File Structure

```
/
├── PATHWAY_DESIGN_SYSTEM.md      # Complete design specification (34KB)
├── COMPONENT_SHOWCASE.md         # Component code examples
├── DESIGN_PATTERNS.md            # Dashboard & interaction patterns
├── README_DESIGN_SYSTEM.md       # This file (overview & guide)
│
├── src/
│   ├── app/
│   │   └── App.tsx               # Live demo dashboard
│   └── styles/
│       ├── index.css             # Global styles
│       ├── theme.css             # Design tokens & colors
│       ├── tailwind.css          # Tailwind imports
│       └── fonts.css             # Font imports
│
├── package.json                  # Dependencies
└── vite.config.ts                # Vite configuration
```

---

## 🎯 Key Features

### ✅ What's Delivered

- **Complete Design System Specification** (34KB markdown document)
- **Working Interactive Demo** (Institutional Analytics Dashboard)
- **60+ Component Specifications** (Buttons, cards, tables, charts, forms, modals)
- **6 Dashboard Layout Templates** (Wireframes + component breakdowns)
- **Comprehensive Color System** (Dark mode optimized, WCAG AA compliant)
- **Typography Scale** (8 heading levels, 4 body sizes, monospace variants)
- **Spacing System** (12-step scale, grid system, layout containers)
- **Navigation Structure** (Full information architecture)
- **Responsive Patterns** (Mobile, tablet, desktop breakpoints)
- **Accessibility Guidelines** (WCAG 2.1 AA compliance)
- **Code Examples** (React + Tailwind implementation)
- **Design Patterns** (Filtering, drill-down, bulk actions, error states)

### 🚧 Not Included (Out of Scope)

- Light mode theme (dark mode is primary, light mode can be added later)
- Backend integration (all data is mocked)
- Authentication flows (login, signup, password reset)
- User management interfaces
- Email templates
- Mobile native apps (this is web-only)

---

## 🔄 Next Steps

### For Implementation

1. **Create Figma Component Library**
   - Convert specifications to Figma components
   - Add auto-layout for responsive behavior
   - Include all states (hover, focus, disabled)
   - Create component variants (sizes, colors)

2. **Build Reusable React Components**
   - Extract components from `App.tsx` to `/src/components/`
   - Create TypeScript prop interfaces
   - Add Storybook for component documentation
   - Write unit tests

3. **Implement Additional Dashboards**
   - Market Intelligence dashboard
   - Curriculum Alignment interface
   - Alumni Continuity tracker
   - Employer Relations CRM
   - Reporting & Compliance center

4. **Add Backend Integration**
   - Connect to real APIs
   - Implement authentication
   - Add data fetching with React Query
   - Handle loading and error states

5. **Enhance Interactions**
   - Drill-down navigation
   - Advanced filtering
   - Data export (CSV, PDF)
   - Shareable dashboard links

### For Design System Evolution

- **Add Light Mode**: Create light theme variant (optional)
- **Mobile Apps**: Adapt design system for React Native
- **Animation Library**: Define micro-interactions and transitions
- **Illustration System**: Create empty states, onboarding graphics
- **Email Templates**: Extend design system to email notifications

---

## 📞 Support & Feedback

This design system is a **living document**. As the Pathway platform evolves:

- Update component specifications when new patterns emerge
- Add new dashboard layouts as features are built
- Refine color palette based on user feedback
- Expand accessibility guidelines for new interaction types

**Design System Owner**: Pathway Product Design Team  
**Contact**: design@pathway.edu.hk  
**Version**: 1.0  
**Last Updated**: May 11, 2026

---

## 🙏 Acknowledgments

This design system was created to serve Hong Kong universities in their mission to support student career success. It prioritizes:

- **Privacy** for student data
- **Accessibility** for all users
- **Clarity** in complex institutional analytics
- **Trust** through professional, compliant design

Built with modern web technologies and best practices for enterprise SaaS platforms.

---

**Ready to explore?** Start with the [Complete Design System Specification](./PATHWAY_DESIGN_SYSTEM.md) or dive into the [Live Demo](./src/app/App.tsx). 🚀
