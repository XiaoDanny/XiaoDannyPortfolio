"use client";
import { useEffect, useRef, useState } from "react";

// ─── To add a new experience, push an object to ENTRIES ──────────────────────
// Order: newest first (top of tree) → oldest last (near roots)
// type: "work" | "education" | "other"  — controls node accent color

type EntryType = "work" | "education" | "other";

interface Entry {
  company:     string;
  role:        string;
  date:        string;
  description: string;
  website:     string;
  image:       string;
  type:        EntryType;
}

const ENTRIES: Entry[] = [
  {
    company:     "Handshake",
    role:        "AI QA",
    date:        "Oct – Nov 2025",
    description: "Performed data annotation and evaluation of LLM outputs, collaborating with researchers to improve AI quality, performance, and contextual reliability.",
    website:     "https://joinhandshake.com/blog/our-team/introducing-handshake-ai/",
    image:       "/Images/Experience/Handshake.png",
    type:        "work",
  },
  {
    company:     "Calit2",
    role:        "Software Engineer",
    date:        "Mar – Jun 2024",
    description: "Developed the Cooling Center Locator, a full-stack web app helping users find nearby cooling centers and access heat-safety resources.",
    website:     "https://calit2.uci.edu/",
    image:       "/Images/Experience/Calit2.jpg",
    type:        "work",
  },
  {
    company:     "UCI Esports",
    role:        "Scholarship Athlete",
    date:        "Mar 2022 – Jun 2025",
    description: "Competed professionally while completing a Computer Science degree, developing leadership and communication through high-stakes team competition.",
    website:     "https://esports.uci.edu/",
    image:       "/Images/Experience/UCIesports.png",
    type:        "other",
  },
];

const NODE_R = 7; // node dot radius

// Peak positions on mountainRange.png, as % of the image's width/height, left → right
// (exact tips found by scanning the actual asset for each region's topmost silhouette pixel)
const PEAKS: { x: number; y: number }[] = [
  { x: 15.22, y: 46.15 },
  { x: 34.61, y: 45.59 },
  { x: 47.78, y: 38.99 },
  { x: 68.99, y: 47.93 },
  { x: 87.69, y: 43.46 },
];

// Evenly spread `count` entries across the available peaks, always hitting real tips
function pickPeaks(count: number) {
  if (count <= 1) return [PEAKS[Math.floor(PEAKS.length / 2)]];
  return Array.from({ length: count }, (_, i) => {
    const idx = Math.round((i * (PEAKS.length - 1)) / (count - 1));
    return PEAKS[idx];
  });
}

const ACCENT: Record<EntryType, string> = {
  work:      "rgba(99,102,241,1)",
  education: "rgba(59,130,246,1)",
  other:     "rgba(16,185,129,1)",
};
const ACCENT_GLOW: Record<EntryType, string> = {
  work:      "rgba(99,102,241,0.35)",
  education: "rgba(59,130,246,0.35)",
  other:     "rgba(16,185,129,0.35)",
};

// ─── Mobile — single-column left-rail timeline (avoids the wide tree canvas) ──
function MobileTimeline({
  active,
  setActive,
}: {
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  return (
    <div className="relative lg:hidden">
      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-white/10" />
      <div className="flex flex-col gap-5">
        {ENTRIES.map((entry, i) => {
          const isActive = active === i;
          const color = ACCENT[entry.type];
          const glow = ACCENT_GLOW[entry.type];

          return (
            <div key={entry.company} className="relative flex gap-4">
              <button
                onClick={() => setActive(isActive ? null : i)}
                className="relative z-10 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                           focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115]"
                aria-label={isActive ? `Collapse ${entry.company}` : `Expand ${entry.company}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: NODE_R * 2,
                    height: NODE_R * 2,
                    background: isActive ? color : "rgba(255,255,255,0.28)",
                    boxShadow: isActive ? `0 0 14px 5px ${glow}` : "none",
                  }}
                />
              </button>

              <div className="min-w-0 flex-1 pb-1">
                <button
                  onClick={() => setActive(isActive ? null : i)}
                  className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
                    isActive
                      ? "animate-[experience-pop_300ms_ease-out] border-white/20"
                      : "border-white/10 bg-white/[0.03] active:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={entry.image}
                      alt={entry.company}
                      className="h-8 w-8 flex-shrink-0 rounded-lg object-cover border border-white/10 bg-black/20"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entry.company}</p>
                      <p className="text-[11px] text-gray-400 truncate">{entry.role}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] font-medium" style={{ color }}>{entry.date}</p>
                  {isActive && (
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-400">{entry.description}</p>
                  )}
                </button>
                {isActive && (
                  <a
                    href={entry.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 flex items-center gap-1 px-1 text-[10px] text-gray-500 transition-colors hover:text-white"
                  >
                    Visit site ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Strips the image's own background via flood fill (sampling the actual corner color) so it
// blends seamlessly with whatever sits behind it, instead of showing a mismatched color box
function TransparentImage({ src, className }: { src: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const { data } = imageData;
      const [bgR, bgG, bgB] = [data[0], data[1], data[2]]; // top-left corner = background color
      const isBackground = (i: number) =>
        Math.abs(data[i] - bgR) + Math.abs(data[i + 1] - bgG) + Math.abs(data[i + 2] - bgB) < 30;

      // Flood fill from the border inward so only the connected background is removed
      const visited = new Uint8Array(width * height);
      const stack: number[] = [];
      for (let x = 0; x < width; x++) stack.push(x, x + (height - 1) * width);
      for (let y = 0; y < height; y++) stack.push(y * width, y * width + (width - 1));

      while (stack.length) {
        const p = stack.pop()!;
        if (visited[p]) continue;
        visited[p] = 1;
        const i = p * 4;
        if (!isBackground(i)) continue;
        data[i + 3] = 0;
        const x = p % width;
        const y = (p - x) / width;
        if (x > 0) stack.push(p - 1);
        if (x < width - 1) stack.push(p + 1);
        if (y > 0) stack.push(p - width);
        if (y < height - 1) stack.push(p + width);
      }

      ctx.putImageData(imageData, 0, 0);
    };
  }, [src]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

// ─── Desktop — horizontal mountain range, entries sit on the peaks ────────────
function MountainTimeline({
  active,
  setActive,
}: {
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  // Left → right reads oldest → newest, so reverse the newest-first ENTRIES order
  const timeline = [...ENTRIES].reverse();
  const peaks = pickPeaks(timeline.length);

  return (
    <div className="relative mx-auto mt-20 hidden aspect-[1755/896] w-full lg:block">
      <TransparentImage
        src="/Images/mountainRange.png"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {timeline.map((entry, i) => {
        const originalIndex = ENTRIES.length - 1 - i;
        const isActive       = active === originalIndex;
        const color          = ACCENT[entry.type];
        const { x, y }       = peaks[i];
        const stemHeight     = isActive ? 112 : 44;

        return (
          <div key={entry.company} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            {/* Stem — grows taller & accent-colored when expanded, rooted exactly at the peak tip */}
            <div
              className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 transition-all duration-300"
              style={{ height: stemHeight, background: isActive ? color : "rgba(255,255,255,0.3)" }}
            />

            {/* Invisible click target — the peak itself is the node, no dot needed */}
            <button
              onClick={() => setActive(isActive ? null : originalIndex)}
              className="absolute z-20 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                         focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115]"
              aria-label={isActive ? `Collapse ${entry.company}` : `Expand ${entry.company}`}
            />

            {/* Pill (collapsed) or card (expanded), floating above the stem */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-[bottom] duration-300 ease-out"
              style={{
                bottom: stemHeight + 8,
              }}
            >
              {isActive ? (
                <div className="w-64 animate-[experience-pop_300ms_ease-out] rounded-xl border border-white/20 p-4 text-left">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={entry.image}
                      alt={entry.company}
                      className="h-8 w-8 flex-shrink-0 rounded-lg object-cover border border-white/10 bg-black/20"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entry.company}</p>
                      <p className="text-[11px] text-gray-400 truncate">{entry.role}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] font-medium" style={{ color }}>{entry.date}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-gray-400">{entry.description}</p>
                  <a
                    href={entry.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 transition-colors hover:text-white"
                  >
                    Visit site ↗
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => setActive(originalIndex)}
                  className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-[#131316]/90 px-3 py-1.5 text-[11px] font-medium leading-none text-gray-300 shadow-md transition-colors hover:border-white/25 hover:text-white"
                >
                  <img src={entry.image} alt="" className="h-4 w-4 flex-shrink-0 rounded-full object-cover" />
                  <span>{entry.company}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Experience() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <MobileTimeline active={active} setActive={setActive} />
      <MountainTimeline active={active} setActive={setActive} />
    </>
  );
}
