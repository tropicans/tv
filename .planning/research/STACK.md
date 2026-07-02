# Stack Research

**Domain:** Frontend Layout & Mobile Responsiveness
**Researched:** 2026-07-02
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | ^19.2.4 | UI Framework | Current project runtime; standard component-based rendering. |
| Tailwind CSS | ^3.4.1 | Styling & Layout | Pre-configured in project; supports rapid utility-first mobile-first responsive styling via `sm:`, `md:`, `lg:` prefixes. |
| Framer Motion | ^12.38.0 | Sidebar Drawer Animations | Allows smooth slide-in/slide-out animations for the collapsible mobile admin sidebar. |
| Lucide React | ^1.7.0 | Icon Library | Current project icons; used for menu/burger icon, close icon, and other mobile indicators. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.1 | Conditional Classes | For combining responsive classnames conditionally based on sidebar state. |
| tailwind-merge | ^3.5.0 | Tailwind Class Conflict Resolution | Ensures class overrides are applied cleanly for mobile variants. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Chrome DevTools | Responsive Viewport Emulation | Essential for testing breakpoints and touch targets across different devices. |

## Installation

No new npm packages are required, as React, Tailwind, Framer Motion, and Lucide React are already present in `frontend-display/package.json`.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Tailwind media queries | CSS Grid/Flexbox in vanilla CSS | If Tailwind configuration is restricted; however, Tailwind is already integrated and preferred. |
| React custom viewport state | CSS-only media queries (`hidden md:block`) | CSS-only is preferred for performance and avoiding layout shift (CLS), but custom hook `useWindowSize` is useful for conditional component lifecycle mounting. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Device detection libraries (e.g. react-device-detect) | Relies on user-agent sniffing, which is inaccurate and leads to hydration mismatches in server environments. | Tailwind media queries and CSS grid layout responsiveness. |
| Fixed pixel widths | Causes horizontal scrollbars on mobile. | Fluid layout classes (`w-full`, `max-w-md`, flex grow). |

## Stack Patterns by Variant

**If Mobile view is active:**
- Use vertical column layouts (`flex flex-col` or `grid-cols-1`).
- Hide secondary embeds (`hidden` class).
- Toggle sidebar overlay using state `isOpen`.

**If TV view is active:**
- Keep landscape bento grid structure (`grid-cols-12`, fixed screen size constraints).

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| React 19 | Framer Motion v12 | Fully compatible; tested inside the workspace. |

## Sources

- [Tailwind CSS Docs](https://tailwindcss.com/docs/responsive-design) — Responsive breakpoints and mobile-first workflow verification.
- [React 19 Docs](https://react.dev) — Hooks and rendering lifecycle.

---
*Stack research for: Frontend Layout & Mobile Responsiveness*
*Researched: 2026-07-02*
