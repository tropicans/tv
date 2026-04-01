import React from "react";

const OfficeStatus: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-[1.5rem] p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-outline font-bold text-lg uppercase tracking-wider">
          Status Kantor
        </span>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full">
          <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-sm font-bold uppercase">Optimal</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-xs text-outline font-bold uppercase">
            Okupansi
          </span>
          <span className="text-xl font-extrabold">64%</span>
        </div>
        <div className="flex flex-col items-end pl-8">
          <span className="text-xs text-outline font-bold uppercase">
            Kualitas Udara
          </span>
          <span className="text-xl font-extrabold text-primary">
            Sangat Baik
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfficeStatus;
