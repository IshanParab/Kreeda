import dbConnect from "@/lib/mongoose";
import { detectSport, isDuplicateTitle } from "@/lib/newsClassifier";
import NewsArticle from "@/models/NewsArticle";
import Parser from "rss-parser";

interface RawArticle {
  title: string;
  link: string;
  source: string;
  pubDate?: string;
  type: "general" | "goa_local";
}

interface NewsApiArticle {
  title?: string;
  url?: string;
  source?: { name?: string };
  publishedAt?: string;
}

const GOA_RSS_SOURCES = [
  {
    name: "Reddit r/Goa",
    url: "https://www.reddit.com/r/Goa/search.rss?q=sports+OR+football+OR+event+OR+marathon&restrict_sr=on&sort=new&t=all",
  },
];

function toIsoDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function deduplicateArticles(articles: RawArticle[]): RawArticle[] {
  const byLink = new Set<string>();
  const result: RawArticle[] = [];

  for (const article of articles) {
    if (!article.title || !article.link || byLink.has(article.link)) continue;
    const duplicate = result.some((existing) =>
      isDuplicateTitle(existing.title, article.title)
    );
    if (!duplicate) {
      byLink.add(article.link);
      result.push(article);
    }
  }

  return result;
}

export async function refreshNewsCache() {
  const parser = new Parser();
  const collected: RawArticle[] = [];
  const newsApiKey = process.env.NEWS_API_KEY;

  if (newsApiKey) {
    try {
      const newsRes = await fetch(
        `https://newsapi.org/v2/top-headlines?country=in&category=sports&pageSize=20&apiKey=${newsApiKey}`,
        { cache: "no-store" }
      );
      const newsData = (await newsRes.json()) as { articles?: NewsApiArticle[] };
      const fetched = (newsData.articles || []).map((a) => ({
        title: a.title || "",
        link: a.url || "",
        source: a.source?.name || "NewsAPI",
        pubDate: a.publishedAt,
        type: "general" as const,
      }));
      collected.push(...fetched);
    } catch (error) {
      console.error("NewsAPI refresh failed:", error);
    }
  }

  for (const source of GOA_RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const feedArticles = (feed.items || []).map((item) => ({
        title: item.title || "",
        link: item.link || "",
        source: source.name,
        pubDate: item.pubDate,
        type: "goa_local" as const,
      }));
      collected.push(...feedArticles);
    } catch (error) {
      console.error(`RSS refresh failed for ${source.name}:`, error);
    }
  }

  const deduped = deduplicateArticles(collected);
  await dbConnect();

  if (deduped.length > 0) {
    await Promise.all(
      deduped.map((item) =>
        NewsArticle.findOneAndUpdate(
          { link: item.link },
          {
            title: item.title,
            source: item.source,
            pubDate: toIsoDate(item.pubDate),
            type: item.type,
            sport: detectSport(`${item.title}`),
            scrapedAt: new Date(),
          },
          { upsert: true, new: true }
        )
      )
    );
  }

  return NewsArticle.find({})
    .sort({ pubDate: -1, createdAt: -1 })
    .limit(100)
    .lean();
}

export async function getCachedNews(sport?: string) {
  await dbConnect();
  const filter = sport && sport !== "All" ? { sport } : {};
  return NewsArticle.find(filter)
    .sort({ pubDate: -1, createdAt: -1 })
    .limit(100)
    .lean();
}
