export interface Announcement {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  status: string;
  isFeatured: boolean;
  imageUrl: string | null;
  scheduledAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  location: string;
  locationType: string;
  startTime: string;
  endTime: string | null;
  status: string;
  attendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  icon: string;
  trend: string | null;
  trendType: string;
  sortOrder: number;
}

export interface PrayerTime {
  id: string;
  date: string;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  city: string;
}

export interface DisplaySettings {
  id: string;
  brandColor: string;
  activeLayout: string;
  weatherCity: string;
  timezone: string;
}

export interface DisplayData {
  featured: Announcement | null;
  announcements: Announcement[];
  meetings: Meeting[];
  kpis: Kpi[];
  prayerTime: PrayerTime | null;
  settings: DisplaySettings | null;
}
