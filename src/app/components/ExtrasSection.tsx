"use client";

import { useEffect, useRef, useState } from "react";
import TypingText from "./TypingText";
import { FUN_FACTS, SLIDESHOW_CLIPS } from "../constants";

export default function ExtrasSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showVideoFade, setShowVideoFade] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const slideshowClips = SLIDESHOW_CLIPS;
  const currentClip = slideshowClips[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => setShowVideoFade(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = volume;
    vid.muted = isMuted;
    void vid.play().catch(() => {});
  }, [currentIndex, volume, isMuted]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onVolChange = () => {
      setVolume(vid.volume);
      setIsMuted(vid.muted);
    };
    vid.addEventListener("volumechange", onVolChange);
    return () => vid.removeEventListener("volumechange", onVolChange);
  }, []);

  const handleVideoEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshowClips.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slideshowClips.length - 1 : prev - 1,
    );
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshowClips.length);
  };

  return (
    <section
      id="extras"
      className="py-20 flex flex-col items-start justify-start w-full max-w-5xl mx-auto px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(80, 20, 100, 0.15) 0%, rgba(20, 80, 100, 0.15) 100%)',
      }}
    >
      {/* Neon glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-magenta-500"></div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Beyond the Code
          </h2>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 opacity-30"></div>
        </div>

      <div className="w-full grid md:grid-cols-2 gap-8">
        {/* Esports Achievements */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-magenta-300 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Esports Journey
          </h3>
          <p className="text-purple-100/80">
            As a <span className="font-bold text-cyan-300">semi-professional League of Legends athlete</span>,
            I balanced competitive gaming with academic excellence at UCI. This experience taught
            me invaluable lessons about <span className="font-bold text-purple-300">leadership</span>, <span className="font-bold text-purple-300">teamwork</span>,
            and <span className="font-bold text-purple-300">performance under pressure</span>—skills that directly translate to my work as a developer.
          </p>
          
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-magenta-900/20 border border-purple-500/30 shadow-lg shadow-purple-500/10">
            <h4 className="text-lg font-bold text-purple-200 mb-3">Notable Achievements</h4>
            <ul className="list-none text-purple-100/90 space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-cyan-400">▸</span>IGN: XiaoDanny</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">▸</span>UCI Esports Scholarship Athlete 2021-2025</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">▸</span>Game: League of Legends</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">▸</span>Maintained Challenger (0.01% NA ranking) while balancing academics</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">▸</span>Primary shotcaller and leader on multiple semi-professional teams</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">▸</span>Led multiple deep runs in high-stakes tournaments</li>
            </ul>
          </div>

          <TypingText label="Fun Fact:" phrases={FUN_FACTS} className="mt-6" />
        </div>

        {/* Video Highlights */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            Highlight Reel
          </h3>
          
          <div
            ref={wrapperRef}
            className={`relative w-full h-64 md:h-80 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden bg-black/40 border border-cyan-500/30 transition-opacity duration-700 ${
              showVideoFade ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handlePrev}
              aria-label="Previous clip"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black/80 z-20"
            >
              ←
            </button>
            <video
              key={currentClip.name}
              ref={videoRef}
              src={`/Clips/${currentClip.name}.mp4`}
              controls
              aria-label={`Video highlight: ${currentClip.title}`}
              title={currentClip.title}
              className="w-full h-full object-contain z-10"
              onEnded={() => {
                handleVideoEnded();
                if (document.fullscreenElement) wrapperRef.current?.requestFullscreen();
              }}
            />
            <button
              onClick={handleNext}
              aria-label="Next clip"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black/80 z-20"
            >
              →
            </button>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/20">
            <h4 className="text-sm font-bold text-cyan-300 mb-1">Clip Context:</h4>
            <p className="text-sm text-purple-100/80">{currentClip.story}</p>
          </div>
        </div>
      </div>

      {/* Other Interests */}
      <div className="mt-8 w-full p-5 rounded-lg border border-magenta-500/20 bg-gradient-to-r from-purple-900/10 to-magenta-900/10">
        <h3 className="text-xl font-bold text-magenta-300 mb-3 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Other Interests
        </h3>
        <p className="text-purple-100/80">
          When I&apos;m not coding or gaming, you can find me working out, watching good movies/shows,
          or playing piano. I believe in maintaining a balanced lifestyle that fuels both creativity
          and productivity.
        </p>
      </div>
      </div>
    </section>
  );
}
