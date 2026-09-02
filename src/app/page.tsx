import { redis } from "./lib/redis";
import { getGithubActivity } from "./lib/githubActivity";
import { getLeetcodeActivity } from "./lib/leetcodeActivity";
import { getLatestVideo } from "./lib/youtubeActivity";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const [views, githubActivity, leetcodeActivity, latestVideo] = await Promise.all([
    redis.incr("stats:total_views"),
    getGithubActivity(),
    getLeetcodeActivity(),
    getLatestVideo(),
  ]);
  return <HomeClient initialViews={views} githubActivity={githubActivity} leetcodeActivity={leetcodeActivity} latestVideo={latestVideo} />;
}
