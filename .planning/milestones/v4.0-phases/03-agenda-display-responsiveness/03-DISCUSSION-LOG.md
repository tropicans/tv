# Phase 3: Agenda Display Responsiveness - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 3-Agenda Display Responsiveness
**Areas discussed:** Viewport Breakpoints & Hiding Widgets, Weekly Calendar Mobile Layout, Cuti (Leave) List Stacking Position, Carousel Cycle & Scroll Animations

---

## Viewport Breakpoints & Hiding Widgets

| Option | Description | Selected |
|--------|-------------|----------|
| 768px (Tailwind 'md') | Standard smartphone cutoff; hides secondary widgets under 768px and matches ROADMAP.md criteria | ✓ |
| 1024px (Tailwind 'lg') | Triggers on tablets as well, providing more screen space on medium viewports | |
| You decide | Will use 768px as standard | |

**User's choice:** 768px (Tailwind 'md')
**Notes:** Decided to use standard 768px breakpoint.

---

## Weather Widget on /agenda

| Option | Description | Selected |
|--------|-------------|----------|
| Hide weather widget under 768px on /agenda | Matches MOB-02 to prioritize screen space for the weekly agenda and leave list | ✓ |
| Keep weather widget visible on /agenda | Appends it to the bottom of the page when stacked on mobile | |
| You decide | Will hide it | |

**User's choice:** Hide weather widget under 768px on /agenda
**Notes:** Decided to hide the Weather widget on `/agenda` mobile view to focus on core agenda data.

---

## Header Layout Adaptation

| Option | Description | Selected |
|--------|-------------|----------|
| Stack Header content vertically on mobile | Center-aligns the logo/title and moves the clock and date below it with reduced font size (e.g. clock text-4xl) | ✓ |
| Keep horizontal layout but shrink elements | Keep logo/title on the left and clock on the right, but shrink the clock (e.g. text-2xl) and hide the subtitle | |
| You decide | Will stack vertically | |

**User's choice:** Stack Header content vertically on mobile
**Notes:** Stack and center header contents on mobile to prevent overlapping.

---

## Weekly Calendar Mobile Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Stack all 5 days vertically in a single scrollable column | Very clear, provides a simple scrolling list of the entire week's agenda, and fits mobile usage patterns | ✓ |
| Show 1 day at a time with day selector tabs | Keeps the interface clean and compact, but requires tapping to switch between days | |
| You decide | Will stack them vertically | |

**User's choice:** Stack all 5 days vertically in a single scrollable column
**Notes:** Stack the 5-day calendar in a single column list for easy scrolling.

---

## Event Card Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Adapt card styling on mobile | Reduce card padding (e.g. to p-4) and slightly scale down headings/fonts to make layout clean | ✓ |
| Maintain large desktop card size on mobile | Keeps the same generous padding and font scale, prioritizing extreme legibility | |
| You decide | Will adapt card styling | |

**User's choice:** Adapt card styling on mobile
**Notes:** Scale down event cards' text and padding slightly for mobile screen optimization.

---

## Vertical Stacking Order

| Option | Description | Selected |
|--------|-------------|----------|
| Weekly Agenda first, then Cuti Pegawai list below it | Prioritizes the main week's calendar events, placing the secondary employee leave list at the bottom | ✓ |
| Cuti Pegawai list first, then Weekly Agenda below it | Prioritizes employee leave information, placing the weekly calendar below it | |
| You decide | Will put Weekly Agenda first | |

**User's choice:** Weekly Agenda first, then Cuti Pegawai list below it
**Notes:** Stacking Weekly Agenda first.

---

## Cuti Pegawai List Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Stack items vertically as a simple list | Maintains consistency with the desktop scroll layout and is straightforward to read | ✓ |
| Horizontal swipeable row | Displays the employee leave cards side-by-side in a horizontal scrolling container | |
| You decide | Will stack vertically | |

**User's choice:** Stack items vertically as a simple list
**Notes:** Use standard vertical list format for leave items.

---

## Week Auto-cycling

| Option | Description | Selected |
|--------|-------------|----------|
| Disable week auto-cycling on mobile | Users switch between Week 1 and Week 2 manually using the top buttons, preventing sudden changes | ✓ |
| Keep week auto-cycling active on mobile | Continues to swap weeks automatically every 15 seconds | |
| You decide | Will disable auto-cycling | |

**User's choice:** Disable week auto-cycling on mobile
**Notes:** Paused auto-cycling to prevent disorientation while reading.

---

## Cuti List Auto-scrolling

| Option | Description | Selected |
|--------|-------------|----------|
| Disable auto-scrolling on mobile | Render as a static list that expands or handles touch scrolling naturally | ✓ |
| Keep Cuti list auto-scrolling active on mobile | Keeps the 25 FPS auto-scroll running inside a fixed-height box | |
| You decide | Will disable it on mobile | |

**User's choice:** Disable auto-scrolling on mobile
**Notes:** Static list rendering to avoid nested touch scroll conflicts on mobile.

---

## the agent's Discretion

Standard layout spacing details and component modifications are left to the agent's implementation discretion.

## Deferred Ideas

None.
