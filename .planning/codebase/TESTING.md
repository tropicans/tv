# Testing Patterns

**Analysis Date:** 2026-07-02

## Test Framework

**Runner:**
- Jest (configured and run via `react-scripts` inside `frontend-display/`).

**Assertion Library:**
- Jest default assertions (`expect`).
- Matchers: `toBe`, `toEqual`, `toHaveLength`, `toHaveClass`, `getAttribute`.

**Run Commands:**
```bash
# Run frontend test suite (runs in interactive watch mode by default)
cd frontend-display
npm test

# Run tests in CI / non-interactive mode
cd frontend-display
CI=true npm test
```

## Test File Organization

**Location:**
- Test files are collocated with the source code or components they test.
- Example: `frontend-display/src/components/MeetingList.test.tsx` sits right next to `frontend-display/src/components/MeetingList.tsx`.

**Naming:**
- Unit and component tests: `*.test.tsx`.

**Structure:**
```
frontend-display/src/
  components/
    MeetingList.tsx
    MeetingList.test.tsx
  App.tsx
  App.test.tsx
```

## Test Structure

**Suite Organization:**
Tests use standard `describe` and `it` blocks from Jest. Mocking is declared at the top of the file to intercept complex module behaviors.

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import MeetingList from './MeetingList';

// Mock framer-motion animations
jest.mock('framer-motion', () => ({
  useAnimationFrame: jest.fn(),
}));

describe('MeetingList Component', () => {
  it('renders meetings and highlights all today\'s meetings', () => {
    // Arrange
    render(<MeetingList meetings={mockMeetings} />);

    // Act & Assert
    const syncMeetings = screen.getAllByText('Cloud Infrastructure Sync');
    expect(syncMeetings).toHaveLength(2);
  });
});
```

## Mocking

**Framework:**
- Jest module mocks via `jest.mock()`.

**Common Mocks:**
- `framer-motion`: Mocked in React test environments to prevent lifecycle/animation loops from blocking or throwing errors in Jest JSDOM.
- Backend API mocks: Currently, the frontend tests use in-memory data structures passed directly via props rather than mocking global fetch requests.

## Fixtures and Factories

**Mock Data:**
- Simple arrays of objects modeled after Prisma schemas are defined directly within test files (e.g. `mockMeetings` in `MeetingList.test.tsx`).

## Coverage

- No specific coverage goals, config files, or badges are enforced in this repository.

## Test Types

**Component/Unit Tests:**
- Validate component states, styling classes (e.g., confirming `agenda-highlighted` is applied to today's meetings), list duplication (infinite loop calculations), and properties.
- Executed on JSDOM.

**Backend integration tests:**
- No automated backend tests exist. Verification is done manually by running the application inside Docker Compose and inspecting console output/database tables.

---

*Testing analysis: 2026-07-02*
*Update when test patterns change*
