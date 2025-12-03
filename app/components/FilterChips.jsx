// components/FilterChips.jsx
"use client";

const CHIP_OPTIONS = [
  { key: "all", label: "All", value: null },
  { key: "politics", label: "Political", value: "politics" },
  { key: "sports", label: "Sport", value: "sports" },
  { key: "technology", label: "Technology", value: "technology" },
  { key: "local", label: "Local", value: "local" },
];

export default function FilterChips({
  selectedCategory = null,
  onChange = () => {}, // default so it doesn't crash
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {CHIP_OPTIONS.map((opt) => {
        const isActive =
          (selectedCategory == null && opt.value == null) ||
          selectedCategory === opt.value;

        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => {
              console.log("Chip clicked:", opt.value); // 🔍 debug
              onChange(opt.value);
            }}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              isActive
                ? "bg-orange-500 border-orange-500 text-[var(--button-text)]"
                : "border-[var(--card-border)] card-body"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}










// // components/FilterChips.jsx
// "use client";

// const CHIP_OPTIONS = [
//   { key: "all", label: "All", value: null },
//   { key: "politics", label: "Political", value: "politics" },
//   { key: "sports", label: "Sport", value: "sports" },
//   { key: "technology", label: "Technology", value: "technology" },
//   { key: "local", label: "Local", value: "local" }, // optional category
// ];

// export default function FilterChips({ selectedCategory, onChange = () => {},}) {
//   return (
//     <div className="flex flex-wrap gap-2 mb-2">
//       {CHIP_OPTIONS.map((opt) => {
//         const isActive =
//           (selectedCategory == null && opt.value == null) ||
//           selectedCategory === opt.value;

//         return (
//           <button
//             key={opt.key}
//             type="button"
//             onClick={() => onChange(opt.value)}
//             className={`px-3 py-1 rounded-full text-xs border transition ${
//               isActive
//                 ? "bg-orange-500 border-orange-500 text-[var(--button-text)]"
//                 : "border-[var(--card-border)] card-body"
//             }`}
//           >
//             {opt.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }










// // File: components/FilterChips.jsx
// import React from 'react';

// export default function FilterChips({
//   chips = ['All', 'Political', 'Sport', 'Technology', 'Local'],
//   onSelect = () => {}
// }) {
//   return (
//     <div className="flex gap-2 items-center overflow-x-auto pb-2">
//       {chips.map((c) => (
//         <button
//           key={c}
//           onClick={() => onSelect(c)}
//           className="px-3 py-1 rounded-full text-sm whitespace-nowrap"
//           style={{
//             background: "var(--card-bg)",
//             border: "1px solid var(--card-border)",
//             color: "var(--text-body)"
//           }}
//         >
//           {c}
//         </button>
//       ))}
//     </div>
//   );
// }


