// components/FilterChips.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const CHIP_OPTIONS = [
  { key: "all", label: "All", value: null },
  { key: "politics", label: "Political", value: "politics" },
  { key: "sports", label: "Sport", value: "sports" },
  { key: "technology", label: "Technology", value: "technology" },
  { key: "local", label: "Local", value: "local" },
];

export default function FilterChips({
  selectedCategory = null,
  onChange = () => {},
}) {
  const containerRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    const container = containerRef.current;
    const activeButton = container?.querySelector(
      `[data-active="true"]`
    );

    if (container && activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setUnderlineStyle({
        width: buttonRect.width + "px",
        transform: `translateX(${buttonRect.left - containerRect.left}px)`,
      });
    }
  }, [selectedCategory]);

  return (
    <div className="mb-3 relative">

      

      <div
        ref={containerRef}
        className="flex gap-6 text-sm font-medium overflow-x-auto scrollbar-hide relative"
      >
        {CHIP_OPTIONS.map((opt) => {
          const isActive =
            (selectedCategory == null && opt.value == null) ||
            selectedCategory === opt.value;

          return (
            <button
              key={opt.key}
              data-active={isActive}
              type="button"
              onClick={() => onChange(opt.value)}
              className="relative pb-2 whitespace-nowrap transition-colors duration-200"
              style={{
                color: isActive
                  ? "var(--text-title)"
                  : "var(--text-body)",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.color = "var(--button-bg)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.color = "var(--text-body)";
              }}
            >
              {opt.label}
            </button>
          );
        })}

        {/* Animated Underline */}
        <span
          className="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
          style={{
            ...underlineStyle,
            background: "var(--button-bg)",
          }}
        />
      </div>

      {/* Bottom divider line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--card-border)" }}
      />
    </div>
  );
}








// "use client";

// import { useEffect, useRef, useState } from "react";

// const CHIP_OPTIONS = [
//   { key: "all", label: "All", value: null },
//   { key: "politics", label: "Political", value: "politics" },
//   { key: "sports", label: "Sport", value: "sports" },
//   { key: "technology", label: "Technology", value: "technology" },
//   { key: "local", label: "Local", value: "local" },
// ];

// export default function FilterChips({
//   selectedCategory = null,
//   onChange = () => {},
// }) {
//   const containerRef = useRef(null);
//   const [gliderStyle, setGliderStyle] = useState({});

//   useEffect(() => {
//     const activeButton = containerRef.current?.querySelector(
//       `[data-active="true"]`
//     );

//     if (activeButton) {
//       setGliderStyle({
//         width: activeButton.offsetWidth  + "px",
//         transform: `translateX(${activeButton.offsetLeft}px)`,
//       });
//     }
//   }, [selectedCategory]);

//   return (
//     <div className="mb-3">
//       <div
//         ref={containerRef}
//         className="relative inline-flex items-center rounded-full px-2 py-1"
//         style={{
//           background: "var(--card-bg)",
//           border: "1px solid var(--card-border)",
//         }}
//       >
//         {/* Dynamic Glider */}
//         <span
//           className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out"
//           style={{
//             ...gliderStyle,
//             background: "var(--button-bg)",
//           }}
//         />

//         {CHIP_OPTIONS.map((opt) => {
//           const isActive =
//             (selectedCategory == null && opt.value == null) ||
//             selectedCategory === opt.value;

//           return (
//             <button
//               key={opt.key}
//               data-active={isActive}
//               type="button"
//               onClick={() => onChange(opt.value)}
//               className="relative z-10 px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-200"
//               style={{
//                 color: isActive
//                   ? "var(--button-text)"
//                   : "var(--text-body)",
//               }}
//             >
//               {opt.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }









// "use client";

// import { useMemo } from "react";

// const CHIP_OPTIONS = [
//   { key: "all", label: "All", value: null },
//   { key: "politics", label: "Political", value: "politics" },
//   { key: "sports", label: "Sport", value: "sports" },
//   { key: "technology", label: "Technology", value: "technology" },
//   { key: "local", label: "Local", value: "local" },
// ];

// export default function FilterChips({
//   selectedCategory = null,
//   onChange = () => {},
// }) {
//   const activeIndex = useMemo(() => {
//     const index = CHIP_OPTIONS.findIndex(
//       (opt) =>
//         (selectedCategory == null && opt.value == null) ||
//         selectedCategory === opt.value
//     );
//     return index === -1 ? 0 : index;
//   }, [selectedCategory]);

//   return (
//     <div className="w-full mb-4">
//       <div
//         className="relative flex p-2 rounded-full shadow-sm"
//         style={{
//           background: "var(--card-bg)",
//           border: "1px solid var(--card-border)",
//         }}
//       >
//         {/* Glider */}
//         <span
//           className="absolute top-2 bottom-2 rounded-full transition-all duration-300 ease-out"
//           style={{
//             width: `calc((100% - 16px) / ${CHIP_OPTIONS.length})`,
//             left: `calc(${activeIndex} * (100% / ${CHIP_OPTIONS.length}) + 8px)`,
//             background: "var(--button-bg)",
//           }}
//         />

//         {CHIP_OPTIONS.map((opt, index) => {
//           const isActive = index === activeIndex;

//           return (
//             <button
//               key={opt.key}
//               type="button"
//               onClick={() => onChange(opt.value)}
//               className="relative z-10 flex-1 text-center text-sm font-medium py-2 rounded-full transition-colors duration-200"
//               style={{
//                 color: isActive
//                   ? "var(--button-text)"
//                   : "var(--text-body)",
//               }}
//             >
//               {opt.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }










// "use client";

// const CHIP_OPTIONS = [
//   { key: "all", label: "All", value: null },
//   { key: "politics", label: "Political", value: "politics" },
//   { key: "sports", label: "Sport", value: "sports" },
//   { key: "technology", label: "Technology", value: "technology" },
//   { key: "local", label: "Local", value: "local" },
// ];

// export default function FilterChips({
//   selectedCategory = null,
//   onChange = () => {}, // default so it doesn't crash
// }) {
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
//             onClick={() => {
//               console.log("Chip clicked:", opt.value); // 🔍 debug
//               onChange(opt.value);
//             }}
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


