"use client";
import { useState } from "react";
import Link from "next/link";
import Projects, { FeaturedProjects } from "./components/Projects";
import Experience from "./components/Experience";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                  Software Engineer
                </h2>

                <p className="mt-6 mb-8 text-sm leading-relaxed text-gray-300 md:text-base">
                  Hi there! I&rsquo;m Daniel, a Computer Science graduate from UC Irvine.
                  I&rsquo;m excited to share my journey and some of the things I&rsquo;ve been building.
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
