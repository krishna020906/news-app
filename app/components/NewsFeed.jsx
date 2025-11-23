// components/NewsFeed.jsx
"use client";

import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// simple "time ago" formatter
function formatTimeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString();
}

// take first ~40 words as summary
function makeSummary(content) {
  if (!content) return "";
  const words = content.trim().split(/\s+/);
  if (words.length <= 40) return content;
  return words.slice(0, 40).join(" ") + "…";
}

export default function NewsFeed({ onOpen, query }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/news");
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load news");
        }

        const mapped = (data.posts || []).map((p) => ({
          id: p._id,
          source: p.category || "Top Headlines",
          title: p.title,
          summary: makeSummary(p.content),
          image: p.mediaUrl || "",

          time: formatTimeAgo(p.createdAt),
          comments: p.commentsCount || 0,
          shares: 0,

          // dummy bias until you calculate real values
          bias: { proA: 0, proB: 0, neutral: 100 },

          // keep raw fields in case ArticleModal needs them
          _raw: p,
        }));

        if (!cancelled) {
          setArticles(mapped);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Failed to load news");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // optional search filter by title/content
  const filtered = articles.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="card p-4 animate-pulse">
          <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
          <div className="h-3 w-2/3 bg-gray-700 rounded" />
        </div>
        <div className="card p-4 animate-pulse">
          <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
          <div className="h-3 w-full bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4">
        <p className="card-body text-red-400 text-sm">
          Failed to load news: {error}
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="card p-4">
        <p className="card-body text-sm">No news found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((a) => (
        <ArticleCard
          key={a.id}
          article={a}
          onOpen={(art) => onOpen(art)}
        />
      ))}
    </div>
  );
}
