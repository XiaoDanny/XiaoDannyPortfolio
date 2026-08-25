"use client";
import { useState } from "react";

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

// ─── Layout — all positions auto-derive from ENTRIES.length ──────────────────
const CW      = 580;  // canvas width
const CX      = 290;  // trunk center x
const TOP_PAD = 80;   // canopy space above first node
const SPACING = 172;  // vertical gap between nodes
const BOT_PAD = 130;  // roots space below last node
const BRANCH  = 96;   // horizontal arm from trunk to branch tip
const CARD_W  = 174;  // card width
const NODE_R  = 7;    // node dot radius

// Canvas height grows automatically with each new entry
const CH = TOP_PAD + ENTRIES.length * SPACING + BOT_PAD;

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

// ─── Main component ───────────────────────────────────────────────────────────
export default function Experience() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex justify-center overflow-x-auto scrollbar-hidden">
      <div className="relative flex-shrink-0" style={{ width: CW, height: CH }}>

        {/* Tree illustration */}
        <TreeSVG active={active} />

        {ENTRIES.map((entry, i) => {
          const nodeY    = TOP_PAD + i * SPACING;
          const side     = i % 2 === 0 ? "right" : "left";
          const isActive = active === i;
          const color    = ACCENT[entry.type];
          const glow     = ACCENT_GLOW[entry.type];

          const cardLeft = side === "right"
            ? CX + BRANCH + 14
            : CX - BRANCH - 14 - CARD_W;

          return (
            <div key={entry.company}>

              {/* Node — click target + visual dot */}
              <button
                onClick={() => setActive(isActive ? null : i)}
                className="absolute z-20 flex items-center justify-center rounded-full
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                           focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115]"
                style={{ left: CX - 16, top: nodeY - 16, width: 32, height: 32 }}
                aria-label={isActive ? `Collapse ${entry.company}` : `Expand ${entry.company}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width:      NODE_R * 2,
                    height:     NODE_R * 2,
                    background: isActive ? color : "rgba(255,255,255,0.28)",
                    boxShadow:  isActive ? `0 0 14px 5px ${glow}` : "none",
                  }}
                />
              </button>

              {/* Entry card */}
              <div
                className={`absolute z-10 transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-55 hover:opacity-85"
                }`}
                style={{ top: nodeY - 30, left: cardLeft, width: CARD_W }}
              >
                <button
                  onClick={() => setActive(isActive ? null : i)}
                  className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
                    isActive
                      ? "border-white/20 bg-[#161b24]/90 backdrop-blur-sm shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
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

// ─── Tree SVG ─────────────────────────────────────────────────────────────────
interface TreeSVGProps { active: number | null; }

function TreeSVG({ active }: TreeSVGProps) {
  const trunkBase = CH - BOT_PAD * 0.45;
  const trunkTop  = TOP_PAD - 14;
  const th        = trunkBase - trunkTop;

  // ── Wide tapered trunk — 28px at base, 4px at top ──
  const trunk = [
    `M ${CX - 14},${trunkBase}`,
    `C ${CX - 11},${trunkBase - th * 0.28} ${CX - 5},${trunkBase - th * 0.62} ${CX - 2},${trunkTop}`,
    `L ${CX + 2},${trunkTop}`,
    `C ${CX + 5},${trunkBase - th * 0.62} ${CX + 11},${trunkBase - th * 0.28} ${CX + 14},${trunkBase}`,
    "Z",
  ].join(" ");

  // ── Roots — spread outward and DOWNWARD along the ground ──
  const rb = trunkBase;
  const roots = [
    `M ${CX-8},${rb}    C ${CX-26},${rb+10} ${CX-60},${rb+18} ${CX-96},${rb+20}`,
    `M ${CX+8},${rb}    C ${CX+26},${rb+10} ${CX+60},${rb+18} ${CX+96},${rb+20}`,
    `M ${CX-5},${rb+6}  C ${CX-18},${rb+14} ${CX-42},${rb+20} ${CX-68},${rb+22}`,
    `M ${CX+5},${rb+6}  C ${CX+18},${rb+14} ${CX+42},${rb+20} ${CX+68},${rb+22}`,
    `M ${CX-3},${rb+12} C ${CX-8}, ${rb+18} ${CX-22},${rb+22} ${CX-36},${rb+24}`,
    `M ${CX+3},${rb+12} C ${CX+8}, ${rb+18} ${CX+22},${rb+22} ${CX+36},${rb+24}`,
  ];

  // ── Canopy: ellipse blob + upward branch lines going into it ──
  const ct = trunkTop + 2;
  const blobCY = ct - 24;
  const canopyBranches = [
    `M ${CX},${ct+12} C ${CX-30},${ct+2}  ${CX-54},${ct-6}  ${CX-60},${ct-16}`,
    `M ${CX},${ct+12} C ${CX+30},${ct+2}  ${CX+54},${ct-6}  ${CX+60},${ct-16}`,
    `M ${CX},${ct+6}  C ${CX-16},${ct-2}  ${CX-30},${ct-12} ${CX-36},${ct-26}`,
    `M ${CX},${ct+6}  C ${CX+16},${ct-2}  ${CX+30},${ct-12} ${CX+36},${ct-26}`,
    `M ${CX},${ct+4}  C ${CX-6}, ${ct-10} ${CX-10},${ct-22} ${CX-8}, ${ct-34}`,
    `M ${CX},${ct+4}  C ${CX+6}, ${ct-10} ${CX+10},${ct-22} ${CX+8}, ${ct-34}`,
  ];

  // ── Filler branches between nodes — simple upward arcs with Y-forks ──
  const fillers: string[] = [];
  for (let i = 0; i < ENTRIES.length - 1; i++) {
    const midY = (TOP_PAD + i * SPACING + TOP_PAD + (i + 1) * SPACING) / 2;
    const tipY = midY - 36;
    fillers.push(`M ${CX},${midY}   C ${CX-16},${midY-18} ${CX-36},${midY-28} ${CX-46},${tipY}`);
    fillers.push(`M ${CX-46},${tipY} C ${CX-52},${tipY-12} ${CX-58},${tipY-14} ${CX-56},${tipY-6}`);
    fillers.push(`M ${CX-46},${tipY} C ${CX-40},${tipY-12} ${CX-36},${tipY-14} ${CX-34},${tipY-6}`);
    fillers.push(`M ${CX},${midY}   C ${CX+16},${midY-18} ${CX+36},${midY-28} ${CX+46},${tipY}`);
    fillers.push(`M ${CX+46},${tipY} C ${CX+52},${tipY-12} ${CX+58},${tipY-14} ${CX+56},${tipY-6}`);
    fillers.push(`M ${CX+46},${tipY} C ${CX+40},${tipY-12} ${CX+36},${tipY-14} ${CX+34},${tipY-6}`);
  }

  // ── Entry branch sub-twigs — angle clearly upward ──
  const twigs: string[] = [];
  for (let i = 0; i < ENTRIES.length; i++) {
    const nodeY = TOP_PAD + i * SPACING;
    const dir   = i % 2 === 0 ? 1 : -1;
    const endX  = CX + dir * BRANCH;
    const endY  = nodeY - 16;
    twigs.push(`M ${endX},${endY} C ${endX+dir*10},${endY-16} ${endX+dir*20},${endY-20} ${endX+dir*22},${endY-14}`);
    twigs.push(`M ${endX},${endY} C ${endX+dir*8}, ${endY-4}  ${endX+dir*18},${endY-6}  ${endX+dir*20},${endY-14}`);
  }

  // ── Leaf dots — tight clusters only at tips ──
  const leaves: [number, number, number][] = [
    [CX-60, ct-16, 1.8], [CX-48, ct-26, 2.0], [CX-32, ct-34, 2.2],
    [CX-12, ct-38, 2.0], [CX,    ct-42, 2.4], [CX+12, ct-38, 2.0],
    [CX+32, ct-34, 2.2], [CX+48, ct-26, 2.0], [CX+60, ct-16, 1.8],
    [CX-20, ct-28, 1.6], [CX+20, ct-28, 1.6], [CX-6,  ct-30, 1.8], [CX+6, ct-30, 1.8],
    ...ENTRIES.flatMap((_, i): [number, number, number][] => {
      const endY = TOP_PAD + i * SPACING - 16;
      const d    = i % 2 === 0 ? 1 : -1;
      const ex   = CX + d * BRANCH;
      return [[ex+d*22, endY-14, 1.8], [ex+d*20, endY-6, 1.6], [ex+d*20, endY+2, 1.5]];
    }),
    ...Array.from({ length: ENTRIES.length - 1 }, (_, i): [number, number, number][] => {
      const midY = (TOP_PAD + i * SPACING + TOP_PAD + (i+1) * SPACING) / 2;
      const ty   = midY - 38;
      return [[CX-56, ty, 1.5], [CX-44, ty-6, 1.4], [CX+56, ty, 1.5], [CX+44, ty-6, 1.4]];
    }).flat(),
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${CW} ${CH}`}
      aria-hidden="true"
    >
      {/* Roots — go down and out, like surface roots */}
      {roots.map((d, i) => (
        <path key={`r${i}`} d={d} fill="none"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth={i < 2 ? "1.8" : i < 4 ? "1.3" : "1.0"}
          strokeLinecap="round"
        />
      ))}

      {/* Trunk */}
      <path d={trunk} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />

      {/* Knot bumps */}
      {ENTRIES.map((_, i) => {
        const nodeY = TOP_PAD + i * SPACING;
        const prop  = (nodeY - trunkTop) / th;
        const rx    = Math.round(14 - prop * 12) + 3;
        return <ellipse key={`k${i}`} cx={CX} cy={nodeY} rx={rx} ry={4} fill="rgba(255,255,255,0.05)" />;
      })}

      {/* Filler branches */}
      {fillers.map((d, i) => (
        <path key={`f${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.9" strokeLinecap="round" />
      ))}

      {/* Entry branches */}
      {ENTRIES.map((_, i) => {
        const nodeY    = TOP_PAD + i * SPACING;
        const dir      = i % 2 === 0 ? 1 : -1;
        const endX     = CX + dir * BRANCH;
        const endY     = nodeY - 16;
        const isActive = active === i;
        const d = `M ${CX},${nodeY} C ${CX+dir*42},${nodeY-28} ${endX-dir*12},${endY-8} ${endX},${endY}`;
        return (
          <path key={`b${i}`} d={d} fill="none"
            stroke={isActive ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.16)"}
            strokeWidth={isActive ? 2.2 : 1.8}
            strokeLinecap="round"
          />
        );
      })}

      {/* Sub-twigs */}
      {twigs.map((d, i) => (
        <path key={`t${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.9" strokeLinecap="round" />
      ))}

      {/* Canopy: translucent blob + branches */}
      <ellipse cx={CX} cy={blobCY} rx={74} ry={36}
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      {canopyBranches.map((d, i) => (
        <path key={`c${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.1" strokeLinecap="round" />
      ))}

      {/* Leaf dots */}
      {leaves.map(([lx, ly, r], i) => (
        <circle key={`l${i}`} cx={lx} cy={ly} r={r} fill="rgba(255,255,255,0.12)" />
      ))}
    </svg>
  );
}
