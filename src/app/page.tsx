import { redis } from "./lib/redis";
import { getGithubActivity } from "./lib/githubActivity";
import { getLeetcodeActivity } from "./lib/leetcodeActivity";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const [views, githubActivity, leetcodeActivity] = await Promise.all([
    redis.incr("stats:total_views"),
    getGithubActivity(),
    getLeetcodeActivity(),
  ]);
  return <HomeClient initialViews={views} githubActivity={githubActivity} leetcodeActivity={leetcodeActivity} />;
}
