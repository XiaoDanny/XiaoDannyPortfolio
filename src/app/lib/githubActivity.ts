// ─── GitHub activity data source ──────────────────────────────────────────────
// Presentation components (e.g. RecentCommitsWidget) never fetch or shape data
// themselves — they just render whatever this module hands them. That keeps the
// widget UI stable while the data source evolves:
//   today:  static snapshot, refreshed manually from the GitHub REST API
//   later:  swap getGithubActivity()'s body for a `fetch` against a route handler
//           (e.g. /api/github-activity) that calls the GitHub REST API server-side
//           with `next: { revalidate }` for caching, or wrap it in `unstable_cache`.
// The return shape below is the contract the UI depends on, so that swap requires
// no changes outside this file.

export interface CommitEntry {
  hash: string;
  message: string;
  additions: number;
  deletions: number;
}

export interface LanguageStat {
  name: string;
  pct: number;
}

export interface GithubActivity {
  repoName: string;
  repoUrl: string;
  commits: CommitEntry[];
  languages: LanguageStat[];
  languageTimeframeLabel: string;
}

// Snapshot pulled from `git log` (commits) and the GitHub REST API's public
// events + per-repo `/languages` endpoints (language mix) — update by hand
// until this is wired up to a live fetch.
const REPO_NAME = "XiaoDannyPortfolio";
const REPO_URL = `https://github.com/XiaoDanny/${REPO_NAME}`;

const RECENT_COMMITS: CommitEntry[] = [
  { hash: "66a3142", message: "Major Revisions all Sections", additions: 865, deletions: 386 },
  { hash: "346545b", message: "many changes", additions: 517, deletions: 295 },
  { hash: "d1a2259", message: "home revisions", additions: 53, deletions: 48 },
];

// Every repo pushed to or opened a PR against in the last 90 days, weighted by
// each repo's language bytes, programming languages only (markup/config excluded)
const LANGUAGE_ACTIVITY: LanguageStat[] = [
  { name: "C++", pct: 32 },
  { name: "JavaScript", pct: 20 },
  { name: "TypeScript", pct: 18 },
  { name: "Other", pct: 30 },
];

export function getGithubActivity(): GithubActivity {
  return {
    repoName: REPO_NAME,
    repoUrl: REPO_URL,
    commits: RECENT_COMMITS,
    languages: LANGUAGE_ACTIVITY,
    languageTimeframeLabel: "Last 90 days",
  };
}
