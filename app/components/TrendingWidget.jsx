// components/TrendingNow.jsx
"use client";

import { useEffect, useState } from "react";

export default function TrendingWidget() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/news/trending")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.posts || []);
      })
      .catch((err) => {
        console.error("Trending fetch error:", err);
      });
  }, []);

  return (
    <aside
      className="rounded-2xl p-5"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="h-6 w-1 rounded-full"
          style={{ background: "var(--button-bg)" }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--text-title)" }}
        >
          Trending Now
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={item._id} className="group cursor-pointer">

            <div className="flex gap-4 items-start">

              {/* Rank */}
              <div
                className="text-2xl font-bold leading-none"
                style={{
                  color:
                    i < 3
                      ? "var(--button-bg)"
                      : "var(--text-body)",
                  opacity: 0.9,
                }}
              >
                {i + 1}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 ">
                <p
                  className="text-sm font-medium leading-tight group-hover:underline transition truncate"
                  style={{ color: "var(--text-title)" }}
                >
                  {item.title}
                </p>

                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-body)" }}
                >
                  {item.views || 0} views ·{" "}
                  {item.commentsCount || 0} comments
                </p>
              </div>
            </div>

            {/* Divider */}
            {i !== items.length - 1 && (
              <div
                className="mt-4 h-px"
                style={{ background: "var(--card-border)" }}
              />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}









// import { useEffect, useState } from "react";

// export default function TrendingWidget() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetch("/api/news/trending")
//       .then((res) => res.json())
//       .then((data) => setItems(data.posts || []));
//   }, []);

//   return (
//     <div className="bg-[#111] rounded-xl p-4  shadow-lg">
//       <h3 className="text-lg font-semibold mb-3">🔥 Trending Now</h3>

//       <div className="space-y-3">
//         {items.map((item, i) => (
//           <div key={item._id} className="flex gap-3 items-start">
//             <span className="text-orange-400 font-bold text-lg">
//               #{i + 1}
//             </span>

//             <div className="text-sm">
//               <p className="font-medium line-clamp-2">
//                 {item.title}
//               </p>
//               <p className="text-xs text-gray-400">
//                 {item.views || 0} views · {item.commentsCount || 0} comments
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
