// Timeline.tsx
"use client";
import { useEffect, useRef, useState } from "react";

interface ProjectEntry {
  name: string;
  role: string;
  description: string;
  date: string;
  technologies: string[];
}

const projects: ProjectEntry[] = [
  {
    name: "Explorer",
    role: "Fullstack Developer",
    description:
      "Tracks and visualizes user travel history by automatically marking visited locations over time.",
    date: "June 2025 - Present",
    technologies: ["JavaScript", "React", "Mapbox"],
  },
  {
    name: "League Rank Tracker",
    role: "Team Lead @Irvine Hacks Hackathon",
    description:
      "Allows users to create and share custom leaderboards, add friends, and compete/race eachother by tracking real-time ranking updates through an interactive dashboard.",
    date: "March 2025",
    technologies: ["JavaScript", "Python", "React", "Flask", "SQLite"],
  },
  {
    name: "Fabflix",
    role: "Student Software Engineer",
    description:
    "Simulates a real-world e-commerce platform with user authentication, enabling users to search, browse, and securely check out movies.",
    date: "September–December 2024",
    technologies: ["Java", "SQL", "Tomcat", "AWS", "Docker", "Kubernetes", "jMeter"],
  },
  {
    name: "Cooling Center Locator",
    role: "Software Engineer @The California Instutute of Techology",
    description:
      "Locates nearby cooling centers based on the user’s location and provides helpful tips to stay cool during heatwaves.",
    date: "March-June 2024",
    technologies: ["JavaScript", "React", "GoogleMaps API"],
  },
  {
    name: "UCI Search Engine",
    role: "Student Software Engineer",
    description:
      "A web crawler and search system designed to extract and organize content from UCI’s official website.",
    date: "March-June 2023",
    technologies: ["React", "Node", "Python", "Flash", "OpenAI API"],
  },
];

function useInView(
    ref: React.RefObject<HTMLDivElement | null>,
    rootMargin = "0px"
  ): boolean {
    const [inView, setInView] = useState(false);
  
    useEffect(() => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { rootMargin }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [ref, rootMargin]);
  
    return inView;
  }

export default function Timeline() {
  return (
    <section className="relative w-full py-16 pb-24">
      {/* Center neon line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-cyan-400 w-1 h-full z-0" />

      <div className="space-y-32 relative z-10">
        {projects.map((entry, idx) => (
          <TimelineItem
            key={idx}
            entry={entry}
            side={idx % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({
    entry,
    side,
  }: {
    entry: ProjectEntry;
    side: "left" | "right";
  }) {
    // Now ref is HTMLDivElement | null and matches
    const ref = useRef<HTMLDivElement>(null)
    const visible = useInView(ref, "-100px");


  const isLeft = side === "left";

  // container positioning
  const containerClasses = `relative w-[45%] max-w-md ${
    isLeft ? "ml-auto" : "mr-auto"
  }`;

  // content wrapper — handles fade-in, text-align and padding
  const contentClasses = `
    transition-all duration-700 ease-out
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
    ${isLeft ? "text-left pr-4" : "text-right pl-4"}
  `;

  const arrowClasses = `absolute top-2 ${
    isLeft ? "-right-1" : "-left-1"
  } w-3 h-3 rotate-45 bg-cyan-400 z-10`;

  const datePosition = `absolute top-2 text-sm text-gray-400 ${
    isLeft
      ? "right-[calc(50%+1.5rem)] text-left"
      : "left-[calc(50%+1.5rem)] text-right"
  }`;

  return (
    <div className="relative flex items-start">
      <div ref={ref} className={containerClasses}>


        <div className={contentClasses}>
          <h3 className="text-2xl font-semibold text-white">{entry.name}</h3>
          <p className="text-cyan-300 text-sm font-medium mt-1">
            {entry.role}
          </p>
          <p className="mt-2 text-gray-300">{entry.description}</p>

          {/* tighter, inward‐aligned tech badges */}
          <div
            className={`mt-3 flex flex-wrap gap-1 ${
              isLeft ? "justify-start " : "justify-end"
            }`}
          >
            {entry.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-block px-1 py-0.5 text-xs font-medium rounded-full bg-cyan-700 text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* center dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-2">
        <div className="w-4 h-4 bg-cyan-300 rounded-full border-2 border-white" />
      </div>

      {/* date */}
      <div className={datePosition}>{entry.date}</div>
    </div>
  );
}
