import React from "react";
import { useClock } from "../hooks/useClock";

interface HeaderProps {
  weatherCity?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const { time, dateStr } = useClock();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-6 md:px-12 py-4 md:py-8 bg-white/60 backdrop-blur-xl border-b border-white/20">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Logo_Setneg_RI.svg/960px-Logo_Setneg_RI.svg.png"
            alt="Logo Setneg"
            className="h-14 w-auto drop-shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-widest text-cyan-900 font-headline uppercase leading-tight">
            KEMENTERIAN SEKRETARIAT NEGARA RI
          </h1>
          <p className="text-[10px] md:text-xs font-label font-bold text-cyan-700 tracking-[0.2em] uppercase mt-1">
            Pusat Pengembangan Kompetensi ASN
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end">
        <div className="font-headline font-extrabold tracking-tight text-4xl md:text-6xl text-slate-900">
          {time}
        </div>
        <div className="font-label uppercase tracking-[0.3em] text-[10px] md:text-sm text-cyan-800 font-bold mt-1 text-center md:text-right">
          {dateStr}
        </div>
      </div>
    </header>
  );
};

export default Header;
