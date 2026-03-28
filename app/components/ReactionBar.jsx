//app/compnents/ReactionBar.jsx
"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";

const REACTIONS = [
  { key: "hot_take", label: "Hot Take", emoji: "😤" },
  { key: "insight", label: "Insight", emoji: "💡" },
  { key: "funny", label: "Funny", emoji: "😂" },
  { key: "mind_blown", label: "Mind Blown", emoji: "🤯" },
];

export default function ReactionBar({ newsId, initialCounts }) {
  const [counts, setCounts] = useState(initialCounts || {});
  const [userReaction, setUserReaction] = useState(null);

  // const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const total = Object.values(counts || {}).reduce((a, b) => a + b, 0);

  const topReaction = REACTIONS.reduce((max, r) => {
    return (counts[r.key] || 0) > (counts[max.key] || 0) ? r : max;
  }, REACTIONS[0]);

  const topPercent =
    total > 0
      ? Math.round(((counts[topReaction.key] || 0) / total) * 100)
      : 0;

  

  async function handleReact(type) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      

      if (!user) {
        console.error("User not logged in");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`/api/news/${newsId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ THIS WAS MISSING
        },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (data.ok) {
        setCounts(data.reactions);
        setUserReaction((prev) => (prev === type ? null : type));
      } else {
        console.error("API error:", data.error);
      }
    } catch (err) {
      console.error(err);
    }
    console.log("newsId:", newsId);
  }

  return (
    <div className="mt-6 space-y-4">

      {/* 🔥 MOST POPULAR */}
      {total > 0 && (
        <div className="text-sm font-medium">
          🔥 Most readers felt:{" "}
          <span className="text-orange-500">
            {topReaction.emoji} {topReaction.label}
          </span>{" "}
          ({topPercent}%)
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => handleReact(r.key)}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition ${
              userReaction === r.key
                ? "bg-orange-500 text-white border-orange-500"
                : "border-[var(--card-border)] hover:border-orange-500 hover:scale-105 active:scale-95"
            }`}
          >
            <span>{r.emoji}</span>
            <span>{r.label}</span>
            <span className="text-xs opacity-70">
              {counts[r.key] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}