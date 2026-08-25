"use client";
import { useState } from "react";
import Link from "next/link";
import Projects from "./components/Projects";
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

  const CONTAINER = "mx-auto w-full max-w-6xl px-6";

  return (
    <div className="bg-canvas relative min-h-screen">
      {/* Main content */}
      <div className="relative z-20 font-sans text-white">
        {/* Header */}
        <header className="fixed top-0 z-[9999] w-full border-b border-subtle bg-[#0f1115] py-4 isolate">
          <nav className={`relative flex items-center justify-center ${CONTAINER}`}>
            {/* Desktop links */}
            <ul className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-gray-300 md:flex">
              {navLinks.map(({ id, href }) =>
                id === "beyond" ? (
                  <li key={id}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 hover:border-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
              className="md:hidden rounded border border-white/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
              <div className="bg-surface min-w-[160px] rounded-lg border border-subtle py-2 text-white shadow-lg">
                <ul className="flex flex-col">
                  {navLinks.map(({ id, href }) =>
                    id === "beyond" ? (
                      <li key={id}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-1 px-4 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10"
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
                          className="block px-4 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10"
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
            className="relative scroll-mt-20 flex min-h-[60vh] flex-col justify-start gap-6 pt-28 pb-0 md:min-h-[64vh] md:pt-32"
          >
            <div className={`flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center lg:gap-6 ${CONTAINER}`}>
              <div className="w-full text-center lg:w-auto lg:text-left">
                <h1 className="whitespace-nowrap text-[2.35rem] font-semibold tracking-[-0.05em] text-white md:text-[3.1rem] xl:text-[3.8rem]">
                  Hi <span aria-hidden="true">👋</span>, I&rsquo;m Daniel
                </h1>

                <p className="mx-auto mt-6 max-w-sm text-base font-medium leading-none text-gray-200 md:text-[1.1rem] lg:mx-0">
                  I&rsquo;m
                </p>

                <p className="mx-auto mt-2 inline-flex max-w-sm items-center gap-2 text-lg font-semibold leading-tight text-white md:text-[1.45rem] lg:mx-0">
                  <span>a recent CS graduate from UC Irvine</span>
                  <img src="/Images/Experience/UCIesports.png" alt="UCI logo" className="h-5 w-5 object-contain md:h-6 md:w-6" />
                </p>

                <p className="mx-auto mt-2 max-w-sm text-base font-medium leading-tight text-gray-200 md:text-[1.1rem] lg:mx-0">
                  a Software Engineer @ TBD
                </p>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-400 md:text-base lg:mx-0">
                  currently based in Birmingham, Alabama <span aria-hidden="true">📍</span> <span aria-hidden="true">🇺🇸</span> <span aria-hidden="true">🇹🇼</span>
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
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

              <div className="relative z-0 flex shrink-0 justify-center">
                <div className="flex flex-col items-center gap-3" aria-label="Photo carousel">
                  <button
                    type="button"
                    onClick={() => setActivePhoto((current) => (current + 1) % photos.length)}
                    aria-label={`Show next photo. Currently showing photo ${activePhoto + 1} of ${photos.length}`}
                    className="relative h-[260px] w-[186px] cursor-pointer appearance-none border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0f1115] md:h-[288px] md:w-[206px]"
                  >
                    {photos.map((photo, photoIndex) => {
                      const position = (photoIndex - activePhoto + photos.length) % photos.length;
                      const positionStyles = [
                        { transform: "translate(0px, 0px) rotate(-1.5deg)",  zIndex: 40, opacity: 1 },
                        { transform: "translate(10px, 6px) rotate(4deg)",    zIndex: 30, opacity: 0.92 },
                        { transform: "translate(20px, 12px) rotate(9deg)",   zIndex: 20, opacity: 0.72 },
                        { transform: "translate(30px, 18px) rotate(13.5deg)",zIndex: 10, opacity: 0.48 },
                      ];
                      const { transform, zIndex, opacity } = positionStyles[position];

                      return (
                        <div
                          key={photo.src}
                          style={{ transform, zIndex, opacity }}
                          className="absolute inset-0 bg-[#f2ede6] px-[10px] pt-[10px] pb-[36px] shadow-[0_8px_32px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
                        >
                          <div className="h-full w-full overflow-hidden">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              style={{ objectPosition: photo.objectPosition }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </button>
                </div>
              </div>
            </div>

          </section>
          {/* Projects Section */}
          <section
            id="projects"
            className={`scroll-mt-20 pt-1 pb-12 ${CONTAINER}`}
          >
            <Projects />
          </section>

          {/* ── Experience Section ── */}
          <section
            id="experience"
            className={`scroll-mt-20 py-12 ${CONTAINER}`}
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
