"use client";
import { useEffect, useRef, useState } from "react";

export interface SpineSection {
  id: string;
  label: string;
}

// A section counts as "reached" once its top has scrolled to within this many px of the
// viewport top — matches how a reader would describe "I'm on this section now".
const ACTIVE_OFFSET = 160;

/** Desktop-only fixed nav: a compact node cluster with a fill that tracks page scroll progress. */
export default function Spine({ sections }: { sections: SpineSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    function update() {
      tickingRef.current = false;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0);

      // Scrolled to (or past) the bottom always counts as reaching the last section, even if
      // that section plus the footer is too short for its own top to cross ACTIVE_OFFSET.
      if (maxScroll > 0 && window.scrollY >= maxScroll - 1) {
        setActiveIndex(sections.length - 1);
        return;
      }

      let current = 0;
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_OFFSET) current = index;
      });
      setActiveIndex(current);
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  function goTo(event: React.MouseEvent, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Section navigation"
      // Content (Container.tsx) centers independently at `50% - 32rem` (half of its own
      // max-w-5xl). This sits a small, fixed gap to the left of that same edge, floored so
      // it can't go off-screen (or collide with content) at the narrow end of the lg
      // breakpoint (~1024px). w-24 comfortably fits the current labels (measured: "Projects"
      // is the widest at ~70px) — widen this if longer labels come back later.
      className="fixed left-[max(1rem,calc(50%-40rem))] top-1/2 z-[9999] hidden w-24 -translate-y-1/2 lg:block"
    >
      <div className="relative flex w-full flex-col gap-8">
        <div className="pointer-events-none absolute right-[5px] top-1.5 bottom-1.5 w-px bg-white/15" />
        <div
          className="pointer-events-none absolute right-[5px] top-1.5 w-px bg-white/80 transition-[height] duration-150 ease-out"
          style={{ height: `calc(${progress * 100}% - 12px)` }}
        />
        {sections.map((section, index) => {
          const isActive = index <= activeIndex;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => goTo(event, section.id)}
              aria-current={index === activeIndex ? "true" : undefined}
              className="group relative flex w-full items-center justify-end gap-3 focus-visible:outline-none"
            >
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {section.label}
              </span>
              <span
                className={`h-[10px] w-[10px] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? "border-white bg-white"
                    : "border-white/30 bg-transparent group-hover:border-white/60"
                }`}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
