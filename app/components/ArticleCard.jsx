// File: components/ArticleCard.jsx
import React from "react";
import BiasMeter from "./BiasMeter";

export default function ArticleCard({ article, onOpen = () => {}, onReact }) {
  return (
    <article
      className="card overflow-hidden cursor-pointer"
      onClick={() => onOpen(article)}
    >
      <div className="relative h-44 md:h-56 lg:h-44">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title || "hero"}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}

        <div
          className="absolute left-4 top-4 px-3 py-1 text-xs font-medium rounded-full"
          style={{
            background: "var(--badge-bg)",
            backdropFilter: "blur(6px)",
          }}
        >
          {article.source}
        </div>
      </div>

      <div className="p-4">
        <h3 className="card-title text-lg font-semibold line-clamp-2">
          {article.title}
        </h3>

        <p className="card-body mt-2 text-sm line-clamp-3">
          {article.summary}
        </p>

        <BiasMeter bias={article.bias} />

        <div className="mt-4 flex items-center justify-between text-sm card-body">
          <div className="flex gap-4 items-center">
            {/* LIKE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // don't trigger onOpen
                onReact && onReact("like");
              }}
              className="flex items-center gap-2 hover:opacity-80"
            >
              👍 <span>{article.likes ?? 0}</span>
            </button>

            {/* DISLIKE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReact && onReact("dislike");
              }}
              className="flex items-center gap-2 hover:opacity-80"
            >
              👎 <span>{article.dislikes ?? 0}</span>
            </button>

            {/* COMMENTS */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(article);
              }}
              className="flex items-center gap-2 hover:opacity-80"
            >
              💬 <span>{article.comments ?? 0}</span>
            </button>

            <span>· {article.time}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(article);
            }}
            className="px-3 py-1 rounded-full text-sm"
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)",
            }}
          >
            Read
          </button>
        </div>
      </div>
    </article>
  );
}










// // File: components/ArticleCard.jsx
// import React from 'react';
// import BiasMeter from './BiasMeter';

// export default function ArticleCard({ article, onOpen = () => {} }) {
//   return (
//     <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
//       <div className="relative h-44 md:h-56 lg:h-44">
//         <img src={article.image} alt="hero" className="object-cover w-full h-full" />
//         <div className="absolute left-4 top-4 bg-white/80 backdrop-blur rounded-full px-3 py-1 text-xs font-medium">{article.source}</div>
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{article.title}</h3>
//         <p className="mt-2 text-sm text-slate-600 line-clamp-3">{article.summary}</p>

//         <BiasMeter bias={article.bias} />

//         <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
//           <div className="flex gap-4 items-center">
//             <button className="flex items-center gap-2">👍 <span>{Math.floor(Math.random() * 200)}</span></button>
//             <button className="flex items-center gap-2">💬 <span>{article.comments}</span></button>
//             <span>· {article.time}</span>
//           </div>
//           <button onClick={() => onOpen(article)} className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">Read</button>
//         </div>
//       </div>
//     </article>
//   );
// }


