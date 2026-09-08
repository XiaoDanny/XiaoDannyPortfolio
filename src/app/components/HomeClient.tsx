"use client";

// Homepage. Was built and validated in isolation at /skeleton before being ported here —
// see git history on that route if any of the reasoning below needs more context.
//
// Nav sits at the top of the content column, sharing its left edge, sticky so it (and the
// theme toggle) stay reachable at any scroll position. Clicking "About" scrolls to the very
// top of the page; the other links center their section in the viewport instead of just
// aligning its top edge. Sections are strung together with a short connector line between
// each. A light/dark toggle lives top-right, defaulting to dark — every color on this page
// is a CSS variable (see the <style jsx> block below) so the toggle actually repaints the
// whole page instead of just switching an inert icon.

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import NextImage from "next/image";
import type { GithubActivity } from "../lib/githubActivity";
import type { LeetcodeActivity, LeetcodeDay } from "../lib/leetcodeActivity";

type Theme = "dark" | "light";

// "Featured" and "Experience" both scroll to the same #projects section — Experience isn't
// a distinct scroll position anymore, it's a toggle state there — but each link also sets
// that section's toggle to the view it's named for, so landing there shows the right thing.
// Nav links only scroll — they never touch the Projects/Work-Education toggle state.
// That only ever gets its starting value once, on page load; after that it's entirely
// under the visitor's own control via the toggle itself.
const NAV_LINKS: { label: string; id: string }[] = [
  { label: "About", id: "about" },
  { label: "Featured", id: "featured-project" },
  { label: "Experience", id: "experience-toggle" },
];
const LEETCODE_USER = "XiaoDanny";

// Same sentences and shuffle-bag logic as before (avoids an immediate repeat when a bag
// wraps around), same /api/beyond-stats
// backend for site-record tracking.
const RACE_TEXTS = [
  "A wizard is never late. Nor is he early; he arrives precisely when he means to.",
  "All we have to decide is what to do with the time that is given to us.",
  "You either die a hero, or you live long enough to see yourself become the villain.",
  "It's not who I am underneath, but what I do that defines me.",
  "You think darkness is your ally, but you merely adopted the dark. I was born in it.",
  "To boldly go where no man has gone before.",
  "I have been and always shall be your friend.",
  "Sometimes you have to take a leap of faith first. The trust part comes later.",
  "We may not be able to protect the Earth, but you can be damn well sure we'll avenge it.",
  "You could not live with your own failure. Where did that bring you? Back to me.",
  "With great power comes great responsibility.",
  "If you're nothing without the suit, then you shouldn't have it.",
  "Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.",
];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffleNextBag(array: string[], avoidFirst: string): string[] {
  const shuffled = shuffle(array);
  if (shuffled.length > 1 && shuffled[0] === avoidFirst) {
    const swapIndex = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
  }
  return shuffled;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);
    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

// Real photos and real live weather — sized to
// match the h-60/w-44 footprint already tuned for this layout instead of their original
// fixed pixel dimensions.
const photos = [
  { src: "/Images/BeyondTheCode/Daniel1.jpg", alt: "Daniel Coyle", objectPosition: "center 35%" },
  { src: "/Images/BeyondTheCode/Gym.jpg", alt: "Daniel Coyle at the gym", objectPosition: "center 30%" },
  { src: "/Images/BeyondTheCode/Daniel2.jpg", alt: "Daniel Coyle at Yellowstone National Park", objectPosition: "52% 55%" },
  { src: "/Images/BeyondTheCode/LookingUp.jpg", alt: "Daniel Coyle, UC Irvine Class of 2025", objectPosition: "30% 30%" },
];

function PhotoStack() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setActive((current) => (current + 1) % photos.length)}
        aria-label={`Photo ${active + 1} of ${photos.length}: ${photos[active].alt}. Tap for the next photo.`}
        className="relative h-60 w-44 cursor-pointer appearance-none overflow-hidden rounded-2xl border-0 bg-transparent p-0 transition-transform duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg)] md:hover:scale-[1.02]"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            aria-hidden={index !== active}
            className={`absolute inset-0 transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-0"}`}
          >
            <NextImage
              src={photo.src}
              alt={index === active ? photo.alt : ""}
              fill
              sizes="176px"
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
              className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                index === active ? "bg-[var(--dot-active)]" : "bg-[var(--dot-inactive)] group-hover:bg-[var(--dot-hover)]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

type WeatherData = { temperature: number; high: number; low: number; code: number; isDay: boolean };

function useWeather(): { data: WeatherData | null; loading: boolean; error: boolean } {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=33.5186&longitude=-86.8104&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto"
    )
      .then((response) => response.json())
      .then(
        (data: {
          current?: { temperature_2m: number; weather_code: number; is_day: number };
          daily?: { temperature_2m_max: number[]; temperature_2m_min: number[] };
        }) => {
          if (data.current && data.daily) {
            setData({
              temperature: data.current.temperature_2m,
              code: data.current.weather_code,
              isDay: data.current.is_day === 1,
              high: data.daily.temperature_2m_max[0],
              low: data.daily.temperature_2m_min[0],
            });
          } else setError(true);
        }
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

function WeatherIcon({ code, isDay }: { code?: number; isDay: boolean }) {
  const isClear = code === 0;
  const isRain = code !== undefined && code >= 51 && code <= 67;
  const isSnow = code !== undefined && code >= 71 && code <= 77;
  const isStorm = code !== undefined && code >= 95;
  const color = isClear
    ? isDay
      ? "text-amber-400"
      : "text-sky-300"
    : isStorm
      ? "text-indigo-400"
      : isRain
        ? "text-sky-400"
        : isSnow
          ? "text-[var(--fg)]"
          : "text-[var(--muted)]";
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={`h-10 w-10 shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2">
      {isClear ? (
        isDay ? (
          <>
            <circle cx="24" cy="24" r="8" fill="currentColor" stroke="none" />
            {[0, 45, 90, 135].map((angle) => (
              <path key={angle} d="M24 4v6M24 38v6M4 24h6M38 24h6" transform={`rotate(${angle} 24 24)`} />
            ))}
          </>
        ) : (
          <path d="M31 7a17 17 0 1 0 10 31A17 17 0 0 1 31 7Z" fill="currentColor" stroke="none" />
        )
      ) : isStorm ? (
        <path d="M25 7 14 27h10l-3 14 13-21H24l1-13Z" fill="currentColor" stroke="none" />
      ) : isSnow ? (
        <path d="M24 8v32M10 16l28 16M10 32l28-16M24 8l-3 5m3-5 3 5M24 40l-3-5m3 5 3-5" />
      ) : (
        <>
          <path d="M13 33h23a8 8 0 0 0 0-16 11 11 0 0 0-21-2 8 8 0 0 0-2 18Z" fill="currentColor" fillOpacity=".18" />
          {isRain && <path d="m18 37-2 5m9-5-2 5m9-5-2 5" />}
        </>
      )}
    </svg>
  );
}

function WeatherWidget() {
  const { data, loading, error } = useWeather();
  const condition =
    data?.code === 0
      ? "Clear"
      : data?.code !== undefined && data.code < 4
        ? "Partly cloudy"
        : data?.code !== undefined && data.code < 80
          ? "Cloudy"
          : data?.code !== undefined && data.code < 83
            ? "Rain"
            : data?.code !== undefined && data.code < 86
              ? "Snow"
              : "Storm";

  return (
    <div className="w-44 rounded-xl border border-[var(--border)] p-4 text-center">
      <p className="text-[10px] uppercase tracking-widest text-[var(--muted-2)]">Birmingham, AL</p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <WeatherIcon code={data?.code} isDay={data?.isDay ?? true} />
        <div className="text-left">
          <p className="text-xl font-semibold text-[var(--fg)]">{loading ? "--" : data ? `${Math.round(data.temperature)}°F` : "--"}</p>
          <p className="text-[10px] text-[var(--muted-2)]">{error ? "Unavailable" : loading ? "Loading" : condition}</p>
        </div>
      </div>
      {data && !loading && !error && (
        <p className="mt-2 text-[10px] uppercase tracking-widest text-[var(--muted-2)]">
          High {Math.round(data.high)}° · Low {Math.round(data.low)}°
        </p>
      )}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.5 5.3 18.5 5.6 18.5 5.6c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M5.2 3.5A2.2 2.2 0 1 1 .8 3.5a2.2 2.2 0 0 1 4.4 0ZM1.1 8h4.2v13H1.1V8Zm6.8 0h4v1.8h.1c.6-1.1 2-2.2 4.2-2.2 4.5 0 5.3 3 5.3 6.9V21h-4.2v-5.8c0-1.4 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21H7.9V8Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function LeetcodeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.02-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
      <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommitsView({ commits, languages, languageTimeframeLabel }: GithubActivity) {
  return (
    <>
      <ul className="flex flex-col gap-1.5">
        {commits.map((commit) => (
          <li key={commit.hash}>
            <a
              href={`${commit.repoUrl}/commit/${commit.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-md px-1 py-1 text-xs transition-colors hover:bg-[var(--card)]"
            >
              <p className="min-w-0 truncate text-[var(--muted)] group-hover:text-[var(--fg)]">
                <span className="font-semibold text-[var(--fg)]">{commit.repoName}</span>
                <span className="text-[var(--muted-2)]"> · </span>
                <span className="truncate">{commit.message}</span>
              </p>
              <span className="shrink-0 whitespace-nowrap text-[10px] tabular-nums">
                <span className="text-emerald-500">+{commit.additions}</span> <span className="text-red-500">-{commit.deletions}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {languages.length > 0 && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="text-[11px] uppercase tracking-widest text-[var(--muted-2)]">{languageTimeframeLabel}</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-[10px] text-[var(--muted-2)]">
                <span className="w-[68px] shrink-0 truncate text-[var(--muted)]">{lang.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--card-2)]">
                  <div className="h-full rounded-full bg-[var(--muted)]" style={{ width: `${lang.pct}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right tabular-nums text-[var(--muted-2)]">{lang.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// LeetCode's own ramp: unfilled cells stay near-canvas, activity climbs through green.
const HEATMAP_LEVELS_DARK = ["rgba(255,255,255,0.07)", "rgba(45,122,62,0.45)", "rgba(45,150,70,0.65)", "rgba(56,180,90,0.8)", "rgb(82,190,105)"];
const HEATMAP_LEVELS_LIGHT = ["rgba(0,0,0,0.06)", "rgba(45,122,62,0.35)", "rgba(45,150,70,0.55)", "rgba(56,180,90,0.75)", "rgb(56,160,80)"];

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
  theme,
}: LeetcodeActivity & { theme: Theme }) {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const visibleCalendar = isMobile ? calendar.slice(-182) : calendar;
  const visibleSubmissions = isMobile ? visibleCalendar.reduce((total, day) => total + day.count, 0) : submissionsPastYear;
  const heatmapLevels = theme === "dark" ? HEATMAP_LEVELS_DARK : HEATMAP_LEVELS_LIGHT;

  const leadingBlanks = visibleCalendar.length > 0 ? new Date(`${visibleCalendar[0].date}T00:00:00Z`).getUTCDay() : 0;
  const cells: (LeetcodeDay | null)[] = [...Array<null>(leadingBlanks).fill(null), ...visibleCalendar];
  const weeks: (LeetcodeDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <div className="relative h-[78px] w-[78px] shrink-0">
          <svg viewBox="0 0 78 78" className="h-full w-full -rotate-90">
            <circle cx="39" cy="39" r={ringRadius} fill="none" stroke="var(--card-2)" strokeWidth="5" />
            <circle
              cx="39"
              cy="39"
              r={ringRadius}
              fill="none"
              stroke="var(--accent-gold, #C9A227)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - solvedPct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold leading-none text-[var(--fg)]">{totalSolved}</span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[var(--muted-2)]">Solved</span>
          </div>
        </div>

        <div className="shrink-0 space-y-1.5">
          {difficulties.map((difficulty) => (
            <div key={difficulty.label} className="flex items-center gap-2">
              <span className="w-[42px] shrink-0 text-[9px] font-semibold" style={{ color: difficulty.color }}>
                {difficulty.label}
              </span>
              <div className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--card-2)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${difficulty.total > 0 ? (difficulty.solved / difficulty.total) * 100 : 0}%`, background: difficulty.color }}
                />
              </div>
              <span className="w-[56px] shrink-0 text-[9px] tabular-nums text-[var(--muted-2)]">
                {difficulty.solved}/{difficulty.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex basis-full items-center justify-center gap-3 border-t border-[var(--border)] pt-3 sm:basis-auto sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          {[
            { value: totalSubmissions.toLocaleString(), label: "Submissions" },
            { value: currentStreak, label: "Streak" },
            { value: maxStreak, label: "Best" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-semibold leading-none tabular-nums text-[var(--fg)]">{stat.value}</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[var(--muted-2)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <p className="text-[11px] leading-4 text-[var(--muted-2)]">
          <span className="font-semibold text-[var(--fg)]">{visibleSubmissions.toLocaleString()}</span> submissions in the past{" "}
          {isMobile ? "six months" : "one year"}
        </p>

        <div
          className="mt-2 flex gap-px sm:gap-[3px]"
          role="img"
          aria-label={`${visibleSubmissions} LeetCode submissions in the past ${isMobile ? "six months" : "year"}`}
        >
          {monthGroups.map((group, groupIndex) => (
            <div key={`${group.label}-${groupIndex}`} className="flex min-w-0 gap-px" style={{ flexGrow: group.weeks.length, flexBasis: 0 }}>
              {group.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex min-w-0 flex-1 flex-col gap-px">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day?.date ?? `${weekIndex}-${dayIndex}`}
                      title={day ? `${day.count} on ${day.date}` : undefined}
                      className="aspect-square w-full rounded-[1px]"
                      style={{ background: day ? heatmapLevels[heatmapLevel(day.count)] : "transparent" }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-1 flex gap-px text-[8px] leading-[1.3] text-[var(--muted-2)] sm:gap-[3px]">
          {monthGroups.map((group, groupIndex) => (
            <div key={`${group.label}-${groupIndex}`} className="min-w-0 truncate text-center" style={{ flexGrow: group.weeks.length, flexBasis: 0 }}>
              {group.label}
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[8px] leading-none text-[var(--muted-2)] sm:justify-end">
          <span>Less</span>
          <div className="flex items-center gap-px" aria-hidden="true">
            {heatmapLevels.map((color, index) => (
              <span key={index} className="h-2.5 w-2.5 rounded-[1px]" style={{ background: color }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// Still "about me" — just a different facet of it (what I'm building day to day) — so it
// lives inside the About section rather than getting its own nav entry.
function ActivityWidget({ github, leetcode, theme }: { github: GithubActivity; leetcode: LeetcodeActivity; theme: Theme }) {
  const [view, setView] = useState<"github" | "leetcode">("github");
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>();

  // Track whichever panel is showing so the swap doesn't jump — same technique the
  // Projects/Experience toggle below uses.
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setContentHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border-strong)] p-8">
      {/* One header row, matching every other card on the page — title left, actions
          right — instead of stacking a bare swap-button row on top of a second,
          separate icon/title row. */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-[var(--fg)]">{view === "github" ? "Recent Commits" : "LeetCode Progress"}</p>
        <div className="flex items-center gap-3">
          <a
            href={view === "github" ? "https://github.com/XiaoDanny" : `https://leetcode.com/u/${LEETCODE_USER}/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={view === "github" ? "Open GitHub profile" : "Open LeetCode profile"}
            title={view === "github" ? "GitHub" : "LeetCode"}
            className="text-[var(--muted-2)] transition-colors hover:text-[var(--fg)]"
          >
            {view === "github" ? <GithubIcon /> : <LeetcodeIcon />}
          </a>
          <button
            type="button"
            onClick={() => setView((current) => (current === "github" ? "leetcode" : "github"))}
            aria-label={`Swap to ${view === "github" ? "LeetCode" : "GitHub"} view`}
            className="inline-flex items-center gap-1 text-[10px] uppercase leading-none tracking-[0.18em] text-[var(--muted-2)] transition-colors hover:text-[var(--fg)]"
          >
            <SwapIcon /> Swap
          </button>
        </div>
      </div>
      <div style={{ height: contentHeight }} className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none">
        <div ref={contentRef}>{view === "github" ? <CommitsView {...github} /> : <LeetcodeView {...leetcode} theme={theme} />}</div>
      </div>
    </div>
  );
}

// Real experience data — a plain list instead of the mountain-range timeline the previous
// design used (ruled out for being too busy). Sorted by start date, most recent first.
// type is unused now (no sub-toggle anymore) but kept in case that comes back.
const EXPERIENCE = [
  {
    company: "Coding Mind Academy",
    role: "Instructor / Tutor",
    date: "Sep 2026 – Present",
    description: "Teaching data structures, algorithms, and Python programming to students of mixed ages.",
    website: "https://codingmind.com/",
    image: "/Images/Experience/CodingMind.jpg",
    type: "work" as const,
  },
  {
    company: "Handshake",
    role: "AI QA",
    date: "Oct – Nov 2025",
    description:
      "Annotated and evaluated image data for a confidential AI lab project through Handshake AI, contributing to a dataset used to train and evaluate frontier models.",
    website: "https://joinhandshake.com/blog/our-team/introducing-handshake-ai/",
    image: "/Images/Experience/Handshake.png",
    type: "work" as const,
  },
  {
    company: "Calit2",
    role: "Software Engineer",
    date: "Mar – Jun 2024",
    description: "Developed the Cooling Center Locator, a full-stack web app helping users find nearby cooling centers and access heat-safety resources.",
    website: "https://calit2.uci.edu/",
    image: "/Images/Experience/Calit2.jpg",
    type: "work" as const,
  },
  {
    company: "UCI Esports",
    role: "Scholarship Athlete",
    date: "Mar 2022 – Jun 2025",
    description:
      "Competed on the League of Legends team at a professional level (Challenger rank), balancing competitive play with a Computer Science courseload.",
    website: "https://esports.uci.edu/",
    image: "/Images/Experience/UCIesports.png",
    type: "education" as const,
  },
  {
    company: "University of California, Irvine",
    role: "B.S. Computer Science",
    date: "2021 – 2025",
    description: "B.S. Computer Science, Class of 2025. Coursework in data structures, algorithms, systems, and databases.",
    website: "https://uci.edu/",
    image: "/Images/Experience/UCI.png",
    type: "education" as const,
  },
];

// Real project data — 5 entries. Alpha Ring (projects[0]) is the one featured above; the
// rest only show up in the Projects toggle view.
const projects = [
  {
    name: "Alpha Ring",
    date: "July 2026 - Present",
    description:
      "An open source mod restoring local split-screen co-op to Halo: The Master Chief Collection on PC. As part of a two-person team, I contribute by decompiling the source code and designing/implementing hooks to enable features the original game didn't support.",
    technologies: ["C++", "CMake", "Ghidra", "x64dbg", "MinHook"],
    image: "/Images/Projects/AlphaRing.png",
    demoUrl: "https://www.youtube.com/watch?v=IRZPdAJFkc8",
    githubUrl: "https://github.com/megabitt01/AlphaRing/tree/xiaodanny",
  },
  {
    name: "SQL Duel",
    date: "Coming Soon",
    description: "A competitive SQL practice platform where users solve interview-style SQL challenges solo or compete against each other in real-time 1v1 duels.",
    technologies: ["TypeScript", "React", "Vite", "Python", "FastAPI", "SQLite"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    name: "Rank Tracker",
    date: "March 2025 · Irvine Hacks",
    description: "Customizable, real-time leaderboard powered by the Riot Games API for tracking and comparing player performance.",
    technologies: ["Python", "Flask", "React", "Riot Games API", "SQLite"],
    demoUrl: "#",
    githubUrl: "https://github.com/XiaoDanny/Rank-Tracker",
  },
  {
    name: "Fabflix",
    date: "Fall 2024 · UCI Capstone",
    description: "Movie catalog application with user authentication, enabling users to search, browse, and securely check out movies.",
    technologies: ["Java", "JavaScript", "SQL", "AWS", "Docker", "Kubernetes"],
    demoUrl: "#",
    githubUrl: "https://github.com/XiaoDanny/Fabflix-Movie-DB",
  },
  {
    name: "Cooling Center Locator",
    date: "March–June 2024 · Calit2",
    description: "Locates nearby cooling centers based on the user's location and provides helpful tips to stay cool during heatwaves.",
    technologies: ["JavaScript", "React", "GoogleMaps API"],
    demoUrl: "#",
    githubUrl: "https://github.com/XiaoDanny/Cooling-Center-Locator",
  },
];

// Date/title/description/actions are always visible below the image, not gated behind a
// hover — reverse-engineering a closed-source game engine to add split-screen back in is
// the single most interesting fact on this page, and hiding it behind discovery meant even
// a first-time viewer of their own project card missed it. One card, one border — the image
// on top and the info below are still a single box, not a box nested inside another.
function FeaturedProjectCard() {
  const project = projects[0];

  return (
    <article className="w-full overflow-hidden rounded-[28px] border border-[var(--border-strong)]">
      <div className="relative aspect-[25/12] w-full bg-[var(--card)]">
        {project.image && (
          <NextImage src={project.image} alt={`${project.name} screenshot`} fill sizes="(max-width: 640px) 100vw, 672px" className="h-full w-full object-cover object-center" />
        )}
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted-2)]">{project.date}</p>
          <h3 className="mt-1 text-2xl font-semibold text-[var(--fg)]">{project.name}</h3>
        </div>

        <p className="text-sm leading-relaxed text-[var(--muted)]">{project.description}</p>

        <div className="mt-1 flex items-center gap-3">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[var(--fg)] px-5 py-2 text-xs font-medium uppercase tracking-widest text-[var(--bg)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]"
          >
            Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} on GitHub`}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="rounded-2xl border border-[var(--border-strong)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[var(--fg)]">{project.name}</h3>
          <p className="mt-0.5 text-xs text-[var(--muted-2)]">{project.date}</p>
        </div>
        {project.githubUrl !== "#" && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} on GitHub`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <GithubIcon />
          </a>
        )}
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span key={tech} className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceEntry({ entry }: { entry: (typeof EXPERIENCE)[number] }) {
  return (
    <div className="flex gap-4">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <NextImage src={entry.image} alt={`${entry.company} logo`} fill sizes="40px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-semibold text-[var(--fg)]">
            {entry.company} <span className="font-normal text-[var(--muted)]">· {entry.role}</span>
          </p>
          <p className="shrink-0 text-xs text-[var(--muted-2)]">{entry.date}</p>
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">{entry.description}</p>
        <a href={entry.website} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-[var(--muted-2)] transition-colors hover:text-[var(--fg)]">
          Visit site ↗
        </a>
      </div>
    </div>
  );
}

// Just the original two-way toggle (Projects / Work-Education) — no nested sub-toggle.
// Work and education entries sit together in one combined list.
function ExperienceList() {
  return (
    <div className="flex flex-col gap-8">
      {EXPERIENCE.map((entry) => (
        <ExperienceEntry key={entry.company} entry={entry} />
      ))}
    </div>
  );
}

// Featured always shows — no toggle for it anymore. Below it, one toggle now covers what
// used to be two separate sections (all projects, and Experience), reusing the same
// height-matched swap pattern as the activity widget instead of introducing a new one.
type ProjectsView = "projects" | "experience";

// view/onViewChange are lifted to the parent so the nav's "Featured"/"Experience" links can
// drive this section's toggle directly instead of only being able to scroll to it.
function ProjectsSection({ view, onViewChange }: { view: ProjectsView; onViewChange: (view: ProjectsView) => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>();

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setContentHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Scroll target includes the "Featured" label itself, not just the card below it —
          landing on just the card was cutting the label off above the viewport. */}
      <div id="featured-project" className="scroll-mt-24">
        <p className="mb-4 text-lg font-semibold text-[var(--fg)]">Featured</p>
        <FeaturedProjectCard />
      </div>

      <Connector />

      {/* Segmented toggle instead of a title + separate "Swap" link — this control is both
          the header and the switch. Experience (Work/Education) on the left, Projects on
          the right, defaulting to Experience. Its own scroll target, separate from Featured
          above, so the "Experience" nav link lands here instead of at Featured. rounded-2xl
          throughout (not rounded-full) to match the ProjectRow/ExperienceList cards it
          switches between — a pill capsule here read as a shape the rest of the page's
          boxes don't use. Inner highlight is rounded-xl (2xl minus the p-1 inset) so it
          stays concentric with the outer corner instead of the two radii fighting. */}
      <div id="experience-toggle" className="mb-6 flex scroll-mt-24 rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-1">
        {(["experience", "projects"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onViewChange(option)}
            aria-pressed={view === option}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              view === option ? "bg-[var(--card-3)] text-[var(--fg)]" : "text-[var(--muted-2)] hover:text-[var(--fg)]"
            }`}
          >
            {option === "projects" ? "Projects" : "Work/Education"}
          </button>
        ))}
      </div>

      <div style={{ height: contentHeight }} className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none">
        <div ref={contentRef}>
          {view === "projects" ? (
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <ProjectRow key={project.name} project={project} />
              ))}
            </div>
          ) : (
            <ExperienceList />
          )}
        </div>
      </div>
    </div>
  );
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

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
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
    <div className="relative flex min-h-[220px] flex-col rounded-2xl border border-[var(--border-strong)] p-4 text-left sm:min-h-[260px] sm:p-6">
      <button
        type="button"
        onClick={nextSentence}
        aria-label="Skip to the next sentence"
        title="Next Sentence"
        className="absolute right-3 top-3 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--muted-2)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
          <path d="M20 5v5h-5M20 10a8 8 0 1 0 2 5.3" />
        </svg>
      </button>

      <div className="flex min-h-[64px] items-center pr-10 sm:min-h-[88px]">
        <div className="break-words whitespace-pre-wrap font-mono text-xs leading-relaxed tracking-wide text-[var(--muted)] sm:text-sm">
          {raceText.split("").map((character, index) => {
            const typedCharacter = typed[index];
            const isCurrent = index === typed.length && isFocused && finishedTime === null;
            const color =
              typedCharacter === undefined ? "text-[var(--muted-2)]" : typedCharacter === character ? "text-[var(--fg)]" : "text-red-400";
            return (
              <span
                key={`${character}-${index}`}
                className={`${color} transition-colors duration-100 ${isCurrent ? "border-l border-[var(--fg)] pl-px" : ""}`}
              >
                {character}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center sm:flex-1">
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
          className="w-full cursor-text rounded-md border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-xs text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--muted-2)] focus:border-[var(--border-strong)] disabled:opacity-60 sm:text-sm"
        />
      </div>

      <div className="mt-2 flex h-6 items-center justify-between text-[10px] uppercase tracking-[0.1em] text-[var(--muted-2)] sm:h-8 sm:text-[11px] sm:tracking-[0.13em]">
        {isFocused && finishedTime === null && (
          <>
            <span className="text-sm font-semibold tracking-normal text-[var(--muted)] sm:text-base">{elapsed.toFixed(2)}</span>
            <span>Tab to restart</span>
          </>
        )}
      </div>

      <div className="h-10 sm:h-12">
        {finishedTime !== null && (
          <div className="pt-1 text-[10px] uppercase tracking-[0.13em] text-[var(--muted-2)]">
            <p className="mt-2">
              Site Record: <strong className="font-medium text-[var(--muted)]">{siteRecord.toFixed(2)}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// A short vertical segment in the gap between two section boxes, giving the page a
// "connected" feel without a line running through the boxes' own content.
// Same total gap as before (32px padding + 32px line + 32px padding = 96px) — just without
// the visible line itself, pure spacing now.
function Connector() {
  return <div className="h-24" aria-hidden />;
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="none">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function HomeClient({
  initialViews,
  githubActivity,
  leetcodeActivity,
}: {
  initialViews: number;
  githubActivity: GithubActivity;
  leetcodeActivity: LeetcodeActivity;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsView, setProjectsView] = useState<ProjectsView>("experience");

  // The theme vars below are scoped to [data-theme], set on the content div — but the
  // page's own scrollbar belongs to <html>, outside that div, so it can't see them.
  // Mirroring the attribute onto the root lets html::-webkit-scrollbar-* below resolve
  // the same --muted-2/--muted vars instead of needing a second, hardcoded color set.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function jumpTo(id: string) {
    // "About" is the top of the page — go there directly rather than through
    // scrollIntoView, which is what every other nav link uses.
    if (id === "about") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // block: "start" lands the target at the top of the screen instead of vertically
    // centered — each target also has scroll-mt-24 so it clears the sticky nav bar
    // instead of landing underneath it.
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div data-theme={theme} className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      {/* Every color elsewhere on this page is one of these variables, so the toggle below
          actually repaints the page instead of switching an icon that does nothing. */}
      <style jsx global>{`
        [data-theme="dark"] {
          --bg: #121212;
          --fg: #ffffff;
          --muted: #9ca3af;
          --muted-2: #6b7280;
          --border: rgba(255, 255, 255, 0.15);
          --border-strong: rgba(255, 255, 255, 0.2);
          --card: rgba(255, 255, 255, 0.05);
          --card-2: rgba(255, 255, 255, 0.1);
          --card-3: rgba(255, 255, 255, 0.2);
          --dot-active: rgba(255, 255, 255, 0.75);
          --dot-inactive: rgba(255, 255, 255, 0.2);
          --dot-hover: rgba(255, 255, 255, 0.4);
        }
        [data-theme="light"] {
          --bg: #f7f5f0;
          --fg: #18181b;
          --muted: #52525b;
          --muted-2: #71717a;
          --border: rgba(0, 0, 0, 0.12);
          --border-strong: rgba(0, 0, 0, 0.18);
          --card: rgba(0, 0, 0, 0.035);
          --card-2: rgba(0, 0, 0, 0.07);
          --card-3: rgba(0, 0, 0, 0.12);
          --dot-active: rgba(0, 0, 0, 0.65);
          --dot-inactive: rgba(0, 0, 0, 0.18);
          --dot-hover: rgba(0, 0, 0, 0.35);
        }

        /* Thin, theme-aware scrollbar instead of the OS default. html carries the mirrored
           data-theme attribute (see the useEffect above) so --muted-2/--muted resolve here
           the same as everywhere else on the page — no separate color set to keep in sync.
           body inherits those same vars from html, and is targeted too because globals.css
           sets overflow-x: hidden on body, which in some browsers makes body — not html —
           the element that actually owns the viewport's scrollbar. */
        html,
        body {
          scrollbar-width: thin;
          scrollbar-color: var(--muted-2) transparent;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          width: 8px;
        }
        html::-webkit-scrollbar-track,
        body::-webkit-scrollbar-track {
          background: transparent;
        }
        html::-webkit-scrollbar-thumb,
        body::-webkit-scrollbar-thumb {
          background-color: var(--muted-2);
          border-radius: 9999px;
        }
        html::-webkit-scrollbar-thumb:hover,
        body::-webkit-scrollbar-thumb:hover {
          background-color: var(--muted);
        }
        html::-webkit-scrollbar-button,
        body::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      {/* Content column is flex-1 so it stretches to fill the viewport when content is short,
          pushing the footer (a sibling, outside this div) down to the bottom of the screen
          instead of leaving it stranded partway down a tall, empty page. Nav is the first
          thing in it, so it shares the exact same left edge as the section boxes below. */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-6">
        <nav className="sticky top-0 z-10 mb-8 border-b border-[var(--border)] bg-[var(--bg)] py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            {/* Inline links at sm+ (this 3-link nav actually fits fine even at 375px — this
                is a deliberate mobile convention, not a fix for overflow). Below sm, a
                hamburger opens a dropdown with the same links instead. */}
            <div className="hidden items-center gap-8 sm:flex">
              {NAV_LINKS.map(({ label, id }) => (
                <a
                  key={label}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpTo(id);
                  }}
                  className="text-sm font-medium text-[var(--muted-2)] transition-colors duration-300 hover:text-[var(--fg)]"
                >
                  {label}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--muted)] transition-colors hover:text-[var(--fg)] sm:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Theme toggle — right-aligned with the containers below, defaults to dark. */}
            <button
              type="button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Absolutely positioned (nav is already a sticky/positioning container), so this
              floats over the content below instead of pushing the nav taller and shoving
              everything down when it opens. A compact card anchored to the button itself
              (left-0 matches the hamburger's position), not a full-width bar — it should
              read as a dropdown coming from the button, not a second header. */}
          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 flex w-40 flex-col gap-1 rounded-md border border-[var(--border-strong)] bg-[var(--bg)] p-2 shadow-lg sm:hidden">
              {NAV_LINKS.map(({ label, id }) => (
                <a
                  key={label}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    jumpTo(id);
                  }}
                  className="w-full rounded-md px-2 py-2 text-sm font-medium text-[var(--muted-2)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </nav>

        <div id="about" className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-stretch sm:justify-start">
            <div className="min-w-0 sm:max-w-sm">
              <h1 className="text-4xl font-bold text-[var(--fg)]">Hi, I&apos;m Daniel</h1>
              <p className="mt-4 text-[var(--muted)]">
                I enjoy reverse-engineering old games, pushing their engines beyond their original
                limits to unlock features they were never intended to support.
              </p>
              <p className="mt-4 text-[var(--muted)]">
                Since graduating from UC Irvine, where I studied computer science, I&apos;ve worked
                as an AI QA contractor at <span className="font-semibold text-[var(--fg)]">Handshake</span>,
                annotating image data to support frontier AI model training. I&apos;m now an
                instructor at <span className="font-semibold text-[var(--fg)]">Coding Mind Academy</span>,
                where I teach data structures, algorithms, and Python. I&apos;m also one of two
                developers on{" "}
                <span className="font-semibold text-[var(--fg)]">Alpha Ring</span>, an open source
                mod with thousands of users.
              </p>
              <p className="mt-4 text-[var(--muted)]">
                I&apos;m seeking software engineering opportunities where I can bring that same
                level of problem solving to production systems.
              </p>

              {/* Right after the pitch — the natural next action once someone's read it.
                  Mail/LinkedIn/GitHub live here now instead of the footer, matching the
                  deployed site's own pattern; footer keeps just copyright + view count. */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-3 rounded-md border border-[var(--border-strong)] px-4 text-sm font-semibold text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                >
                  Resume
                  {/* External-link glyph, not a download arrow — this opens the PDF in a new
                      tab, it doesn't save a file to disk, so a download icon would be wrong. */}
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 3h7v7M21 3l-9 9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="mailto:danieljcoyle02@gmail.com"
                  aria-label="Email Daniel Coyle"
                  title="Email Daniel Coyle"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                >
                  <MailIcon />
                </a>
                <a
                  href="https://www.linkedin.com/in/danieljcoyle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://github.com/XiaoDanny"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-strong)] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                >
                  <GithubIcon />
                </a>
              </div>
            </div>

            {/* Weather stays bottom-aligned with the closing line; photo is centered in
                whatever space is left above it, rather than pinned to either end. */}
            <div className="flex shrink-0 flex-col items-center">
              <div className="flex flex-1 flex-col items-center justify-center">
                <PhotoStack />
              </div>
              <WeatherWidget />
            </div>
          </div>

          {/* Still "about me" — what I'm building day to day, not a separate topic */}
          <ActivityWidget github={githubActivity} leetcode={leetcodeActivity} theme={theme} />
        </div>

        <Connector />

        <div id="projects" className="scroll-mt-24">
          <ProjectsSection view={projectsView} onViewChange={setProjectsView} />
        </div>

        <Connector />

        {/* TypeRacer — the one fun/personality widget ported back in so far; positioned
            near the bottom, same spirit as it had in the old "Beyond" grid. No header,
            the widget speaks for itself. */}
        <TypeRacerWidget />
      </div>

      {/* Footer is a sibling of the flex-1 content column above, not nested inside it — that's
          what lets it sit at the bottom of the viewport on short pages instead of floating
          wherever the content happens to end. Rounded bar, copyright left, view count right,
          matching the existing site footer. */}
      {/* max-w-2xl matches the CONTENT COLUMN's outer edge, but the visible cards
          (Experience, Projects, the activity widget) are narrower than that — they sit
          inside its px-6 padding, so their real box is 624px, not 672px. Footer is a
          sibling outside that padding (for the sticky-to-bottom trick), so matching the
          cards means matching 624px directly, not max-w-2xl. */}
      <footer className="mx-auto mb-6 mt-14 flex w-full max-w-[39rem] flex-col items-center gap-4 rounded-2xl border border-[var(--border)] px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-[var(--muted)]">© 2026 Daniel Coyle</p>
        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
          <EyeIcon />
          {initialViews.toLocaleString()} views
        </span>
      </footer>
    </div>
  );
}
