import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import { Meeting } from "../types";

interface Props {
  meetings: Meeting[];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace('.', ':');
}

function formatDate(startIso: string, endIso: string | null): string {
  const d1 = new Date(startIso);
  const formattedStart = d1.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  
  if (!endIso) return formattedStart;
  
  const d2 = new Date(endIso);
  const formattedEnd = d2.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  
  if (formattedStart === formattedEnd) {
    return formattedStart;
  }
  
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()} - ${formattedEnd}`;
  }
  
  return `${formattedStart} - ${formattedEnd}`;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "in_progress":
      return "Sedang Berlangsung";
    case "confirmed":
      return "Terkonfirmasi";
    case "pending":
      return "Menunggu";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
}

function getStatusStyle(status: string): string {
  if (status === "in_progress") return "text-outline font-bold uppercase";
  return "";
}

function getLocationIcon(locationType: string): string {
  return locationType === "virtual" ? "videocam" : "location_on";
}

const MeetingList: React.FC<Props> = ({ meetings: rawMeetings }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const yPos = useRef(0);
  const pauseTime = useRef(0);
  const pausedIndices = useRef<Set<number>>(new Set());

  // Urutkan jadwal secara kronologis tanpa memfilternya (tetap agenda sebulan)
  const sortedMeetings = [...rawMeetings].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  // Group duplicate meetings with same title and exact same time
  const groupedMap = new Map<string, Meeting>();
  for (const m of sortedMeetings) {
    const key = `${m.title.trim()}-${new Date(m.startTime).getTime()}`;
    if (groupedMap.has(key)) {
      const existing = groupedMap.get(key)!;
      if (!existing.location.includes(m.location)) {
        existing.location = `${existing.location}, ${m.location}`;
      }
    } else {
      groupedMap.set(key, { ...m });
    }
  }
  const meetings = Array.from(groupedMap.values());

  const needsScroll = meetings.length > 2;
  const displayedMeetings = needsScroll ? [...meetings, ...meetings] : meetings;

  const isToday = (dateIso: string) => {
    const d = new Date(dateIso);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  const now = Date.now();
  let nextUpcomingIndex = meetings.findIndex(m => {
    const endTime = m.endTime ? new Date(m.endTime).getTime() : new Date(m.startTime).getTime() + 2 * 60 * 60 * 1000;
    return endTime >= now;
  });
  if (nextUpcomingIndex === -1) nextUpcomingIndex = 0;

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

    if (Math.abs(yPos.current) >= contentHeight) {
      yPos.current = 0;
      pausedIndices.current.clear();
    }

    contentRef.current.style.transform = `translateY(${yPos.current}px)`;

    const highlightedElements = contentRef.current.querySelectorAll('.agenda-highlighted');
    const currentVisualCenter = Math.abs(yPos.current) + (containerHeight / 2);

    for (let i = 0; i < highlightedElements.length; i++) {
      const target = highlightedElements[i] as HTMLElement;
      const targetIndexAttr = target.getAttribute('data-index');
      const targetIndex = targetIndexAttr ? parseInt(targetIndexAttr, 10) : i;

      if (pausedIndices.current.has(targetIndex)) {
        continue;
      }

      const targetCenterY = target.offsetTop + target.offsetHeight / 2;

      // Cek jika titik tengah target sudah mencapai atau melewati titik tengah container
      if (currentVisualCenter >= targetCenterY) {
        pauseTime.current = 4000; // Pause 4 detik
        pausedIndices.current.add(targetIndex);
        
        // Snap posisi presisi di tengah
        yPos.current = -(targetCenterY - containerHeight / 2);
        contentRef.current.style.transform = `translateY(${yPos.current}px)`;
        break; // Hanya pause untuk satu item pada satu waktu
      }
    }
  });

  return (
    <section className="col-span-7 row-span-6 bg-[#8EC5E8] rounded-[2rem] shadow-xl p-10 flex flex-col gap-6 border border-white/40 h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-indigo-900/10 pb-6 shrink-0">
        <h3 className="font-headline text-2xl font-extrabold text-slate-900 flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl">calendar_month</span>
          Agenda {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </h3>
        <span className="font-label text-xs font-black text-slate-800 bg-white/60 px-3 py-1 rounded-full uppercase tracking-widest">
          {meetings.length} Kegiatan
        </span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{
          WebkitMaskImage: needsScroll ? 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' : 'none',
          maskImage: needsScroll ? 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' : 'none'
        }}
      >
        <div 
          ref={contentRef}
          className="flex flex-col gap-5"
        >
          {displayedMeetings.map((meeting, arrayIndex) => {
            const index = arrayIndex % meetings.length;
            const isActive = meeting.status === "in_progress";
            // Highlight all meetings scheduled for today, or the closest upcoming meeting if there are none today
            const isHighlighted = isActive || isToday(meeting.startTime) || index === nextUpcomingIndex;

            return (
              <div
                key={`${meeting.id}-${arrayIndex}`}
                data-index={arrayIndex}
                className={`p-6 rounded-3xl transition-all duration-500 ease-in-out shrink-0 ${
                  isHighlighted 
                    ? "bg-white text-slate-900 shadow-sm scale-[1.02] agenda-highlighted" 
                    : "bg-white/30 text-slate-900 border border-white/40"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`flex items-center gap-2 font-label text-sm font-black px-3 py-1.5 rounded-lg leading-none ${isHighlighted ? 'text-blue-700 bg-blue-50' : 'text-slate-800 bg-white/50'}`}>
                    <span>{formatDate(meeting.startTime, meeting.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.status !== "confirmed" && (
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${getStatusStyle(meeting.status)} ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>
                        {getStatusLabel(meeting.status)}
                      </span>
                    )}
                    <span className={`material-symbols-outlined ${isHighlighted ? 'text-blue-700' : 'text-slate-700'}`}>
                      {isActive ? 'groups' : getLocationIcon(meeting.locationType)}
                    </span>
                  </div>
                </div>
                {(() => {
                  let displayTitle = meeting.title;
                  let institution = null;
                  
                  const matchParen = displayTitle.match(/^(.*?)\s*\((.+)\)$/);
                  if (matchParen) {
                    displayTitle = matchParen[1];
                    institution = matchParen[2];
                  } else {
                    const matchHyphen = displayTitle.match(/^(.*?)\s+-\s+(.+)$/);
                    if (matchHyphen) {
                      displayTitle = matchHyphen[1];
                      institution = matchHyphen[2];
                    }
                  }
                  
                  return (
                    <div className="mb-3">
                      <h4 className="font-headline font-extrabold text-lg leading-tight line-clamp-2">
                        {displayTitle}
                      </h4>
                      {institution && (
                        <div className={`font-label text-xs uppercase tracking-wider mt-1 font-bold ${isHighlighted ? 'text-blue-600/80' : 'text-slate-500'}`}>
                          {institution}
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div className="flex flex-wrap gap-2">
                  {meeting.location.split(', ').map((loc, i) => (
                    <div key={i} className={`inline-flex items-center gap-2 font-label text-sm font-black px-3 py-1.5 rounded-lg leading-none ${isHighlighted ? 'text-blue-700 bg-blue-50' : 'text-slate-800 bg-white/50'}`}>
                      <span className="material-symbols-outlined text-base">
                        {getLocationIcon(meeting.locationType)}
                      </span>
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MeetingList;
