import React from "react";
import { useDisplayData } from "./hooks/useDisplayData";
import Header from "./components/Header";
import { RadialBackground } from "./components/ui/RadialBackground";
import VideoEmbed from "./components/VideoEmbed";
import { HourlyWeather } from "./components/HourlyWeather";
import PrayerTimes from "./components/PrayerTimes";
import MeetingList from "./components/MeetingList";
import { AnnouncementTicker } from "./components/AnnouncementTicker";
import logoBerAKHLAK from "./assets/Logo_BerAKHLAK.png";
import logoBangga from "./assets/Logo-Bangga-Melayani-Bangsa.png";


function App() {
  const { data, error } = useDisplayData();

  if (error) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center font-body">
        <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>
        <div className="text-center bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-2xl">
          <span className="material-symbols-outlined text-error text-6xl mb-4 block">
            error
          </span>
          <p className="text-on-background text-xl font-bold font-headline">
            Gagal memuat data
          </p>
          <p className="text-on-surface-variant mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center font-body">
        <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>
        <div className="text-center bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-lg">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium tracking-wide">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background font-body text-on-background overflow-hidden h-screen w-screen selection:bg-transparent">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>

      {/* Navigation Shell (TopAppBar) */}
      <Header />

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

      {/* Footer / Marquee Shell */}
      <AnnouncementTicker />
    </div>
  );
}

export default App;
