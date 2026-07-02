# Architecture Research

**Domain:** Frontend Layout & Mobile Responsiveness
**Researched:** 2026-07-02
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Viewport Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ Mobile  │  │ Tablet  │  │ Desktop │                      │
│  └────┬────┘  └────┬────┘  └────┬────┘                      │
│       │            │            │                           │
├───────┴────────────┴────────────┴───────────────────────────┤
│                   Tailwind Breakpoint Engine                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │ CSS Media Queries (hidden, flex-col, grid-cols-12)  │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    React UI State Layer                     │
│  ┌────────────────────────┐  ┌────────────────────────┐     │
│  │ isSidebarOpen (Toggle)  │  │ useClock / useDisplay  │     │
│  └────────────────────────┘  └────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Tailwind Config | Defines breakpoints (`sm`, `md`, `lg`, `xl`) and theme tokens | `tailwind.config.js` |
| Sidebar Toggle | Triggers open/close state of the admin menu on mobile | React State Hook (`useState`) |
| Responsive Layout Wrappers | Stacks widgets and collapses columns dynamically | Tailwind utility classes (`flex flex-col md:flex-row`) |

## Recommended Project Structure

No folder structure changes are required. The changes are local adjustments to existing components:
```
frontend-display/src/
├── components/
│   ├── CmsDashboard.tsx        # Add collapsible sidebar toggle and mobile forms/tables
│   ├── AgendaDashboard.tsx     # Add responsive breakpoints to hide secondary widgets
│   └── Header.tsx              # Ensure top header scales down gracefully
```

### Structure Rationale

- We modify components directly using Tailwind responsive utilities to keep the codebase simple and maintain styles alongside their markup.

## Architectural Patterns

### Pattern 1: Tailwind CSS Responsive Classes

**What:** Implementing styling overrides using Tailwind breakpoint prefixes.
**When to use:** For standard visual layout transformations (e.g. grid to list).
**Trade-offs:** Fast, zero-runtime cost, but can clutter JSX markup if not managed carefully.

**Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
  <div className="col-span-1 md:col-span-8">Main Content</div>
  <div className="col-span-1 md:col-span-4 hidden md:block">Sidebar (Desktop only)</div>
</div>
```

### Pattern 2: Stateful Drawer Slide-in

**What:** An overlay menu that slides in from the left on mobile when toggled.
**When to use:** For navigating the CMS Admin panel on smartphones.
**Trade-offs:** Needs React state coordination and backdrop click dismissal.

**Example:**
```tsx
const [isOpen, setIsOpen] = useState(false);
return (
  <>
    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">Menu</button>
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0`}>
      {/* Sidebar Content */}
    </aside>
  </>
);
```

## Data Flow

### Request Flow

No data flow changes are required. API calls (`fetchAgendaEvents`, `fetchEmployeeLeaves`) will run identical payloads regardless of viewport width.

---
*Architecture research for: Frontend Layout & Mobile Responsiveness*
*Researched: 2026-07-02*
