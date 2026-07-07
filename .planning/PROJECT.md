# Project: PPKASN Corporate TV Display

## What This Is
A full-stack, real-time television display dashboard system for the Indonesian Ministry of State Secretariat (Kemensetneg) PPKASN. It combines manual weekly agenda inputs and employee leave lists entered via a secure CMS admin panel with automated weather forecasts, prayer times, and room bookings from internal systems.

## Core Value
Continuous, reliable, and highly legible information broadcast on TV displays across different physical locations, manageable directly via a secure CMS admin panel (Single Source of Truth).

## Current State
- **Active Version**: v5.0 (Cuti Archiving) - Phase 6 Complete
- **Summary**: Milestone v4.0 is complete and shipped. v5.0 is focused on archiving employee leave (cuti) records instead of hard-deleting them. Phase 6 (Backend API & Database) is completed and verified.

## Current Milestone: v5.0 Cuti Archiving

**Goal:** Menghindari penghapusan data cuti pegawai dengan mengarsipkannya sehingga data historis tetap tersimpan, dan menyediakan antarmuka pengarsipan di CMS Admin.

**Target features:**
- Modifikasi skema database `EmployeeLeave` untuk mendukung status pengarsipan (kolom `isArchived` boolean atau sejenisnya).
- Perbarui API Backend (CRUD cuti) untuk mendukung fungsi pengarsipan (archive/unarchive) dan pemfilteran data cuti aktif vs diarsipkan.
- Perbarui halaman "Kelola Cuti" di CMS Admin untuk mengganti aksi "Hapus" dengan "Arsipkan", serta menyediakan tab/filter untuk melihat riwayat "Cuti Diarsipkan".
- Pastikan API display `/api/display/agenda` secara otomatis memfilter dan menyembunyikan cuti yang diarsipkan.

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
- ✓ **MOB-01**: Responsivitas Agenda Display (Opsi 2) — v4.0
- ✓ **MOB-02**: Responsivitas CMS Admin Portal — v4.0
- ✓ **LVARCH-01**: Skema database EmployeeLeave dengan status isArchived — Phase 6
- ✓ **LVARCH-02**: Filter data cuti di display agenda public (sembunyikan data diarsipkan) — Phase 6
- ✓ **LVARCH-03**: Filter data cuti di admin GET (active/archived/all) — Phase 6
- ✓ **LVARCH-04**: Soft-delete data cuti pada DELETE endpoint — Phase 6
- ✓ **LVARCH-05**: Endpoint restore/unarchive data cuti — Phase 6

### Active
- **LVARCH-06**: Penggantian aksi Hapus dengan Arsipkan di CMS Admin UI
- **LVARCH-07**: Tombol filter/tab "Aktif" vs "Diarsipkan" di CMS Admin UI
- **LVARCH-08**: Aksi Restore untuk data cuti yang diarsipkan di CMS Admin UI
- **LVARCH-09**: Validasi integrasi end-to-end pengarsipan cuti di UI

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
*Last updated: 2026-07-07 after completing Phase 6*
