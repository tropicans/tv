import React from "react";
import { useBMKG } from "../hooks/useBMKG";
import { useTraffic } from "../hooks/useTraffic";

export const AnnouncementTicker = () => {
  const { bmkgText, loading: bmkgLoading } = useBMKG();
  const { trafficText, loading: trafficLoading } = useTraffic();

  // Gabungkan hasil fetch dari masing-masing API
  const displayTexts = [
    bmkgLoading ? "Mengambil update BMKG terbaru..." : bmkgText,
    trafficLoading ? "Mengambil data pantauan lalu lintas..." : trafficText,
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex items-center h-16 bg-[#8EC5E8] text-slate-900 shadow-2xl overflow-hidden shrink-0">
      <div className="px-10 h-full bg-black/10 flex items-center justify-center z-10 shadow-xl border-r border-black/5 shrink-0">
        <span className="font-label font-black text-slate-900 text-sm tracking-[0.3em] uppercase">Info Terkini</span>
      </div>
      
      <div className="flex-grow overflow-hidden relative h-full flex items-center">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-20 text-slate-900 font-body text-base font-bold tracking-wide h-full pl-[100vw] will-change-transform">
          {displayTexts.map((text, i) => (
            <span key={i} className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 h-full flex items-center gap-5 bg-black/5 border-l border-black/5 shrink-0">
        <img src="/Logo_BerAKHLAK.svg.png" alt="BerAKHLAK" className="h-12 w-auto object-contain" />
        <img src="/Logo-Bangga-Melayani-Bangsa.png" alt="Bangga Melayani Bangsa" className="h-16 w-auto object-contain" />
        <div className="border-l border-black/10 h-8 mx-1"></div>
        <div className="flex items-center gap-2 text-slate-800 font-label text-[10px] font-black uppercase tracking-[0.25em]">
          <div className="w-2 h-2 rounded-full bg-green-600 shadow-none"></div>
          <span>System Online</span>
        </div>
      </div>
    </footer>
  );
};
