# Pathway Design System — Quick Reference Card

**Print this for your desk or bookmark for instant access** 📌

---

## 🎨 Colors (Dark Mode)

```
Brand Colors:
  Primary   #6366F1  (Indigo)   → Primary actions, key metrics
  Secondary #FBBF24  (Amber)    → Highlights, warnings
  Success   #34D399  (Emerald)  → Positive trends
  Danger    #F43F5E  (Rose)     → Alerts, errors
  Info      #0EA5E9  (Cyan)     → Informational

Chart Palette:
  #6366F1  #0EA5E9  #34D399  #FBBF24  #A78BFA  #2DD4BF  #FB923C  #F472B6

Backgrounds:
  Base      #0A0A0F
  Surface   #141419
  Hover     #1C1C24
  Active    #232330
  Elevated  #1F1F28

Text:
  Primary   #FFFFFF
  Secondary #B4B4C8
  Tertiary  #8A8A9E
  Disabled  #5A5A6E

Borders:
  Subtle    #2A2A36
  Default   #3A3A48
  Strong    #4A4A58
```

---

## 📏 Spacing Scale

```
space-1:   4px     space-8:  32px
space-2:   8px     space-10: 40px
space-3:  12px     space-12: 48px
space-4:  16px     space-16: 64px
space-5:  20px     space-20: 80px
space-6:  24px     space-24: 96px

Common Usage:
  Card padding:     24px (space-6)
  Section gaps:     24px (space-6)
  Component gaps:   16px (space-4)
  Button padding:   12px 24px (space-3 space-6)
```

---

## ✏️ Typography

```
Display:
  2xl: 72px / 700  |  xl: 60px / 700  |  lg: 48px / 600  |  md: 36px / 600

Heading:
  H1: 30px / 600   |  H2: 24px / 600  |  H3: 20px / 600
  H4: 18px / 600   |  H5: 16px / 500  |  H6: 14px / 500

Body:
  xl: 20px / 400   |  lg: 18px / 400  |  md: 16px / 400
  sm: 14px / 400   |  xs: 12px / 400

Label:
  lg: 14px / 500 (uppercase)
  md: 12px / 500 (uppercase)
  sm: 10px / 500 (uppercase)

Font Stack:
  Primary: 'Inter', -apple-system, system-ui, sans-serif
  Mono: 'JetBrains Mono', 'SF Mono', monospace
```

---

## 📦 Component Sizes

```
Buttons:
  Small:  32px height | 10px 16px padding | 12px text
  Medium: 40px height | 12px 24px padding | 14px text
  Large:  48px height | 14px 28px padding | 16px text

Inputs:
  Standard: 40px height | 10px 14px padding | 14px text
  Border: 1px solid #3A3A48
  Focus: ring-2 ring-primary/20

Icons:
  XS: 16px  |  SM: 20px  |  MD: 24px  |  LG: 28px  |  XL: 32px
  Navigation: 22px  |  Buttons: 20px  |  Tables: 18px

Cards:
  Border: 1px solid #2A2A36
  Radius: 12px (rounded-xl)
  Padding: 24px
  Shadow: 0 1px 3px rgba(0,0,0,0.3)
```

---

## 🖼️ Border Radius

```
sm:   8px  (rounded-lg)    → Inputs, small buttons
md:  10px  (rounded-xl)    → Dropdowns, filters
lg:  12px  (rounded-xl)    → Cards, panels
xl:  16px  (rounded-2xl)   → Modals
full: 50%  (rounded-full)  → Avatars, badges
```

---

## 📐 Grid System

```
Desktop (≥1280px):  12 columns | 24px gutter | 40px margin
Tablet (768-1279):   8 columns | 20px gutter | 32px margin
Mobile (<768px):     4 columns | 16px gutter | 16px margin

Common Layouts:
  4-column metrics: grid-cols-4 gap-6
  2-column charts:  grid-cols-2 gap-6
  3-column split:   grid-cols-3 gap-6
```

---

## 🎭 Component States

```
Hover:
  Background: #1C1C24 (bg-surface-hover)
  Border: #3A3A48 (border-default)

Active:
  Background: #232330 (bg-surface-active)
  Border: #6366F1 (border-primary)

Focus:
  Outline: 4px solid #6366F1 at 20% opacity
  Border: #6366F1

Disabled:
  Opacity: 50%
  Cursor: not-allowed
  Background: desaturated
```

---

## 📊 Chart Guidelines

```
Line Charts:
  Stroke width: 2.5px
  Data points: 6px circle (show on hover)
  Grid: dashed #2A2A36
  Axes: 12px, #8A8A9E

Bar Charts:
  Bar radius: [6, 6, 0, 0] (top corners)
  Bar spacing: 8px
  Hover: Increase opacity to 100%

Donut Charts:
  Inner radius: 60-70px
  Outer radius: 100px
  Stroke width: 32px
  Padding angle: 2

Tooltips (All):
  Background: #1F1F28
  Border: 1px solid #3A3A48
  Radius: 8px
  Font: 13px
```

---

## 🔲 Layout Containers

```
Sidebar:     280px width
Top bar:     64px height
Sub-header:  56px height

Max widths:
  sm:   640px
  md:   768px
  lg:  1024px
  xl:  1280px
  2xl: 1536px
  full: 100%
```

---

## 💬 Status Badges

```html
Success:  bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30
Warning:  bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30
Danger:   bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30
Info:     bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/30
Neutral:  bg-muted text-text-secondary border-border

Size: 24px height | 4px 10px padding | 12px text | rounded-full
```

---

## 📱 Responsive Breakpoints

```css
Tailwind Classes:
  (default)  → Mobile (<768px)
  md:        → Tablet (≥768px)
  lg:        → Desktop (≥1024px)
  xl:        → Large Desktop (≥1280px)

Example:
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
  p-4 md:p-6 lg:p-8
  hidden md:block
```

---

## 🧩 Common Patterns

### Metric Card
```tsx
<div className="bg-card border border-border rounded-xl p-6">
  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-primary" />
  </div>
  <div className="text-[12px] text-text-tertiary uppercase mb-1">Label</div>
  <div className="text-[28px] font-semibold text-text-primary">Value</div>
  <div className="text-[12px] text-success mt-2">+2.3%</div>
</div>
```

### Dashboard Card
```tsx
<div className="bg-card border border-border rounded-xl overflow-hidden">
  <div className="px-6 py-5 border-b border-border">
    <h3 className="text-[18px] font-semibold">Title</h3>
  </div>
  <div className="p-6">Content</div>
</div>
```

### Search Input
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
  <input className="w-full h-10 pl-10 pr-4 bg-input-background border border-border rounded-lg" />
</div>
```

### Button
```tsx
<button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
  Action
</button>
```

---

## ♿ Accessibility Quick Checks

```
✅ Color contrast ≥ 4.5:1 for text
✅ Focus indicators visible (4px outline)
✅ Keyboard navigation (Tab, Enter, Esc)
✅ ARIA labels on icon buttons
✅ Semantic HTML (<nav>, <main>, <article>)
✅ Form labels associated with inputs
✅ Alternative text for charts
✅ Skip links at page top
```

---

## 🔗 Quick Links

| Need... | Go to... |
|---------|----------|
| Full specs | `PATHWAY_DESIGN_SYSTEM.md` |
| Code examples | `COMPONENT_SHOWCASE.md` |
| Design patterns | `DESIGN_PATTERNS.md` |
| Overview | `README_DESIGN_SYSTEM.md` |
| Live demo | `src/app/App.tsx` |

---

## 📋 Design Checklist

Before shipping a new feature:

- [ ] Uses design tokens (no hardcoded hex colors)
- [ ] Consistent spacing (multiples of 4px)
- [ ] Responsive on mobile, tablet, desktop
- [ ] All states defined (hover, focus, disabled, loading, error)
- [ ] Empty state included
- [ ] Error state with retry
- [ ] Loading skeleton
- [ ] Keyboard accessible
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Focus indicators visible
- [ ] Semantic HTML used

---

**Version 1.0** | Pathway Institutional SaaS | May 11, 2026  
Print or save this reference for quick access during design and development.
