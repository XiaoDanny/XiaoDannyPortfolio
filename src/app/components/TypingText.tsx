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
    if (length <= 1) return 0;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * length);
    } while (randomIndex === currentIndex); // Ensure it's not the same as the current index
    return randomIndex;
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phrases.length === 0) return;

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
  }, [displayText, phase, currentPhrase, phrases]);

  return (
    <p className={`font-medium ${className}`}>
      {label && (
        <span className="text-gray-400">{label}&nbsp;</span>
      )}
      <span className="italic text-white">
        {displayText}
      </span>
      <span className="cursor ml-1" />
    </p>
  );
}