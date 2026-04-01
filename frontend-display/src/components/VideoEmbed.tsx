import React from "react";

const VideoEmbed: React.FC = () => {
  return (
    <section className="col-span-5 row-span-4 bg-white/70 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative border border-white/40">
      <div className="relative flex-grow flex items-center justify-center p-4">
        <iframe
          loading="lazy"
          className="w-full aspect-video border-none rounded-xl"
          src="https://www.youtube.com/embed/dgFS_Vh7TYo?autoplay=1&loop=1&playlist=dgFS_Vh7TYo&controls=0&modestbranding=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      </div>
    </section>
  );
};

export default VideoEmbed;
