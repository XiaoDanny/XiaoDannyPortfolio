import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

type VotingSong = { id: number; title: string; votes: number };
type SentenceRecords = Record<string, number>;

const CLICK_COUNT_KEY = "stats:click_count";
const TOTAL_VIEWS_KEY = "stats:total_views";
const TYPERACER_RECORD_KEY = "stats:typeracer_record";

declare global {
  var bestVisitorTime: number | null | undefined;
}

// bestVisitorTime stays in-memory — unused by the frontend, unaffected by the Redis migration
let bestVisitorTime: number | null = globalThis.bestVisitorTime ?? null;
globalThis.bestVisitorTime = bestVisitorTime;

const currentSongs: VotingSong[] = [
  { id: 1, title: "How to Train Your Dragon", votes: 0 },
  { id: 2, title: "Merry-Go-Round of Life", votes: 0 },
  { id: 3, title: "Oogway Ascends", votes: 0 },
  { id: 4, title: "The Lord of the Rings", votes: 0 },
];
const votingSongs: VotingSong[] = globalThis.votingSongs?.length === currentSongs.length
  && globalThis.votingSongs.every((song, index) => song.title === currentSongs[index].title)
  ? globalThis.votingSongs
  : currentSongs;
globalThis.votingSongs = votingSongs;

declare global {
  var votingSongs: VotingSong[] | undefined;
  var pendingSongRequests: string[] | undefined;
}

const pendingSongRequests = globalThis.pendingSongRequests ?? [];
globalThis.pendingSongRequests = pendingSongRequests;

async function getStatsPayload() {
  const [clicks, views, sentenceRecords] = await Promise.all([
    redis.get<number>(CLICK_COUNT_KEY),
    redis.get<number>(TOTAL_VIEWS_KEY),
    redis.get<SentenceRecords>(TYPERACER_RECORD_KEY),
  ]);

  return {
    clicks: clicks ?? 0,
    views: views ?? 0,
    bestVisitorTime,
    songs: votingSongs,
    sentenceRecords: sentenceRecords ?? {},
  };
}

export async function GET() {
  return NextResponse.json(await getStatsPayload());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    type?: string;
    time?: number;
    songId?: number;
    previousSongId?: number | null;
    song?: string;
    sentence?: string;
  } | null;

  if (body?.type === "click") {
    await redis.incr(CLICK_COUNT_KEY);
  }

  if (body?.type === "view") {
    await redis.incr(TOTAL_VIEWS_KEY);
  }

  if (body?.type === "race" && typeof body.sentence === "string" && typeof body.time === "number" && body.time > 0 && body.time < 3600) {
    const sentenceRecords = (await redis.get<SentenceRecords>(TYPERACER_RECORD_KEY)) ?? {};
    const currentRecord = sentenceRecords[body.sentence] ?? 100;
    if (body.time < currentRecord) {
      sentenceRecords[body.sentence] = body.time;
      await redis.set(TYPERACER_RECORD_KEY, sentenceRecords);
    }
    bestVisitorTime = bestVisitorTime === null ? body.time : Math.min(bestVisitorTime, body.time);
    globalThis.bestVisitorTime = bestVisitorTime;
  }

  if (body?.type === "vote" && typeof body.songId === "number") {
    if (typeof body.previousSongId === "number" && body.previousSongId !== body.songId) {
      const previousSong = votingSongs.find((candidate) => candidate.id === body.previousSongId);
      if (previousSong && previousSong.votes > 0) previousSong.votes -= 1;
    }
    const song = votingSongs.find((candidate) => candidate.id === body.songId);
    if (song) song.votes += 1;
  }

  if (body?.type === "request" && typeof body.song === "string") {
    const song = body.song.trim();
    if (song.length >= 2 && song.length <= 120) pendingSongRequests.push(song);
  }

  return NextResponse.json(await getStatsPayload());
}
