---
phase: 3
slug: agenda-display-responsiveness
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-02
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest + React Testing Library (CRA native) |
| **Config file** | None — react-scripts native |
| **Quick run command** | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` |
| **Full suite command** | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick test command
- **After every plan wave:** Run full suite command
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | MOB-01 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | MOB-03 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 2 | MOB-01 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 2 | MOB-02 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |
| 03-02-03 | 02 | 2 | MOB-01 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |
| 03-03-01 | 03 | 2 | MOB-01 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |
| 03-03-02 | 03 | 2 | MOB-03 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |
| 03-03-03 | 03 | 2 | MOB-01 | — | N/A | unit | `docker run --rm -e CI=true -v "c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display:/app" -w /app node:20-alpine npm test -- src/components/ResponsiveLayout.test.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend-display/src/components/ResponsiveLayout.test.tsx` — stubs for MOB-01, MOB-02, MOB-03

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Verify visual layout presentation on mobile | MOB-01 | Requires browser layout engine viewport measurement | Open Chrome DevTools, toggle mobile device toolbar (e.g. Pixel 7), navigate to / and /agenda. Verify no horizontal overflow and scrollbars. |
| Verify Video and Weather widgets are hidden | MOB-02 | Requires visual confirmation of DOM display style | Inspect page at width < 768px. Ensure weather widget and video embed elements have CSS `display: none` / `hidden`. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-07-02
