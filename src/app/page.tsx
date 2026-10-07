import { getViewCount } from "./lib/views";
import { getGithubActivity } from "./lib/githubActivity";
import { getLeetcodeActivity } from "./lib/leetcodeActivity";
import HomeClient from "./components/HomeClient";

// Always render per request, so the view count is current and the page can't silently turn
// static when Redis env vars are missing at build time. The GitHub/LeetCode fetches set their
// own revalidate, so they stay cached.
export const dynamic = "force-dynamic";

export default async function Home() {
  // Read-only: views are registered by the browser via /api/views, never by rendering.
  const [views, githubActivity, leetcodeActivity] = await Promise.all([
    getViewCount(),
    getGithubActivity(),
    getLeetcodeActivity(),
  ]);
  return <HomeClient initialViews={views} githubActivity={githubActivity} leetcodeActivity={leetcodeActivity} />;
}
