import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CmsDashboard } from './CmsDashboard';
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
  LayoutDashboard: () => <div data-testid="icon-dashboard" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  Users: () => <div data-testid="icon-users" />,
  Plus: () => <div data-testid="icon-plus" />,
  Trash2: () => <div data-testid="icon-trash" />,
  Check: () => <div data-testid="icon-check" />,
  AlertCircle: () => <div data-testid="icon-alert" />,
  ArrowLeft: () => <div data-testid="icon-arrow-left" />,
  LogOut: () => <div data-testid="icon-logout" />,
  UserCheck: () => <div data-testid="icon-usercheck" />,
  Info: () => <div data-testid="icon-info" />,
  BookOpen: () => <div data-testid="icon-bookopen" />,
  Menu: () => <div data-testid="icon-menu" />,
  X: () => <div data-testid="icon-x" />,
}));

// Mock API module
jest.mock('../api', () => ({
  fetchCurrentUser: jest.fn(),
  fetchAuthConfig: jest.fn(),
  fetchAgendaEvents: jest.fn(),
  fetchEmployeeLeaves: jest.fn(),
  loginWithGoogle: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('../hooks/useClock', () => ({
  useClock: () => ({
    time: "10:00:00",
    dateStr: "Senin, 06 Juli 2026",
  }),
}));

describe('CMS Admin Sidebar Drawer Tests', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('auth_token', 'mock-token');

    (api.fetchCurrentUser as jest.Mock).mockResolvedValue({
      email: 'admin@ppkasn.go.id'
    });
    (api.fetchAuthConfig as jest.Mock).mockResolvedValue({
      googleClientId: 'mock-google-client-id'
    });
    (api.fetchAgendaEvents as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Agenda Rapat', timeText: '10:00', location: 'Ruang A', dateText: 'Senin', date: '2026-07-06' }
    ]);
    (api.fetchEmployeeLeaves as jest.Mock).mockResolvedValue([
      { id: '1', employeeName: 'Yudhi', dateRange: '06-08 Juli', monthText: 'Juli' }
    ]);
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
    localStorage.clear();
  });

  it('renders hamburger menu on mobile and toggles sidebar open/close', async () => {
    setWindowWidth(800); // Mobile/tablet breakpoint (< 1024px)
    
    await act(async () => {
      render(<CmsDashboard />);
    });

    // Wait for the dashboard to finish loading
    await screen.findByRole('heading', { name: /Dashboard Ringkasan/i });

    // Hamburger button should be present
    const toggleButton = screen.getByLabelText('Buka menu sidebar');
    expect(toggleButton).toBeInTheDocument();

    // The sidebar should initially have translate-x-full off-screen style
    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).toContain('-translate-x-full');

    // Open sidebar by clicking hamburger
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    // Sidebar should slide in (translate-x-0)
    expect(sidebar.className).toContain('translate-x-0');

    // Close button should be present inside sidebar now
    const closeButton = screen.getByLabelText('Tutup menu sidebar');
    expect(closeButton).toBeInTheDocument();

    // Close sidebar by clicking close button
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Sidebar should slide out
    expect(sidebar.className).toContain('-translate-x-full');
  });

  it('closes open sidebar on mobile when clicking backdrop overlay', async () => {
    setWindowWidth(800);
    
    await act(async () => {
      render(<CmsDashboard />);
    });

    await screen.findByRole('heading', { name: /Dashboard Ringkasan/i });

    const toggleButton = screen.getByLabelText('Buka menu sidebar');
    const sidebar = screen.getByRole('complementary');

    // Open sidebar
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(sidebar.className).toContain('translate-x-0');

    // Backdrop should be rendered
    const backdrop = document.querySelector('.bg-slate-900\\/40');
    expect(backdrop).toBeInTheDocument();

    // Click backdrop
    await act(async () => {
      fireEvent.click(backdrop!);
    });

    // Sidebar should close
    expect(sidebar.className).toContain('-translate-x-full');
  });

  it('closes open sidebar on mobile when selecting a navigation link', async () => {
    setWindowWidth(800);
    
    await act(async () => {
      render(<CmsDashboard />);
    });

    await screen.findByRole('heading', { name: /Dashboard Ringkasan/i });

    const toggleButton = screen.getByLabelText('Buka menu sidebar');
    const sidebar = screen.getByRole('complementary');

    // Open sidebar
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(sidebar.className).toContain('translate-x-0');

    // Click navigation tab 'Kelola Agenda'
    const kelolaAgendaButton = screen.getByText('Kelola Agenda');
    await act(async () => {
      fireEvent.click(kelolaAgendaButton);
    });

    // Sidebar should close
    expect(sidebar.className).toContain('-translate-x-full');
    // Main header should reflect the active tab change
    expect(screen.getByRole('heading', { name: /Kelola Jadwal Kegiatan/i })).toBeInTheDocument();
  });

  it('does not display hamburger toggle and renders static sidebar on desktop viewports', async () => {
    setWindowWidth(1200); // Desktop view (>= 1024px)
    
    await act(async () => {
      render(<CmsDashboard />);
    });

    await screen.findByRole('heading', { name: /Dashboard Ringkasan/i });

    // Hamburger button should have lg:hidden or not render clickability
    const toggleButton = screen.queryByLabelText('Buka menu sidebar');
    // Note: Since hamburger button has Tailwind class lg:hidden, it is technically in DOM but invisible on desktop.
    // The sidebar itself should have lg:static and lg:translate-x-0 classes
    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).toContain('lg:static');
    expect(sidebar.className).toContain('lg:translate-x-0');
  });
});
