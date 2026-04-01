import React from "react";

const CanvaEmbed: React.FC = () => {
  return (
    <div className="flex-1 w-full rounded-[2rem] overflow-hidden shadow-sm relative bg-surface-container-lowest">
      <iframe
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full border-none"
        src="https://www.canva.com/design/DAHFfJ4iRyM/5CvUL89xJXc8wbCX3FmhFQ/view?embed&autoplay=1"
        allowFullScreen
        allow="fullscreen"
        title="Canva Presentation"
      ></iframe>
    </div>
  );
};

export default CanvaEmbed;
