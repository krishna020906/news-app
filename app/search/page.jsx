"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";


export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    async function fetchResults() {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    }

    fetchResults();
  }, [q]);

  if (!q) {
    return <p className="p-6">Start searching for news</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Search results for “{q}”
      </h1>

      {loading && <p>Searching…</p>}

      {!loading && results.length === 0 && (
        <p>No results found.</p>
      )}

      {results.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          onOpen={() => router.push(`/news/${article._id}`)}
        />
      ))}
    </div>
  );
}
