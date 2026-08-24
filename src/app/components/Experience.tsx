interface ExperienceEntry {
  company: string;
  role: string;
  date: string;
  description: string;
  website: string;
  image: string;
}

const experience: ExperienceEntry[] = [
{
  company: "Handshake",
  role: "AI QA",
  date: "October–November 2025",
  description:
    "Performed data annotation and evaluation of LLM outputs, collaborating with researchers to improve AI quality, performance, and contextual reliability.",
  website: "https://joinhandshake.com/blog/our-team/introducing-handshake-ai/",
  image: "/Images/Experience/Handshake.png",
},
{
  company: "Calit2",
  role: "Software Engineer",
  date: "March–June 2024",
  description:
    "Developed the Cooling Center Locator, a full-stack web application that helps users locate nearby cooling centers and access heat-safety resources. See Projects for more details.",
  website: "https://calit2.uci.edu/",
  image: "/Images/Experience/Calit2.jpg",
},
{
  company: "UCI Esports",
  role: "Scholarship Athlete",
  date: "March 2022–June 2025",
  description:
    "Competed at a professional level while balancing a rigorous Computer Science course load, developing leadership and communication skills through high-stakes team competition.",
  website: "https://esports.uci.edu/",
  image: "/Images/Experience/UCIesports.png",
},
];

export default function Experience() {
  return (
    <div className="border-t border-white/10">
      {experience.map((entry) => (
        <div
          key={entry.company + entry.role}
          className="grid gap-4 md:grid-cols-[100px_minmax(0,1.1fr)_minmax(0,1.8fr)] md:items-center py-5 border-b border-white/10"
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-gray-500 md:pt-1">
            {entry.date}
          </span>

          <a
            href={entry.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${entry.company} website`}
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-2 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.04] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          >
            <img
              src={entry.image}
              alt={`${entry.company} logo`}
              className="h-10 w-10 rounded-md object-cover border border-white/10 bg-black/20"
            />

            <span className="min-w-0">
              <span className="block text-base font-medium text-white transition-colors group-hover:text-gray-200">
                {entry.company}
              </span>
              <span className="mt-1 block text-sm text-gray-300">{entry.role}</span>
            </span>

            <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-gray-500 transition-colors group-hover:text-gray-300">
              Visit →
            </span>
          </a>

          <p className="text-sm leading-relaxed text-gray-400">
            {entry.description}
          </p>
        </div>
      ))}
    </div>
  );
}
