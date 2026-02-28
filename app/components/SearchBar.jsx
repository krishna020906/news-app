//app/components/searhbar.jsx


"use client";

import React from "react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
}) {
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex-1 w-full"
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <div className="relative w-full">

        {/* ICON */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-4 h-4"
            style={{ color: "var(--text-body)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        {/* INPUT */}
        <input
          type="search"
          id="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Find interesting news"
          className="block w-full py-3 pl-10 pr-28 text-sm rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-title)",
          }}
        />

        {/* BUTTON — PERFECTLY CENTERED */}
        <button
          type="submit"
          className="absolute top-1/2 right-2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
          }}
        >
          Search
        </button>

      </div>
    </form>
  );
}







// import React from "react";

// export default function SearchBar({ value, onChange, onSubmit }) {
//   return (
//     <div className="relative">
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") onSubmit();
//         }}
//         placeholder="Find interesting news"
//         className="w-full md:w-96 pl-10 pr-4 py-2 rounded-full focus:outline-none"
//         style={{
//           background: "var(--card-bg)",
//           border: "1px solid var(--card-border)",
//           color: "var(--text-body)",
//         }}
//       />

//       <div className="absolute left-3 top-1/2 -translate-y-1/2">
//         🔍
//       </div>
//     </div>
//   );
// }









// // File: components/SearchBar.jsx
// import React from 'react';

// export default function SearchBar({ onChange = () => {}, mobile = false }) {
//   return (
//     <div className="relative">
//       <input
//         onChange={(e) => onChange(e.target.value)}
//         placeholder="Find interesting news"
//         className="w-full md:w-96 pl-10 pr-4 py-2 rounded-full focus:outline-none"
//         style={{
//           background: "var(--card-bg)",
//           border: "1px solid var(--card-border)",
//           color: "var(--text-body)"
//         }}
//       />

//       <div
//         className="absolute left-3 top-1/2 -translate-y-1/2"
//         style={{ color: "var(--text-body)" }}
//       >
//         🔍
//       </div>
//     </div>
//   );
// }
