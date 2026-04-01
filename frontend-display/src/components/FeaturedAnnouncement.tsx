import React from "react";
import { Announcement } from "../types";

interface Props {
  announcement: Announcement | null;
}

const FeaturedAnnouncement: React.FC<Props> = ({ announcement }) => {
  if (!announcement) {
    return (
      <div className="flex-1 bg-primary-container rounded-[2rem] p-12 flex items-center justify-center">
        <p className="text-on-primary-container/60 text-xl font-medium">
          Tidak ada pengumuman utama
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-primary-container rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="relative z-10">
        <span className="bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-4 inline-block">
          Pengumuman Utama
        </span>
        <h2 className="text-[2.5rem] font-extrabold leading-tight text-on-primary-container tracking-tight">
          {announcement.title}
        </h2>
        {announcement.description && (
          <p className="text-lg text-on-primary-container/80 mt-4 max-w-md font-medium line-clamp-2">
            {announcement.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-3xl">
            {announcement.icon}
          </span>
        </div>
        <span className="text-xl font-bold text-on-primary-container">
          {announcement.status === "live" ? "Sedang Tayang" : "Terjadwal"}
        </span>
      </div>
    </div>
  );
};

export default FeaturedAnnouncement;
