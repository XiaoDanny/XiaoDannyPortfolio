import { useState, useEffect } from "react";

interface TypingTextProps {
  phrases: string[];
  label?: string; // optional prefix
  className?: string;
}

export default function TypingText({ phrases, label = "", className = "" }: TypingTextProps) {
  const typingSpeed = 100;
  const pauseDuration = 2000;
  const deletingSpeed = 50;

  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  // Helper function to get a random index different from the current one
  const getRandomIndex = (currentIndex: number, length: number): number => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * length);
    } while (randomIndex === currentIndex); // Ensure it's not the same as the current index
    return randomIndex;
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      const nextChar = phrases[currentPhrase].slice(0, displayText.length + 1);
      if (nextChar === displayText) {
        setPhase("pausing");
      } else {
        timeout = setTimeout(() => setDisplayText(nextChar), typingSpeed);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), pauseDuration);
    } else if (phase === "deleting") {
      if (displayText.length === 0) {
        setCurrentPhrase((i) => getRandomIndex(i, phrases.length)); // Choose a random phrase
        setPhase("typing");
      } else {
        timeout = setTimeout(() => setDisplayText((t) => t.slice(0, -1)), deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase, currentPhrase]);

  return (
    <p className={`font-semibold translate-x-5 translate-y-1 ${className}`}>
      {label && (
        <span className="mt-5 text-gray-300">{label}&nbsp;</span>
      )}
      <span className="text-cyan-300 inline-block drop-shadow-[0_0_6px_#00FFFF]">
        {displayText}
      </span>
      <span className="cursor ml-1" />
    </p>
  );
}