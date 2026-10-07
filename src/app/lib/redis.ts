import { Redis } from "@upstash/redis";

type RedisLike = Pick<Redis, "get" | "set" | "incr" | "eval">;

const localMemory = new Map<string, unknown>();

const fallbackRedis: RedisLike = {
  async get<T>(key: string) {
    return (localMemory.get(key) as T | undefined) ?? null;
  },
  async set<T>(key: string, value: T) {
    localMemory.set(key, value);
    return value;
  },
  async incr(key: string) {
    const current = Number(localMemory.get(key) ?? 0);
    const nextValue = current + 1;
    localMemory.set(key, nextValue);
    return nextValue;
  },
  async eval() {
    throw new Error("Lua scripts need a real Redis connection");
  },
};

// KV_REST_API_* is what this project (and Vercel's Upstash integration) provides;
// UPSTASH_REDIS_REST_* is what Upstash itself names them, accepted so a rename can't
// silently disconnect the site from its data.
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Callers that must never run against the in-memory fallback (the view counter) check this.
export const redisConfigured = Boolean(redisUrl && redisToken);

if (!redisConfigured && process.env.VERCEL_ENV === "production") {
  console.error(
    "[redis] Missing KV_REST_API_URL/KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN) in production. " +
      "The view counter is disabled and TypeRacer records are falling back to per-instance memory.",
  );
}

export const redis: RedisLike = redisConfigured
  ? new Redis({ url: redisUrl!, token: redisToken! })
  : fallbackRedis;
