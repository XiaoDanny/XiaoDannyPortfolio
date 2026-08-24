// Projects.tsx
"use client";
import { useState } from "react";

interface ProjectEntry {
  name: string;
  description: string;
  date: string;
  technologies: string[];
  featured: boolean;
  // TODO: replace with real links/screenshot once available
  image?: string;
  demoUrl: string;
  githubUrl: string;
}

const projects: ProjectEntry[] = [
  {
    name: "Alpha Ring",
    description:
      "An open-source mod for Halo: The Master Chief Collection that enables local split-screen co-op on PC, with support for multiple players, controller profiles, and customizable gameplay settings.",
    date: "July 2026 - Present",
    technologies: [],
    featured: true,
    demoUrl: "https://www.youtube.com/watch?v=IRZPdAJFkc8",
    githubUrl: "https://github.com/kirklandsig/AlphaRing",
    image: "/Images/Projects/AlphaRing.png",
  },
  {
    name: "SQL Duel",
    description:
      "A competitive SQL practice platform where users solve interview-style SQL challenges solo or compete against each other in real-time 1v1 duels.",
    date: "Coming Soon",
    technologies: ["TypeScript", "React", "Vite", "Python", "FastAPI", "SQLite"],
    featured: true,
    demoUrl: "#",
    githubUrl: "#",
  },
  {
  name: "Rank Tracker",
  description:
    "Customizable, real-time leaderboard powered by the Riot Games API for tracking and comparing player performance.",
  date: "March 2025 · Irvine Hacks",
  technologies: ["Python", "Flask", "React", "Riot Games API", "SQLite"],
  featured: false,
  demoUrl: "#",
  githubUrl: "https://github.com/XiaoDanny/Rank-Tracker",
},
  {
    name: "Fabflix",
    description:
      "Movie catalog application with user authentication, enabling users to search, browse, and securely check out movies.",
    date: "Fall 2024 · UCI Capstone",
    technologies: ["Java", "JavaScript", "SQL", "AWS", "Docker", "Kubernetes"],
    featured: false,
    demoUrl: "#",
    githubUrl: "https://github.com/XiaoDanny/Fabflix-Movie-DB",
  },
  {
    name: "Cooling Center Locator",
    description:
      "Locates nearby cooling centers based on the user’s location and provides helpful tips to stay cool during heatwaves.",
    date: "March–June 2024 · Calit2",
    technologies: ["JavaScript", "React", "GoogleMaps API"],
    featured: false,
    demoUrl: "#",
    githubUrl: "https://github.com/XiaoDanny/Cooling-Center-Locator",
  },
];

const featuredProjects = projects.filter((project) => project.featured);
const nonFeaturedProjects = projects.filter((project) => !project.featured);

export function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = featuredProjects.length;

  const goTo = (index: number) => setActiveIndex((index + total) % total);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* fade the peeking side cards into the background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#0d0d0f] to-transparent md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#0d0d0f] to-transparent md:w-20" />

      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        aria-label="Previous project"
        className="absolute left-1 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-3 md:h-11 md:w-11"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        aria-label="Next project"
        className="absolute right-1 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-3 md:h-11 md:w-11"
      >
        →
      </button>

      <div className="overflow-hidden px-[8%]">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(calc(-${activeIndex * 84}% - ${activeIndex}rem))` }}
        >
          {featuredProjects.map((project, index) => (
            <div
              key={project.name}
              className="group relative aspect-[4/3] w-[84%] shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#131316] transition-opacity duration-500 sm:aspect-[16/9]"
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-[#17171b] to-[#0d0d0f]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.6),transparent_40%)]" />
                </div>
              )}

              {/* always-visible label */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent p-5 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">
                  {project.date}
                </p>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {project.name}
                </h3>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end gap-4 bg-black/80 p-6 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
  <p className="text-sm leading-relaxed text-gray-300 md:line-clamp-3">
    {project.description}
  </p>

  <div className="flex items-center gap-3">
                  {project.demoUrl !== "#" && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white px-5 py-2 text-xs font-medium uppercase tracking-widest text-black transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Demo
                  </a>
                  )}
                  {project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} on GitHub`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <img
                      src="/Images/Image3.svg"
                      alt=""
                      className="h-4 w-4 invert"
                    />
                  </a>
                  )}
                  {project.demoUrl === "#" && project.githubUrl === "#" && (
                    <span className="text-xs uppercase tracking-widest text-gray-500">Coming soon</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {featuredProjects.map((project, index) => (
          <button
            type="button"
            key={project.name}
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.name}`}
            className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {nonFeaturedProjects.map((project) => (
        <div
          key={project.name}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]"
        >
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>

          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            {project.description}
          </p>

          <p className="mt-4 text-xs text-gray-500">{project.date}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.githubUrl && project.githubUrl !== "#" && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} on GitHub`}
              className="absolute bottom-5 right-5 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur transition-all duration-300 hover:bg-white hover:text-black group-hover:translate-y-0 group-hover:opacity-100 md:opacity-0"
            >
              <img
                src="/Images/Image3.svg"
                alt=""
                className="h-4 w-4 invert"
              />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
