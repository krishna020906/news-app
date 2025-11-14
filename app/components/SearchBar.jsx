

// File: components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ onChange = () => {}, mobile = false }) {
  return (
    <div className="relative">
      <input
        onChange={(e) => onChange(e.target.value)}
        placeholder="Find interesting news"
        className="w-full md:w-96 pl-10 pr-4 py-2 rounded-full border text-slate-600 border-slate-300 bg-slate-50 focus:outline-none"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}


