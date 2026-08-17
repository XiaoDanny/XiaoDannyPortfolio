"use client";
import { useEffect, useRef, useState } from "react";
import TypingText from "./components/TypingText";
import Projects, { FeaturedProjects } from "./components/Projects";
import Experience from "./components/Experience";

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentIndex, setCurrentIndex] = useState(0); // Declare only once
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const slideshowClips = [
    {
      name: "DiveOutplay",
      title: "Dive Outplay",
      story:
        "This match was the lower bracket finals to qualify for the North American Champions League(Professional League). On the verge of elimination, I outplayed the enemy by drawing their pressure, and burning their time and resources while even securing a kill. This allowed my team to secure key objectives across the map.",
    },
    {
      name: "GankOutplay",
      title: "Gank Outplay",
      story:
        "In a really tough series vs the tournament favorites in the upper bracket finals, I baited the enemy mid and jungle callapse and outplayed it to secure a kill and an early game lead",
    },
    {
      name: "GankOutplay2",
      title: "Gank Outplay 2",
      story:
        "Survived and outplayed multiple members of the enemy team securing an early game lead for my team.",
    },
    {
      name: "QuadraKill",
      title: "Quadra Kill",
      story:
        "Secured a Quadra Kill in a crucial teamfight vs the tournament favorites in a high-stakes elimination match.",
    },
    {
      name: "Shockwave",
      title: "Shockwave",
      story:
        "&#39;XiaoDanny Shockwave will find them all!&#39; With our backs against the wall, a perfectly timed ultimate secured victory for UCI Esports in a high-stakes elimination match.",
    },
    {
      name: "TeamfightWin",
      title: "Teamfight Win",
      story:
        "This teamfight was memorable for me because we fell really far behind against the tournament favorites. But with clean teamfight execution, we were able to turn the tide and secure a comeback victory.",
    },
    {
      name: "TeamfightWin2",
      title: "Teamfight Win 2",
      story:
        "One of the most memorable teamfights for me. We competed in the North American Challengers League Open Qualifier and went up against NA’s #1 mid lane prospect, Evolved. With an amazing engage from our support, Kurulean, we clinch a vital series win to take us to the upper bracket finals.",
    },
  ];

  const currentClip = slideshowClips[currentIndex]; // Use the single declaration of currentIndex

  // 1) Re-apply volume and mute when the clip (or play/pause) changes
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = volume;
    vid.muted = isMuted;
    isPlaying ? vid.play().catch(() => {}) : vid.pause();
  }, [currentIndex, isPlaying, volume, isMuted]);

  // 2) Sync React state when the user drags the native <video> volume slider
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

  // Handlers
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
    <div className="relative min-h-screen bg-[#0d0d0f]">
      {/* Main content */}
      <div className="relative z-20 font-sans text-white">
        {/* Header */}
        <header className="fixed top-0 w-full py-5 bg-[#0d0d0f]/80 backdrop-blur-sm z-30 border-b border-white/10">
          <nav className="relative max-w-7xl mx-auto flex justify-center items-center">
            {/* Desktop links */}
            <ul className="hidden md:flex gap-10 text-xs uppercase tracking-widest text-gray-300">
              {["home", "projects", "experience", "beyond"].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="capitalize hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {id}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button
              className="md:hidden px-3 py-2 rounded border border-white/20 text-xs uppercase tracking-widest"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Open menu"
            >
              Menu
            </button>

            {/* mobile menu panel */}
            <div
              className={`md:hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 transform transition-all duration-150 ${
                menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="min-w-[160px] bg-[#0d0d0f] text-white rounded-lg py-2 shadow-lg border border-white/10">
                <ul className="flex flex-col">
                  {["home", "projects", "experience", "beyond"].map((id) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/5"
                      >
                        {id}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </header>

        {/* Sections */}
        <main className="pt-0">
          {/* Home */}
          <section
            id="home"
            className="relative min-h-screen flex flex-col items-center justify-center gap-16 pt-32 pb-16"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6">
              <img
                src="/Images/NewXiaoDannySelfie.jpg"
                alt="Profile"
                className="w-48 h-48 md:w-80 md:h-80 object-cover rounded-full border border-white/15"
              />
              <div className="max-w-md text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Daniel Coyle
                </h1>
                <h2 className="mt-2 text-sm md:text-base uppercase tracking-widest text-gray-400">
                  Full Stack Developer
                </h2>

                <p className="text-gray-300 mt-6 mb-8 text-sm md:text-base leading-relaxed">
                  Hello! I&rsquo;m Daniel, a passionate developer who enjoys{" "}
                  <span className="italic text-white">exploring</span>{" "}
                  new technologies and{" "}
                  <span className="italic text-white">building</span>{" "}
                  impactful web applications. I&rsquo;m excited to share
                  my journey and what motivates me.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <a
                    href="/DanielCoyleResumeSep2025.pdf"
                    download
                    className="border border-white/20 text-white px-6 py-2 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Download CV
                  </a>
                  <a
                    href="mailto:danieljcoyle02@gmail.com"
                    className="border border-white/20 text-white px-6 py-2 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Contact Me
                  </a>
                </div>
                <div className="flex justify-center md:justify-start gap-4 mt-8">
                  <a
                    href="https://www.linkedin.com/in/danieljcoyle/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/Images/Image2.svg"
                      alt="LinkedIn"
                      className="w-9 h-9 grayscale opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </a>
                  <a
                    href="https://github.com/XiaoDanny"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/Images/Image3.svg"
                      alt="GitHub"
                      className="w-9 h-9 grayscale opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full px-6">
              <p className="mb-5 text-center text-[10px] uppercase tracking-[0.32em] text-gray-500">
                Featured 
              </p>
              <FeaturedProjects />
            </div>
          </section>
          {/* Divider */}
          <div className="flex justify-center my-8 px-6">
            <div className="w-24 h-px bg-white/15" />
          </div>

          {/* About Me Section */}
          <section
            id="projects"
            className="py-16 w-full max-w-6xl mx-auto px-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Projects</h2>
            <Projects />
          </section>

          {/* ── Experience Section ── */}
          <section
            id="experience"
            className="py-16 w-full max-w-6xl mx-auto px-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Experience</h2>
            <Experience />
          </section>

          {/* ── Beyond the Code Section ── */}
          <section
            id="beyond"
            className="py-16 max-w-6xl mx-auto px-6 border-t border-white/10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Beyond the Code</h2>
            <p className="text-gray-400 text-sm md:text-base mb-8 max-w-2xl">
              Outside of software, I competed as a semi-professional League of
              Legends player. It&#39;s where I first learned to lead under
              pressure—a mindset that now carries directly into how I approach
              engineering.
            </p>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Video Carousel */}
              <div
                ref={wrapperRef}
                className="relative w-full lg:w-[560px] h-56 md:h-[380px] rounded-lg overflow-hidden bg-black/40 border border-white/10 flex-shrink-0"
              >
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/60 border border-white/20 text-white w-8 h-8 rounded-full hover:bg-white hover:text-black transition-colors z-20"
                >
                  ←
                </button>
                <video
                  key={currentClip.name}
                  ref={videoRef}
                  src={`/Clips/${currentClip.name}.mp4`}
                  controls
                  className="w-full h-full object-contain z-10"
                  onEnded={() => {
                    handleVideoEnded();
                    if (document.fullscreenElement)
                      wrapperRef.current?.requestFullscreen();
                  }}
                />
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 border border-white/20 text-white w-8 h-8 rounded-full hover:bg-white hover:text-black transition-colors z-20"
                >
                  →
                </button>
              </div>

              {/* Achievements */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-widest">
                  Notable Achievements
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                  <li>IGN: XiaoDanny</li>
                  <li>UCI Esports Scholarship Athlete 2021-2025</li>
                  <li>Game: League of Legends</li>
                  <li>
                    Maintained Challenger (0.01% NA ranking) while balancing
                    academics
                  </li>
                  <li>
                    Primary shotcaller and leader on multiple
                    semi-professional teams
                  </li>
                  <li>Led multiple deep runs in high-stakes tournaments</li>
                </ul>

                <TypingText
                  label="Fun Fact:"
                  phrases={[
                    `I play midlane`,
                    `My current favorite champion is Taliyah`,
                    `My favorite pro-player is Zeka`,
                    `I beat T1 Faker in soloq`,
                    `I'm a Bjergsen fan`,
                    `I peaked 1100 LP in NA soloq`,
                  ]}
                  className="mt-6"
                />

                <h4 className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
                  Clip Context
                </h4>
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">
                  {currentClip.story}
                </p>
              </div>
            </div>
          </section>
        </main>
        {/* Footer */}
        <footer className="relative mt-12 p-4 text-gray-400 text-sm">
          Designed and Developed by <br />
          <span className="text-white font-semibold">Daniel Coyle</span>
        </footer>
      </div>
    </div>
  );
}
