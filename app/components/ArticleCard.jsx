import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import BiasMeter from "./BiasMeter";

export default function ArticleCard({ article }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(article.isSaved || false);
  }, [article]);

  async function toggleSave(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.info("Login to save news");
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(`/api/news/${article.id}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsSaved(data.saved);
      toast.success(data.saved ? "Saved" : "Removed");
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Link href={`/news/${article.id}`} className="block">
      <article
        className="
          card overflow-hidden cursor-pointer
          transition-all duration-200 ease-out
          hover:-translate-y-1 hover:shadow-xl
        "
      >

        {/* IMAGE */}
        <div className="relative h-44 md:h-56">
          {article.mediaUrl ? (
            <img
              src={article.mediaUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">
            {article.title}
          </h3>

          <p className="mt-2 text-sm text-gray-400 line-clamp-3">
            {article.content}
          </p>

          <BiasMeter bias={article.bias || { proA: 0, proB: 0, neutral: 100 }} />

          {/* ACTION BAR */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                  className="
                    flex items-center gap-2
                    transition-transform duration-150
                    hover:scale-110
                    active:scale-95
                  "
              >
                👍 {article.likesCount ?? 0}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                  className="
                    flex items-center gap-2
                    transition-transform duration-150
                    hover:scale-110
                    active:scale-95
                  "
              >
                👎 {article.dislikesCount ?? 0}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                  className="
                    flex items-center gap-2
                    transition-transform duration-150
                    hover:scale-110
                    active:scale-95
                  "
              >
                💬 {article.commentsCount ?? 0}
              </button>

              <button
                onClick={toggleSave}
                className="
                    flex items-center gap-2
                    transition-transform duration-150
                    hover:scale-110
                    active:scale-95
                "
              >
                {isSaved ? "🔖" : "📑"}
              </button>
            </div>

            <span className="text-xs opacity-70">
              {article.createdAt
                ? new Date(article.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}












// import { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";
// import BiasMeter from "./BiasMeter";
// import Link from "next/link";

// export default function ArticleCard({ article, onOpen = () => {}, onReact }) {
//   const [isSaved, setIsSaved] = useState(false);

//   useEffect(() => {
//     setIsSaved(article.isSaved || false);
//   }, [article]);

//   async function toggleSave(e) {
//     e.stopPropagation();

//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         toast.info("Login to save news");
//         return;
//       }

//       const token = await user.getIdToken();
//       const res = await fetch(`/api/news/${article.id}/save`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       setIsSaved(data.saved);
//       toast.success(data.saved ? "Saved" : "Removed from saved");
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//   }


// return (
//   <Link href={`/news/${article.id}`} className="block">
//     <article className="card overflow-hidden cursor-pointer">
      
//       {/* IMAGE */}
//       <div className="relative h-44 md:h-56">
//         {article.mediaUrl ? (
//           <img
//             src={article.mediaUrl}
//             alt={article.title}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-800" />
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="p-4">
//         <h3 className="card-title text-lg font-semibold line-clamp-2">
//           {article.title}
//         </h3>

//         <p className="card-body mt-2 text-sm line-clamp-3">
//           {article.content}
//         </p>

//         <BiasMeter bias={article.bias || { proA: 0, proB: 0, neutral: 100 }} />

//         {/* ACTIONS */}
//         <div className="mt-4 flex items-center justify-between text-sm card-body">
//           <div className="flex gap-4 items-center">
//             <button
//               onClick={(e) => e.stopPropagation()}
//               className="flex items-center gap-2"
//             >
//               👍 {article.likesCount ?? 0}
//             </button>

//             <button
//               onClick={(e) => e.stopPropagation()}
//               className="flex items-center gap-2"
//             >
//               👎 {article.dislikesCount ?? 0}
//             </button>

//             <button
//               onClick={(e) => e.stopPropagation()}
//               className="flex items-center gap-2"
//             >
//               💬 {article.commentsCount ?? 0}
//             </button>
//           </div>

//           <button
//             onClick={(e) => e.stopPropagation()}
//             className="px-3 py-1 rounded-full text-sm"
//             style={{
//               background: "var(--button-bg)",
//               color: "var(--button-text)",
//             }}
//           >
//             Read
//           </button>
//         </div>
//       </div>
//     </article>
//   </Link>
// );


//   return (
//     <article
//       className="card overflow-hidden cursor-pointer"
//       onClick={() => onOpen(article)}
//     >
//       {/* IMAGE */}
//       <div className="relative h-44 md:h-56 lg:h-44">
//         {article.mediaUrl ? (
//           <img
//             src={article.mediaUrl}
//             alt={article.title}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-800" />
//         )}

//         {/* CATEGORY BADGE */}
//         <div
//           className="absolute left-4 top-4 px-3 py-1 text-xs font-medium rounded-full"
//           style={{
//             background: "var(--badge-bg)",
//             backdropFilter: "blur(6px)",
//           }}
//         >
//           {article.category || "Top Headlines"}
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="p-4">
//         <h3 className="card-title text-lg font-semibold line-clamp-2">
//           {article.title}
//         </h3>

//         <p className="card-body mt-2 text-sm line-clamp-3">
//           {article.content}
//         </p>

//         <BiasMeter bias={article.bias || { proA: 0, proB: 0, neutral: 100 }} />

//         {/* ACTION ROW */}
//         <div className="mt-4 flex items-center justify-between text-sm card-body">
//           <div className="flex gap-4 items-center">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onReact && onReact("like");
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               👍 <span>{article.likesCount ?? 0}</span>
//             </button>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onReact && onReact("dislike");
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               👎 <span>{article.dislikesCount ?? 0}</span>
//             </button>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onOpen(article);
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               💬 <span>{article.commentsCount ?? 0}</span>
//             </button>

//             {/* SAVE BUTTON */}
//             <button
//               onClick={toggleSave}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               {isSaved ? "🔖" : "📑"}
//             </button>

//             <span className="opacity-70">
//               ·{" "}
//               {article.createdAt
//                 ? new Date(article.createdAt).toLocaleDateString()
//                 : ""}
//             </span>
//           </div>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onOpen(article);
//             }}
//             className="px-3 py-1 rounded-full text-sm"
//             style={{
//               background: "var(--button-bg)",
//               color: "var(--button-text)",
//             }}
//           >
//             Read
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }










// import { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";
// import BiasMeter from "./BiasMeter";

// export default function ArticleCard({ article, onOpen = () => {}, onReact }) {
//   const [isSaved, setIsSaved] = useState(false);

//   useEffect(() => {
//     setIsSaved(article.isSaved || false);
//   }, [article]);

//   async function toggleSave(e) {
//     e.stopPropagation();
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         toast.info("Login to save news");
//         return;
//       }

//       const token = await user.getIdToken();

//       const res = await fetch(`/api/news/${article.id}/save`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok || !data.ok) throw new Error(data.error);

//       setIsSaved(data.saved);
//       toast.success(data.saved ? "News saved" : "Removed from saved");
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     }
//   }

//   return (
//     <article
//       className="card overflow-hidden cursor-pointer"
//       onClick={() => onOpen(article)}
//     >
//       {/* IMAGE */}
//       <div className="relative h-44 md:h-56 lg:h-44">
//         {article.mediaUrl ? (
//           <img
//             src={article.mediaUrl}
//             alt={article.title || "news"}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-800" />
//         )}

//         {/* CATEGORY BADGE */}
//         <div
//           className="absolute left-4 top-4 px-3 py-1 text-xs font-medium rounded-full"
//           style={{
//             background: "var(--badge-bg)",
//             backdropFilter: "blur(6px)",
//           }}
//         >
//           {article.category || "Top Headlines"}
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="p-4">
//         <h3 className="card-title text-lg font-semibold line-clamp-2">
//           {article.title}
//         </h3>

//         <p className="card-body mt-2 text-sm line-clamp-3">
//           {article.content}
//         </p>

//         <BiasMeter bias={article.bias || { proA: 0, proB: 0, neutral: 100 }} />

//         {/* FOOTER ACTIONS */}
//         <div className="mt-4 flex items-center justify-between text-sm card-body">
//           <div className="flex gap-4 items-center">
//             {/* LIKE */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onReact && onReact("like");
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               👍 <span>{article.likesCount ?? 0}</span>
//             </button>

//             {/* DISLIKE */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onReact && onReact("dislike");
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               👎 <span>{article.dislikesCount ?? 0}</span>
//             </button>

//             {/* COMMENTS */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onOpen(article);
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               💬 <span>{article.commentsCount ?? 0}</span>
//             </button>

//             {/* SAVE (NEW POSITION) */}
//             <button
//               onClick={toggleSave}
//               className="flex items-center gap-2 hover:opacity-80"
//               title={isSaved ? "Remove from saved" : "Save news"}
//             >
//               {isSaved ? "🔖" : "📑"}
//             </button>

//             {/* TIME */}
//             <span className="opacity-70">
//               ·{" "}
//               {article.createdAt
//                 ? new Date(article.createdAt).toLocaleDateString()
//                 : ""}
//             </span>
//           </div>

//           {/* READ BUTTON */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onOpen(article);
//             }}
//             className="px-3 py-1 rounded-full text-sm"
//             style={{
//               background: "var(--button-bg)",
//               color: "var(--button-text)",
//             }}
//           >
//             Read
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }


// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";
// import { useState, useEffect } from "react";

// export default function ArticleCard({ article, onOpen, onReact }) {
//   const [isSaved, setIsSaved] = useState(false);

//   useEffect(() => {
//     // If backend returned saved info, set it here
//     setIsSaved(article.isSaved || false);
//   }, [article]);

//   async function toggleSave(e) {
//     e.stopPropagation();
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         toast.info("Login to save news");
//         return;
//       }

//       const token = await user.getIdToken();

//       const res = await fetch(`/api/news/${article.id}/save`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok || !data.ok) throw new Error(data.error);

//       setIsSaved(data.saved);

//       toast.success(data.saved ? "NEWS SAVED" : "REMOVED FROM SAVED");
//     } catch (err) {
//       toast.error("Something went wrong");
//       console.error(err);
//     }
//   }

//   return (
//     <div className="relative card p-4 rounded-xl cursor-pointer">

//       {/* SAVE BUTTON */}
//       <button
//         onClick={toggleSave}
//         className="absolute top-3 right-3 text-white text-xl"
//       >
//         {isSaved ? "🔖" : "📑"}
//       </button>

//       {/* Card Contents */}
//       <div onClick={() => onOpen(article)}>
//         {/* existing card code */}
//       </div>
//     </div>
//   );
// }








// // File: components/ArticleCard.jsx
// import React from "react";
// import BiasMeter from "./BiasMeter";

// export default function ArticleCard({ article, onOpen = () => {}, onReact }) {
//   return (
//     <article
//       className="card overflow-hidden cursor-pointer"
//       onClick={() => onOpen(article)}
//     >
//       <div className="relative h-44 md:h-56 lg:h-44">
//         {article.image ? (
//           <img
//             src={article.image}
//             alt={article.title || "hero"}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-800" />
//         )}

//         <div
//           className="absolute left-4 top-4 px-3 py-1 text-xs font-medium rounded-full"
//           style={{
//             background: "var(--badge-bg)",
//             backdropFilter: "blur(6px)",
//           }}
//         >
//           {article.source}
//         </div>
//       </div>

//       <div className="p-4">
//         <h3 className="card-title text-lg font-semibold line-clamp-2">
//           {article.title}
//         </h3>

//         <p className="card-body mt-2 text-sm line-clamp-3">
//           {article.summary}
//         </p>

//         <BiasMeter bias={article.bias} />

//         <div className="mt-4 flex items-center justify-between text-sm card-body">
//           <div className="flex gap-4 items-center">
//             {/* LIKE */}
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation(); // don't trigger onOpen
//                 onReact && onReact("like");
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               👍 <span>{article.likes ?? 0}</span>
//             </button>

//             {/* DISLIKE */}
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onReact && onReact("dislike");
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               👎 <span>{article.dislikes ?? 0}</span>
//             </button>

//             {/* COMMENTS */}
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onOpen(article);
//               }}
//               className="flex items-center gap-2 hover:opacity-80"
//             >
//               💬 <span>{article.comments ?? 0}</span>
//             </button>

//             <span>· {article.time}</span>
//           </div>

//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onOpen(article);
//             }}
//             className="px-3 py-1 rounded-full text-sm"
//             style={{
//               background: "var(--button-bg)",
//               color: "var(--button-text)",
//             }}
//           >
//             Read
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }










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


