// app/page.tsx
"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const starsRef = useRef<HTMLDivElement>(null);
  const stars2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (starsRef.current) {
        starsRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      if (stars2Ref.current) {
        stars2Ref.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Radial gradient base layer */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0a0f2c] via-[#0d1b2a] to-black z-0" />

      {/* Stars — above gradient (z-10), but below content (z-20) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div ref={starsRef} className="stars" />
        <div ref={stars2Ref} className="stars2" />
      </div>

      {/* Your content */}
      <div className="relative z-20 font-sans text-white">
        <header className="fixed top-0 w-full p-4 bg-transparent z-30">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-lg font-bold"></div>
            <ul className="flex gap-6 text-sm sm:text-base">
              {["home", "about", "experience", "projects"].map((id) => (
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

        <main className="pt-0">
          <section
            id="home"
            className="min-h-screen flex items-center justify-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <img
                src="/Images/Image1.jpg"
                alt="Profile"
                className="w-96 h-96 border-2 border-white object-cover shadow-lg"
              />
              <div className="max-w-md text-center md:text-left">
                <h1 className="text-7xl font-bold  translate-x-5 -translate-y-6">
                  Daniel Coyle
                </h1>

                <h2 className="text-4xl font-bold cosmic-gradient translate-x-5 -translate-y-3">
                  Fullstack Developer
                </h2>

                <p className="text-gray-300 mb-6 translate-x-5">
                Hello! I’m Daniel, a passionate developer who enjoys {' '}
                  <span className="text-cyan-300 font-semibold drop-shadow-[0_0_6px_#00FFFF]">
                    exploring
                  </span>
                  {' '} new technologies and {' '} 
                  <span className="text-cyan-300 font-semibold drop-shadow-[0_0_6px_#00FFFF]">
                    building
                  </span>
                  {' '} impactful web applications. I’m excited to share a bit about my journey and what drives me.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
  <a
    href="/Images/Daniel_Coyle_Resume.pdf"
    download
    className="hover:scale-110 transition-transform duration-200
      bg-cyan-400 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-[0_0_8px_rgb(14,188,212)] translate-x-5"
  >
    Download CV
  </a>
  <a
    href="mailto:danieljcoyle02@gmail.com"
    className="hover:scale-110 transition-transform duration-200
      bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 hover:shadow-[0_0_8px_rgb(139,0,255)] translate-x-5"
  >
    Contact Info
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
                    href="https://github.com/daniel-coyle"
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

          {[
            { id: "about", label: "About Me" },
            { id: "experience", label: "Experience" },
            { id: "projects", label: "Projects" },
          ].map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="min-h-screen flex flex-col justify-center items-center"
            >
              <h2 className="text-3xl font-bold mb-4">{sec.label}</h2>
              <p className="text-gray-300">
                This is the {sec.id} section where you can{" "}
                {sec.label.toLowerCase()}.
              </p>
            </section>
          ))}
        </main>

        <footer className="w-full p-4 text-center">
          <p className="text-sm text-gray-300">
            © 2025 Daniel Coyle. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
