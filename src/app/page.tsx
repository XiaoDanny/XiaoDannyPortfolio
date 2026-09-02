import { redis } from "./lib/redis";
import { getGithubActivity } from "./lib/githubActivity";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const [views, githubActivity] = await Promise.all([
    redis.incr("stats:total_views"),
    getGithubActivity(),
  ]);
  return <HomeClient initialViews={views} githubActivity={githubActivity} />;
}
