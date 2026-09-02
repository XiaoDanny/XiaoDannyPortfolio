import { Redis } from "@upstash/redis";

type RedisLike = Pick<Redis, "get" | "set" | "incr">;

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
};

const hasRedisConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export const redis: RedisLike = hasRedisConfig
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : fallbackRedis;
