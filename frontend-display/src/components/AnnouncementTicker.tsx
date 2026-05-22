import React from "react";
import { AlertTriangle, CarFront, Newspaper, TrendingUp, Megaphone, ShieldAlert } from "lucide-react";
import { useTickerData } from "../hooks/useTickerData";

export const AnnouncementTicker = () => {
  const { tickerData, loading } = useTickerData();

  // If there's an active earthquake alert (mag >= 5.0)
  const isAlertActive = !!tickerData?.bmkgAlert;

  const allItems = [
    {
      label: "INFO INTERNAL",
      text: loading ? "" : tickerData?.announcements || "",
      icon: Megaphone,
      badgeClass: "bg-purple-500 text-white",
      iconColor: "text-purple-500",
    },
    {
      label: "GEMPA TERKINI",
      text: loading ? "" : tickerData?.bmkg || "",
      icon: AlertTriangle,
      badgeClass: isAlertActive ? "bg-white text-red-600 animate-pulse font-extrabold" : "bg-red-500 text-white",
      iconColor: isAlertActive ? "text-white" : "text-red-500",
    },
    {
      label: "LALU LINTAS",
      text: loading ? "" : tickerData?.traffic || "",
      icon: CarFront,
      badgeClass: "bg-blue-600 text-white",
      iconColor: "text-blue-600",
    },
    {
      label: "BERITA TERKINI",
      text: loading ? "" : tickerData?.news || "",
      icon: Newspaper,
      badgeClass: "bg-emerald-600 text-white",
      iconColor: "text-emerald-600",
    },
    {
      label: "INFO PASAR",
      text: loading ? "" : tickerData?.finance || "",
      icon: TrendingUp,
      badgeClass: "bg-amber-600 text-white",
      iconColor: "text-amber-600",
    },
  ];

  // Hanya tampilkan kategori yang memiliki data nyata
  const items = allItems.filter(item => item.text.length > 0);

  // Adjust theme depending on alert state
  const containerBg = "bg-[#8EC5E8] text-slate-900";
  const dividerColor = "bg-black/10";
  const borderDivider = "border-black/5";

  return (
    <footer className={`fixed bottom-0 left-0 w-full z-50 flex items-center h-16 ${containerBg} shadow-2xl overflow-hidden shrink-0 transition-colors duration-500`}>
      {/* Title Shell */}
      <div className={`px-10 h-full bg-black/10 flex items-center justify-center z-10 shadow-xl border-r ${borderDivider} shrink-0`}>
        <span className="font-label font-black text-slate-900 text-sm tracking-[0.3em] uppercase flex items-center gap-2">
          {isAlertActive && (
            <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
          )}
          <span>Info Terkini</span>
        </span>
      </div>
      
      {/* Marquee Content */}
      <div className="flex-grow overflow-hidden relative h-full flex items-center">
        {loading || items.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <span className="font-body text-sm opacity-60 tracking-wide">
              {loading ? "Memuat informasi terkini..." : "Tidak ada informasi saat ini."}
            </span>
          </div>
        ) : (
          <div 
            className="whitespace-nowrap animate-marquee flex items-center gap-20 text-current font-body text-base font-bold tracking-wide h-full will-change-transform"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <span key={i} className="flex items-center gap-6" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 opacity-60"></span>
                  <span className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full shadow-inner border border-white/40">
                    {/* Category Badge */}
                    <span className={`font-label text-xs font-black px-2.5 py-0.5 rounded-full tracking-wider ${item.badgeClass}`}>
                      {item.label}
                    </span>
                    
                    {/* Icon & Message */}
                    <span className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      <span className="font-medium tracking-wide text-slate-900">{item.text}</span>
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Logos / Status */}
      <div className={`px-6 h-full flex items-center gap-5 bg-black/5 border-l ${borderDivider} shrink-0`}>
        <img src="/Logo_BerAKHLAK.svg.png" alt="BerAKHLAK" className="h-10 w-auto object-contain" />
        <img src="/Logo-Bangga-Melayani-Bangsa.png" alt="Bangga Melayani Bangsa" className="h-12 w-auto object-contain" />
        <div className={`${dividerColor} border-l h-8 mx-1`}></div>
        <div className={`flex items-center gap-2 text-slate-800 font-label text-[10px] font-black uppercase tracking-[0.25em]`}>
          <div className={`w-2 h-2 rounded-full ${isAlertActive ? 'bg-red-600 animate-ping' : 'bg-green-600'} shadow-none`}></div>
          <span>{isAlertActive ? "ALERT ACTIVE" : "System Online"}</span>
        </div>
      </div>
    </footer>
  );
};
