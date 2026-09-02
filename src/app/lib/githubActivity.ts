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

type SearchCommitItem = {
  sha: string;
  commit: { message: string };
  repository: { full_name: string; html_url: string };
};

async function getRecentCommits(): Promise<CommitEntry[]> {
  const search = await githubFetch(
    `https://api.github.com/search/commits?q=author:${GITHUB_USER}&sort=author-date&order=desc&per_page=${COMMIT_COUNT}`,
  ) as { items: SearchCommitItem[] };

  const commits = await Promise.all(
    search.items.map(async (item): Promise<CommitEntry> => {
      const detail = await githubFetch(`https://api.github.com/repos/${item.repository.full_name}/commits/${item.sha}`) as {
        stats?: { additions: number; deletions: number };
      };
      return {
        hash: item.sha.slice(0, 7),
        message: item.commit.message.split("\n")[0],
        additions: detail.stats?.additions ?? 0,
        deletions: detail.stats?.deletions ?? 0,
        repoName: item.repository.full_name.split("/")[1],
        repoUrl: item.repository.html_url,
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
        byteTotals.set(name, (byteTotals.get(name) ?? 0) + bytes);
      }
    }),
  );

  const totalBytes = [...byteTotals.values()].reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) return FALLBACK_ACTIVITY.languages;

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
