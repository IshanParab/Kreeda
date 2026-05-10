"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Article {
  _id?: string;
  title: string;
  link: string;
  source: string;
  pubDate?: string;
  type: "general" | "goa_local";
  sport?: string;
}

export default function NewsFeed() {
  const { status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedSport, setSelectedSport] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      const query = selectedSport !== "All" ? `?sport=${encodeURIComponent(selectedSport)}` : "";
      fetch(`/api/news${query}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.articles) {
            setArticles(data.articles);
          }
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [status, router, selectedSport]);

  if (loading) return <div className="p-8">Loading News Feed...</div>;
  const availableSports = Array.from(
    new Set(articles.map((article) => article.sport).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-600">Sports News & Goa Events</h1>
        <div className="mb-6 flex items-center gap-2">
          <label className="text-sm font-medium" htmlFor="sport-filter">
            Filter by sport:
          </label>
          <select
            id="sport-filter"
            value={selectedSport}
            onChange={(e) => {
              setLoading(true);
              setSelectedSport(e.target.value);
            }}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="All">All</option>
            {availableSports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6">
          {articles.length === 0 ? (
            <p>No news found at the moment.</p>
          ) : (
             articles.map((article, idx) => (
               <a
                 key={idx}
                 href={article.link}
                 target="_blank"
                 rel="noopener noreferrer"
                  className={`block bg-white shadow rounded-lg p-6 hover:shadow-md transition ${article.type === 'goa_local' ? 'border-l-4 border-green-500' : 'border-l-4 border-indigo-500'}`}
                >
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${article.type === 'goa_local' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                        {article.type === 'goa_local' ? 'Goa Local' : 'National'}
                      </span>
                      {article.sport ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                          {article.sport}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs text-gray-500">
                      {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : "Unknown date"}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
                  <p className="text-sm text-gray-600">Source: {article.source}</p>
                </a>
             ))
          )}
        </div>
      </div>
    </div>
  );
}
