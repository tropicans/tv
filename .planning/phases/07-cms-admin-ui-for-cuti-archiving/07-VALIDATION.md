---
phase: 07
slug: cms-admin-ui-for-cuti-archiving
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-07
---

# Phase 07 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest (via react-scripts) |
| **Config file** | package.json |
| **Quick run command** | `C:\Users\yudhiar\\.bun\bin\bun test CmsDashboardResponsive.test.tsx -- --watchAll=false` |
| **Full suite command** | `C:\Users\yudhiar\\.bun\bin\bun test -- --watchAll=false` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `C:\Users\yudhiar\\.bun\bin\bun test CmsDashboardResponsive.test.tsx -- --watchAll=false`
- **After every plan wave:** Run `C:\Users\yudhiar\\.bun\bin\bun test -- --watchAll=false`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | LVARCH-06 | — | N/A | unit | `C:\Users\yudhiar\\.bun\bin\bun test -- --watchAll=false` | ✅ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | LVARCH-07, LVARCH-08, LVARCH-09 | — | N/A | unit | `C:\Users\yudhiar\\.bun\bin\bun test -- --watchAll=false` | ✅ W0 | ⬜ pending |
| 07-01-03 | 01 | 1 | — | — | N/A | unit | `C:\Users\yudhiar\\.bun\bin\bun test -- --watchAll=false` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| User interface visual layout of Cuti Aktif and Cuti Terarsip tabs | LVARCH-07 | Visual styling and layout checks cannot be fully automated | Deploy via docker compose, navigate to Kelola Cuti, verify tabs rendering |
| Custom confirmation modal styles and overlay | LVARCH-08, LVARCH-09 | Visual checks for modal aesthetics and overlay backdrop | Click "Arsipkan" or "Pulihkan", verify modal rendering and backdrop blur |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-07
