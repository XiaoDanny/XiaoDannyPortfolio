import Timeline from "./Timeline";

export default function ExperienceSection() {
  return (
    <section 
      className="py-20 relative"
      style={{
        background: 'linear-gradient(135deg, rgba(20, 40, 60, 0.08) 0%, rgba(10, 30, 50, 0.12) 100%)',
      }}
    >
      {/* Blueprint grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(100, 150, 200, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 150, 200, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-12">
          <div className="h-px w-16 bg-blue-400/40"></div>
          <h2 id="experience" className="text-3xl md:text-4xl font-semibold mx-4 text-center font-mono text-blue-100">
            Experience
          </h2>
          <div className="h-px w-16 bg-blue-400/40"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
