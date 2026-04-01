import React from "react";
import { useClock } from "../hooks/useClock";

const Clock: React.FC = () => {
  const { time, dateStr } = useClock();

  return (
    <div className="flex flex-col justify-start">
      <h1 className="font-bold tracking-tight text-[8rem] leading-none text-on-surface">
        {time}
      </h1>
      <p className="text-[2rem] font-medium text-outline -mt-4">{dateStr}</p>
    </div>
  );
};

export default Clock;
