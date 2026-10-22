import { NextRequest, NextResponse } from "next/server";
import { videoItems as demoVideoItems, VideoItem } from "../../../data/news";

function filterInternalVideos(search: string): VideoItem[] {
  const q = search.toLowerCase().trim();
  if (!q || q === "world news today") {
    return demoVideoItems;
  }

  const terms = q.split(/\s+/).filter(Boolean);
  const scored = demoVideoItems.map((video) => {
    const text = `${video.title} ${video.description || ""} ${video.channel}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (text.includes(term)) score += 2;
    }
    return { video, score };
  });

  const matches = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return matches.length > 0 ? matches.map((m) => m.video) : demoVideoItems;
}

// This route retrieves YouTube videos or falls back gracefully without exposing API keys
export async function GET(request: NextRequest) {
  try {
    const rawApiKey = process.env.YOUTUBE_API_KEY || "";
    const apiKey = rawApiKey.trim();
    const hasLiveKey = apiKey.length > 0 && apiKey !== "your_youtube_api_key_here";

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("q")?.trim() || "world news today";

    // 1. If YouTube API Key is configured, attempt live fetch
    if (hasLiveKey) {
      try {
        const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
        endpoint.searchParams.set("part", "snippet");
        endpoint.searchParams.set("type", "video");
        endpoint.searchParams.set("videoEmbeddable", "true");
        endpoint.searchParams.set("safeSearch", "moderate");
        endpoint.searchParams.set("order", "date");
        endpoint.searchParams.set("maxResults", "8");
        endpoint.searchParams.set("q", search);
        endpoint.searchParams.set("key", apiKey);

        const response = await fetch(endpoint.toString(), {
          next: { revalidate: 600 },
        });

        if (response.ok) {
          const data = await response.json();
          const videos = (data.items || []).map(
            (
              item: {
                id?: { videoId?: string };
                snippet?: {
                  title?: string;
                  description?: string;
                  channelTitle?: string;
                  publishedAt?: string;
                  thumbnails?: {
                    high?: { url?: string };
                    medium?: { url?: string };
                  };
                };
              },
              index: number
            ) => {
              const videoId = item.id?.videoId || "";
              return {
                id: index + 1,
                videoId,
                title: item.snippet?.title || "Untitled video",
                description: item.snippet?.description || "",
                channel: item.snippet?.channelTitle || "News Channel",
                image:
                  item.snippet?.thumbnails?.high?.url ||
                  item.snippet?.thumbnails?.medium?.url ||
                  "/globe.svg",
                url: `https://www.youtube.com/watch?v=${videoId}`,
                publishedAt: item.snippet?.publishedAt || "",
                views: "YouTube",
                age: "Recently published",
                duration: "Video",
              };
            }
          );

          if (videos.length > 0) {
            return NextResponse.json({ videos, isLive: true });
          }
        }
      } catch (externalError) {
        console.warn("YouTube live search failed, falling back to curated feed:", externalError);
      }
    }

    // 2. Fallback: Curated dynamic YouTube videos matching the search
    const videos = filterInternalVideos(search);
    return NextResponse.json({ videos, isLive: false });
  } catch (error) {
    console.error("YouTube route unexpected error:", error);
    return NextResponse.json({ videos: demoVideoItems, isLive: false });
  }
}