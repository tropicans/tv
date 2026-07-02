# Project: PPKASN Corporate TV Display

## What This Is
A full-stack, real-time television display dashboard system for the Indonesian Ministry of State Secretariat (Kemensetneg) PPKASN. It combines manual weekly agenda inputs and employee leave lists entered via a secure CMS admin panel with automated weather forecasts, prayer times, and room bookings from internal systems.

## Core Value
Continuous, reliable, and highly legible information broadcast on TV displays across different physical locations, manageable directly via a secure CMS admin panel (Single Source of Truth).

## Current State
- **Active Version**: v4.0 (Mobile Responsiveness) - In Progress (Phase 5 complete)
- **Summary**: Phase 3 (Display Responsiveness), Phase 4 (CMS Admin Sidebar Drawer), and Phase 5 (CMS Admin Tables & Forms) complete and verified. Agenda Dashboard and CMS Admin Portal are now fully responsive on mobile/tablet viewports with touch-friendly elements.

## Current Milestone: v4.0 Mobile Responsiveness

**Goal:** Menjadikan Agenda Dashboard dan CMS Admin Portal responsif serta mudah digunakan di perangkat smartphone.

**Target features:**
- Halaman Display Utama/Agenda responsif dengan menyembunyikan widget sekunder (Video & Cuaca) dan menyusun widget utama (Agenda, Jadwal Sholat, Ticker) secara mobile-optimized.
- CMS Admin Portal responsif menggunakan menu sidebar lipat (burger menu), serta mengoptimalkan form input dan tabel data agar pas di layar smartphone.
- Pengaturan breakpoint Tailwind responsif pada komponen-komponen display & admin.

## Requirements

### Validated
- **V-1**: Public display routes for schedules, prayer times, weather, and scrolling tickers.
- **V-2**: Secure CMS admin panel with email verification and Google OAuth login.
- **V-3**: Two-week activity agenda rolling carousel with horizontal sliding transitions.
- **V-4**: Large-text, high-contrast, borderless UI/UX television accessibility.
- **V-5**: Deprecated and disabled Google Slides scraper boot synchronization and scheduler.
- **V-6**: Simplified CMS Admin UI with "Dashboard Ringkasan" statistics overview panel.
- **V-7**: Clean Google OAuth-only authentication portal with email login removed.
- **V-8**: Local Jakarta time date filtering to filter out passed employee leaves from display agenda.
- **MOB-01**: Responsivitas Agenda Display (Opsi 2 - hide Video & Cuaca, stack Agenda, Jadwal Sholat, Ticker). *Validated in Phase 3.*
- **MOB-02**: Responsivitas CMS Admin Portal (Sidebar lipat / burger menu, touch-friendly tables & forms). *Validated in Phase 4 & Phase 5.*

### Active
- None (All requirements for Milestone v4.0 validated)

### Out of Scope
- Google Slides scraping and synchronization (Deprecated).

## Context
- **tv spec**: wall-displays viewed from a distance (mouse-free).
- **input method**: 100% manual CRUD overrides inside the CMS.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Side-by-Side Bento Grid | Combines weekly activities and leave lists on one screen to avoid cycling delays | Shipped |
| Custom HMAC-SHA256 Auth | Built-in Node crypto avoids external dependencies | Shipped |
| Horizontal Sliding Carousel | Displays 2 weeks of data dynamically without shrinking font size | Shipped |
| CMS Single Source of Truth | Deprecates scraper to allow full, reliable manual scheduling control | Shipped |
| Google OAuth Only Login | Simplifies admin auth security flow and removes email login friction | Shipped |
| Local Time Date Filtering | Ensures passed leave dates are auto-hidden on display client | Shipped |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-02*
