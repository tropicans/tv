import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AgendaDashboard } from './AgendaDashboard';
import * as api from '../api';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="icon-calendar" />,
  Clock: () => <div data-testid="icon-clock" />,
  MapPin: () => <div data-testid="icon-mappin" />,
  AlertCircle: () => <div data-testid="icon-alert" />,
  RefreshCw: () => <div data-testid="icon-refresh" />,
  Users: () => <div data-testid="icon-users" />,
}));

// Mock API module
jest.mock('../api', () => ({
  fetchAgendaDisplayData: jest.fn(),
}));

// Mock clock hook
jest.mock('../hooks/useClock', () => ({
  useClock: () => ({
    time: "10:00:00",
    dateStr: "Senin, 06 Juli 2026",
  }),
}));

// Mock child components to prevent side effects/network calls
jest.mock('./HourlyWeather', () => ({
  HourlyWeather: () => <div data-testid="hourly-weather">Mock Weather</div>,
}));

jest.mock('./AnnouncementTicker', () => ({
  AnnouncementTicker: () => <div data-testid="announcement-ticker">Mock Ticker</div>,
}));

describe('AgendaDashboard Date Formatting Bug Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reproduces the bug where Wednesday 08 Juli 2026 displays as 08 Januari 2026 when there are no events', async () => {
    // Mock the data returned by fetchAgendaDisplayData
    (api.fetchAgendaDisplayData as jest.Mock).mockResolvedValue({
      agenda: [
        {
          dateText: "Senin, 06 Juli 2026",
          date: "2026-07-06T00:00:00.000Z",
          events: [
            { id: "1", title: "Rakor Program", timeText: "09.00-10.30", location: "R. Rapat" }
          ]
        },
        {
          dateText: "Selasa, 07 Juli 2026",
          date: "2026-07-07T00:00:00.000Z",
          events: [
            { id: "2", title: "Rakor Awal", timeText: "14.00-15.30", location: "Zoom" }
          ]
        }
      ],
      cuti: [],
      settings: {
        slidesUrl: null,
        lastSyncTime: null,
        lastSyncStatus: null
      }
    });

    await act(async () => {
      render(<AgendaDashboard />);
    });

    // Wednesday, 08 July 2026 (Wednesday has no events in the mock above)
    // We expect "08 Juli 2026" to be displayed on the page.
    // Under the bug, this will fail because it displays "08 Januari 2026".
    const wednesdayElement = screen.queryByText(/08 Juli 2026/i);
    expect(wednesdayElement).toBeInTheDocument();
  });
});
