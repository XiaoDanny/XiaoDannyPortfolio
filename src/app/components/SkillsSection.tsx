const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
  frontend: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
  backend: ["Node.js", "Flask", "Express"],
  tools: ["Git", "Docker", "AWS", "Kubernetes", "jMeter"],
  databases: ["SQLite", "PostgreSQL", "MongoDB"],
};

const skillLevels: Record<string, number> = {
  "JavaScript": 95,
  "TypeScript": 90,
  "React": 92,
  "Next.js": 88,
  "Python": 85,
  "Node.js": 87,
};

export default function SkillsSection() {
  return (
    <section 
      id="skills" 
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.08) 0%, rgba(40, 10, 60, 0.12) 100%)',
      }}
    >
      {/* Gaming-style accent lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-500 rotate-45"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <div className="w-3 h-3 bg-cyan-500 rotate-45"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div 
              key={category}
              className="p-4 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-cyan-900/10 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            >
              <h3 className="text-lg font-bold text-purple-300 mb-3 capitalize flex items-center gap-2">
                <span className="text-xs">▶</span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => {
                  const level = skillLevels[skill];
                  return (
                    <div key={skill} className="group relative">
                      <span
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/30 rounded text-purple-100 hover:border-purple-400/60 hover:shadow-md hover:shadow-purple-500/20 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                      {level && (
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" style={{width: `${level}%`}}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
