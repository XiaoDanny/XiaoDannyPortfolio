// components/HighlightsSection.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import TypingText from "./TypingText";
import { SlideshowClip, FUN_FACTS } from "../constants";

interface HighlightsSectionProps {
  slideshowClips: SlideshowClip[];
  onBack: () => void;
}

export default function HighlightsSection({
  slideshowClips,
  onBack,
}: HighlightsSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showAchievementsFade, setShowAchievementsFade] = useState(false);
  const [showVideoFade, setShowVideoFade] = useState(false);

  const currentClip = slideshowClips[currentIndex];

  // Fade-in animations
  useEffect(() => {
    setShowAchievementsFade(false);
    setShowVideoFade(false);

    const achTimer = setTimeout(() => setShowAchievementsFade(true), 0);
    const vidTimer = setTimeout(() => setShowVideoFade(true), 300);

    return () => {
      clearTimeout(achTimer);
      clearTimeout(vidTimer);
    };
  }, []);

  // Apply volume and mute when clip changes
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = volume;
    vid.muted = isMuted;
    void vid.play().catch(() => {});
  }, [currentIndex, volume, isMuted]);

  // Sync React state when user drags native video volume slider
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
      prev === 0 ? slideshowClips.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshowClips.length);
  };

  return (
    <div className="w-full">
      {/* Highlights Title */}
      <div
        className={`absolute top-4 right-4 text-4xl font-bold 
              transition-opacity duration-700 ${
                showVideoFade ? "opacity-100" : "opacity-0"
              }`}
      >
        Highlights
      </div>

      {/* Video Wrapper */}
      <div
        ref={wrapperRef}
        className={`relative md:absolute md:top-20 md:-right-72 ml-4 w-full md:w-[800px] h-56 md:h-[450px]
                rounded-lg shadow-lg overflow-hidden bg-transparent
                transition-opacity duration-700
                ${showVideoFade ? "opacity-100" : "opacity-0"}`}
      >
        <button
          onClick={handlePrev}
          aria-label="Previous clip"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700 z-20"
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
            if (document.fullscreenElement)
              wrapperRef.current?.requestFullscreen();
          }}
        />
        <button
          onClick={handleNext}
          aria-label="Next clip"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700 z-20"
        >
          →
        </button>
      </div>

      {/* Notable Achievements */}
      <div
        className={`mt-5 p-6 rounded-lg shadow-lg  max-w-xl
                              transition-opacity duration-700
                              ${showAchievementsFade ? "opacity-100" : "opacity-0"}`}
        style={{
          transitionDelay: "500ms",
          transitionDuration: "1700ms",
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          {" "}
          <span className="text-cyan-300 font-semibold drop-shadow-[0_0_6px_#00FFFF]">
            Notable Achievements
          </span>{" "}
        </h3>
        <div>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>IGN: XiaoDanny</li>
            <li>UCI Esports Scholarship Athlete 2021-2025</li>
            <li>Game: League of Legends</li>
            <li>
              Maintained Challenger (0.01% NA ranking) while balancing academics
            </li>
            <li>
              Primary shotcaller and leader on multiple semi-professional teams
            </li>
            <li>Led multiple deep runs in high-stakes tournaments</li>
          </ul>
        </div>

        <TypingText
          label="Fun Fact:"
          phrases={FUN_FACTS}
          className="mt-6 -translate-x-0 -translate-y-4"
        />

        {/* Clip Details */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-white">Clip Context:</h3>
        </div>

        {/* Clip Story */}
        <div
          className={`
    mt-4 text-gray-300 transition-opacity duration-700 -translate-y-2
    ${showVideoFade ? "opacity-100" : "opacity-0"}
  `}
          style={{
            transitionDelay: "600ms",
            transitionDuration: "700ms",
          }}
        >
          {currentClip.story}
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
