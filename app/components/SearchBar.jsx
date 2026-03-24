// // //app/components/searhbar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ value, onChange }) {
  const router = useRouter();

  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState(null);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (value) params.set("q", value);
    if (timeFilter) params.set("time", timeFilter);

    router.push(`/?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <div className="relative w-full max-w-xl">

      {/* INPUT CONTAINER */}
      <div className="relative flex items-center">

        {/* INPUT */}
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Find interesting news"
          className="w-full py-3 pl-4 pr-20 text-sm rounded-xl border border-[var(--card-border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="absolute right-10 top-1/2 -translate-y-1/2 px-3 py-1 text-xs rounded-md bg-orange-500 text-white hover:scale-105 transition"
        >
          Search
        </button>

        {/* FILTER ICON */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-orange-500/10 transition"
        >
          <FunnelIcon
            className={`w-5 h-5 transition ${
              timeFilter
                ? "text-orange-500 drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]"
                : "text-[var(--text-body)] hover:text-orange-500"
            }`}
          />
        </button>

      </div>

      {/* DROPDOWN */}
      {showFilters && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--card-border)] shadow-xl p-2 z-50 bg-[var(--card-bg)]">

          <p className="text-xs opacity-60 px-2 py-1 mb-1">Time</p>

          {[
            ["1h", "Last 1 hour"],
            ["24h", "Today"],
            ["7d", "This week"],
            ["30d", "This month"],
          ].map(([val, label]) => {
            const active = timeFilter === val;

            return (
              <button
                key={val}
                onClick={() => setTimeFilter(val)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${
                    active
                      ? "bg-orange-500 text-white shadow-md"
                      : "hover:bg-orange-500/10"
                  }
                `}
              >
                {label}
              </button>
            );
          })}

          {/* CLEAR */}
          <button
            onClick={() => setTimeFilter(null)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 mt-1"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}






// "use client";

// export default function SearchBar({ value, onChange, onSubmit }) {
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSubmit();
//       }}
//       className="flex-1 w-full"
//     >
//       <div className="relative w-full">

//         <input
//           type="search"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="Find interesting news"
//           className="w-full py-3 pl-4 pr-24 text-sm rounded-xl border border-[var(--card-border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
//         />

//         <button
//           type="submit"
//           className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs rounded-lg bg-orange-500 text-white"
//         >
//           Search
//         </button>

//       </div>
//     </form>
//   );
// }








// "use client";

// import React from "react";
// import Router from "next/router";

// export default function SearchBar({
//   value,
//   onChange,
//   onSubmit,
// }) {
// const router = useRouter();

// const handleSearch = () => {
//   const params = new URLSearchParams();

//   if (query) params.set("q", query);
//   if (timeFilter) params.set("time", timeFilter);

//   router.push(`/?${params.toString()}`);

//   setShowFilters(false);
// };

//   return (
//     <form
//       onSubmit={handleSearch}
//       className="flex-1 w-full"
//     >
//       <label htmlFor="search" className="sr-only">
//         Search
//       </label>

//       <div className="relative w-full">

//         {/* ICON */}
//         <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//           <svg
//             className="w-4 h-4"
//             style={{ color: "var(--text-body)" }}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
//             />
//           </svg>
//         </div>

//         {/* INPUT */}
//         <input
//           type="search"
//           id="search"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="Find interesting news"
//           className="block border  w-full py-3 pl-10 pr-28 text-sm rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 hover:!border-orange-500  focus:ring-orange-500 focus:border-orange-500"
//           style={{
//             background: "var(--card-bg)",
//             border: "1px solid var(--card-border)",
//             color: "var(--text-title)",
//           }}
//         />

//         {/* BUTTON — PERFECTLY CENTERED */}
//         <button
//           type="submit"
//           className="absolute top-1/2 right-2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
//           style={{
//             background: "var(--button-bg)",
//             color: "var(--button-text)",
//           }}
//         >
//           Search
//         </button>
//         {/* DROPDOWN */}
//           {showFilters && (
//             <div className="absolute top-12 right-0 w-48 rounded-xl border border-[var(--card-border)] shadow-lg p-2 z-50"
//               style={{ background: "var(--card-bg)" }}
//             >
//               <p className="text-xs opacity-60 px-2 py-1">Time</p>

//               <button onClick={() => setTimeFilter("1h")} className="w-full text-left px-3 py-2 rounded hover:bg-orange-500/10">
//                 Last 1 hour
//               </button>

//               <button onClick={() => setTimeFilter("24h")} className="w-full text-left px-3 py-2 rounded hover:bg-orange-500/10">
//                 Today
//               </button>

//               <button onClick={() => setTimeFilter("7d")} className="w-full text-left px-3 py-2 rounded hover:bg-orange-500/10">
//                 This week
//               </button>

//               <button onClick={() => setTimeFilter("30d")} className="w-full text-left px-3 py-2 rounded hover:bg-orange-500/10">
//                 This month
//               </button>

//               {/* CLEAR */}
//               <button
//                 onClick={() => setTimeFilter(null)}
//                 className="w-full text-left px-3 py-2 rounded text-red-400 hover:bg-red-500/10"
//               >
//                 Clear
//               </button>
//             </div>
//           )}

//       </div>
//     </form>
//   );
// }







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
