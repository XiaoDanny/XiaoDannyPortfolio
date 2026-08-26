import { NextResponse } from "next/server";

type BeyondStats = {
  clicks: number;
  bestVisitorTime: number | null;
  views: number;
};

type VotingSong = { id: number; title: string; votes: number };
type SentenceRecords = Record<string, number>;

declare global {
  var beyondStats: BeyondStats | undefined;
  var sentenceRecords: SentenceRecords | undefined;
  var sentenceRecordsVersion: number | undefined;
}

const stats: BeyondStats = globalThis.beyondStats ?? {
  clicks: 0,
  bestVisitorTime: null,
  views: 0,
};
stats.views ??= 0;
globalThis.beyondStats = stats;
const sentenceRecords: SentenceRecords = globalThis.sentenceRecords ?? {};
if (globalThis.sentenceRecordsVersion !== 2) {
  Object.keys(sentenceRecords).forEach((sentence) => {
    sentenceRecords[sentence] = 100;
  });
  globalThis.sentenceRecordsVersion = 2;
}
globalThis.sentenceRecords = sentenceRecords;

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

export async function GET() {
  return NextResponse.json({ ...stats, songs: votingSongs, sentenceRecords });
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
    stats.clicks += 1;
  }

  if (body?.type === "view") {
    stats.views += 1;
  }

  if (body?.type === "race" && typeof body.sentence === "string" && typeof body.time === "number" && body.time > 0 && body.time < 3600) {
    const currentRecord = sentenceRecords[body.sentence] ?? 100;
    if (body.time < currentRecord) sentenceRecords[body.sentence] = body.time;
    stats.bestVisitorTime = stats.bestVisitorTime === null
      ? body.time
      : Math.min(stats.bestVisitorTime, body.time);
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

  return NextResponse.json({ ...stats, songs: votingSongs, sentenceRecords });
}
