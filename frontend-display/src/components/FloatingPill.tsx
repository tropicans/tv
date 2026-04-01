import React from "react";

const FloatingPill: React.FC = () => {
  return (
    <div className="fixed bottom-10 right-12 flex items-center gap-4 bg-white/70 backdrop-blur-xl px-8 py-4 rounded-full shadow-lg border border-white/40">
      <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
      <span className="text-on-surface font-bold text-sm tracking-widest uppercase">
        Umpan Jaringan Aktif
      </span>
    </div>
  );
};

export default FloatingPill;
