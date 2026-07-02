# Pitfalls Research

**Domain:** Frontend Layout & Mobile Responsiveness
**Researched:** 2026-07-02
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Breaking the TV Display Bento Grid Layout

**What goes wrong:**
Adding mobile responsive classes causes the desktop TV layout (Bento grid) to break, misalign, or introduce horizontal scrollbars.

**Why it happens:**
Modifying existing grid or flex configurations without prepending viewport prefixes (e.g. using `flex-col` instead of `flex flex-col md:flex-row`).

**How to avoid:**
Always apply a mobile-first approach where responsive overrides are targeted at tablet and desktop sizes using `md:` or `lg:` prefixes, leaving mobile (`< 768px`) as the default base styling, OR preserve the TV view specifically under a target breakpoint.

**Warning signs:**
The main dashboard displays elements stacked vertically even when viewed on a full HD TV monitor screen.

**Phase to address:**
Phase 1: Agenda Display Responsiveness

---

### Pitfall 2: Trapped Navigation Drawer in CMS Admin Panel

**What goes wrong:**
On mobile screens, the admin panel sidebar slides over but has no backdrop (overlay) or close button, trapping the user or blocking access to the CRUD forms.

**Why it happens:**
Failing to include a backdrop element that dismisses the sidebar when tapped outside, or missing navigation link click-handlers to close the sidebar.

**How to avoid:**
Implement a backdrop div with `onClick={() => setIsSidebarOpen(false)}` and ensure the menu collapses automatically when a menu link is tapped.

**Warning signs:**
Users are unable to see the forms after selecting a navigation tab on a mobile device because the sidebar stays open and covers the content.

**Phase to address:**
Phase 2: CMS Admin Sidebar Drawer

---

### Pitfall 3: Sub-optimal touch target sizes (Fat-fingering)

**What goes wrong:**
Admins accidentally delete or edit the wrong agenda items because delete (`Trash2`) or update buttons are too close together or have very small active tap areas.

**Why it happens:**
Keeping desktop padding and mouse-optimized layout for compact icon buttons on touch screens.

**How to avoid:**
Apply a minimum touch target size of 44x44px for all interactive elements (buttons, inputs, dropdowns) on mobile viewports.

**Warning signs:**
Admin is trying to hit "Hapus" but accidentally hits a text line or misses the button entirely.

**Phase to address:**
Phase 3: CMS Admin Tables & Forms

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| CSS-only toggling for complex menus | No JS state required. | Hard to animate slide-in/slide-out smoothly and manage keypress accessibility (ESC key to close). | Simple dropdowns, but drawer menus should use React state. |
| Hardcoded viewports in React JS | Avoids layout shift during hydration. | Hydration mismatch if server-side rendering is used in the future. | Only when layout structures are radically different and cannot be handled cleanly via CSS hidden/block tags. |

---
*Pitfalls research for: Frontend Layout & Mobile Responsiveness*
*Researched: 2026-07-02*
