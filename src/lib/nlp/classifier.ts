import stringSimilarity from "string-similarity";

const sportKeywords: Record<string, string[]> = {
  football: ["football", "soccer", "fc goa", "isl", "goal", "fifa"],
  badminton: ["badminton", "shuttle", "smash", "court", "pvl", "saina", "sindhu"],
  tableTennis: ["table tennis", "ping pong", "paddler", "tt"],
  cricket: ["cricket", "bcci", "ipl", "wickets", "runs", "batsman", "bowler"],
  running: ["running", "marathon", "sprint", "athletics", "track"],
  cycling: ["cycling", "cyclist", "pedal", "tour de"],
};

export function classifySport(text: string): string {
  const lowerText = text.toLowerCase();

  for (const [sport, keywords] of Object.entries(sportKeywords)) {
    for (const keyword of keywords) {
      // Use regex with word boundaries to avoid partial matches like "scrolling" -> "rolling"
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(lowerText)) {
        return sport;
      }
    }
  }
  return "general";
}

export function isDuplicate(newTitle: string, existingTitles: string[], threshold = 0.8): boolean {
  if (existingTitles.length === 0) return false;

  const matches = stringSimilarity.findBestMatch(newTitle, existingTitles);
  return matches.bestMatch.rating >= threshold;
}
