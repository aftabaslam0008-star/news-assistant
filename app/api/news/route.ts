import { NextRequest, NextResponse } from "next/server";
import { newsItems as demoNewsItems, NewsItem } from "../../../data/news";

const allowedLanguages = new Set(["en", "ur", "hi", "ar", "fr", "de", "es"]);
const allowedCountries = new Set(["pk", "us", "gb", "in", "ca", "au"]);
const allowedCategories = new Set([
  "general",
  "world",
  "business",
  "technology",
  "science",
  "entertainment",
  "sports",
  "health",
]);

// Fallback search and category filter across the curated news repository
function filterInternalNews(
  category: string,
  search: string,
  country: string
): NewsItem[] {
  const q = search.toLowerCase().trim();
  const cat = category.toLowerCase().trim();

  let filtered = [...demoNewsItems];

  if (cat && cat !== "general" && cat !== "top stories") {
    filtered = filtered.filter((item) => {
      const itemCat = item.category.toLowerCase();
      if (cat === "entertainment") return itemCat === "culture" || itemCat === "entertainment";
      return itemCat === cat;
    });
  }

  if (country) {
    const countrySpecific = filtered.filter((item) => item.country === country || item.country === "worldwide");
    if (countrySpecific.length > 0) {
      filtered = countrySpecific;
    }
  }

  if (q.length >= 2) {
    const scored = filtered.map((item) => {
      const text = `${item.title} ${item.summary} ${item.source} ${item.category}`.toLowerCase();
      let score = 0;
      const terms = q.split(/\s+/).filter(Boolean);
      for (const term of terms) {
        if (text.includes(term)) score += 2;
      }
      return { item, score };
    });

    const matches = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
    if (matches.length > 0) {
      return matches.map((m) => m.item);
    }
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const rawApiKey = process.env.GNEWS_API_KEY || "";
    const apiKey = rawApiKey.trim();
    const hasLiveKey = apiKey.length > 0 && apiKey !== "your_gnews_api_key_here";

    const input = request.nextUrl.searchParams;
    const search = input.get("q")?.trim().slice(0, 200) || "";
    const requestedLanguage = input.get("lang") || "en";
    const requestedCountry = input.get("country") || "";
    const requestedCategory = input.get("category") || "general";
    const requestedPage = Number(input.get("page") || "1");

    const page = Number.isInteger(requestedPage)
      ? Math.min(Math.max(requestedPage, 1), 10)
      : 1;

    const language = allowedLanguages.has(requestedLanguage)
      ? requestedLanguage
      : "en";
    const country = allowedCountries.has(requestedCountry)
      ? requestedCountry
      : "";
    const category = allowedCategories.has(requestedCategory)
      ? requestedCategory
      : "general";

    // 1. If GNews API key is provided, attempt live fetch
    if (hasLiveKey) {
      try {
        const endpointName = search ? "search" : "top-headlines";
        const parameters = new URLSearchParams({
          lang: language,
          max: "10",
          page: String(page),
          apikey: apiKey,
        });

        if (search) parameters.set("q", search);
        else parameters.set("category", category);
        if (country) parameters.set("country", country);

        const response = await fetch(
          `https://gnews.io/api/v4/${endpointName}?${parameters.toString()}`,
          { next: { revalidate: 300 } }
        );

        if (response.ok) {
          const data = await response.json();
          const articles = (data.articles || []).map(
            (
              article: {
                title?: string;
                description?: string;
                image?: string;
                url?: string;
                publishedAt?: string;
                source?: { name?: string; url?: string };
              },
              index: number
            ) => ({
              id: `${article.url || "article"}-${index}`,
              title: article.title || "Untitled article",
              summary: article.description || "No description is available.",
              image: article.image || "/globe.svg",
              source: article.source?.name || "Global Desk",
              sourceUrl: article.source?.url || "",
              url: article.url || "",
              publishedAt: article.publishedAt || "",
              age: "Recent",
              readTime: "4 min",
              category: requestedCategory,
              isVideo: false,
            })
          );

          if (articles.length > 0) {
            return NextResponse.json({
              articles,
              hasMore: articles.length === 10 && page < 10,
              page,
              isLive: true,
              filters: { country: country || "worldwide", language, category },
            });
          }
        }
      } catch (externalError) {
        console.warn("GNews live request failed, falling back to curated feed:", externalError);
      }
    }

    // 2. Resilient Fallback: Curated dynamic news feed matching the user's filters
    const fallbackList = filterInternalNews(category, search, country);
    const pageSize = 8;
    const startIndex = (page - 1) * pageSize;
    const paginated = fallbackList.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      articles: paginated.length > 0 ? paginated : fallbackList.slice(0, 8),
      hasMore: startIndex + pageSize < fallbackList.length,
      page,
      isLive: false,
      filters: { country: country || "worldwide", language, category },
    });
  } catch (error) {
    console.error("News route unexpected error:", error);
    // Even in unexpected errors, return standard articles instead of a breaking 500 error
    return NextResponse.json({
      articles: demoNewsItems.slice(0, 6),
      hasMore: false,
      page: 1,
      isLive: false,
    });
  }
}