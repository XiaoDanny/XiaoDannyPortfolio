"use client";
import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import Projects from "./Projects";
import Experience from "./Experience";
import { CONTAINER } from "./Container";
import { type GithubActivity } from "../lib/githubActivity";
import { type LeetcodeActivity, type LeetcodeDay } from "../lib/leetcodeActivity";

const LEETCODE_USER = "XiaoDanny";

const photos = [
  { src: "/Images/BeyondTheCode/Daniel1.jpg", alt: "Daniel Coyle", objectPosition: "center 35%" },
  { src: "/Images/BeyondTheCode/Gym.jpg", alt: "Daniel Coyle at the gym", objectPosition: "center 30%" },
  { src: "/Images/BeyondTheCode/Daniel2.jpg", alt: "Daniel Coyle at Yellowstone National Park", objectPosition: "52% 55%" },
  { src: "/Images/BeyondTheCode/LookingUp.jpg", alt: "Daniel Coyle, UC Irvine Class of 2025", objectPosition: "30% 30%" },
];

/** Photo shown first. Change this src to feature a different photo. */
const FEATURED_PHOTO_SRC = "/Images/BeyondTheCode/Daniel1.jpg";

const STACK_TRANSITION = "transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]";

/** Single vertical rhythm between sections: each owns its bottom gap, none add top padding. */
const SECTION_SPACING = "pb-16";

function PhotoStack() {
  const featuredIndex = Math.max(0, photos.findIndex((photo) => photo.src === FEATURED_PHOTO_SRC));
  const [active, setActive] = useState(featuredIndex);

  return (
    <div className="relative z-0 flex shrink-0 flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setActive((current) => (current + 1) % photos.length)}
        aria-label={`Photo ${active + 1} of ${photos.length}: ${photos[active].alt}. Tap for the next photo.`}
        className={`${STACK_TRANSITION} relative h-[232px] w-[166px] cursor-pointer appearance-none overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] md:h-[256px] md:w-[183px] md:hover:scale-[1.02]`}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            aria-hidden={index !== active}
            className={`${STACK_TRANSITION} absolute inset-0 ${index === active ? "opacity-100" : "opacity-0"}`}
          >
            <NextImage
              src={photo.src}
              alt={index === active ? photo.alt : ""}
              fill
              sizes="206px"
              style={{ objectPosition: photo.objectPosition }}
              className="object-cover"
            />
          </div>
        ))}
      </button>

      <div className="flex items-center gap-1" role="tablist" aria-label="Choose a photo">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Show photo ${index + 1}: ${photo.alt}`}
            onClick={() => setActive(index)}
            className="group cursor-pointer p-1.5 focus-visible:outline-none"
          >
            <span
              className={`${STACK_TRANSITION} block h-1.5 w-1.5 rounded-full ${
                index === active
                  ? "bg-white/75"
                  : "bg-white/20 group-hover:bg-white/40"
              } group-focus-visible:ring-2 group-focus-visible:ring-white/60 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--background)]`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Inline flag icons so flags render as pictures (Windows falls back to plain "US"/"TW" text for emoji flags)
function UsFlagIcon({ "aria-label": ariaLabel }: { "aria-label": string }) {
  return (
    <svg viewBox="0 0 20 14" width="16" height="12" role="img" aria-label={ariaLabel} className="shrink-0 rounded-[2px]">
      <rect width="20" height="14" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#fff" />
      ))}
      <rect width="8" height="7" fill="#3C3B6E" />
    </svg>
  );
}

function TwFlagIcon({ "aria-label": ariaLabel }: { "aria-label": string }) {
  return (
    <svg viewBox="0 0 20 14" width="16" height="12" role="img" aria-label={ariaLabel} className="shrink-0 rounded-[2px]">
      <rect width="20" height="14" fill="#FE0000" />
      <rect width="10" height="7" fill="#000095" />
      <circle cx="5" cy="3.5" r="2.1" fill="#fff" />
      <circle cx="5" cy="3.5" r="1" fill="#000095" />
    </svg>
  );
}

// Strips the flat white background from a logo via flood fill, leaving only the artwork (like an emoji with no backing box)
function TransparentLogo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const { data } = imageData;
      const isNearWhite = (i: number) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235;

      // Flood fill from the border inward so only the connected background is
      // removed, leaving any white artwork (e.g. lettering) inside the logo intact
      const visited = new Uint8Array(width * height);
      const stack: number[] = [];
      for (let x = 0; x < width; x++) stack.push(x, x + (height - 1) * width);
      for (let y = 0; y < height; y++) stack.push(y * width, y * width + (width - 1));

      while (stack.length) {
        const p = stack.pop()!;
        if (visited[p]) continue;
        visited[p] = 1;
        const i = p * 4;
        if (!isNearWhite(i)) continue;
        data[i + 3] = 0;
        const x = p % width;
        const y = (p - x) / width;
        if (x > 0) stack.push(p - 1);
        if (x < width - 1) stack.push(p + 1);
        if (y > 0) stack.push(p - width);
        if (y < height - 1) stack.push(p + width);
      }

      ctx.putImageData(imageData, 0, 0);
    };
  }, [src]);

  return <canvas ref={canvasRef} role="img" aria-label={alt} className={className} />;
}

const RACE_TEXTS = [
  // The Lord of the Rings
  "A wizard is never late. Nor is he early; he arrives precisely when he means to.",
  "All we have to decide is what to do with the time that is given to us.",

  // The Dark Knight Trilogy
  "You either die a hero, or you live long enough to see yourself become the villain.",
  "It's not who I am underneath, but what I do that defines me.",
  "You think darkness is your ally, but you merely adopted the dark. I was born in it.",

  // Star Trek
  "To boldly go where no man has gone before.",
  "I have been and always shall be your friend.",

  // DC
  "Sometimes you have to take a leap of faith first. The trust part comes later.",

  // Marvel
  "We may not be able to protect the Earth, but you can be damn well sure we'll avenge it.",
  "You could not live with your own failure. Where did that bring you? Back to me.",
  "With great power comes great responsibility.",
  "If you're nothing without the suit, then you shouldn't have it.",

  // Kung Fu Panda
  "Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.",
];

const LATEST_PIANO_VIDEO: { id: string; views: string } | null = null;

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Reshuffles, swapping the first slot if it would repeat the last sentence of the
// previous bag, so cycling never produces an immediate back-to-back repeat at the seam
function shuffleNextBag(array: string[], avoidFirst: string): string[] {
  const shuffled = shuffle(array);
  if (shuffled.length > 1 && shuffled[0] === avoidFirst) {
    const swapIndex = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
  }
  return shuffled;
}

function TypeRacerWidget() {
  const [raceText, setRaceText] = useState(RACE_TEXTS[0]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedTime, setFinishedTime] = useState<number | null>(null);
  const [siteRecord, setSiteRecord] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const [bag, setBag] = useState<string[]>(RACE_TEXTS);
  const [bagIndex, setBagIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const shuffled = shuffle(RACE_TEXTS);
    setBag(shuffled);
    setBagIndex(0);
    setRaceText(shuffled[0]);
  }, []);

  useEffect(() => {
    fetch("/api/beyond-stats")
      .then((response) => response.json())
      .then((stats: { sentenceRecords?: Record<string, number> }) => setSiteRecord(stats.sentenceRecords?.[raceText] ?? 100))
      .catch(() => undefined);
  }, [raceText]);

  useEffect(() => {
    if (!startedAt || finishedTime !== null) return;
    const interval = window.setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 50);
    return () => window.clearInterval(interval);
  }, [startedAt, finishedTime]);

  function handleChange(value: string) {
    if (value.length > raceText.length || finishedTime !== null) return;
    if (!startedAt && value) setStartedAt(Date.now());
    setTyped(value);
    if (value === raceText && startedAt) {
      const time = (Date.now() - startedAt) / 1000;
      setElapsed(time);
      setFinishedTime(time);
      setNewRecord(time < siteRecord);
      fetch("/api/beyond-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "race", sentence: raceText, time }),
      })
        .then((response) => response.json())
        .then((stats: { sentenceRecords?: Record<string, number> }) => {
          setSiteRecord(stats.sentenceRecords?.[raceText] ?? 100);
        })
        .catch(() => undefined);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      resetRace();
    }
  }

  function resetRace() {
    setTyped("");
    setStartedAt(null);
    setFinishedTime(null);
    setElapsed(0);
    setNewRecord(false);
    inputRef.current?.focus();
  }

  function nextSentence() {
    const nextIndex = bagIndex + 1;
    if (nextIndex < bag.length) {
      setBagIndex(nextIndex);
      setRaceText(bag[nextIndex]);
    } else {
      const freshBag = shuffleNextBag(RACE_TEXTS, bag[bagIndex]);
      setBag(freshBag);
      setBagIndex(0);
      setRaceText(freshBag[0]);
    }
    setTyped("");
    setStartedAt(null);
    setFinishedTime(null);
    setElapsed(0);
    setSiteRecord(100);
    setNewRecord(false);
  }

  return (
    <div className="bg-canvas relative flex min-h-[220px] flex-col rounded-xl border border-subtle p-3 text-left sm:min-h-[260px] sm:p-4">
      <button
        type="button"
        onClick={nextSentence}
        aria-label="Skip to the next sentence"
        title="Next Sentence"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
          <path d="M20 5v5h-5M20 10a8 8 0 1 0 2 5.3" />
        </svg>
      </button>
      <div className="flex min-h-[64px] items-center pr-8 sm:min-h-[88px] sm:pr-10">
        <div className="break-words whitespace-pre-wrap font-mono text-xs leading-relaxed tracking-wide text-gray-300 sm:text-sm">
          {raceText.split("").map((character, index) => {
            const typedCharacter = typed[index];
            const isCurrent = index === typed.length && isFocused && finishedTime === null;
            const color = typedCharacter === undefined
              ? "text-gray-500"
              : typedCharacter === character
                ? "text-white"
                : "text-red-400";
            return <span key={`${character}-${index}`} className={`${color} transition-colors duration-100 ${isCurrent ? "border-l border-white pl-px" : ""}`}>{character}</span>;
          })}
        </div>
      </div>
      <div className="mt-2 flex items-center sm:mt-0 sm:flex-1">
        <input
        ref={inputRef}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={(event) => event.preventDefault()}
        onDrop={(event) => event.preventDefault()}
        value={
  finishedTime === null
    ? typed
    : newRecord
    ? `New record: ${finishedTime.toFixed(2)}s! Click to race again.`
    : `Finished in ${finishedTime.toFixed(2)}s. Click to race again.`
}
        onFocus={() => {
          setIsFocused(true);
          if (finishedTime !== null) resetRace();
        }}
        onBlur={() => setIsFocused(false)}
        readOnly={finishedTime !== null}
        aria-label="TypeRacer input"
        placeholder="Start typing here..."
        className="w-full cursor-text rounded-md border border-subtle bg-transparent px-2.5 py-1.5 text-xs font-mono text-white outline-none transition-colors placeholder:text-gray-600 focus:border-white/40 disabled:opacity-60 sm:px-3 sm:py-2 sm:text-sm"
        />
      </div>
      <div className="mt-2 flex h-6 items-center justify-between text-[10px] uppercase tracking-[0.1em] text-gray-400 sm:mt-0 sm:h-8 sm:text-[11px] sm:tracking-[0.13em]">
        {isFocused && finishedTime === null && <><span className="text-sm font-semibold tracking-normal text-gray-300 sm:text-base">{elapsed.toFixed(2)}</span><span>Tab to restart</span></>}
      </div>
      <div className="h-10 sm:h-12">
        {finishedTime !== null && (
        <div className="animate-[vote-confirm_220ms_ease-out] pt-1 text-[10px] uppercase tracking-[0.13em] text-gray-500">
          <p className="mt-2">Site Record: <strong className="font-medium text-gray-300">{siteRecord.toFixed(2)}</strong></p>
        </div>
        )}
      </div>
    </div>
  );
}

function ClickMeWidget() {
  const [clicks, setClicks] = useState<number | null>(null);
  const [sessionClicks, setSessionClicks] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    fetch("/api/beyond-stats")
      .then((response) => response.json())
      .then((stats: { clicks: number }) => setClicks(stats.clicks))
      .catch(() => setClicks(0));
  }, []);

  function handleClick() {
    setIsPressed(true);
    window.setTimeout(() => setIsPressed(false), 240);
    setClicks((count) => (count ?? 0) + 1);
    setSessionClicks((count) => count + 1);
    fetch("/api/beyond-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "click" }),
    })
      .then((response) => response.json())
      .then((stats: { clicks: number }) => setClicks(stats.clicks))
      .catch(() => undefined);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      aria-label="Click Me counter"
      className={`bg-canvas relative flex h-full min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border border-strong p-4 text-center text-white outline-none transition-transform duration-150 hover:border-white/45 focus-visible:ring-2 focus-visible:ring-white ${isPressed ? "animate-[click-pop_240ms_ease-out]" : ""}`}
    >
      <p className="text-4xl font-semibold tracking-wide text-white md:text-5xl">
        {clicks === null ? "--" : clicks.toLocaleString()}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white">Click me</p>
      <p className="mt-5 text-xs text-gray-400">you&apos;ve clicked {sessionClicks} time{sessionClicks === 1 ? "" : "s"}</p>
    </div>
  );
}

function CommitIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M4 12h5M15 12h5" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.5 5.3 18.5 5.6 18.5 5.6c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

// Purely presentational — every value it renders comes in as props, so the data
// source (static snapshot today, a live fetch later) can change without touching this.
function ActivityWidget({ github, leetcode }: { github: GithubActivity; leetcode: LeetcodeActivity }) {
  const [view, setView] = useState<"github" | "leetcode">("github");

  return (
    <div className="col-span-2 flex flex-col lg:col-span-2">
      {/* Same height as the "Hear Me Play" label row, so this card's top edge lines up with the video's. */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
          {view === "github" ? "Recent Commits" : "LeetCode Progress"}
        </span>
        <button
          type="button"
          onClick={() => setView((current) => (current === "github" ? "leetcode" : "github"))}
          aria-label={`Swap to ${view === "github" ? "LeetCode" : "GitHub"} view`}
          className="inline-flex items-center gap-1 text-[10px] uppercase leading-none tracking-[0.18em] text-gray-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
            <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Swap
        </button>
      </div>

      <div className="bg-canvas flex h-full min-h-[220px] flex-1 flex-col rounded-xl border border-subtle p-4 text-left">
        {view === "github" ? <CommitsView {...github} /> : <LeetcodeView {...leetcode} />}
      </div>
    </div>
  );
}

function CommitsView({ commits, languages, languageTimeframeLabel }: GithubActivity) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CommitIcon />
          <h3 className="text-sm font-semibold text-white">Recent Commits</h3>
        </div>
        <a
          href="https://github.com/XiaoDanny"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub profile"
          title="GitHub"
          className="text-gray-500 transition-colors hover:text-white"
        >
          <GithubIcon />
        </a>
      </div>

      <ul className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-hidden">
        {commits.map((commit) => (
          <li key={commit.hash}>
            <a
              href={`${commit.repoUrl}/commit/${commit.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-md px-1 py-1 text-xs transition-colors hover:bg-white/5"
            >
              <p className="min-w-0 truncate text-gray-300 group-hover:text-white">
                <span className="font-semibold text-white">{commit.repoName}</span>
                <span className="text-gray-600"> · </span>
                <span className="truncate">{commit.message}</span>
              </p>
              <span className="shrink-0 whitespace-nowrap text-[10px] tabular-nums">
                <span className="text-emerald-400/80">+{commit.additions}</span>{" "}
                <span className="text-red-400/70">-{commit.deletions}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {languages.length > 0 && (
        <div className="mt-auto border-t border-subtle pt-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">{languageTimeframeLabel}</p>
          <div className="mt-2 space-y-1.5">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="w-[68px] shrink-0 truncate text-gray-300">{lang.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white/70" style={{ width: `${lang.pct}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right tabular-nums text-gray-500">{lang.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function LeetcodeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.02-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

// LeetCode's own ramp: unfilled cells stay near-canvas, activity climbs through green.
const HEATMAP_LEVELS = [
  "rgba(255,255,255,0.07)",
  "rgba(45,122,62,0.55)",
  "rgba(45,150,70,0.75)",
  "rgba(56,190,90,0.9)",
  "rgb(74,222,110)",
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function heatmapLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function LeetcodeView({
  totalSolved,
  totalQuestions,
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal,
  totalSubmissions,
  submissionsPastYear,
  maxStreak,
  currentStreak,
  calendar,
}: LeetcodeActivity) {
  // Pad the head so every column is a full Sun–Sat week, matching LeetCode's grid.
  const leadingBlanks = calendar.length > 0 ? new Date(`${calendar[0].date}T00:00:00Z`).getUTCDay() : 0;
  const cells: (LeetcodeDay | null)[] = [...Array<null>(leadingBlanks).fill(null), ...calendar];
  const weeks: (LeetcodeDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Group weeks into months so each label can center over its own block of columns.
  const monthGroups: { label: string; weeks: (LeetcodeDay | null)[][] }[] = [];
  for (const week of weeks) {
    const firstDay = week.find((day): day is LeetcodeDay => day !== null);
    const label = firstDay ? MONTH_LABELS[Number(firstDay.date.slice(5, 7)) - 1] : "";
    const current = monthGroups[monthGroups.length - 1];
    if (current && current.label === label) current.weeks.push(week);
    else monthGroups.push({ label, weeks: [week] });
  }

  const difficulties = [
    { label: "Easy", solved: easySolved, total: easyTotal, color: "rgb(56,189,248)" },
    { label: "Medium", solved: mediumSolved, total: mediumTotal, color: "rgb(251,191,36)" },
    { label: "Hard", solved: hardSolved, total: hardTotal, color: "rgb(248,113,113)" },
  ];

  const solvedPct = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  const ringRadius = 34;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <div className="relative grid h-full min-h-0 grid-rows-2">
      <a
        href={`https://leetcode.com/u/${LEETCODE_USER}/`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open LeetCode profile"
        title="LeetCode"
        className="absolute right-0 top-0 z-10 text-gray-400 transition-colors hover:text-white"
      >
        <LeetcodeIcon />
      </a>

      {/* Top half — solved ring, difficulty progress, streak totals */}
      <div className="flex min-h-0 items-center justify-center gap-4">
        <div className="relative h-[78px] w-[78px] shrink-0">
          <svg viewBox="0 0 78 78" className="h-full w-full -rotate-90">
            <circle cx="39" cy="39" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="39"
              cy="39"
              r={ringRadius}
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - solvedPct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold leading-none text-white">{totalSolved}</span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.14em] text-gray-400">Solved</span>
          </div>
        </div>

        <div className="shrink-0 space-y-1.5">
          {difficulties.map((difficulty) => (
            <div key={difficulty.label} className="flex items-center gap-2">
              <span className="w-[42px] shrink-0 text-[9px] font-semibold" style={{ color: difficulty.color }}>
                {difficulty.label}
              </span>
              <div className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${difficulty.total > 0 ? (difficulty.solved / difficulty.total) * 100 : 0}%`,
                    background: difficulty.color,
                  }}
                />
              </div>
              <span className="w-[56px] shrink-0 text-[9px] tabular-nums text-gray-400">
                {difficulty.solved}/{difficulty.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3 border-l border-subtle pl-4">
          {[
            { value: totalSubmissions.toLocaleString(), label: "Submissions" },
            { value: currentStreak, label: "Streak" },
            { value: maxStreak, label: "Best" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-semibold leading-none tabular-nums text-white">{stat.value}</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom half — submission heatmap */}
      <div className="flex min-h-0 flex-col justify-center border-t border-subtle pt-2">
        <p className="text-[11px] leading-4 text-gray-400">
          <span className="font-semibold text-white">{submissionsPastYear.toLocaleString()}</span> submissions in the past one year
        </p>

        <div className="mt-1 flex gap-[3px]" role="img" aria-label={`${submissionsPastYear} LeetCode submissions in the past year`}>
          {monthGroups.map((group, groupIndex) => (
            <div
              key={`${group.label}-${groupIndex}`}
              className="flex min-w-0 gap-[1px]"
              style={{ flexGrow: group.weeks.length, flexBasis: 0 }}
            >
              {group.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex min-w-0 flex-1 flex-col gap-[1px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day?.date ?? `${weekIndex}-${dayIndex}`}
                      title={day ? `${day.count} on ${day.date}` : undefined}
                      className="aspect-square w-full rounded-[1px]"
                      style={{ background: day ? HEATMAP_LEVELS[heatmapLevel(day.count)] : "transparent" }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-1 flex gap-[3px] text-[8px] leading-none text-gray-500">
          {monthGroups.map((group, groupIndex) => (
            <div
              key={`${group.label}-${groupIndex}`}
              className="min-w-0 truncate text-center"
              style={{ flexGrow: group.weeks.length, flexBasis: 0 }}
            >
              {group.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type WeatherData = {
  temperature: number;
  high: number;
  low: number;
  code: number;
  isDay: boolean;
};

function useWeather(): { data: WeatherData | null; loading: boolean; error: boolean } {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=33.5186&longitude=-86.8104&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto")
      .then((response) => response.json())
      .then((data: { current?: { temperature_2m: number; weather_code: number; is_day: number }; daily?: { temperature_2m_max: number[]; temperature_2m_min: number[] } }) => {
        if (data.current && data.daily) {
          setData({ temperature: data.current.temperature_2m, code: data.current.weather_code, isDay: data.current.is_day === 1, high: data.daily.temperature_2m_max[0], low: data.daily.temperature_2m_min[0] });
        } else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

function WeatherWidget() {
  const { data, loading, error } = useWeather();
  const condition = data?.code === 0 ? "Clear" : data?.code !== undefined && data.code < 4 ? "Partly cloudy" : data?.code !== undefined && data.code < 80 ? "Cloudy" : data?.code !== undefined && data.code < 83 ? "Rain" : data?.code !== undefined && data.code < 86 ? "Snow" : "Storm";

  return (
    <div className="bg-canvas col-span-2 flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-subtle p-4 text-center lg:col-span-1">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Birmingham, AL</p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <WeatherIcon code={data?.code} isDay={data?.isDay ?? true} />
        <div>
          <p className="text-2xl font-semibold text-white">{loading ? "--" : data ? `${Math.round(data.temperature)}°F` : "--"}</p>
          <p className="text-xs text-gray-400">{error ? "Weather unavailable" : loading ? "Loading weather" : condition}</p>
        </div>
      </div>
      {data && !loading && !error && <p className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-gray-400">High {Math.round(data.high)}° · Low {Math.round(data.low)}°</p>}
    </div>
  );
}

function WeatherIcon({ code, isDay }: { code?: number; isDay: boolean }) {
  const isClear = code === 0;
  const isRain = code !== undefined && code >= 51 && code <= 67;
  const isSnow = code !== undefined && code >= 71 && code <= 77;
  const isStorm = code !== undefined && code >= 95;
  const color = isClear ? (isDay ? "text-amber-300" : "text-sky-200") : isStorm ? "text-indigo-300" : isRain ? "text-sky-300" : isSnow ? "text-white" : "text-gray-300";
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={`h-12 w-12 shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2">
      {isClear ? isDay ? <><circle cx="24" cy="24" r="8" fill="currentColor" stroke="none" />{[0,45,90,135].map((angle) => <path key={angle} d="M24 4v6M24 38v6M4 24h6M38 24h6" transform={`rotate(${angle} 24 24)`} />)}</> : <path d="M31 7a17 17 0 1 0 10 31A17 17 0 0 1 31 7Z" fill="currentColor" stroke="none" /> : isStorm ? <path d="M25 7 14 27h10l-3 14 13-21H24l1-13Z" fill="currentColor" stroke="none" /> : isSnow ? <path d="M24 8v32M10 16l28 16M10 32l28-16M24 8l-3 5m3-5 3 5M24 40l-3-5m3 5 3-5" /> : <><path d="M13 33h23a8 8 0 0 0 0-16 11 11 0 0 0-21-2 8 8 0 0 0-2 18Z" fill="currentColor" fillOpacity=".18" />{isRain && <path d="m18 37-2 5m9-5-2 5m9-5-2 5" />}</>}
    </svg>
  );
}

function PianoVideoQuadrant() {
  return (
    <div className="col-span-2 flex w-full min-w-0 flex-col self-start lg:col-span-2">
      <div className="flex items-center justify-between gap-4 pb-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Hear Me Play</span>
        <span className="inline-flex items-center text-[10px] uppercase tracking-[0.18em] text-gray-400">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-1.5 h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.8">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          {LATEST_PIANO_VIDEO?.views ? `${LATEST_PIANO_VIDEO.views} views` : "0 views"}
        </span>
      </div>

      <div className="bg-canvas relative aspect-video overflow-hidden rounded-lg border border-subtle">
        {LATEST_PIANO_VIDEO ? (
          <iframe
            title="Latest piano video"
            src={`https://www.youtube.com/embed/${LATEST_PIANO_VIDEO.id}?autoplay=1&mute=1&rel=0`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="text-3xl text-white/40" aria-hidden="true">♪</span>
            <p className="mt-3 text-sm font-medium text-gray-200">Coming Soon</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-500">
              New piano videos are on the way.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BeyondSection({ githubActivity, leetcodeActivity }: { githubActivity: GithubActivity; leetcodeActivity: LeetcodeActivity }) {
  return (
    <section id="beyond" className={`scroll-mt-20 ${SECTION_SPACING}`}>
      <div className={CONTAINER}>
        <div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-4">
          <PianoVideoQuadrant />
          <ActivityWidget github={githubActivity} leetcode={leetcodeActivity} />
          <div className="col-span-2 lg:col-span-2"><TypeRacerWidget /></div>
          <div className="col-span-2 lg:col-span-1"><ClickMeWidget /></div>
          <WeatherWidget />
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({ initialViews, githubActivity, leetcodeActivity }: { initialViews: number; githubActivity: GithubActivity; leetcodeActivity: LeetcodeActivity }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const siteViews = initialViews;

  const navLinks = [
    { id: "home", href: "#home" },
    { id: "projects", href: "#projects" },
    { id: "experience", href: "#experience" },
  ];

  // Scroll manually so the section anchor never ends up in the address bar.
  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    setMenuOpen(false);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="bg-canvas relative min-h-screen">
      {/* Main content */}
      <div className="relative z-20 font-sans text-white">
        {/* Header */}
        <header className="fixed top-0 z-[9999] w-full border-b border-subtle bg-[rgba(15,17,21,0.82)] py-4 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm isolate">
          <nav className={`relative flex items-center justify-center ${CONTAINER}`}>
            {/* Desktop links */}
            <ul className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 md:flex">
              {navLinks.map(({ id, href }) => (
                <li key={id}>
                  <a
                    href={href}
                    className="capitalize transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    onClick={(event) => scrollToSection(event, id)}
                  >
                    {id}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded border border-strong px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              Menu
            </button>

            {/* mobile menu panel */}
            <div
              id="mobile-navigation"
              className={`md:hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 transform transition-all duration-150 ${
                menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="bg-surface min-w-[160px] rounded-lg border border-subtle py-2 text-white shadow-lg">
                <ul className="flex flex-col">
                  {navLinks.map(({ id, href }) => (
                    <li key={id}>
                      <a
                        href={href}
                        onClick={(event) => scrollToSection(event, id)}
                        className="block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:bg-white/10"
                      >
                        {id}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </header>

        {/* Sections */}
        <main className="pt-0">
          {/* Home */}
          <section
            id="home"
            className={`relative scroll-mt-20 pt-24 md:pt-28 ${SECTION_SPACING} ${CONTAINER}`}
          >
            <div className="relative grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-6">
              <div className="w-full max-w-xl text-left lg:w-auto">
                <h1 className="whitespace-nowrap text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl xl:text-6xl">
                  Hi, I&rsquo;m Daniel
                </h1>

                <ul className="mt-5 space-y-3 text-base font-normal leading-relaxed text-gray-200 md:text-[1.1rem] lg:mx-0">
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                    <span>Recent CS graduate from UC Irvine</span>
                    <TransparentLogo
                      src="/Images/anteater.png"
                      alt="UC Irvine"
                      className="h-5 w-auto object-contain md:h-6"
                    />
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                    <span>Instructor @ Coding Mind</span>
                    <NextImage
                      src="/Images/Experience/CodingMind.jpg"
                      alt="Coding Mind"
                      width={80}
                      height={22}
                      className="h-5 w-auto object-contain md:h-6"
                    />
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                    <span>Aspiring SWE/DE</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                    <span>Based in Birmingham, Alabama</span>
                    <span aria-hidden="true">📍</span>
                    <UsFlagIcon aria-label="United States" />
                    <TwFlagIcon aria-label="Taiwan" />
                  </li>
                </ul>

                <div className="mt-8 flex flex-wrap items-center justify-start gap-4">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-3 rounded-md border border-strong px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Resume
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M12 11v6m0 0-3-3m3 3 3-3" />
                    </svg>
                  </a>
                  <a
                    href="mailto:danieljcoyle02@gmail.com"
                    aria-label="Email Daniel Coyle"
                    title="Email Daniel Coyle"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-strong text-white transition-colors hover:bg-white hover:text-black"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/danieljcoyle/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="group/social inline-flex h-10 w-10 items-center justify-center rounded-md border border-strong transition-colors hover:bg-white"
                  >
                    <NextImage
                      src="/Images/Image2.svg"
                      alt=""
                      width={36}
                      height={36}
                      className="h-5 w-5 transition-all group-hover/social:invert"
                    />
                  </a>
                  <a
                    href="https://github.com/XiaoDanny"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                    className="group/social inline-flex h-10 w-10 items-center justify-center rounded-md border border-strong transition-colors hover:bg-white"
                  >
                    <NextImage
                      src="/Images/Image3.svg"
                      alt=""
                      width={36}
                      height={36}
                      className="h-5 w-5 transition-all group-hover/social:invert"
                    />
                  </a>
                </div>
              </div>

              <PhotoStack />
            </div>

          </section>
          {/* Projects Section */}
          <section
            id="projects"
            className={`scroll-mt-20 ${SECTION_SPACING} ${CONTAINER}`}
          >
            <Projects />
          </section>

          {/* ── Experience Section ── */}
          <section
            id="experience"
            className={`scroll-mt-20 ${SECTION_SPACING} ${CONTAINER}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Experience</h2>
            <Experience />
          </section>

          <BeyondSection githubActivity={githubActivity} leetcodeActivity={leetcodeActivity} />
        </main>
        <footer className={`${CONTAINER} mb-4`}>
          <div className="bg-canvas flex w-full flex-col gap-5 rounded-xl border border-subtle px-5 py-5 text-xs text-gray-400 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center font-mono tracking-wide text-[var(--accent-gold)] lg:text-left">© 2026 Daniel Coyle</p>
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-end">
            <span className="inline-flex items-center gap-1.5 font-mono tracking-wide">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
              {siteViews.toLocaleString()} views
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://github.com/XiaoDanny" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className="text-gray-400 transition-colors hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.5 5.3 18.5 5.6 18.5 5.6c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/danieljcoyle/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className="text-gray-400 transition-colors hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M5.2 3.5A2.2 2.2 0 1 1 .8 3.5a2.2 2.2 0 0 1 4.4 0ZM1.1 8h4.2v13H1.1V8Zm6.8 0h4v1.8h.1c.6-1.1 2-2.2 4.2-2.2 4.5 0 5.3 3 5.3 6.9V21h-4.2v-5.8c0-1.4 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21H7.9V8Z" /></svg>
            </a>
            <a href="https://www.youtube.com/@XiaoDannyPiani" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="text-gray-400 transition-colors hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
            </a>
            <a href="https://www.twitch.tv/xiaodannylol" target="_blank" rel="noopener noreferrer" aria-label="Twitch" title="Twitch" className="text-gray-400 transition-colors hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M4 2h18v13l-5 5h-4l-3 3v-3H4V2Zm2 2v14h4v1.2l1.2-1.2h4l3.8-3.8V4H6Zm3 3h2v5H9V7Zm4 0h2v5h-2V7Z" /></svg>
            </a>
          </div>
          </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
