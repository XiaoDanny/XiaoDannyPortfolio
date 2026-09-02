// ─── LeetCode activity data source ────────────────────────────────────────────
// LeetCode has no official public API, but its own GraphQL endpoint serves profile
// data for any public username without auth — the same endpoint the community
// wrappers (alfa-leetcode-api etc.) proxy, minus the third-party uptime dependency.
// Same contract style as githubActivity: the UI renders whatever this hands it.

export interface LeetcodeDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface LeetcodeActivity {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  /** Every submission ever made, from submitStats. */
  totalSubmissions: number;
  /** Submissions inside the rolling calendar window the heatmap renders. */
  submissionsPastYear: number;
  activeDays: number;
  maxStreak: number;
  currentStreak: number;
  calendar: LeetcodeDay[];
}

const LEETCODE_USER = "XiaoDanny";
const REVALIDATE_SECONDS = 3600; // refresh at most once an hour
const CALENDAR_DAYS = 371; // 53 weeks, so the grid always starts on a week boundary

const FALLBACK_ACTIVITY: LeetcodeActivity = {
  totalSolved: 0,
  totalQuestions: 0,
  easySolved: 0,
  easyTotal: 0,
  mediumSolved: 0,
  mediumTotal: 0,
  hardSolved: 0,
  hardTotal: 0,
  totalSubmissions: 0,
  submissionsPastYear: 0,
  activeDays: 0,
  maxStreak: 0,
  currentStreak: 0,
  calendar: [],
};

const PROFILE_QUERY = `
  query userProfile($username: String!, $year: Int, $previousYear: Int) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count }
        totalSubmissionNum { difficulty count submissions }
      }
      currentYear: userCalendar(year: $year) { submissionCalendar }
      previousYear: userCalendar(year: $previousYear) { submissionCalendar }
    }
  }
`;

type DifficultyCount = { difficulty: string; count: number; submissions?: number };

type ProfileResponse = {
  data?: {
    allQuestionsCount?: DifficultyCount[];
    matchedUser?: {
      submitStats?: {
        acSubmissionNum?: DifficultyCount[];
        totalSubmissionNum?: DifficultyCount[];
      };
      currentYear?: { submissionCalendar?: string } | null;
      previousYear?: { submissionCalendar?: string } | null;
    } | null;
  };
};

const countFor = (stats: DifficultyCount[] | undefined, difficulty: string) =>
  stats?.find((stat) => stat.difficulty === difficulty)?.count ?? 0;

/** submissionCalendar is a JSON string of { unixSecondsAtUTCMidnight: count }. */
function buildCalendar(submissionCalendars: (string | undefined)[]): LeetcodeDay[] {
  const byDate = new Map<string, number>();

  for (const calendar of submissionCalendars) {
    if (!calendar) continue;
    let raw: Record<string, number> = {};
    try {
      raw = JSON.parse(calendar) as Record<string, number>;
    } catch {
      continue;
    }
    for (const [seconds, count] of Object.entries(raw)) {
      const date = new Date(Number(seconds) * 1000).toISOString().slice(0, 10);
      byDate.set(date, (byDate.get(date) ?? 0) + count);
    }
  }

  // Walk back from today so the grid is dense — LeetCode only returns active days.
  const days: LeetcodeDay[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i < CALENDAR_DAYS; i++) {
    const date = new Date(cursor.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    days.push({ date, count: byDate.get(date) ?? 0 });
  }
  return days.reverse();
}

function summarize(calendar: LeetcodeDay[]) {
  let activeDays = 0;
  let maxStreak = 0;
  let runningStreak = 0;
  let submissionsPastYear = 0;

  for (const day of calendar) {
    submissionsPastYear += day.count;
    if (day.count > 0) {
      activeDays++;
      runningStreak++;
      maxStreak = Math.max(maxStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }

  // A streak stays alive until today is missed, so ignore an inactive today.
  let currentStreak = 0;
  for (let i = calendar.length - 1; i >= 0; i--) {
    if (calendar[i].count > 0) currentStreak++;
    else if (i !== calendar.length - 1) break;
  }

  return { activeDays, maxStreak, currentStreak, submissionsPastYear };
}

export async function getLeetcodeActivity(): Promise<LeetcodeActivity> {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/${LEETCODE_USER}/`,
      },
      body: JSON.stringify({
        query: PROFILE_QUERY,
        variables: {
          username: LEETCODE_USER,
          year: new Date().getUTCFullYear(),
          previousYear: new Date().getUTCFullYear() - 1,
        },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) throw new Error(`LeetCode API ${response.status}`);

    const { data } = (await response.json()) as ProfileResponse;
    const user = data?.matchedUser;
    if (!user) throw new Error(`No LeetCode user "${LEETCODE_USER}"`);

    const accepted = user.submitStats?.acSubmissionNum;
    const attempted = user.submitStats?.totalSubmissionNum;
    const calendar = buildCalendar([
      user.currentYear?.submissionCalendar,
      user.previousYear?.submissionCalendar,
    ]);
    const { activeDays, maxStreak, currentStreak, submissionsPastYear } = summarize(calendar);

    return {
      totalSolved: countFor(accepted, "All"),
      totalQuestions: countFor(data?.allQuestionsCount, "All"),
      easySolved: countFor(accepted, "Easy"),
      easyTotal: countFor(data?.allQuestionsCount, "Easy"),
      mediumSolved: countFor(accepted, "Medium"),
      mediumTotal: countFor(data?.allQuestionsCount, "Medium"),
      hardSolved: countFor(accepted, "Hard"),
      hardTotal: countFor(data?.allQuestionsCount, "Hard"),
      totalSubmissions: attempted?.find((stat) => stat.difficulty === "All")?.submissions ?? 0,
      submissionsPastYear,
      activeDays,
      maxStreak,
      currentStreak,
      calendar,
    };
  } catch {
    return FALLBACK_ACTIVITY;
  }
}
