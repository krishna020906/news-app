// File: components/Recommendation.jsx
import React from 'react';

export default function Recommendation({ items = [] }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)"
      }}
    >
      <h3 className="font-semibold" style={{ color: "var(--text-title)" }}>
        Recommendation
      </h3>

      <p className="mt-2 text-sm" style={{ color: "var(--text-body)" }}>
        Personalized picks based on your interests
      </p>

      <div className="mt-4 space-y-3">
        {items.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <img src={a.image} className="w-12 h-12 object-cover rounded-md" />
            <div>
              <div className="text-sm font-medium line-clamp-2" style={{ color: "var(--text-title)" }}>
                {a.title}
              </div>
              <div className="text-xs" style={{ color: "var(--text-body)" }}>
                {a.source} · {a.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


