import { NextResponse } from "next/server";
import Parser from "rss-parser";
import dbConnect from "@/lib/mongoose";
import Article from "@/models/Article";
import Competition from "@/models/Competition";
import { classifySport, isDuplicate } from "@/lib/nlp/classifier";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This ensures Vercel Cron can trigger it without authentication,
// but we check for a secret to prevent unauthorized public access if desired.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow execution without secret for local testing if CRON_SECRET is not set
      if(process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  }

  try {
    await dbConnect();
    const parser = new Parser();
    const results = [];

    // Get last 100 article titles for deduplication context
    const existingArticles = await Article.find().sort({ createdAt: -1 }).limit(100).select('title');
    const existingTitles = existingArticles.map(a => a.title);

    // 1. Fetch Reddit Goa RSS
    try {
      const feed = await parser.parseURL('https://www.reddit.com/r/Goa/search.rss?q=sports+OR+football+OR+tournament+OR+marathon&restrict_sr=on&sort=new&t=all');

      for (const item of feed.items) {
          if (item.title && item.link && !isDuplicate(item.title, existingTitles)) {
              results.push({
                  title: item.title,
                  link: item.link,
                  source: "Reddit r/Goa",
                  pubDate: new Date(item.pubDate || new Date()),
                  type: "goa_local",
                  sportCategory: classifySport(item.title + " " + (item.contentSnippet || ""))
              });
              existingTitles.push(item.title); // Update array to prevent duplicates within the same batch
          }
      }
    } catch (e) {
      console.error("Reddit RSS cron error:", e);
    }

    // 2. Fetch News API
    const newsApiKey = process.env.NEWS_API_KEY;
    if (newsApiKey) {
        try {
            const newsRes = await fetch(`https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=${newsApiKey}`);
            const newsData = await newsRes.json();
            if (newsData.articles) {
                for(const a of newsData.articles) {
                    if (a.title && a.url && !isDuplicate(a.title, existingTitles)) {
                        results.push({
                            title: a.title,
                            link: a.url,
                            source: a.source.name,
                            pubDate: new Date(a.publishedAt),
                            type: "general",
                            sportCategory: classifySport(a.title + " " + (a.description || ""))
                        });
                        existingTitles.push(a.title);
                    }
                }
            }
        } catch(e) {
            console.error("NewsAPI cron error:", e);
        }
    }

    // Save unique articles
    if (results.length > 0) {
        await Article.insertMany(results, { ordered: false }).catch(e => console.log("Some articles might be dupes based on unique link index, ignoring."));
    }

    // 3. AI Extraction: Look for potential local competitions in 'goa_local' news
    const localNews = results.filter(r => r.type === 'goa_local');
    if (localNews.length > 0) {
        const textToAnalyze = localNews.map(n => `Title: ${n.title}, Link: ${n.link}`).join('\n---\n');

        const prompt = `
        Analyze the following recent news items from Goa. Identify any sports tournaments, marathons, or competitions mentioned.
        If you find any, extract them into a strict JSON array format.
        If you find none, return an empty array [].

        JSON Structure per item:
        {
            "title": "Name of the tournament/event",
            "sport": "Type of sport (e.g., football, marathon, badminton)",
            "date": "Extracted date or 'Upcoming'",
            "location": "Location in Goa if mentioned, else 'Goa'",
            "sourceLink": "The link provided in the item"
        }

        News Items:
        ${textToAnalyze}

        Return ONLY valid JSON.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            let responseText = response.text || "[]";
            // Strip markdown block formatting if Gemini adds it
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            const extractedEvents = JSON.parse(responseText);

            if (Array.isArray(extractedEvents) && extractedEvents.length > 0) {
                const compsToInsert = extractedEvents.map(evt => ({
                    ...evt,
                    isAiGenerated: true,
                    status: 'pending' // Admin needs to approve
                }));
                await Competition.insertMany(compsToInsert);
            }

        } catch (e) {
            console.error("AI Extraction error:", e);
        }
    }

    return NextResponse.json({ success: true, articlesAdded: results.length });
  } catch (error) {
    console.error("Cron scrape error:", error);
    return NextResponse.json({ error: "Failed to scrape" }, { status: 500 });
  }
}
