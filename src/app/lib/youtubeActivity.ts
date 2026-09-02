export interface LatestVideo {
  id: string;
  title: string;
  views: string;
}

const REVALIDATE_SECONDS = 3600;

function requiredEnv(name: "YOUTUBE_API_KEY" | "YOUTUBE_CHANNEL_ID") {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function youtubeFetch<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams({ ...params, key: requiredEnv("YOUTUBE_API_KEY") });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}?${searchParams}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`YouTube API ${response.status}`);
  return response.json() as Promise<T>;
}

type ChannelListResponse = {
  items?: Array<{ contentDetails?: { relatedPlaylists?: { uploads?: string } } }>;
};

type PlaylistItemsResponse = {
  items?: Array<{ snippet?: { title?: string; resourceId?: { videoId?: string } } }>;
};

type VideosResponse = {
  items?: Array<{ statistics?: { viewCount?: string } }>;
};

export async function getLatestVideo(): Promise<LatestVideo | null> {
  try {
    const channel = await youtubeFetch<ChannelListResponse>("channels", {
      part: "contentDetails",
      id: requiredEnv("YOUTUBE_CHANNEL_ID"),
    });
    const uploadsPlaylistId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error("YouTube uploads playlist not found");

    const playlist = await youtubeFetch<PlaylistItemsResponse>("playlistItems", {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: "1",
    });
    const latestItem = playlist.items?.[0]?.snippet;
    const id = latestItem?.resourceId?.videoId;
    const title = latestItem?.title;
    if (!id || !title) throw new Error("Latest YouTube video not found");

    const videos = await youtubeFetch<VideosResponse>("videos", {
      part: "statistics",
      id,
    });
    const viewCount = videos.items?.[0]?.statistics?.viewCount;
    const numericViewCount = Number(viewCount);
    if (!Number.isFinite(numericViewCount)) throw new Error("YouTube view count not found");

    return { id, title, views: numericViewCount.toLocaleString() };
  } catch {
    return null;
  }
}
