# Project: PPKASN Corporate TV Display

## What This Is
A full-stack, real-time television display dashboard system for the Indonesian Ministry of State Secretariat (Kemensetneg) PPKASN. It combines manual weekly agenda inputs and employee leave lists entered via a secure CMS admin panel with automated weather forecasts, prayer times, and room bookings from internal systems.

## Core Value
Continuous, reliable, and highly legible information broadcast on TV displays across different physical locations, manageable directly via a secure CMS admin panel (Single Source of Truth).

## Requirements

### Validated
- **V-1**: Public display routes for schedules, prayer times, weather, and scrolling tickers.
- **V-2**: Secure CMS admin panel with email verification and Google OAuth login.
- **V-3**: Two-week activity agenda rolling carousel with horizontal sliding transitions.
- **V-4**: Large-text, high-contrast, borderless UI/UX television accessibility.

### Active (Milestone 3: CMS Single Source of Truth)
- [ ] **CMS-SOT-01**: Disable and remove the Google Slides scraper engine, boot synchronization, and 30-minute cron scheduler.
- [ ] **CMS-SOT-02**: Remove Google Slides URL configuration and manual scraper sync triggers from the CMS interface.
- [ ] **CMS-SOT-03**: Create a CMS Landing Dashboard showing database statistics (Total Events, Total leaves on record) to replace the scraper settings tab.

### Out of Scope
- Google Slides scraping and synchronization (Deprecated).

## Context
- **tv spec**:wall-displays viewed from a distance (mouse-free).
- **input method**: 100% manual CRUD overrides inside the CMS.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Side-by-Side Bento Grid | Combines weekly activities and leave lists on one screen to avoid cycling delays | Shipped |
| Custom HMAC-SHA256 Auth | Built-in Node crypto avoids external dependencies | Shipped |
| Horizontal Sliding Carousel | Displays 2 weeks of data dynamically without shrinking font size | Shipped |
| CMS Single Source of Truth | Deprecates scraper to allow full, reliable manual scheduling control | Pending |

---
*Last updated: 2026-07-02*
