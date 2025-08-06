"use client";
import { useEffect, useRef, useState } from "react";
import TypingText from "./components/TypingText";
import Timeline from "./components/Timeline";
export default function Home() {
  const starsRef = useRef<HTMLDivElement>(null);
  const stars2Ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showJourneyText, setShowJourneyText] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showAchievementsFade, setShowAchievementsFade] = useState(false);
  const [showVideoFade, setShowVideoFade] = useState(false);
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

  // Control playback and mute on state or clip change

  // Parallax effect for stars layers
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (starsRef.current) {
        starsRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
      if (stars2Ref.current) {
        stars2Ref.current.style.transform = `translateY(${scrollY * 0.55}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showHighlights) {
      // Reset both off
      setShowAchievementsFade(false);
      setShowVideoFade(false);

      // 1) Fade in Achievements immediately
      const achTimer = setTimeout(() => setShowAchievementsFade(true), 0);
      // 2) Then fade in Video after 300ms
      const vidTimer = setTimeout(() => setShowVideoFade(true), 300);

      return () => {
        clearTimeout(achTimer);
        clearTimeout(vidTimer);
      };
    } else {
      // Reset on hide
      setShowAchievementsFade(false);
      setShowVideoFade(false);
    }
  }, [showHighlights]);

  // …after your showHighlights useEffect…

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
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 linear-gradient z-0" />

      {/* Parallax stars layers */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div ref={starsRef} className="stars" />
        <div ref={stars2Ref} className="stars2" />
      </div>

      {/* Main content */}
      <div className="relative z-20 font-sans text-white">
        {/* Header */}
        <header className="fixed top-0 w-full p-4 bg-transparent z-30">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-lg font-bold" />
            <ul className="flex gap-6 text-sm sm:text-base">
              {["home", "about", "experience"].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="capitalize hover:text-blue-500 transition-colors"
                  >
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Sections */}
        <main className="pt-0">
          {/* Home */}
          <section
            id="home"
            className="relative min-h-screen flex items-center justify-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <img
                src="/Images/Image1.jpg"
                alt="Profile"
                className="w-96 h-96 border-2 border-white object-cover shadow-lg"
              />
              <div className="max-w-md text-center md:text-left">
                <h1 className="text-7xl font-bold translate-x-5 -translate-y-6">
                  Daniel Coyle
                </h1>
                <h2 className="text-4xl font-bold cosmic-gradient translate-x-5 -translate-y-3">
                  Fullstack Developer
                </h2>
                <p className="text-gray-300 mb-6 translate-x-5">
                  Hello! I’m Daniel, a passionate developer who enjoys{" "}
                  <span className="text-cyan-300 font-semibold drop-shadow-[0_0_6px_#00FFFF]">
                    exploring
                  </span>{" "}
                  new technologies and{" "}
                  <span className="text-cyan-300 font-semibold drop-shadow-[0_0_6px_#00FFFF]">
                    building
                  </span>{" "}
                  impactful web applications. I’m excited to share
                  my journey and what motivates me.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <a
                    href="/Images/Daniel_Coyle_Resume.pdf"
                    download
                    className="hover:scale-110 transition-transform duration-200 bg-cyan-400 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-[0_0_8px_rgb(14,188,212)] translate-x-5"
                  >
                    Download CV
                  </a>
                  <a
                    href="mailto:danieljcoyle02@gmail.com"
                    className="hover:scale-110 transition-transform duration-200 bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 hover:shadow-[0_0_8px_rgb(139,0,255)] translate-x-5"
                  >
                    Contact Me
                  </a>
                </div>
                <div className="flex gap-4 mt-6 translate-x-5">
                  <a
                    href="https://www.linkedin.com/in/danieljcoyle/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/Images/Image2.svg"
                      alt="LinkedIn"
                      className="w-12 h-12 hover:opacity-80 transition-opacity"
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
                      className="w-12 h-12 hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* Divider */}
          <div className="flex justify-center my-8">
            <div className="w-40 h-2 bg-cyan-400 rounded transform -translate-x-96 -translate-y-36 rotate-[-45deg]" />
          </div>

          {/* About Me / Highlights Section */}
          <section
            id="about"
            className="py-0 flex flex-col items-start justify-start w-full max-w-6xl mx-auto px-6 relative transform -translate-y-20 -translate-x-28"
          >
            <h2 className="text-3xl font-bold mb-4 ">About Me</h2>

            {!showHighlights ? (
              <>
                {/* Typing Text */}
                <div className="-translate-x-5">
                  <TypingText
                    label="I&#39;m Daniel Coyle, a"
                    phrases={[
                      "Coder",
                      "Gamer",
                      "Runner",
                      "Lifter",
                      "Player",
                      "Thinker",
                    ]}
                  />
                </div>
                {/* Paragraphs */}
                <p className="mt-5 text-gray-300 max-w-xl">
                  I recently graduated from{" "}
                  <span className="font-bold">
                    UC Irvine
                  </span>{" "}
                  with a{" "}
                  <span className="font-bold">
                   Bachelor{"'"}s Degree in Computer Science
                  </span>
                  . During my time as a student, I developed a strong
                  passion for solving complex problems and building web
                  applications that make a{" "}
                  <span className="font-bold">
                    meaningful impact on people’s lives
                  </span>
                  . While at UCI, I competed as a{" "}
                  <span className="font-bold">
                    semi-professional esports athlete and worked as a{" "}
                  </span>
                  
                  <span className="font-bold">
                    student software developer
                  </span>
                  —two roles where I{" "}
                  led
                  teams in high-stakes environments that demanded
                  <span className="font-bold">
                  {" "}discpline
                  </span>
                  ,{" "}
                  <span className="font-bold">
                    adaptability
                  </span>
                  , and{" "}
                  <span className="font-bold">
                    perserverence
                  </span>
                  . These experiences helped me grow as a{" "}
                  <span className="font-bold">
                    leader
                  </span>
                  , apply my skills in real-world settings, and contribute to
                  meaningful, team-driven projects. I’m eager to continue
                  developing innovative software alongside talented engineers
                  who share the same drive for impact.
                </p>
                <p className="mt-5 text-gray-300 max-w-xl">
                  When I&#39;m not coding, you can find me gaming with friends,
                  working out, watching good movies/shows, or playing piano.
                </p>

                {/* Explore My Competitive Journey */}
                <div className="text-center mt-8">
                  <button
                    onClick={() => {
                      setShowHighlights(true); // Show highlights on click
                      setShowJourneyText(false); // Hide the journey text
                    }}
                    className="text-4xl font-bold cosmic-gradient cursor-pointer hover:scale-105 transition-transform"
                  >
                    Explore My Competitive Journey
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full">
                {/* Highlights Title */}
                <div
                  className={`absolute top-0 right-5 ml-4 text-4xl font-bold cosmic-gradient transition-opacity duration-700 ${
                    showVideoFade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Highlights
                </div>

                {/* Video Wrapper (fades in) */}
                <div
                  ref={wrapperRef}
                  className={`absolute top-20 -right-72 ml-4 w-[800px] h-[450px]
                rounded-lg shadow-lg overflow-visible bg-transparent
                transition-opacity duration-700
                ${showVideoFade ? "opacity-100" : "opacity-0"}`}
                >
                  <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700 z-20"
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
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700 z-20"
                  >
                    →
                  </button>
                </div>

                {/* Notable Achievements (fades in after) */}
                <div
                  className={`mt-5 p-6 rounded-lg shadow-lg  max-w-xl
                              transition-opacity duration-700
                              ${
                                showAchievementsFade
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
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
                        Maintained Challenger (0.01% NA ranking) while balancing
                        academics
                      </li>
                      <li>
                        Primary shotcaller and leader on multiple
                        semi-professional teams
                      </li>
                      <li>Led multiple deep runs in high-stakes tournaments</li>
                    </ul>
                  </div>

                  <TypingText
                    label="Fun Fact:"
                    phrases={[
                      `I play midlane`,
                      `My current favorite champion is Taliyah`,
                      `My favorite pro-player is Zeka`,
                      `I beat T1 Faker in soloq`,
                      `I'm a Bjergsen fan`,
                      `I peaked 1100 LP in NA soloq`,
                      `My flash is on F`,
                      `I'm a RoseThorn fan`,
                      `I'm a Kurulean fan`,
                      `I'm a Strompest fan`,
                      `I'm a Gorica Fan`,
                      `I'm a Joey fan`,
                    ]}
                    className="mt-6 -translate-x-0 -translate-y-4"
                  />
                  {/* Clip Details */}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-white">
                      Clip Context:
                    </h3>
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
                    onClick={() => {
                      setShowHighlights(false); // Hide video and achievements
                      setShowJourneyText(true); // Show original paragraphs
                    }}
                    className="mt-6 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ── Experience & Projects Section ── */}
          <h2 id="experience" className="text-4xl font-bold mb-4 text-center">
            Experience
          </h2>

          <div className="max-w-6xl mx-auto px-6">
            <Timeline />
          </div>
        </main>
        {/* Footer */}
        <footer className="absolute bottom-0 left-0 p-4 text-gray-400 text-sm translate-y-16">
          Designed and Developed by <br />
          <span className="text-white font-semibold">Daniel Coyle</span>
        </footer>
      </div>
    </div>
  );
}
