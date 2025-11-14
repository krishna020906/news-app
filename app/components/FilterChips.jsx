

// File: components/FilterChips.jsx
import React from 'react';

export default function FilterChips({ chips = ['All','Political','Sport','Technology','Local'], onSelect = () => {} }) {
  return (
    <div className="flex gap-2 text-slate-700 items-center overflow-x-auto pb-2">
      {chips.map((c) => (
        <button key={c} onClick={() => onSelect(c)} className="px-3 py-1 bg-white border rounded-full text-sm whitespace-nowrap">{c}</button>
      ))}
    </div>
  );
}


