"use client";
import { useState } from "react";
import Link from "next/link";
import Projects, { FeaturedProjects } from "./components/Projects";
import Experience from "./components/Experience";

const photos = [
  { src: "/Images/BeyondTheCode/Daniel1.jpg", alt: "Daniel Coyle", objectPosition: "center 35%" },
  { src: "/Images/BeyondTheCode/Gym.jpg", alt: "Daniel Coyle at the gym", objectPosition: "center 30%" },
  { src: "/Images/BeyondTheCode/Daniel2.jpg", alt: "Daniel Coyle at Yellowstone National Park", objectPosition: "52% 55%" },
  { src: "/Images/BeyondTheCode/LookingUp.jpg", alt: "Daniel Coyle, UC Irvine Class of 2025", objectPosition: "30% 30%" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const navLinks = [
    { id: "home", href: "#home" },
    { id: "projects", href: "#projects" },
    { id: "experience", href: "#experience" },
    { id: "beyond", href: "/beyond" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0d0d0f]">
      {/* Main content */}
      <div className="relative z-20 font-sans text-white">
        {/* Header */}
        <header className="fixed top-0 w-full py-5 bg-[#0d0d0f]/80 backdrop-blur-sm z-30 border-b border-white/10">
          <nav className="relative max-w-7xl mx-auto flex justify-center items-center">
            {/* Desktop links */}
            <ul className="hidden md:flex gap-10 text-xs uppercase tracking-widest text-gray-300 items-center">
              {navLinks.map(({ id, href }) =>
                id === "beyond" ? (
                  <li key={id}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1 capitalize border border-white/20 rounded-full px-3 py-1 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {id}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ) : (
                  <li key={id}>
                    <a
                      href={href}
                      className="capitalize hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      {id}
                    </a>
                  </li>
                ),
              )}
            </ul>

            {/* Mobile hamburger */}
            <button
              className="md:hidden px-3 py-2 rounded border border-white/20 text-xs uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              Menu
            </button>

            {/* mobile menu panel */}
            <div
              id="mobile-navigation"
              className={`md:hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 transform transition-all duration-150 ${
                menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="min-w-[160px] bg-[#0d0d0f] text-white rounded-lg py-2 shadow-lg border border-white/10">
                <ul className="flex flex-col">
                  {navLinks.map(({ id, href }) =>
                    id === "beyond" ? (
                      <li key={id}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10"
                        >
                          {id}
                          <span aria-hidden="true">↗</span>
                        </Link>
                      </li>
                    ) : (
                      <li key={id}>
                        <a
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10"
                        >
                          {id}
                        </a>
                      </li>
                    ),
                  )}
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
            className="relative scroll-mt-20 min-h-[85vh] flex flex-col items-center justify-center gap-16 pt-32 pb-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6">
              <div className="max-w-md text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Daniel Coyle
                </h1>
                <h2 className="mt-2 text-sm md:text-base uppercase tracking-widest text-gray-400">
                  Software Engineer
                </h2>

                <p className="mt-6 mb-8 text-sm leading-relaxed text-gray-300 md:text-base">
                  Hi there! I&rsquo;m Daniel, a Computer Science graduate from UC Irvine.
                  I&rsquo;m excited to share my journey and some of the things I&rsquo;ve been building.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <a
                    href="/DanielCoyleResumeSep2025.pdf"
                    download
                    className="inline-flex h-10 items-center gap-3 rounded-md border border-white/20 px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Resume
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M12 11v6m0 0-3-3m3 3 3-3" />
                    </svg>
                  </a>
                  <a
                    href="mailto:danieljcoyle02@gmail.com"
                    aria-label="Email Daniel Coyle"
                    title="Email Daniel Coyle"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/danieljcoyle/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/Images/Image2.svg"
                      alt="LinkedIn"
                      className="h-9 w-9 grayscale opacity-70 transition-opacity hover:opacity-100"
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
                      className="h-9 w-9 grayscale opacity-70 transition-opacity hover:opacity-100"
                    />
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center" aria-label="Photo carousel">
                <button
                  type="button"
                  onClick={() => setActivePhoto((current) => (current + 1) % photos.length)}
                  aria-label={`Show next photo. Currently showing photo ${activePhoto + 1} of ${photos.length}`}
                  className="relative h-64 w-52 cursor-pointer appearance-none border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0d0f] sm:h-80 sm:w-64 md:h-[27rem] md:w-[22rem]"
                >
                  {photos.map((photo, photoIndex) => {
                    const position = (photoIndex - activePhoto + photos.length) % photos.length;
                    const positionClasses = [
                      "z-30 translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100",
                      "z-20 translate-x-7 translate-y-3 rotate-3 scale-[.94] opacity-80",
                      "z-10 -translate-x-7 translate-y-6 -rotate-3 scale-[.88] opacity-55",
                      "z-0 translate-x-12 translate-y-9 rotate-6 scale-[.82] opacity-35",
                    ];

                    return (
                      <img
                        key={photo.src}
                        src={photo.src}
                        alt={photo.alt}
                        style={{ objectPosition: photo.objectPosition }}
                        className={`absolute inset-0 h-64 w-52 rounded-xl object-cover shadow-2xl sm:h-80 sm:w-64 md:h-[27rem] md:w-[22rem] ${positionClasses[position]}`}
                      />
                    );
                  })}
                </button>
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
          <div className="flex justify-center my-6 px-6">
            <div className="w-24 h-px bg-white/15" />
          </div>

          {/* About Me Section */}
          <section
            id="projects"
            className="scroll-mt-20 py-12 w-full max-w-6xl mx-auto px-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Projects</h2>
            <Projects />
          </section>

          {/* ── Experience Section ── */}
          <section
            id="experience"
            className="scroll-mt-20 py-12 w-full max-w-6xl mx-auto px-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Experience</h2>
            <Experience />
          </section>

          {/* ── Beyond the Code CTA ── */}
          <div className="py-12 px-6 text-center">
            <p className="text-gray-400 text-sm md:text-base mb-4">
              Want to see what I&apos;m up to outside of code?
            </p>
            <Link
              href="/beyond"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Beyond the Code <span aria-hidden="true">→</span>
            </Link>
          </div>
        </main>
        {/* Footer */}
        <div className="flex justify-center my-6 px-6">
          <div className="w-24 h-px bg-white/15" />
        </div>
        <footer className="py-12 px-6 text-center text-sm text-gray-400">
          <p>Designed &amp; Developed by</p>
          <p className="mt-1 font-semibold text-white">Daniel Coyle</p>
        </footer>
      </div>
    </div>
  );
}
