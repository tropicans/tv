import React from "react";
import { useClock } from "../hooks/useClock";

interface HeaderProps {
  weatherCity?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const { time, dateStr } = useClock();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 bg-white/60 backdrop-blur-xl border-b border-white/20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Logo_Setneg_RI.svg/960px-Logo_Setneg_RI.svg.png"
            alt="Logo Setneg"
            className="h-14 w-auto drop-shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-widest text-cyan-900 font-headline uppercase leading-tight">
            KEMENTERIAN SEKRETARIAT NEGARA RI
          </h1>
          <p className="text-xs font-label font-bold text-cyan-700 tracking-[0.2em] uppercase mt-1">
            Pusat Pengembangan Kompetensi ASN
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-headline font-extrabold tracking-tight text-6xl text-slate-900">
          {time}
        </div>
        <div className="font-label uppercase tracking-[0.3em] text-sm text-cyan-800 font-bold mt-1">
          {dateStr}
        </div>
      </div>
    </header>
  );
};

export default Header;
