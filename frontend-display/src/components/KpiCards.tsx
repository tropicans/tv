import React from "react";
import { Kpi } from "../types";

interface Props {
  kpis: Kpi[];
}

function getTrendColor(trendType: string): string {
  switch (trendType) {
    case "positive":
      return "text-emerald-500";
    case "negative":
      return "text-error";
    default:
      return "text-outline";
  }
}

const KpiCards: React.FC<Props> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-surface-container-lowest rounded-[1.5rem] p-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined">{kpi.icon}</span>
            <span className="font-bold uppercase tracking-wider text-xs">
              {kpi.label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.5rem] font-black leading-none">
              {kpi.value}
            </span>
            {kpi.trend && (
              <span className={`font-bold text-lg ${getTrendColor(kpi.trendType)}`}>
                {kpi.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
