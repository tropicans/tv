import React, { useEffect, useState, useRef } from "react";
import { fetchAgendaDisplayData } from "../api";
import Header from "./Header";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { HourlyWeather } from "./HourlyWeather";
import { Calendar, Clock, MapPin, AlertCircle, RefreshCw, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  title: string;
  timeText: string;
  location: string;
}

interface GroupedAgenda {
  dateText: string;
  date: string;
  events: Event[];
}

interface Leave {
  id: string;
  employeeName: string;
  dateRange: string;
  monthText: string;
}

interface DisplayData {
  agenda: GroupedAgenda[];
  cuti: Leave[];
  settings: {
    slidesUrl: string | null;
    lastSyncTime: string | null;
    lastSyncStatus: string | null;
  };
}

export const AgendaDashboard: React.FC = () => {
  const [data, setData] = useState<DisplayData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Carousel States
  const [activeWeek, setActiveWeek] = useState<1 | 2>(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchAgendaDisplayData();
      setData(res);
      setError(null);
    } catch (e: any) {
      console.error("Failed to load agenda data:", e);
      setError(e.message || "Gagal memuat data agenda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto cycle weeks every 15 seconds
  useEffect(() => {
    if (isMobile) return;
    const cycleInterval = setInterval(() => {
      setActiveWeek((prev) => (prev === 1 ? 2 : 1));
    }, 15 * 1000);
    return () => clearInterval(cycleInterval);
  }, [isMobile]);

  // Auto scroll cuti list when content overflows
  const cutiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return;
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

        if (isScrollingDown) {
          container.scrollTop += 1;
          // Hit bottom
          if (container.scrollTop + clientHeight >= scrollHeight - 1) {
            clearInterval(scrollInterval);
            isScrollingDown = false;
            // Hold at bottom for 3 seconds before reversing
            holdTimer = setTimeout(() => {
              startScroll();
            }, 3000);
          }
        } else {
          // Scroll up twice as fast
          container.scrollTop -= 2;
          // Hit top
          if (container.scrollTop <= 0) {
            clearInterval(scrollInterval);
            isScrollingDown = true;
            // Hold at top for 3 seconds before scrolling down again
            holdTimer = setTimeout(() => {
              startScroll();
            }, 3000);
          }
        }
      }, 40); // 25 FPS scroll speed
    };

    // Delay scroll start on boot/update by 2 seconds
    const initTimer = setTimeout(startScroll, 2000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(scrollInterval);
      clearTimeout(holdTimer);
    };
  }, [data, isMobile]);

  // Find minimum date from active agenda items to use as baseline
  const getMinDate = (): Date => {
    if (!data || !data.agenda || data.agenda.length === 0) return new Date();
    
    let min = new Date(data.agenda[0].date);
    for (const item of data.agenda) {
      const d = new Date(item.date);
      if (d < min) min = d;
    }
    return min;
  };

  // Get Monday of the week containing date d
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Match target date with agenda events
  const getEventsForDate = (targetDate: Date): { dateText: string; events: Event[] } => {
    if (!data || !data.agenda) return { dateText: "", events: [] };

    const matched = data.agenda.find((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getDate() === targetDate.getDate() &&
        itemDate.getMonth() === targetDate.getMonth() &&
        itemDate.getFullYear() === targetDate.getFullYear()
      );
    });

    if (matched) {
      return matched;
    }

    const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][targetDate.getDay()];
    const months = ["Juli", "Agustus", "September", "Oktober", "November", "Desember", "Januari", "Februari", "Maret", "April", "Mei", "Juni"];
    const formattedDate = `${targetDate.getDate().toString().padStart(2, "0")} ${months[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
    return {
      dateText: `${dayName}, ${formattedDate}`,
      events: []
    };
  };

  if (error) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center font-body">
        <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>
        <div className="text-center bg-white/75 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4 animate-bounce" />
          <h2 className="text-on-background text-2xl font-black font-headline tracking-tight uppercase">
            Gagal Memuat Agenda
          </h2>
          <p className="text-on-surface-variant mt-3 text-sm">{error}</p>
          <button 
            onClick={() => { setLoading(true); loadData(); }}
            className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full font-label text-xs font-black tracking-wider uppercase hover:bg-primary-container hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center font-body">
        <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>
        <div className="text-center bg-white/75 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-xl">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-label text-xs font-black tracking-widest uppercase">Memuat Agenda TV...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic Monday baselines
  const minDate = getMinDate();
  const mondayWeek1 = getMonday(minDate);
  const mondayWeek2 = new Date(mondayWeek1);
  mondayWeek2.setDate(mondayWeek2.getDate() + 7);

  // Generate weekday arrays
  const week1Days = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(mondayWeek1);
    d.setDate(d.getDate() + i);
    return d;
  });

  const week2Days = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(mondayWeek2);
    d.setDate(d.getDate() + i);
    return d;
  });

  const currentWeekDays = activeWeek === 1 ? week1Days : week2Days;

  return (
    <div className="bg-background font-body text-on-background min-h-screen overflow-y-auto md:h-screen md:overflow-hidden w-screen selection:bg-transparent">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>

      {/* Header */}
      <Header />

      {/* Main content grid */}
      <main className="px-6 md:px-12 pt-48 md:pt-36 pb-20 min-h-screen md:h-screen flex flex-col gap-6 md:grid md:grid-cols-12 md:grid-rows-6 md:gap-8">
        
        {/* Left Side: 5 Column Weekly Agenda Calendar (span 9) */}
        <div className="col-span-9 row-span-6 flex flex-col h-auto md:h-full pb-2 order-1">
          
          {/* Active Week Paging Indicators Banner */}
          <div className="flex items-center gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
              <button
                onClick={() => setActiveWeek(1)}
                className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-500 cursor-pointer hover:bg-slate-100/50 ${
                  activeWeek === 1 ? "bg-primary text-white shadow-sm hover:bg-primary" : "text-slate-500 font-bold"
                }`}
              >
                Minggu Ini
              </button>
              <button
                onClick={() => setActiveWeek(2)}
                className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-500 cursor-pointer hover:bg-slate-100/50 ${
                  activeWeek === 2 ? "bg-primary text-white shadow-sm hover:bg-primary" : "text-slate-500 font-bold"
                }`}
              >
                Minggu Depan
              </button>
            </div>
            
            {/* MD3 Tonal Pagination Dots */}
            <div className="flex items-center gap-2 ml-auto bg-white/40 px-4 py-2.5 rounded-full border border-white/40">
              <div className={`h-2.5 rounded-full transition-all duration-500 ${activeWeek === 1 ? "bg-primary w-6" : "bg-slate-400/40 w-2.5"}`}></div>
              <div className={`h-2.5 rounded-full transition-all duration-500 ${activeWeek === 2 ? "bg-primary w-6" : "bg-slate-400/40 w-2.5"}`}></div>
            </div>
          </div>

          {/* Sliding Week viewport */}
          <div className="flex-grow relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWeek}
                initial={{ opacity: 0, x: activeWeek === 1 ? -150 : 150 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeWeek === 1 ? 150 : -150 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col gap-6 w-full h-auto md:grid md:grid-cols-5 md:h-full md:absolute md:inset-0"
              >
                {currentWeekDays.map((dayDate, index) => {
                  const { dateText, events } = getEventsForDate(dayDate);
                  const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][dayDate.getDay()];
                  const displayDate = dateText.split(/,\s+/)[1] || dateText;

                  return (
                    <div
                      key={dayName}
                      className="flex flex-col h-auto md:h-full bg-white/95 rounded-[2.2rem] p-6 shadow-md border border-white/80 overflow-hidden"
                    >
                      {/* Day Header */}
                      <div className="pb-4 mb-4 border-b border-slate-200/50 flex flex-col shrink-0">
                        <h3 className="font-headline font-black text-3xl text-slate-800 leading-none">
                          {dayName}
                        </h3>
                        <span className="font-label text-xs font-bold text-cyan-850 uppercase tracking-widest mt-2 block">
                          {displayDate}
                        </span>
                      </div>

                      {/* Events list */}
                      <div className="flex-grow overflow-y-visible md:overflow-y-auto space-y-4 pr-1 scrollbar-none">
                        {events.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center opacity-25 py-12">
                            <Calendar size={28} className="text-slate-450 mb-2" strokeWidth={1.5} />
                            <span className="font-body text-xs font-semibold text-slate-500 tracking-wide">
                              Tidak ada agenda
                            </span>
                          </div>
                        ) : (
                          events.map((event, eIdx) => (
                            <div
                              key={event.id || eIdx}
                              className="bg-white rounded-[1.2rem] p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col gap-2.5 hover:shadow-md transition-shadow duration-300"
                            >
                              {/* Title */}
                              <h4 className="font-headline font-black text-sm md:text-base text-slate-900 tracking-tight leading-snug">
                                {event.title}
                              </h4>

                              {/* Time */}
                              {event.timeText && (
                                <div className="flex items-center gap-1.5 text-xs text-cyan-800 font-extrabold font-label uppercase tracking-wider">
                                  <Clock size={14} className="shrink-0 text-cyan-800" strokeWidth={2.5} />
                                  <span>{event.timeText}</span>
                                </div>
                              )}

                              {/* Location */}
                              {event.location && (
                                <div className="flex items-start gap-1.5 text-xs text-slate-650 font-semibold font-body leading-normal">
                                  <MapPin size={14} className="shrink-0 mt-0.5 text-slate-400" strokeWidth={2} />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Cuti List + Weather Widget (span 3) */}
        <div className="col-span-3 row-span-6 flex flex-col gap-6 h-auto md:h-full pb-2 order-2">
          
          {/* Cuti Pegawai Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-grow flex flex-col bg-white/95 rounded-[2.2rem] p-6 border border-white/80 shadow-md overflow-visible md:overflow-hidden h-auto md:h-full"
          >
            {/* Panel Title */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200/50 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-primary shadow-sm">
                <Users size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-headline font-black text-xl text-slate-800 leading-none">
                  Cuti Pegawai
                </h3>
                <span className="font-label text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 block">
                  Juli 2026
                </span>
              </div>
            </div>

            {/* Scrollable Cuti List */}
            <div 
              ref={cutiContainerRef}
              className="flex-grow overflow-y-visible md:overflow-y-auto space-y-3.5 pr-1 scrollbar-none"
            >
              {data.cuti.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-2 py-10">
                  <span className="font-body text-xs font-semibold text-slate-500">
                    Tidak ada cuti bulan ini
                  </span>
                </div>
              ) : (
                data.cuti.map((leave, lIdx) => (
                  <div
                    key={leave.id || lIdx}
                    className="bg-white rounded-[1.2rem] p-4 border border-slate-100 flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="font-headline font-black text-sm text-slate-900">
                      {leave.employeeName}
                    </span>
                    <span className="font-label text-[10px] font-black text-cyan-800 flex items-center gap-1.5 bg-cyan-50/50 px-2.5 py-1 rounded-full w-max border border-cyan-100/50 uppercase tracking-wider">
                      <Calendar size={11} className="shrink-0 text-cyan-800" strokeWidth={2.5} />
                      <span>{leave.dateRange}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Compact Weather Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:block shrink-0 h-40"
          >
            <HourlyWeather />
          </motion.div>

        </div>
      </main>

      {/* Footer Announcement Marquee */}
      <AnnouncementTicker />
    </div>
  );
};
