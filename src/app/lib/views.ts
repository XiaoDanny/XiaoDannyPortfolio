import { createHmac } from "node:crypto";
import { redis, redisConfigured } from "./redis";

// What counts as one view: the homepage finished loading in a real browser, its JS ran and
// POSTed to /api/views, the request came to the production deployment, and that visitor
// (hashed IP + user agent) hasn't had a view counted within the cooldown below.

export const TOTAL_VIEWS_KEY = "stats:total_views";

// 30 minutes is the conventional web-analytics session timeout: long enough that reloading,
// re-opening the tab or bouncing between the site and a résumé adds nothing, short enough that
// someone who comes back later in the day (a recruiter re-checking before a call) counts again.
// It's a fixed window from the counted view — reloads during it don't extend it.
export const VIEW_COOLDOWN_SECONDS = 30 * 60;

// One temporary key per visitor, expiring after the cooldown.
const VISITOR_COOLDOWN_KEY_PREFIX = "views:cooldown:";

// Runs as one atomic step inside Redis (one round trip, nothing can run in between): start the
// visitor's cooldown and, only if it wasn't already running, count the view. There's no gap
// where the cooldown exists but the count never happened, and a retried request just finds the
// cooldown in place, so a view is neither lost nor double-counted. Returns [counted (1/0), total].
const REGISTER_VIEW_SCRIPT = `
if redis.call("SET", KEYS[1], "1", "NX", "EX", ARGV[1]) then
  return { 1, redis.call("INCR", KEYS[2]) }
end
return { 0, tonumber(redis.call("GET", KEYS[2]) or "0") }
`;

// The Upstash client retries failed requests with backoff and has no timeout of its own, so
// an unreachable Redis could otherwise stall the homepage or hold /api/views open indefinitely.
const READ_TIMEOUT_MS = 1500;
const REGISTER_TIMEOUT_MS = 3000;

// Real browsers all send a "Mozilla/5.0 ..." user agent; this list only catches the automated
// clients that also run JavaScript or imitate a browser (Googlebot's renderer, Lighthouse,
// headless Chrome, link-preview fetchers, uptime checkers).
const AUTOMATED_USER_AGENT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|pingdom|uptime|phantom|selenium|puppeteer|playwright/i;

// Keyed hash so the Redis keys can't be reversed back to an IP by brute-forcing the address
// space. VIEW_DEDUPE_SALT should be its own random secret; the Redis token (also stable and
// server-only) is only a fallback so a missing variable doesn't stop counting.
const HASH_SECRET = process.env.VIEW_DEDUPE_SALT || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

if (!process.env.VIEW_DEDUPE_SALT && redisConfigured && process.env.VERCEL_ENV === "production") {
  console.warn("[views] VIEW_DEDUPE_SALT is not set; hashing visitor IDs with the Redis token instead.");
}

type ViewResult = { views: number | null; counted: boolean };

function isProductionDeployment() {
  // NODE_ENV guards against `next dev` run with a pulled production env.
  return process.env.VERCEL_ENV === "production" && process.env.NODE_ENV === "production";
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Redis timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function hash(value: string) {
  return createHmac("sha256", HASH_SECRET).update(value).digest("base64url");
}

// On Vercel these headers are set by the edge and can't be spoofed by the client.
function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

function isSameOriginBrowserRequest(headers: Headers) {
  const userAgent = headers.get("user-agent") ?? "";
  if (!userAgent.startsWith("Mozilla/5.0") || AUTOMATED_USER_AGENT.test(userAgent)) return false;

  // Browsers always attach Origin to a fetch() POST; plain HTTP clients and other sites' pages don't match.
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function getViewCount(): Promise<number | null> {
  // Never show the in-memory fallback's number as the site's view count.
  if (!redisConfigured) return null;
  try {
    const views = await withTimeout(redis.get<number>(TOTAL_VIEWS_KEY), READ_TIMEOUT_MS);
    return Number(views ?? 0);
  } catch (error) {
    console.error("[views] Failed to read view count", error);
    return null;
  }
}

export function registerView(headers: Headers): Promise<ViewResult> {
  return withTimeout(registerViewUnbounded(headers), REGISTER_TIMEOUT_MS);
}

async function registerViewUnbounded(headers: Headers): Promise<ViewResult> {
  if (!redisConfigured || !isProductionDeployment() || !isSameOriginBrowserRequest(headers)) {
    return { views: await getViewCount(), counted: false };
  }

  const visitor = hash(`${clientIp(headers)}\n${headers.get("user-agent")}`);
  const [counted, views] = await redis.eval<[number], [number, number]>(
    REGISTER_VIEW_SCRIPT,
    [`${VISITOR_COOLDOWN_KEY_PREFIX}${visitor}`, TOTAL_VIEWS_KEY],
    [VIEW_COOLDOWN_SECONDS],
  );
  return { views, counted: counted === 1 };
}
