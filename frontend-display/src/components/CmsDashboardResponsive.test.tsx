import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
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

describe('CMS Admin Tables & Forms Responsiveness Tests', () => {
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
      { id: '1', title: 'Agenda Rapat Akbar', timeText: '10:00', location: 'Ruang A', dateText: 'Senin, 06 Juli 2026', date: '2026-07-06' }
    ]);
    (api.fetchEmployeeLeaves as jest.Mock).mockResolvedValue([
      { id: '1', employeeName: 'Yudhi Ardinal', dateRange: '06-08 Juli', monthText: 'Juli' }
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

  it('verifies that stats cards and instructions stack on mobile viewports', async () => {
    setWindowWidth(600); // Mobile width

    await act(async () => {
      render(<CmsDashboard />);
    });

    await screen.findByRole('heading', { name: /Dashboard Ringkasan/i });

    // Find the stats cards container
    const statsContainer = screen.getByText('Total Agenda Terdaftar').closest('.grid');
    expect(statsContainer).toHaveClass('grid-cols-1');
    expect(statsContainer).toHaveClass('md:grid-cols-2');

    // Find instructions container
    const instructionsSpan = screen.getByText('Panduan Pengelolaan Layar TV Agenda');
    const instructionsHeader = instructionsSpan.closest('h3');
    expect(instructionsHeader).toBeInTheDocument();
    
    const instructionsGrid = instructionsHeader?.nextElementSibling;
    expect(instructionsGrid).toBeInTheDocument();
    expect(instructionsGrid).toHaveClass('grid-cols-1');
    expect(instructionsGrid).toHaveClass('md:grid-cols-2');
  });

  it('verifies grid layout stacks form above list below 1024px for Agenda tab', async () => {
    setWindowWidth(800); // Tablet width

    await act(async () => {
      render(<CmsDashboard />);
    });

    // Click navigation tab 'Kelola Agenda'
    const kelolaAgendaButton = screen.getByRole('button', { name: /Kelola Agenda/i });
    await act(async () => {
      fireEvent.click(kelolaAgendaButton);
    });

    await screen.findByRole('heading', { name: /Kelola Jadwal Kegiatan/i });

    // Assert that the container grid uses flex-col on mobile/tablet and lg:grid
    const formHeading = screen.getByText('Tambah Agenda Manual');
    const tabGridContainer = formHeading.closest('.flex-grow > div');
    expect(tabGridContainer).toHaveClass('flex-col');
    expect(tabGridContainer).toHaveClass('lg:grid');
    expect(tabGridContainer).toHaveClass('lg:grid-cols-12');

    // Form should have col-span-12 and lg:col-span-4
    const formContainer = formHeading.closest('div');
    expect(formContainer).toHaveClass('col-span-12');
    expect(formContainer).toHaveClass('lg:col-span-4');

    // List container should have col-span-12 and lg:col-span-8
    const listHeading = screen.getByText('Daftar Agenda Terdaftar');
    const listContainer = listHeading.closest('div');
    expect(listContainer).toHaveClass('col-span-12');
    expect(listContainer).toHaveClass('lg:col-span-8');
  });

  it('verifies table is hidden and card-list is rendered on mobile viewport for Agenda tab', async () => {
    setWindowWidth(600); // Mobile width

    await act(async () => {
      render(<CmsDashboard />);
    });

    const kelolaAgendaButton = screen.getByRole('button', { name: /Kelola Agenda/i });
    await act(async () => {
      fireEvent.click(kelolaAgendaButton);
    });

    await screen.findByRole('heading', { name: /Kelola Jadwal Kegiatan/i });

    // Check that table element is hidden/absent or has md:block/hidden styles
    const tableElement = screen.queryByRole('table');
    expect(tableElement).toHaveClass('hidden');
    expect(tableElement).toHaveClass('md:table');

    // Card representation should be visible inside mobile card list
    const mobileCardList = screen.getByTestId('agenda-mobile-list');
    expect(mobileCardList).toHaveClass('block');
    expect(mobileCardList).toHaveClass('md:hidden');

    const agendaTitleText = within(mobileCardList).getByText('Agenda Rapat Akbar');
    expect(agendaTitleText).toBeInTheDocument();
  });

  it('verifies table is wrapped in scrollable container on tablet viewport for Agenda tab', async () => {
    setWindowWidth(800); // Tablet width

    await act(async () => {
      render(<CmsDashboard />);
    });

    const kelolaAgendaButton = screen.getByRole('button', { name: /Kelola Agenda/i });
    await act(async () => {
      fireEvent.click(kelolaAgendaButton);
    });

    await screen.findByRole('heading', { name: /Kelola Jadwal Kegiatan/i });

    // Table wrapper should have overflow-x-auto and be hidden on mobile, visible on md+
    const tableElement = screen.getByRole('table');
    const tableWrapper = tableElement.parentElement;
    expect(tableWrapper).toHaveClass('overflow-x-auto');
    expect(tableWrapper).toHaveClass('hidden');
    expect(tableWrapper).toHaveClass('md:block');
  });

  it('verifies minimum 44x44px touch targets on mobile interactive elements', async () => {
    setWindowWidth(600); // Mobile width

    await act(async () => {
      render(<CmsDashboard />);
    });

    // Check sidebar navigation tabs min-height/padding classes
    const navDashboardButton = screen.getByRole('button', { name: /Dashboard Ringkasan/i });
    expect(navDashboardButton).toHaveClass('min-h-[44px]');

    // Navigate to Cuti tab
    const kelolaCutiButton = screen.getByRole('button', { name: /Kelola Cuti/i });
    await act(async () => {
      fireEvent.click(kelolaCutiButton);
    });

    // Check input fields have min-height or vertical padding class achieving >= 44px
    const cutiNameInput = screen.getByPlaceholderText('Ketik atau pilih nama pegawai...');
    expect(cutiNameInput).toHaveClass('min-h-[44px]');

    // Check autocomplete item min-height/vertical padding class
    await act(async () => {
      fireEvent.focus(cutiNameInput);
    });
    const firstAutocompleteItem = screen.getByRole('button', { name: 'Danang Mukhtar Hafid' });
    expect(firstAutocompleteItem).toHaveClass('min-h-[44px]');

    // Check delete trash button has min-h/min-w/flex classes
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(
      btn => btn.querySelector('[data-testid="icon-trash"]') || btn.getAttribute('aria-label') === 'Hapus cuti'
    );
    expect(deleteButton).toBeDefined();
    expect(deleteButton).toHaveClass('min-h-[44px]');
    expect(deleteButton).toHaveClass('min-w-[44px]');
  });
});
