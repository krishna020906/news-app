

// File: components/Recommendation.jsx
import React from 'react';

export default function Recommendation({ items = [] }) {
  return (
    <div className="rounded-2xl bg-white border p-4">
      <h3 className="font-semibold">Recommendation</h3>
      <p className="mt-2 text-sm text-slate-500">Personalized picks based on your interests</p>
      <div className="mt-4 space-y-3">
        {items.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <img src={a.image} alt="mini" className="w-12 h-12 object-cover rounded-md" />
            <div>
              <div className="text-sm font-medium line-clamp-2">{a.title}</div>
              <div className="text-xs text-slate-400">{a.source} · {a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


