// components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        placeholder="Find interesting news"
        className="w-full md:w-96 pl-10 pr-4 py-2 rounded-full focus:outline-none"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          color: "var(--text-body)",
        }}
      />

      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        🔍
      </div>
    </div>
  );
}









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
