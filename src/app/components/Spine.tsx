"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface SpineSection {
  id: string;
  label: string;
}

// A section counts as "reached" once its top has scrolled to within this many px of the
// viewport top — matches how a reader would describe "I'm on this section now".
const ACTIVE_OFFSET = 160;

/** Desktop-only fixed nav: a compact node cluster, exactly one node lit for the current section. */
export default function Spine({ sections }: { sections: SpineSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineInset, setLineInset] = useState({ top: 0, bottom: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    function update() {
      tickingRef.current = false;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

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

  // Measures the first/last dot's actual center so the connector line starts and ends exactly
  // on them — no guessed inset that could overshoot or fall short.
  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      const firstDot = dotRefs.current[0];
      const lastDot = dotRefs.current[sections.length - 1];
      if (!container || !firstDot || !lastDot) return;

      const containerRect = container.getBoundingClientRect();
      const firstRect = firstDot.getBoundingClientRect();
      const lastRect = lastDot.getBoundingClientRect();
      setLineInset({
        top: firstRect.top + firstRect.height / 2 - containerRect.top,
        bottom: containerRect.bottom - (lastRect.top + lastRect.height / 2),
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [sections]);

  function goTo(event: React.MouseEvent, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  }

  return (
    <nav
      aria-label="Section navigation"
      // Right edge sits at the page's literal one-third mark (content, in Container.tsx,
      // starts just after that same mark). w-24 comfortably fits the current labels
      // (measured: "Projects" is the widest at ~70px) — widen this if longer labels return.
      className="fixed left-[calc(33.333%-6rem)] top-1/2 z-[9999] hidden w-24 -translate-y-1/2 lg:block"
    >
      <div ref={containerRef} className="relative flex w-full flex-col gap-8">
        <div
          className="pointer-events-none absolute right-[5px] w-px bg-white/15"
          style={{ top: `${lineInset.top}px`, bottom: `${lineInset.bottom}px` }}
        />
        {sections.map((section, index) => {
          const isActive = index === activeIndex;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => goTo(event, section.id)}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex w-full items-center justify-end gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {section.label}
              </span>
              <span
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                className={`h-[10px] w-[10px] shrink-0 rounded-full border transition-colors ${
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
