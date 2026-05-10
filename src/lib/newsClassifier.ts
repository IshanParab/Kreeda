import { SPORT_KEYWORDS } from "@/lib/sportsKeywords";
import { compareTwoStrings } from "string-similarity";

export function detectSport(text: string): string {
  const normalized = text.toLowerCase();
  let bestSport = "General";
  let maxHits = 0;

  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    const hits = keywords.reduce(
      (count, keyword) => count + (normalized.includes(keyword) ? 1 : 0),
      0
    );
    if (hits > maxHits) {
      maxHits = hits;
      bestSport = sport;
    }
  }

  return bestSport;
}

export function isDuplicateTitle(a: string, b: string): boolean {
  return compareTwoStrings(a.toLowerCase(), b.toLowerCase()) >= 0.82;
}
