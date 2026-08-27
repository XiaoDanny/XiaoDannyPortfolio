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

const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);

function FeaturedProjectCard({ project }: { project: ProjectEntry }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <article
      onClick={() => setShowDetails((current) => !current)}
      className="group relative aspect-[25/17] w-full cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-[#131316] md:cursor-default"
    >
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#131316]" />
      )}

      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-6 transition-opacity duration-300 group-hover:opacity-0 ${
          showDetails ? "opacity-0" : ""
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">{project.date}</p>
        <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-end gap-4 bg-black/[0.85] p-6 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 ${
          showDetails ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-gray-300">{project.description}</p>

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
              <img src="/Images/Image3.svg" alt="" className="h-4 w-4 invert" />
            </a>
          )}
          {project.demoUrl === "#" && project.githubUrl === "#" && (
            <span className="text-xs uppercase tracking-widest text-gray-500">Coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}

function AllProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <article className="group relative mx-auto flex h-[300px] w-full max-w-[342px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06] sm:h-[320px] lg:h-[320px] lg:max-w-[380px]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>

        {project.githubUrl && project.githubUrl !== "#" && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} on GitHub`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <img src="/Images/Image3.svg" alt="" className="h-4 w-4 invert" />
          </a>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-300">{project.description}</p>

      <p className="mt-4 text-xs text-gray-500">{project.date}</p>

      {/* Flexible spacer keeps skills pinned to the bottom regardless of description length */}
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          {showAllProjects ? "All" : "Featured"}
        </h2>
        <button
          type="button"
          onClick={() => setShowAllProjects((current) => !current)}
          className="shrink-0 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-xs uppercase tracking-[0.24em] text-gray-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {showAllProjects ? "View Featured" : "View All Projects"}
        </button>
      </div>

      {showAllProjects ? (
        <div className="grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <AllProjectCard key={project.name} project={project} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.name} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
