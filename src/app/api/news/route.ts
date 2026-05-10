import { NextResponse } from "next/server";
import { ensureNewsSchedulerStarted } from "@/lib/newsScheduler";
import { getCachedNews, refreshNewsCache } from "@/lib/newsAggregator";

export async function GET(req: Request) {
  try {
    ensureNewsSchedulerStarted();
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get("sport") || undefined;
    const refresh = searchParams.get("refresh") === "true";

    let articles = refresh
      ? await refreshNewsCache()
      : await getCachedNews(sport);
    if (!articles.length) {
      await refreshNewsCache();
      articles = await getCachedNews(sport);
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
