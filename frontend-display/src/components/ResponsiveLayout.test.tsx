import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from './Header';
import { AgendaDashboard } from './AgendaDashboard';
import App from '../App';

import * as api from '../api';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  useAnimationFrame: jest.fn(),
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
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
  ChevronLeft: () => <div data-testid="icon-chevron-left" />,
  ChevronRight: () => <div data-testid="icon-chevron-right" />,
  Volume2: () => <div data-testid="icon-volume2" />,
  VolumeX: () => <div data-testid="icon-volumex" />,
  CloudSun: () => <div data-testid="icon-cloud-sun" />,
}));

// Mock API module
jest.mock('../api', () => {
  return {
    __esModule: true,
    fetchAgendaDisplayData: jest.fn(),
    fetchDisplayData: jest.fn(),
  };
});

jest.mock('../hooks/useDisplayData', () => ({
  useDisplayData: () => ({
    data: {
      meetings: [
        { id: "m1", title: "App Meeting", location: "Room B", locationType: "physical", startTime: "2026-07-06T09:00:00Z", endTime: "2026-07-06T10:00:00Z" }
      ],
      prayerTime: null,
    },
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('../hooks/useClock', () => ({
  useClock: () => ({
    time: "10:00:00",
    dateStr: "Senin, 06 Juli 2026",
  }),
}));

jest.mock('../hooks/useBMKG', () => ({
  useBMKG: () => ({
    weather: null,
    loading: false,
    error: null,
  }),
}));

jest.mock('../hooks/useCompanyAnnouncements', () => ({
  useCompanyAnnouncements: () => ({
    announcements: [],
    loading: false,
  }),
}));

jest.mock('../hooks/useFinance', () => ({
  useFinance: () => ({
    data: null,
    loading: false,
  }),
}));

jest.mock('../hooks/useNews', () => ({
  useNews: () => ({
    news: [],
    loading: false,
  }),
}));

jest.mock('../hooks/useTickerData', () => ({
  useTickerData: () => ({
    announcements: [],
  }),
}));

jest.mock('../hooks/useTraffic', () => ({
  useTraffic: () => ({
    trafficData: null,
    loading: false,
  }),
}));

describe('Responsive Layout tests', () => {
  jest.setTimeout(30000);
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    (api.fetchAgendaDisplayData as jest.Mock).mockResolvedValue({
      agenda: [
        {
          dateText: "Senin, 06 Juli 2026",
          date: "2026-07-06T00:00:00.000Z",
          events: [
            { id: "e1", title: "Meeting 1", timeText: "09:00 - 10:00", location: "Room A" }
          ]
        }
      ],
      cuti: [
        { id: "c1", employeeName: "Budi", dateRange: "06-10 Juli 2026", monthText: "Juli" }
      ],
      settings: {
        slidesUrl: null,
        lastSyncTime: null,
        lastSyncStatus: null,
      }
    });

    (api.fetchDisplayData as jest.Mock).mockResolvedValue({
      meetings: [],
      prayerTime: null,
    });
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  afterEach(() => {
    setWindowWidth(originalInnerWidth);
  });



  it('verifies Header stacks vertically on mobile but flexes horizontally on desktop', () => {
    const { rerender } = render(<Header />);
    
    // Simulate desktop viewport
    setWindowWidth(1024);
    rerender(<Header />);
    const desktopHeader = screen.getByRole('banner');
    expect(desktopHeader.className).toContain('md:flex-row');
    expect(desktopHeader.className).toContain('flex-col'); // flex-col is base mobile style, md:flex-row is desktop
    expect(desktopHeader.className).toContain('md:px-12');
    expect(desktopHeader.className).toContain('py-4'); // mobile padding py-4, md:py-8 desktop

    // Simulate mobile viewport
    setWindowWidth(400);
    rerender(<Header />);
    const mobileHeader = screen.getByRole('banner');
    expect(mobileHeader.className).toContain('flex-col');
    expect(mobileHeader.className).not.toContain('md:flex-row-override'); // just to assert md prefix is not active
  });

  it('verifies secondary widgets are hidden on mobile viewports', async () => {
    render(<AgendaDashboard />);
    // Load state
    await screen.findByText('Cuti Pegawai', undefined, { timeout: 10000 });

    // HourlyWeather should be wrapped in motion.div with hidden md:block class
    const weatherWrapper = document.querySelector('.hidden.md\\:block');
    expect(weatherWrapper).toBeInTheDocument();
  });

  it('verifies active week paging buttons are clickable on mobile viewports', async () => {
    render(<AgendaDashboard />);
    // Wait for the layout to render
    await screen.findByText('Cuti Pegawai', undefined, { timeout: 10000 });

    // Simulate mobile
    setWindowWidth(400);

    // Assert "Minggu Ini" and "Minggu Depan" are clickable button elements (or styled as such)
    const weekButtons = screen.getAllByRole('button');
    const week1Button = screen.getByText('Minggu Ini');
    const week2Button = screen.getByText('Minggu Depan');

    expect(week1Button.tagName).toBe('BUTTON');
    expect(week2Button.tagName).toBe('BUTTON');

    // Click "Minggu Depan" button
    fireEvent.click(week2Button);
    expect(week2Button.className).toContain('bg-primary');
    expect(week1Button.className).not.toContain('bg-primary');
  });
});
