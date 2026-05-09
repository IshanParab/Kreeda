"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NewsFeed() {
  const { status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetch("/api/news")
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
  }, [status, router]);

  if (loading) return <div className="p-8">Loading News Feed...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-600">Sports News & Goa Events</h1>

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
                 <div className="flex justify-between items-start mb-2">
                     <span className={`text-xs font-semibold px-2 py-1 rounded-full ${article.type === 'goa_local' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                         {article.type === 'goa_local' ? 'Goa Local' : 'National'}
                     </span>
                     <span className="text-xs text-gray-500">{new Date(article.pubDate).toLocaleDateString()}</span>
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
