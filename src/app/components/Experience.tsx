// Experience.tsx
// Placeholder entries — replace with real work history.
interface ExperienceEntry {
  company: string;
  role: string;
  date: string;
  stack: string;
}

const experience: ExperienceEntry[] = [
  {
    company: "Company Name",
    role: "Software Engineer Intern",
    date: "2024 - 2025",
    stack: "React / Node / TypeScript",
  },
  {
    company: "Company Name",
    role: "Frontend Developer Intern",
    date: "2023 - 2024",
    stack: "JavaScript / React",
  },
  {
    company: "Company Name",
    role: "Student Software Developer",
    date: "2022 - 2023",
    stack: "Python / SQL",
  },
];

export default function Experience() {
  return (
    <div className="border-t border-white/10">
      {experience.map((entry) => (
        <div
          key={entry.company + entry.role}
          className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-6 py-5 border-b border-white/10"
        >
          <span className="text-sm text-gray-500 md:w-32 shrink-0">
            {entry.date}
          </span>
          <span className="font-medium text-white md:w-56 shrink-0">
            {entry.company}
          </span>
          <span className="text-gray-300 md:flex-1">{entry.role}</span>
          <span className="text-xs uppercase tracking-widest text-gray-500">
            {entry.stack}
          </span>
        </div>
      ))}
    </div>
  );
}
