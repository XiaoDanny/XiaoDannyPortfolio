// ─── GitHub activity data source ──────────────────────────────────────────────
// Live data pulled from the GitHub REST API, authenticated via GITHUB_TOKEN for the
// higher 5,000 req/hr rate limit. Presentation components (e.g. RecentCommitsWidget)
// never fetch or shape data themselves — they just render whatever this module hands
// them, so the return shape below is the contract the UI depends on.

export interface CommitEntry {
  hash: string;
  message: string;
  additions: number;
  deletions: number;
  repoName: string;
  repoUrl: string;
}

export interface LanguageStat {
  name: string;
  pct: number;
}

export interface GithubActivity {
  commits: CommitEntry[];
  languages: LanguageStat[];
  languageTimeframeLabel: string;
}

const GITHUB_USER = "XiaoDanny";
const COMMIT_COUNT = 3;
const ACTIVITY_WINDOW_DAYS = 90;
const REVALIDATE_SECONDS = 3600; // refresh at most once an hour
const NON_CODE_LANGUAGES = new Set([
  "CSS",
  "HTML",
  "JSON",
  "Less",
  "Markdown",
  "MDX",
  "SCSS",
  "Sass",
  "SVG",
  "TOML",
  "XML",
  "YAML",
]);

const FALLBACK_ACTIVITY: GithubActivity = {
  commits: [
    { hash: "66a3142", message: "Major Revisions all Sections", additions: 865, deletions: 386, repoName: "XiaoDannyPortfolio", repoUrl: "https://github.com/XiaoDanny/XiaoDannyPortfolio" },
    { hash: "346545b", message: "many changes", additions: 517, deletions: 295, repoName: "XiaoDannyPortfolio", repoUrl: "https://github.com/XiaoDanny/XiaoDannyPortfolio" },
    { hash: "d1a2259", message: "home revisions", additions: 53, deletions: 48, repoName: "XiaoDannyPortfolio", repoUrl: "https://github.com/XiaoDanny/XiaoDannyPortfolio" },
  ],
  languages: [
    { name: "C++", pct: 32 },
    { name: "JavaScript", pct: 20 },
    { name: "TypeScript", pct: 18 },
    { name: "Other", pct: 30 },
  ],
  languageTimeframeLabel: "Last 90 days",
};

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function githubFetch(url: string) {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${url}`);
  return response.json();
}

type PushEventPayload = { before?: string; head?: string };
type PullRequestEventPayload = { action?: string; pull_request?: { head?: { sha?: string } } };
type ActivityEvent = {
  type: string;
  repo: { name: string };
  payload?: PushEventPayload & PullRequestEventPayload;
  created_at: string;
};
const ZERO_SHA = "0000000000000000000000000000000000000000";

// The commit search API (q=author:) silently excludes forked repos from its index, which dropped
// commits pushed to forks (e.g. modding tool contributions) entirely. The events API doesn't have
// that gap, so we reconstruct the recent-commits feed from it instead — but it has two quirks of
// its own: (1) GitHub omits the PushEvent entirely for a push that opens or updates a pull request,
// emitting only a PullRequestEvent (opened/synchronize) for it, so both event types are read here;
// (2) events aren't reliably returned in created_at order, so we sort explicitly rather than trust
// array order. GitHub also no longer includes a commit list in the PushEvent payload itself (just
// before/head SHAs), so plain pushes are diffed via the compare endpoint to recover their commits.
// /events/public (not /events) is used deliberately so a token scoped to this account never
// surfaces private repo activity.
async function getRecentCommits(): Promise<CommitEntry[]> {
  const events = await githubFetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`) as ActivityEvent[];

  const relevant = events
    .filter(
      (event) =>
        event.type === "PushEvent" ||
        (event.type === "PullRequestEvent" && (event.payload?.action === "opened" || event.payload?.action === "synchronize")),
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const seen = new Set<string>();
  const candidates: { sha: string; repoFullName: string }[] = [];

  const addCandidate = (sha: string, repoFullName: string) => {
    const key = `${repoFullName}#${sha}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ sha, repoFullName });
  };

  for (const event of relevant) {
    if (candidates.length >= COMMIT_COUNT) break;

    if (event.type === "PullRequestEvent") {
      // event.actor is always GITHUB_USER here (this is their own events feed), so the PR's
      // head commit is theirs regardless of which repo owns the PR.
      const sha = event.payload?.pull_request?.head?.sha;
      if (!sha) continue;
      addCandidate(sha, event.repo.name);
      continue;
    }

    const { before, head } = event.payload ?? {};
    if (!before || !head || before === ZERO_SHA) continue;

    const repoFullName = event.repo.name;
    const compare = await githubFetch(`https://api.github.com/repos/${repoFullName}/compare/${before}...${head}`).catch(() => null) as
      | { commits: { sha: string }[] }
      | null;
    if (!compare) continue;

    // Compare returns commits oldest-first; reverse so the newest commit in this push is seen first.
    for (const commit of [...compare.commits].reverse()) {
      addCandidate(commit.sha, repoFullName);
      if (candidates.length >= COMMIT_COUNT) break;
    }
  }

  const commits = await Promise.all(
    candidates.map(async (item): Promise<CommitEntry> => {
      const detail = await githubFetch(`https://api.github.com/repos/${item.repoFullName}/commits/${item.sha}`) as {
        commit: { message: string };
        stats?: { additions: number; deletions: number };
      };
      return {
        hash: item.sha.slice(0, 7),
        message: detail.commit.message.split("\n")[0],
        additions: detail.stats?.additions ?? 0,
        deletions: detail.stats?.deletions ?? 0,
        repoName: item.repoFullName.split("/")[1],
        repoUrl: `https://github.com/${item.repoFullName}`,
      };
    }),
  );

  return commits;
}

type PublicEvent = { type: string; repo: { name: string }; created_at: string };

async function getRecentlyActiveRepos(): Promise<string[]> {
  const cutoff = Date.now() - ACTIVITY_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const events = await githubFetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=100`) as PublicEvent[];

  const repos = new Set<string>();
  for (const event of events) {
    if (new Date(event.created_at).getTime() < cutoff) continue;
    if (event.type === "PushEvent" || event.type === "PullRequestEvent") repos.add(event.repo.name);
  }
  return [...repos];
}

async function getLanguageBreakdown(): Promise<LanguageStat[]> {
  const repos = await getRecentlyActiveRepos();

  const byteTotals = new Map<string, number>();
  await Promise.all(
    repos.map(async (repo) => {
      const languages = await githubFetch(`https://api.github.com/repos/${repo}/languages`).catch(() => ({})) as Record<string, number>;
      for (const [name, bytes] of Object.entries(languages)) {
        if (NON_CODE_LANGUAGES.has(name)) continue;
        byteTotals.set(name, (byteTotals.get(name) ?? 0) + bytes);
      }
    }),
  );

  const totalBytes = [...byteTotals.values()].reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) return [];

  const sorted = [...byteTotals.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 3);
  const otherBytes = sorted.slice(3).reduce((sum, [, bytes]) => sum + bytes, 0);

  const stats: LanguageStat[] = top.map(([name, bytes]) => ({ name, pct: Math.round((bytes / totalBytes) * 100) }));
  if (otherBytes > 0) stats.push({ name: "Other", pct: Math.round((otherBytes / totalBytes) * 100) });

  return stats;
}

export async function getGithubActivity(): Promise<GithubActivity> {
  try {
    const [commits, languages] = await Promise.all([getRecentCommits(), getLanguageBreakdown()]);
    return {
      commits: commits.length > 0 ? commits : FALLBACK_ACTIVITY.commits,
      languages,
      languageTimeframeLabel: `Last ${ACTIVITY_WINDOW_DAYS} days`,
    };
  } catch {
    return FALLBACK_ACTIVITY;
  }
}
