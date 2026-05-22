import React from 'react';
import { render, screen } from '@testing-library/react';
import MeetingList from './MeetingList';
import { Meeting } from '../types';

// Mock framer-motion to avoid animation errors in test environment
jest.mock('framer-motion', () => ({
  useAnimationFrame: jest.fn(),
}));

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Cloud Infrastructure Sync',
    location: 'Ruang Quantum - Lt. 4',
    locationType: 'physical',
    startTime: new Date().toISOString(), // Hari ini
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    attendees: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Q3 Growth Strategy',
    location: 'Ruang Rapat Horizon',
    locationType: 'physical',
    startTime: new Date().toISOString(), // Hari ini
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    attendees: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Future Workshop',
    location: 'Virtual - Microsoft Teams',
    locationType: 'virtual',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Besok
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    attendees: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
    // Agenda ke-1 (indeks 0) dan agenda ke-2 (indeks 1) adalah hari ini.
    // Karena daftar diduplikasi untuk scroll tak terbatas, ada 4 elemen ter-highlight (0, 1, 3, 4)
    expect(highlightedElements.length).toBe(4);

    // Memastikan setiap card memiliki atribut data-index yang unik sesuai posisinya di daftar tampil
    const cards = document.querySelectorAll('[data-index]');
    expect(cards.length).toBe(6);
    cards.forEach((card, index) => {
      expect(card.getAttribute('data-index')).toBe(index.toString());
    });
  });
});
