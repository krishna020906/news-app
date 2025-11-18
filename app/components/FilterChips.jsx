// File: components/FilterChips.jsx
import React from 'react';

export default function FilterChips({
  chips = ['All', 'Political', 'Sport', 'Technology', 'Local'],
  onSelect = () => {}
}) {
  return (
    <div className="flex gap-2 items-center overflow-x-auto pb-2">
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className="px-3 py-1 rounded-full text-sm whitespace-nowrap"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-body)"
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}


