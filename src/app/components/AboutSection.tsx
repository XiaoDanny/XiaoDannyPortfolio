"use client";

import TypingText from "./TypingText";
import { TYPING_PHRASES } from "../constants";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 flex flex-col items-start justify-start w-full max-w-5xl mx-auto px-6 relative"
      style={{
        background: 'linear-gradient(135deg, rgba(120, 60, 20, 0.05) 0%, rgba(80, 40, 10, 0.08) 100%)',
      }}
    >
      <div className="absolute top-8 left-6 w-1 h-16 bg-gradient-to-b from-amber-500/60 to-orange-500/40"></div>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-amber-100">About Me</h2>

      <div className="md:-translate-x-5">
        <TypingText label="I'm Daniel Coyle, a" phrases={TYPING_PHRASES} />
      </div>
      
      <p className="mt-6 text-amber-50/90 max-w-2xl leading-relaxed">
        I recently graduated from <span className="font-bold text-amber-200">UC Irvine</span>{" "}
        with a <span className="font-bold text-amber-200">Bachelor&apos;s Degree in Computer Science</span>.
        During my time as a student, I developed a strong passion for solving
        complex problems and building web applications that make a{" "}
        <span className="font-bold text-amber-200">meaningful impact on people&apos;s lives</span>.
      </p>

      <p className="mt-4 text-amber-50/90 max-w-2xl leading-relaxed">
        While at UCI, I competed as a <span className="font-bold text-orange-300">semi-professional esports athlete</span>{" "}
        and worked as a <span className="font-bold text-orange-300">student software developer</span>
        —two roles where I led teams in high-stakes environments that demanded{" "}
        <span className="font-bold text-amber-200">discipline</span>, <span className="font-bold text-amber-200">adaptability</span>, and{" "}
        <span className="font-bold text-amber-200">perseverance</span>. These experiences helped me grow as a{" "}
        <span className="font-bold text-amber-200">leader</span> and contribute to meaningful, team-driven projects.
      </p>

      <p className="mt-4 text-amber-50/90 max-w-2xl leading-relaxed">
        I&apos;m currently seeking full-time software engineering opportunities where I can leverage
        my technical skills and collaborative mindset to build innovative solutions.
      </p>
    </section>
  );
}
