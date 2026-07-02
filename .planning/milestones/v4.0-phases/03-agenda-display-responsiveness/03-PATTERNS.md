# Phase 03: Agenda Display Responsiveness - Pattern Map

**Mapped:** 2026-07-02
**Files analyzed:** 5
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `frontend-display/src/App.tsx` | component | request-response | `frontend-display/src/App.tsx` | exact |
| `frontend-display/src/components/Header.tsx` | component | request-response | `frontend-display/src/components/Header.tsx` | exact |
| `frontend-display/src/components/MeetingList.tsx` | component | request-response | `frontend-display/src/components/MeetingList.tsx` | exact |
| `frontend-display/src/components/AgendaDashboard.tsx` | component | request-response | `frontend-display/src/components/AgendaDashboard.tsx` | exact |
| `frontend-display/src/components/ResponsiveLayout.test.tsx` | test | request-response | `frontend-display/src/components/MeetingList.test.tsx` | role-match |

---

## Pattern Assignments

### `frontend-display/src/App.tsx` (component, request-response)

**Analog:** `frontend-display/src/App.tsx`

**Imports pattern** (lines 1-10):
```typescript
import React from "react";
import { useDisplayData } from "./hooks/useDisplayData";
import Header from "./components/Header";
import VideoEmbed from "./components/VideoEmbed";
import { HourlyWeather } from "./components/HourlyWeather";
import PrayerTimes from "./components/PrayerTimes";
import MeetingList from "./components/MeetingList";
import { AnnouncementTicker } from "./components/AnnouncementTicker";
import { AgendaDashboard } from "./components/AgendaDashboard";
import { CmsDashboard } from "./components/CmsDashboard";
```

**Core layout grid/flex container** (lines 53-67):
```typescript
      {/* Main Content Canvas (Full Width) */}
      <main className="px-12 pt-36 pb-20 h-screen grid grid-cols-12 grid-rows-6 gap-8">
        
        {/* Main Content Video/Hero Card */}
        <VideoEmbed />

        {/* Agenda Widget */}
        <MeetingList meetings={data?.meetings || []} />

        {/* Weather Widget */}
        <HourlyWeather />

        {/* Prayer Times Widget */}
        <PrayerTimes prayerTime={data?.prayerTime} />
      </main>
```

*Note: The planner should adapt this grid to a responsive flex layout on mobile using CSS `flex flex-col md:grid md:grid-cols-12 md:grid-rows-6`.*

---

### `frontend-display/src/components/Header.tsx` (component, request-response)

**Analog:** `frontend-display/src/components/Header.tsx`

**Imports pattern** (lines 1-2):
```typescript
import React from "react";
import { useClock } from "../hooks/useClock";
```

**Header alignment pattern** (lines 11-38):
```typescript
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 bg-white/60 backdrop-blur-xl border-b border-white/20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Logo_Setneg_RI.svg/960px-Logo_Setneg_RI.svg.png"
            alt="Logo Setneg"
            className="h-14 w-auto drop-shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-widest text-cyan-900 font-headline uppercase leading-tight">
            KEMENTERIAN SEKRETARIAT NEGARA RI
          </h1>
          <p className="text-xs font-label font-bold text-cyan-700 tracking-[0.2em] uppercase mt-1">
            Pusat Pengembangan Kompetensi ASN
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-headline font-extrabold tracking-tight text-6xl text-slate-900">
          {time}
        </div>
        <div className="font-label uppercase tracking-[0.3em] text-sm text-cyan-800 font-bold mt-1">
          {dateStr}
        </div>
      </div>
    </header>
```

*Note: The planner should modify the header structure (`flex justify-between items-center px-12 py-8`) to stack (`flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0 px-6 md:px-12 py-4 md:py-8`) on mobile.*

---

### `frontend-display/src/components/MeetingList.tsx` (component, request-response)

**Analog:** `frontend-display/src/components/MeetingList.tsx`

**Auto-scroll frame animation loop** (lines 111-128):
```typescript
  useAnimationFrame((time, delta) => {
    if (!needsScroll || !containerRef.current || !contentRef.current) return;

    if (pauseTime.current > 0) {
      pauseTime.current -= delta;
      return;
    }

    const containerHeight = containerRef.current.offsetHeight;
    const contentHeight = contentRef.current.offsetHeight / 2;
    const speed = 0.05; 

    yPos.current -= speed * delta;
```

*Note: The planner should conditionally skip this `useAnimationFrame` execution or snap and reset transforms if the viewport is mobile (`isMobile` state).*

---

### `frontend-display/src/components/AgendaDashboard.tsx` (component, request-response)

**Analog:** `frontend-display/src/components/AgendaDashboard.tsx`

**Cycle weeks interval** (lines 67-72):
```typescript
  // Auto cycle weeks every 15 seconds
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setActiveWeek((prev) => (prev === 1 ? 2 : 1));
    }, 15 * 1000);
    return () => clearInterval(cycleInterval);
  }, []);
```

**Cuti list auto-scroll** (lines 77-127):
```typescript
  useEffect(() => {
    const container = cutiContainerRef.current;
    if (!container) return;

    let scrollInterval: NodeJS.Timeout;
    let isScrollingDown = true;
    let holdTimer: NodeJS.Timeout;

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        
        // If content fits completely, don't scroll
        if (scrollHeight <= clientHeight) return;
        
        // Scroll logic...
```

*Note: The planner should check the `isMobile` viewport state in both of these hooks to disable auto-scroll animations and week auto-cycling, ensuring clean user interaction on mobile.*

---

### `frontend-display/src/components/ResponsiveLayout.test.tsx` (test, request-response)

**Analog:** `frontend-display/src/components/MeetingList.test.tsx`

**Framer motion mock pattern** (lines 7-9):
```typescript
jest.mock('framer-motion', () => ({
  useAnimationFrame: jest.fn(),
}));
```

**React Testing Library setup and assertions** (lines 50-74):
```typescript
describe('MeetingList Component', () => {
  it('renders meetings and highlights all today\'s meetings', () => {
    render(<MeetingList meetings={mockMeetings} />);

    // Memastikan agenda terduplikasi karena needsScroll bernilai true (lebih dari 2 kegiatan)
    const syncMeetings = screen.getAllByText('Cloud Infrastructure Sync');
    expect(syncMeetings).toHaveLength(2);

    const growthMeetings = screen.getAllByText('Q3 Growth Strategy');
    expect(growthMeetings).toHaveLength(2);

    // Memastikan card agenda hari ini memiliki kelas 'agenda-highlighted'
    const highlightedElements = document.querySelectorAll('.agenda-highlighted');
    expect(highlightedElements.length).toBe(4);
  });
});
```

*Note: The new test file should configure/mock `window.innerWidth` and dispatch `window.dispatchEvent(new Event('resize'))` to assert layout responsiveness and toggling logic.*

---

## Shared Patterns

### Viewport Size Detection Hook/State
**Source:** Custom window resize event hook (new shared state implementation)
**Apply to:** `frontend-display/src/components/MeetingList.tsx` and `frontend-display/src/components/AgendaDashboard.tsx`
```typescript
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

---

## No Analog Found

None. All files have direct exact analogs or clear role-match analogs in the codebase.

---

## Metadata

**Analog search scope:** `frontend-display/src/` and `frontend-display/src/components/`
**Files scanned:** 44
**Pattern extraction date:** 2026-07-02
