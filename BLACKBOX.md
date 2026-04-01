# BLACKBOX.md — Corporate TV Design & Prototype Repository

## Directory Overview

This is a **non-code design repository** containing UI/UX prototypes and design system documentation for a **Corporate TV** platform. The project encompasses two complementary products:

1. **Corporate Horizon (Aether)** — A large-format display dashboard designed for corporate TV screens (lobby displays, office monitors). It shows real-time company information such as meeting schedules, announcements, prayer times (Jadwal Sholat), KPIs, and office status. Localized in **Bahasa Indonesia** and optimized for 16:9 aspect ratio viewing from 3–5 meters.

2. **Broadcast Director CMS (Ether)** — A web-based Content Management System (admin dashboard) for managing the content displayed on Corporate Horizon TVs. It provides tools for managing announcements, schedules, layouts, KPIs, and system health monitoring.

Both products share a unified design language built on **Manrope** typography, a **Sky Blue / Dark Navy** color palette derived from Material Design 3 tokens, and a strict "No-Line" philosophy that replaces borders with tonal surface layering.

---

## Project Structure

```
tv/
└── stitch/                                          # All design artifacts
    ├── aether_corporate/
    │   └── DESIGN.md                                # Design system for the TV display dashboard
    ├── cms_admin_dashboard_corporate_tv/
    │   ├── code.html                                # Full HTML/Tailwind prototype of the CMS admin panel
    │   └── screen.png                               # Screenshot of the CMS dashboard
    ├── corporate_tv_dashboard_bahasa_indonesia_jadwal_sholat/
    │   ├── code.html                                # Full HTML/Tailwind prototype of the TV display
    │   └── screen.png                               # Screenshot of the TV dashboard
    └── ether_cms/
        └── DESIGN.md                                # Design system for the CMS admin dashboard
```

---

## Key Files

| File | Description |
|------|-------------|
| `stitch/aether_corporate/DESIGN.md` | **"The Architectural Lens"** — Design system for the TV display. Covers the editorial, magazine-spread aesthetic optimized for large-format screens. Defines surface hierarchy, typography scale (up to 3.5rem Display-LG), the "No-Line Rule," glassmorphism overlays, and TV-specific spacing (minimum 2rem). |
| `stitch/ether_cms/DESIGN.md` | **"The Ethereal Director"** — Design system for the CMS admin panel. Covers the broadcast-gallery aesthetic for desktop admin use. Defines component specs (buttons, cards, input fields, broadcast status chips, timeline scrubber), surface nesting, and CMS-specific interaction patterns. |
| `stitch/cms_admin_dashboard_corporate_tv/code.html` | Fully functional single-file HTML prototype of the CMS. Built with Tailwind CSS (CDN), Manrope font, and Material Symbols. Features: top nav bar, side navigation, summary stats grid, announcement manager with featured broadcast card, content styling panel, integrated schedule, and network health widget. |
| `stitch/corporate_tv_dashboard_bahasa_indonesia_jadwal_sholat/code.html` | Fully functional single-file HTML prototype of the TV display. Built with Tailwind CSS (CDN), Manrope font, and Material Symbols. Features: large digital clock, weather widget, featured announcement card, Jadwal Sholat (Islamic prayer times for Jakarta), meeting agenda list, office status bar, and KPI cards. Localized entirely in Bahasa Indonesia. |
| `stitch/*/screen.png` | Visual reference screenshots of each prototype's rendered output. |

---

## Design System Summary

### Shared Principles (Both Products)

- **Font:** Manrope (Google Fonts) — geometric sans-serif with high x-height for legibility.
- **Color Palette:** Material Design 3 tonal palette anchored on Sky Blue (`primary: #296483`, `primary_container: #8EC5E8`).
- **"No-Line" Rule:** Borders are strictly prohibited for layout sectioning. Use tonal surface shifts instead (`surface` → `surface-container-low` → `surface-container-lowest`).
- **Elevation:** Prefer "Tonal Lift" (white card on gray background) over drop shadows. When shadows are needed, use ultra-diffused ambient shadows: `0px 24px 48px rgba(25, 28, 30, 0.06)`.
- **"Ghost Border" Fallback:** If a border is absolutely required (accessibility), use `outline_variant` (#c0c7ce) at **15% opacity**.
- **Glassmorphism:** For floating overlays — `surface-container-lowest` at 70% opacity with `backdrop-blur: 20-24px`.
- **Primary Gradient:** `linear-gradient(135deg, #296483, #8EC5E8)` for hero elements and CTAs.
- **Darkest Text:** `on_background` (#191c1e) — never use pure `#000000`.

### TV Display (Aether) Specifics

- **Target:** 16:9 large-format screens, viewed from 3–5 meters.
- **Min Text Size:** `body-lg` (1rem) for any readable text.
- **Hero Metrics:** `display-lg` (3.5rem) for singular KPI values.
- **Spacing:** Start at `6` (2rem) minimum; use `12` (4rem) or `16` (5.5rem) for card padding.
- **Layout:** Asymmetrical (e.g., 40/60 split), editorial feel.
- **Locale:** Bahasa Indonesia (Jakarta timezone, WIB).
- **Special Widgets:** Jadwal Sholat (Islamic prayer schedule), weather, meeting agenda.

### CMS Admin (Ether) Specifics

- **Target:** Desktop browser for content administrators.
- **Typography Scale:** `display-md` (2.75rem) for dashboard greetings, `headline-sm` (1.5rem) for sections.
- **Components:** Broadcast status chips (pill-shaped), timeline scrubber, filled input fields, gradient primary buttons.
- **Layout:** Sidebar navigation + main content area with bento grid.

---

## Technology Stack (Prototypes)

The HTML prototypes are **self-contained single-file pages** with no build step required:

- **Tailwind CSS** via CDN (`cdn.tailwindcss.com`) with `forms` and `container-queries` plugins
- **Google Fonts** — Manrope
- **Material Symbols Outlined** — icon set via Google Fonts CDN
- **Custom Tailwind Config** — embedded `<script>` block extending the theme with the full Material Design 3 color token set

### How to View

Open any `code.html` file directly in a web browser:

```bash
# TV Display prototype
start stitch/corporate_tv_dashboard_bahasa_indonesia_jadwal_sholat/code.html

# CMS Admin prototype
start stitch/cms_admin_dashboard_corporate_tv/code.html
```

No server, build tool, or dependency installation is required.

---

## Usage & Conventions

### For Designers
- Refer to the `DESIGN.md` files as the source of truth for visual decisions.
- Use the `screen.png` files as quick visual references.
- Follow the "Do's and Don'ts" sections strictly — especially the No-Line Rule and spacing minimums.

### For Developers Implementing These Designs
- The `code.html` files serve as **pixel-perfect implementation references**. Inspect them for exact Tailwind classes, color tokens, and component structure.
- The Tailwind config block in each HTML file contains the **complete color token map** — extract and reuse it in your project's `tailwind.config.js`.
- All colors use semantic Material Design 3 naming (e.g., `surface-container-low`, `on-primary-container`). Maintain these names in production code for consistency with the design system.
- Icons use **Material Symbols Outlined** with variable font settings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24` (CMS) or `'opsz' 48` (TV).

### For Future Prototyping in This Repo
- Place new design variants under `stitch/` in descriptively named directories.
- Each variant should contain at minimum a `code.html` (prototype) and `screen.png` (screenshot).
- Design system documents go in their respective product directories as `DESIGN.md`.
- Prototypes should remain self-contained single HTML files using CDN dependencies.
