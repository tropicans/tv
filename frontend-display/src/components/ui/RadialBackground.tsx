import React from "react";
import { cn } from "../../lib/utils";

export const RadialBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      {/* Base Background: Setneg Deep Blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]" />
      
      {/* Animated Subtle Fluid Mesh overlay using CSS multi-backgrounds to save dom nodes */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent mix-blend-screen" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/40 via-transparent to-transparent mix-blend-screen animate-slowpan bg-[length:200%_200%]" />
      
      {/* Grid Pattern overlay for tech feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-black/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </div>
  );
};
