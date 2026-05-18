# Pathway Design Patterns & Best Practices

This guide provides practical design patterns for building features in the Pathway Institutional SaaS platform.

## Table of Contents

1. [Dashboard Layout Patterns](#dashboard-layout-patterns)
2. [Data Visualization Patterns](#data-visualization-patterns)
3. [Filter & Search Patterns](#filter--search-patterns)
4. [Responsive Design Patterns](#responsive-design-patterns)
5. [Interaction Patterns](#interaction-patterns)
6. [Error & Empty States](#error--empty-states)

---

## Dashboard Layout Patterns

### Pattern 1: Metric Overview + Charts + Table

**When to use**: Analytics dashboards where users need quick metrics, trends, and detailed records.

```
┌─────────────────────────────────────────────────┐
│ Page Header + Actions                           │
├─────────────────────────────────────────────────┤
│ Filter Bar                                      │
├────────────┬────────────┬────────────┬──────────┤
│ Metric 1   │ Metric 2   │ Metric 3   │ Metric 4 │ 4 columns
├────────────┴────────────┴────────────┴──────────┤
│                                                  │
│ Primary Chart (Full width or 2/3 width)        │
│                                                  │
├────────────┬─────────────────────────────────────┤
│ Secondary  │ Tertiary Chart (1/3 width)         │
│ Chart      │                                     │
│ (2/3 width)│                                     │
├────────────┴─────────────────────────────────────┤
│                                                  │
│ Data Table with Pagination                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Implementation**:
```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-[30px] font-semibold">Dashboard Title</h1>
      <p className="text-[15px] text-text-secondary mt-1">Description</p>
    </div>
    <div className="flex gap-3">
      <Button variant="secondary" icon={<Calendar />}>Date Range</Button>
      <Button variant="primary" icon={<Download />}>Export</Button>
    </div>
  </div>

  {/* Filters */}
  <FilterBar />

  {/* Metrics */}
  <div className="grid grid-cols-4 gap-6">
    <MetricCard />
    <MetricCard />
    <MetricCard />
    <MetricCard />
  </div>

  {/* Charts */}
  <div className="grid grid-cols-3 gap-6">
    <div className="col-span-2">
      <ChartCard title="Primary Trend" />
    </div>
    <ChartCard title="Distribution" />
  </div>

  {/* Table */}
  <DataTableCard />
</div>
```

---

### Pattern 2: Two-Panel Dashboard (List + Detail)

**When to use**: CRM interfaces, directory views, curriculum management.

```
┌────────────────┬─────────────────────────────────┐
│                │ Detail Header                   │
│ Master List    ├─────────────────────────────────┤
│ (Searchable)   │                                 │
│                │ Detail Content                  │
│ Item 1 ●       │ (Forms, charts, metadata)       │
│ Item 2         │                                 │
│ Item 3         │                                 │
│ Item 4         │                                 │
│                │                                 │
│                │                                 │
│ (Pagination)   │                                 │
└────────────────┴─────────────────────────────────┘
      30%                    70%
```

**Implementation**:
```tsx
<div className="flex gap-6 h-[calc(100vh-120px)]">
  {/* Master Panel */}
  <div className="w-[400px] flex flex-col bg-card border border-border rounded-xl overflow-hidden">
    <div className="p-4 border-b border-border">
      <SearchInput placeholder="Search items..." />
    </div>
    <div className="flex-1 overflow-y-auto">
      {items.map(item => (
        <ItemCard 
          key={item.id} 
          active={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)}
        />
      ))}
    </div>
  </div>

  {/* Detail Panel */}
  <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
    <DetailView item={selectedItem} />
  </div>
</div>
```

---

### Pattern 3: Tab-Based Dashboard

**When to use**: Multi-faceted data (Alumni: Career Tracking, Coaching, Credentials).

```tsx
<div className="space-y-6">
  <PageHeader />
  
  <Tabs defaultTab="tracking">
    <Tab id="tracking" label="Career Tracking">
      <CareerTrackingView />
    </Tab>
    <Tab id="coaching" label="AI Coaching">
      <CoachingView />
    </Tab>
    <Tab id="credentials" label="Digital Credentials">
      <CredentialsView />
    </Tab>
  </Tabs>
</div>
```

---

## Data Visualization Patterns

### Pattern 1: Trend with Comparison

**Goal**: Show progress over time with benchmark comparison.

```tsx
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
    <XAxis dataKey="month" stroke="#8A8A9E" />
    <YAxis stroke="#8A8A9E" />
    <Tooltip contentStyle={{
      backgroundColor: '#1F1F28',
      border: '1px solid #3A3A48',
      borderRadius: '8px',
    }} />
    <Legend />
    
    {/* Primary metric */}
    <Line 
      type="monotone" 
      dataKey="current" 
      stroke="#6366F1" 
      strokeWidth={2.5} 
      name="2026 Cohort"
    />
    
    {/* Comparison benchmark */}
    <Line 
      type="monotone" 
      dataKey="benchmark" 
      stroke="#8A8A9E" 
      strokeWidth={2} 
      strokeDasharray="5 5"
      name="Regional Average"
    />
  </LineChart>
</ResponsiveContainer>
```

**Visual Design**:
- Primary data: Solid, bold line (#6366F1, 2.5px)
- Benchmark: Dashed, muted line (#8A8A9E, 2px)
- Grid: Subtle (#2A2A36)
- Axes: Tertiary text color

---

### Pattern 2: Multi-Series Bar Chart with Stacking

**Goal**: Compare multiple categories across dimensions.

```tsx
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={facultyData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
    <XAxis dataKey="faculty" stroke="#8A8A9E" />
    <YAxis stroke="#8A8A9E" />
    <Tooltip />
    <Legend />
    
    <Bar dataKey="employed" stackId="a" fill="#34D399" name="Employed" />
    <Bar dataKey="seeking" stackId="a" fill="#FBBF24" name="Seeking" />
    <Bar dataKey="furtherStudy" stackId="a" fill="#6366F1" name="Further Study" />
  </BarChart>
</ResponsiveContainer>
```

**Color Assignment**:
- Positive outcomes: Success green (#34D399)
- In-progress: Warning amber (#FBBF24)
- Alternative paths: Primary indigo (#6366F1)

---

### Pattern 3: Heatmap for Skills Matrix

**Goal**: Show competency alignment across programs.

```tsx
const HeatmapCell = ({ value, max }: { value: number; max: number }) => {
  const intensity = value / max;
  const bgColor = `rgba(99, 102, 241, ${0.1 + intensity * 0.7})`; // #6366F1 with varying opacity
  
  return (
    <div 
      className="w-full h-full flex items-center justify-center border border-[#2A2A36] text-[12px] font-mono"
      style={{ backgroundColor: bgColor }}
    >
      {value}
    </div>
  );
};

// Grid layout
<div className="grid grid-cols-[200px_repeat(5,1fr)] gap-px bg-[#2A2A36]">
  {/* Headers */}
  <div className="bg-bg-base p-3 font-semibold">Competency</div>
  {programs.map(p => (
    <div key={p} className="bg-bg-base p-3 text-center text-[13px]">{p}</div>
  ))}
  
  {/* Data rows */}
  {competencies.map(comp => (
    <>
      <div className="bg-card p-3 text-[13px]">{comp.name}</div>
      {comp.values.map((val, i) => (
        <HeatmapCell key={i} value={val} max={100} />
      ))}
    </>
  ))}
</div>
```

---

### Pattern 4: Donut Chart with Legend

**Goal**: Show proportional distribution (e.g., sector employment).

```tsx
<div className="flex items-center gap-8">
  {/* Chart */}
  <div className="w-[240px]">
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={sectorData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          dataKey="value"
          paddingAngle={2}
        >
          {sectorData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Custom Legend */}
  <div className="flex-1 space-y-3">
    {sectorData.map(sector => (
      <div key={sector.name} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: sector.color }} 
          />
          <span className="text-[14px] text-text-secondary">{sector.name}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[16px] font-semibold text-text-primary">{sector.value}%</span>
          <span className="text-[12px] text-text-tertiary">({sector.count})</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Filter & Search Patterns

### Pattern 1: Sticky Filter Bar

**Implementation**:
```tsx
<div className="sticky top-0 z-10 bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-3">
  {/* Search */}
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
    <input
      type="text"
      placeholder="Search..."
      className="w-full h-10 pl-10 pr-4 bg-input-background border border-border rounded-lg"
    />
  </div>

  {/* Multi-select dropdowns */}
  <MultiSelect 
    label="Faculty" 
    options={faculties}
    value={selectedFaculties}
    onChange={setSelectedFaculties}
  />
  
  <DateRangePicker 
    value={dateRange}
    onChange={setDateRange}
  />

  {/* Quick filters (chips) */}
  <div className="flex gap-2">
    <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
      All
    </FilterChip>
    <FilterChip active={filter === 'employed'} onClick={() => setFilter('employed')}>
      Employed
    </FilterChip>
  </div>

  {/* Clear */}
  <button 
    className="text-[14px] text-text-tertiary hover:text-foreground"
    onClick={clearFilters}
  >
    Clear
  </button>
</div>

{/* Active filter tags */}
{activeFilters.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-4">
    {activeFilters.map(filter => (
      <FilterTag 
        key={filter.id}
        label={filter.label}
        onRemove={() => removeFilter(filter.id)}
      />
    ))}
  </div>
)}
```

---

### Pattern 2: Advanced Filter Modal

**When to use**: Complex filtering needs (salary range, skills, employment status).

```tsx
function AdvancedFilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Advanced Filters">
      <div className="space-y-6">
        {/* Salary Range */}
        <div>
          <label className="block text-[14px] font-medium mb-3">Salary Range (HKD)</label>
          <div className="flex items-center gap-4">
            <Input type="number" placeholder="Min" />
            <span className="text-text-tertiary">to</span>
            <Input type="number" placeholder="Max" />
          </div>
        </div>

        {/* Employment Status (Checkboxes) */}
        <div>
          <label className="block text-[14px] font-medium mb-3">Employment Status</label>
          <div className="space-y-2">
            <Checkbox label="Employed Full-Time" />
            <Checkbox label="Employed Part-Time" />
            <Checkbox label="Self-Employed" />
            <Checkbox label="Seeking Employment" />
            <Checkbox label="Further Study" />
          </div>
        </div>

        {/* Skills (Multi-select) */}
        <div>
          <label className="block text-[14px] font-medium mb-3">Required Skills</label>
          <MultiSelect options={skillsOptions} />
        </div>

        {/* Apply/Reset */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button 
            onClick={onReset}
            className="flex-1 h-10 border border-border rounded-lg hover:bg-muted"
          >
            Reset
          </button>
          <button 
            onClick={onApply}
            className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## Responsive Design Patterns

### Mobile Table → Card View

**Problem**: Tables are hard to read on mobile.  
**Solution**: Convert to stacked cards on small screens.

```tsx
// Desktop: Table
<div className="hidden md:block">
  <table className="w-full">
    <thead>...</thead>
    <tbody>
      {data.map(item => (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.value}</td>
          ...
        </tr>
      ))}
    </tbody>
  </table>
</div>

// Mobile: Cards
<div className="md:hidden space-y-3">
  {data.map(item => (
    <div key={item.id} className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{item.name}</h4>
        <StatusBadge status={item.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-[13px]">
        <div>
          <div className="text-text-tertiary">Faculty</div>
          <div className="text-foreground mt-1">{item.faculty}</div>
        </div>
        <div>
          <div className="text-text-tertiary">Salary</div>
          <div className="text-foreground mt-1">{item.salary}</div>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

### Responsive Grid

```tsx
<div className="
  grid 
  grid-cols-1           // Mobile: 1 column
  sm:grid-cols-2        // Small tablet: 2 columns
  lg:grid-cols-3        // Tablet: 3 columns
  xl:grid-cols-4        // Desktop: 4 columns
  gap-4 
  md:gap-6
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

### Collapsible Sidebar on Mobile

```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);

return (
  <div className="flex">
    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside className={`
      fixed lg:static
      inset-y-0 left-0
      w-[280px]
      bg-sidebar
      border-r border-sidebar-border
      z-50
      transform lg:transform-none
      transition-transform
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <Sidebar />
    </aside>

    {/* Main Content */}
    <div className="flex-1">
      {/* Mobile Header with Hamburger */}
      <header className="lg:hidden h-14 px-4 flex items-center border-b border-border">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  </div>
);
```

---

## Interaction Patterns

### Pattern 1: Drill-Down Navigation

**Flow**: Dashboard → Filtered View → Detail Modal

```tsx
// Step 1: Clickable metric card
<MetricCard 
  value="87.5%"
  label="Employment Rate"
  onClick={() => router.push('/analytics/employment')}
  className="cursor-pointer hover:border-primary transition-colors"
/>

// Step 2: Filtered analytics page
<EmploymentAnalytics 
  defaultFilter={{ faculty: selectedFaculty }}
/>

// Step 3: Row click opens detail
<TableRow 
  onClick={() => openDetailModal(student.id)}
  className="cursor-pointer hover:bg-accent"
>
  ...
</TableRow>
```

---

### Pattern 2: Inline Editing

```tsx
const [isEditing, setIsEditing] = useState(false);
const [value, setValue] = useState(initialValue);

return isEditing ? (
  <div className="flex items-center gap-2">
    <Input 
      value={value}
      onChange={e => setValue(e.target.value)}
      autoFocus
    />
    <button onClick={handleSave}>
      <Check className="w-4 h-4 text-success" />
    </button>
    <button onClick={() => setIsEditing(false)}>
      <X className="w-4 h-4 text-text-tertiary" />
    </button>
  </div>
) : (
  <div 
    onClick={() => setIsEditing(true)}
    className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
  >
    {value}
  </div>
);
```

---

### Pattern 3: Bulk Actions on Table

```tsx
const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

return (
  <>
    {/* Bulk action bar (appears when items selected) */}
    {selectedRows.size > 0 && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-2xl flex items-center gap-4 z-50">
        <span className="text-[14px] font-medium">
          {selectedRows.size} selected
        </span>
        <button className="h-8 px-4 bg-white/20 rounded-lg hover:bg-white/30">
          Export
        </button>
        <button className="h-8 px-4 bg-white/20 rounded-lg hover:bg-white/30">
          Assign
        </button>
        <button 
          onClick={() => setSelectedRows(new Set())}
          className="ml-4"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    )}

    {/* Table with checkboxes */}
    <table>
      <thead>
        <tr>
          <th>
            <Checkbox 
              checked={selectedRows.size === data.length}
              onChange={toggleSelectAll}
            />
          </th>
          ...
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>
              <Checkbox 
                checked={selectedRows.has(row.id)}
                onChange={() => toggleRow(row.id)}
              />
            </td>
            ...
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
```

---

## Error & Empty States

### Pattern 1: Empty Table State

```tsx
{data.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <Inbox className="w-8 h-8 text-text-tertiary" />
    </div>
    <h3 className="text-[18px] font-semibold text-foreground mb-2">
      No placements yet
    </h3>
    <p className="text-[14px] text-text-secondary max-w-[400px] text-center mb-6">
      Employment placements will appear here once students confirm job offers.
    </p>
    <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg">
      Import Placement Data
    </button>
  </div>
) : (
  <DataTable data={data} />
)}
```

---

### Pattern 2: No Search Results

```tsx
{filteredData.length === 0 && searchQuery && (
  <div className="text-center py-12">
    <Search className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
    <h3 className="text-[16px] font-semibold text-foreground mb-2">
      No results for "{searchQuery}"
    </h3>
    <p className="text-[14px] text-text-secondary mb-4">
      Try adjusting your search or filters
    </p>
    <button 
      onClick={clearFilters}
      className="text-primary hover:underline font-medium"
    >
      Clear all filters
    </button>
  </div>
)}
```

---

### Pattern 3: Error State with Retry

```tsx
{error ? (
  <Alert variant="danger">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-semibold mb-1">Failed to load data</h4>
        <p className="text-[13px]">{error.message}</p>
      </div>
      <button 
        onClick={retry}
        className="h-8 px-4 bg-white/10 rounded-lg hover:bg-white/20 text-[13px]"
      >
        Retry
      </button>
    </div>
  </Alert>
) : (
  <Dashboard data={data} />
)}
```

---

### Pattern 4: Loading Skeleton

```tsx
{isLoading ? (
  <div className="space-y-6">
    {/* Metric cards skeleton */}
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-3">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-3/4 h-8" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      ))}
    </div>

    {/* Chart skeleton */}
    <div className="bg-card border border-border rounded-xl p-6">
      <Skeleton variant="card" className="h-[320px]" />
    </div>

    {/* Table skeleton */}
    <div className="bg-card border border-border rounded-xl p-6 space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} variant="text" />
      ))}
    </div>
  </div>
) : (
  <DashboardContent data={data} />
)}
```

---

## Best Practices Summary

### ✅ Do's

1. **Consistent spacing**: Use 24px gaps for dashboard sections, 16px for component spacing
2. **Clear hierarchy**: Use size, weight, and color to establish information hierarchy
3. **Contextual help**: Provide tooltips for metrics, icons, and unfamiliar terms
4. **Progressive disclosure**: Show overview first, details on demand
5. **Keyboard navigation**: Ensure all actions are keyboard accessible
6. **Loading states**: Always show skeleton or spinner during data fetches
7. **Error handling**: Provide clear error messages and recovery actions

### ❌ Don'ts

1. **Don't overcrowd**: Limit metrics to 4-6 per row, don't pack dashboards
2. **Don't hide context**: Always show sample sizes, date ranges, comparison periods
3. **Don't use jargon**: Explain institutional terms (UGC, HKQA, HEAR)
4. **Don't assume**: Provide empty states, error states, and loading states
5. **Don't break responsive**: Test all layouts on mobile, tablet, desktop
6. **Don't rely on color alone**: Use icons, patterns, labels for accessibility
7. **Don't auto-refresh**: Provide manual refresh controls for dashboard data

---

## Resources

- **Design System**: `/PATHWAY_DESIGN_SYSTEM.md`
- **Component Examples**: `/COMPONENT_SHOWCASE.md`
- **Live Demo**: `/src/app/App.tsx`
- **Icon Library**: [Lucide Icons](https://lucide.dev)
- **Chart Library**: [Recharts Docs](https://recharts.org)
