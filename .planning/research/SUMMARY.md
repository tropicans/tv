# Project Research Summary

**Project:** PPKASN Corporate TV Display
**Domain:** Frontend Layout & Mobile Responsiveness
**Researched:** 2026-07-02
**Confidence:** HIGH

## Executive Summary

This research establishes the implementation strategy for making the PPKASN Corporate TV Display dashboard and CMS Admin Portal mobile-responsive. The dashboard is currently designed for landscape 1080p television screens (Bento Grid layout), and the CMS Admin Portal is optimized for desktop viewports. To enable administrators to manage agendas from smartphones and users to view the agenda on small viewports, we must adapt the layouts without breaking the TV display's visual design.

Our recommended approach is to use mobile-first Tailwind CSS classes, hiding secondary widgets (Video Embed and Weather) on small screens (Option 2) to focus the smartphone display on the core Agenda lists, Prayer Times, and Scrolling Ticker. For the CMS Admin Portal, we will introduce a slide-in sidebar drawer triggered by a burger button, and reformat forms and data tables to prevent horizontal overflow.

## Key Findings

### Recommended Stack

We will leverage the existing frontend stack (React 19 + Tailwind CSS + Framer Motion + Lucide React). No new dependencies are necessary.

**Core technologies:**
- **Tailwind CSS v3.4.1**: Provides responsive media query prefixes (`sm:`, `md:`, `lg:`) to easily toggle layout patterns.
- **Framer Motion**: Powers smooth sliding animations for the mobile navigation drawer.
- **React 19**: Manages UI state toggle for the hamburger drawer.

### Expected Features

**Must have (table stakes):**
- **Mobile-Responsive Display Grid**: Vertical stack layout for small screens.
- **Collapsible Sidebar Drawer**: Hamburger button navigation drawer for CMS Admin.
- **Responsive CMS Forms & Tables**: Touch-friendly inputs, stacked/scrollable table grids, and fluid layout cards.

**Should have (competitive):**
- **Overlay Backdrop**: Click outside the sidebar to close it on mobile.
- **Simplified Mobile Display**: Hide weather and video embeds to prioritize agenda items.

### Architecture Approach

The architecture will rely on CSS-based responsive breakpoints via Tailwind.

**Major components:**
1. **App Layout Grid**: Adapts standard display grids (`grid-cols-12`) to singular columns (`grid-cols-1`) on mobile viewports.
2. **Mobile Nav Sidebar**: Implements a conditional drawer with transition animations.
3. **Responsive Table Wrappers**: Prevents overflow by wrapping tables in scrollable containers or refactoring fields on mobile.

### Critical Pitfalls

1. **Breaking the TV Grid Layout**: Avoided by shielding bento grid layouts behind the `md:` breakpoint.
2. **Trapped Nav Drawer**: Avoided by implementing backdrop dismissals.
3. **Tiny Touch Targets**: Avoided by keeping all buttons at a minimum of 44x44px.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Agenda Display Responsiveness
- **Rationale**: The public-facing agenda is the most viewed page; making it mobile-friendly ensures immediate usability.
- **Delivers**: Responsive layouts for `/` and `/agenda` routes using Option 2 (hide video/weather, stack agenda, prayer times, and ticker).
- **Addresses**: Mobile-Responsive Display Grid.
- **Avoids**: Breaking the TV Grid Layout.

### Phase 2: CMS Admin Sidebar Drawer
- **Rationale**: A collapsible sidebar drawer is required before we can optimize the CMS forms and tables themselves.
- **Delivers**: Slide-in mobile menu drawer with hamburger button toggle and backdrop overlay.
- **Addresses**: Collapsible Sidebar Drawer, Overlay Backdrop.
- **Avoids**: Trapped Nav Drawer.

### Phase 3: CMS Admin Tables & Forms
- **Rationale**: Allows full CRUD management of schedules and employee leaves on small screens.
- **Delivers**: Mobile-responsive data tables, dropdown overlays, statistics cards, and forms.
- **Addresses**: Responsive CMS Forms & Tables, Touch-friendly interactive targets.
- **Avoids**: Tiny Touch Targets.

---
*Project Research Summary for: PPKASN Corporate TV Display*
*Researched: 2026-07-02*
