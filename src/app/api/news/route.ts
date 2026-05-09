import { NextResponse } from "next/server";
import Parser from "rss-parser";

export async function GET() {
  try {
    const parser = new Parser();
    const results = [];

    // 1. Fetch general sports news using NewsAPI
    const newsApiKey = process.env.NEWS_API_KEY;
    if (newsApiKey) {
        try {
            const newsRes = await fetch(`https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=${newsApiKey}`);
            const newsData = await newsRes.json();
            if (newsData.articles) {
                const articles = newsData.articles.map((a: any) => ({
                    title: a.title,
                    link: a.url,
                    source: a.source.name,
                    pubDate: a.publishedAt,
                    type: "general"
                }));
                results.push(...articles.slice(0, 5)); // Keep it small
            }
        } catch(e) {
            console.error("NewsAPI error:", e);
        }
    }

    // 2. Scraper/RSS approach for Goa
    // We use Reddit RSS as a mock for the "Goa Govt/College" scraping requirement,
    // focusing on the r/Goa subreddit and looking for sports/events context.
    try {
      const feed = await parser.parseURL('https://www.reddit.com/r/Goa/search.rss?q=sports+OR+football+OR+event+OR+marathon&restrict_sr=on&sort=new&t=all');

      const goaArticles = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        source: "Reddit r/Goa",
        pubDate: item.pubDate,
        type: "goa_local"
      }));
      results.push(...goaArticles.slice(0, 5));
    } catch (e) {
      console.error("Reddit RSS error:", e);
    }

    return NextResponse.json({ articles: results });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
