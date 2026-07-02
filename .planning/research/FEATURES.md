# Feature Research

**Domain:** Frontend Layout & Mobile Responsiveness
**Researched:** 2026-07-02
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mobile responsive display route | Users checking /agenda on phones should see text without horizontal scrolling. | LOW | Stacks widgets and adjusts font sizes dynamically. |
| Collapsible menu for CMS Admin | Sidebar on mobile takes up 100% width; must be hidden behind a toggle (burger) button. | MEDIUM | Needs state tracking and sliding transitions. |
| Touch-friendly CRUD buttons | Admin buttons must be easy to tap (min 44x44px target). | LOW | Increases padding and margin on interactive elements for mobile. |
| Wrap/Stack table data in Admin | Large tables overflow on mobile. | MEDIUM | Either wraps columns into card layouts or makes the table horizontally scrollable. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Swipe gestures to close mobile menu | Standard mobile navigation feels more native when touch gestures are supported. | MEDIUM | Can be implemented using Framer Motion's drag/swipe events. |
| Adaptive content density (Opsi 2) | Hiding cuaca & video embeds to focus screen real estate on core schedules. | LOW | Uses Tailwind `hidden md:block` utilities to selectively show secondary cards. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Keeping bento grid scale-down on mobile | User wants the same grid layout on phone. | Icons and text become unreadably small on a 5-inch screen. | Use vertical stack layout (`flex-col`) on small screens. |

## Feature Dependencies

```
[Mobile Breakpoints]
    └──requires──> [Tailwind Configuration]
                       └──requires──> [Utility-first Classes in Components]

[Collapsible Sidebar Drawer] ──requires──> [State Toggle Hook]
```

### Dependency Notes

- **Mobile Breakpoints requires Tailwind Configuration:** Breakpoints must align with standard device viewports.
- **Collapsible Sidebar Drawer requires State Toggle Hook:** Needed to manage open/closed UI states.

## MVP Definition

### Launch With (v1 / Milestone 4)

Minimum viable product — what's needed to achieve mobile responsiveness.

- [ ] **Mobile-Optimized Display Grid** — Hides Video/Cuaca widgets, stacks Agenda & PrayerTimes, keeps Scrolling Ticker.
- [ ] **Collapsible Hamburger Navigation** — Slides out admin menu on mobile and overlays main panel.
- [ ] **Responsive Form Layouts** — Fits agenda and cuti CRUD input panels on mobile viewports.
- [ ] **Touch-friendly interactive targets** — Buttons and inputs have minimum 44px tap targets.

### Add After Validation (v1.x)

- [ ] **Horizontally Scrollable Tables** — Allow admins to scroll through large event lists with swipe.

### Future Consideration (v2+)

- [ ] **Swipe gestures** — Swiping to open/close menu sidebar.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Mobile-Optimized Display Grid | HIGH | LOW | P1 |
| Collapsible Hamburger Menu | HIGH | MEDIUM | P1 |
| Responsive Form Layouts | HIGH | MEDIUM | P1 |
| Touch-friendly targets | HIGH | LOW | P1 |
| Horizontally Scrollable Tables | MEDIUM | LOW | P2 |

**Priority key:**
- P1: Must have for milestone completion
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Sources

- Internal layout specifications.
- WCAG Touch Target Size guidelines.

---
*Feature research for: Frontend Layout & Mobile Responsiveness*
*Researched: 2026-07-02*
