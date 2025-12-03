
// components/NewsFeed.jsx
"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config"; // make sure this initializes Firebase
import ArticleCard from "./ArticleCard";

// simple "time ago" formatter
function formatTimeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString();
}

// take first ~40 words as summary
function makeSummary(content) {
  if (!content) return "";
  const words = content.trim().split(/\s+/);
  if (words.length <= 40) return content;
  return words.slice(0, 40).join(" ") + "…";
}

export default function NewsFeed({ onOpen, query , category }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 NEW: mode state – controls which feed we load
  // "latest" = /api/news, "forYou" = /api/news/for-you
  const [mode, setMode] = useState("latest");

  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/news");
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load news");
        }

        const mapped = (data.posts || []).map((p) => ({
          id: p.id,
          source: p.category || "Top Headlines",
          title: p.title,
          summary: makeSummary(p.content),
          image: p.mediaUrl || null,
          time: formatTimeAgo(p.createdAt),
          comments: p.commentsCount || 0,
          shares: 0,
          likes: p.likesCount || 0,
          dislikes: p.dislikesCount || 0,
          category: p.category || "general",   // 👈 NEW
          bias: { proA: 0, proB: 0, neutral: 100 },
          _raw: p,
        }));

        if (!cancelled) {
          setArticles(mapped);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Failed to load news");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadForYou() {
      try {
        setLoading(true);
        setError("");

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          if (!cancelled) {
            setError("Log in and complete your profile to see personalised news.");
            setArticles([]);
          }
          return;
        }

        const idToken = await user.getIdToken();

        const res = await fetch("/api/news/for-you?limit=20", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load personalised feed");
        }

        const mapped = (data.posts || []).map((p) => ({
          id: p.id,
          source: p.category || "For You",
          title: p.title,
          summary: makeSummary(p.content),
          image: p.mediaUrl || null,
          time: formatTimeAgo(p.createdAt),
          comments: p.commentsCount || 0,
          shares: 0,
          likes: p.likesCount || 0,
          dislikes: p.dislikesCount || 0,
          bias: { proA: 0, proB: 0, neutral: 100 },
          _raw: p,
        }));

        if (!cancelled) {
          setArticles(mapped);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Failed to load personalised news");
          setArticles([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (mode === "latest") {
      loadLatest();
    } else {
      loadForYou();
    }

    return () => {
      cancelled = true;
    };
  }, [mode]);

  // 🔥 handle like/dislike INSIDE component
  async function handleReact(postId, type) {
    console.log("Reacting on postId =", postId);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in, cannot react");
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(`/api/news/${postId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to react");
      }

      setArticles((prev) =>
        prev.map((a) =>
          a.id === postId
            ? {
                ...a,
                likes: data.post.likesCount,
                dislikes: data.post.dislikesCount,
              }
            : a
        )
      );
    } catch (err) {
      console.error("Reaction error:", err);
    }
  }

    // optional search filter by title/content
  const filtered = articles.filter((a) => {
    // 1) category filter
    if (category && a.category !== category) {
      return false;
    }

    // 2) search query filter
    if (!query) return true;

    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q)
    );
  });


  return (
    <div className="space-y-4">
      {/* 🔥 NEW: toggle buttons – only affect which endpoint NewsFeed uses */}
      <div className="flex gap-2 mb-1">
        <button
          type="button"
          onClick={() => setMode("latest")}
          className={`px-3 py-1 rounded-full text-xs border transition ${
            mode === "latest"
              ? "bg-orange-500 text-[var(--button-text)] border-orange-500"
              : "border-[var(--card-border)] card-body"
          }`}
        >
          Top Headlines
        </button>
        <button
          type="button"
          onClick={() => setMode("forYou")}
          className={`px-3 py-1 rounded-full text-xs border transition ${
            mode === "forYou"
              ? "bg-orange-500 text-[var(--button-text)] border-orange-500"
              : "border-[var(--card-border)] card-body"
          }`}
        >
          For You / Personalized
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="card p-4 animate-pulse">
            <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
            <div className="h-3 w-2/3 bg-gray-700 rounded" />
          </div>
          <div className="card p-4 animate-pulse">
            <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
            <div className="h-3 w-full bg-gray-700 rounded" />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="card p-4">
          <p className="card-body text-red-400 text-sm">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-4">
          <p className="card-body text-sm">No news found.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((a) => (
            <ArticleCard
              key={a.id}
              article={a}
              onOpen={(art) => onOpen(art)}
              onReact={(type) => handleReact(a.id, type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}









// // components/NewsFeed.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config"; // make sure this initializes Firebase
// import ArticleCard from "./ArticleCard";

// // simple "time ago" formatter
// function formatTimeAgo(iso) {
//   if (!iso) return "";
//   const diffMs = Date.now() - new Date(iso).getTime();
//   const diffMinutes = Math.floor(diffMs / (1000 * 60));
//   if (diffMinutes < 1) return "Just now";
//   if (diffMinutes < 60) return `${diffMinutes} min ago`;
//   const diffHours = Math.floor(diffMinutes / 60);
//   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//   const diffDays = Math.floor(diffHours / 24);
//   if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
//   return new Date(iso).toLocaleDateString();
// }

// // take first ~40 words as summary
// function makeSummary(content) {
//   if (!content) return "";
//   const words = content.trim().split(/\s+/);
//   if (words.length <= 40) return content;
//   return words.slice(0, 40).join(" ") + "…";
// }

// export default function NewsFeed({ onOpen, query }) {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch("/api/news");
//         const data = await res.json();

//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load news");
//         }

//         const mapped = (data.posts || []).map((p) => ({
//           id: p.id,
//           source: p.category || "Top Headlines",
//           title: p.title,
//           summary: makeSummary(p.content),
//           image: p.mediaUrl || null,

//           time: formatTimeAgo(p.createdAt),
//           comments: p.commentsCount || 0,
//           shares: 0,
//           likes: p.likesCount || 0,
//           dislikes: p.dislikesCount || 0,

//           bias: { proA: 0, proB: 0, neutral: 100 },
//           _raw: p,
//         }));

//         if (!cancelled) {
//           setArticles(mapped);
//         }
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) {
//           setError(err.message || "Failed to load news");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // 🔥 handle like/dislike INSIDE component
//   async function handleReact(postId, type) {
//     console.log("Reacting on postId =", postId);

//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         console.error("User not logged in, cannot react");
//         return;
//       }

//       const idToken = await user.getIdToken();

//       const res = await fetch(`/api/news/${postId}/reaction`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify({ type }),
//       });

//       const data = await res.json();
//       if (!res.ok || !data.ok) {
//         throw new Error(data.error || "Failed to react");
//       }

//       setArticles((prev) =>
//         prev.map((a) =>
//           a.id === postId
//             ? {
//                 ...a,
//                 likes: data.post.likesCount,
//                 dislikes: data.post.dislikesCount,
//               }
//             : a
//         )
//       );
//     } catch (err) {
//       console.error("Reaction error:", err);
//     }
//   }

//   // optional search filter by title/content
//   const filtered = articles.filter((a) => {
//     if (!query) return true;
//     const q = query.toLowerCase();
//     return (
//       a.title.toLowerCase().includes(q) ||
//       a.summary.toLowerCase().includes(q)
//     );
//   });

//   if (loading) {
//     return (
//       <div className="space-y-3">
//         <div className="card p-4 animate-pulse">
//           <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
//           <div className="h-3 w-2/3 bg-gray-700 rounded" />
//         </div>
//         <div className="card p-4 animate-pulse">
//           <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
//           <div className="h-3 w-full bg-gray-700 rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card p-4">
//         <p className="card-body text-red-400 text-sm">
//           Failed to load news: {error}
//         </p>
//       </div>
//     );
//   }

//   if (filtered.length === 0) {
//     return (
//       <div className="card p-4">
//         <p className="card-body text-sm">No news found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {filtered.map((a) => (
//         <ArticleCard
//           key={a.id}
//           article={a}
//           onOpen={(art) => onOpen(art)}
//           onReact={(type) => handleReact(a.id, type)}
//         />
//       ))}
//     </div>
//   );
// }










// // components/NewsFeed.jsx
// "use client";

// import { useEffect, useState } from "react";
// import ArticleCard from "./ArticleCard";

// function countWords(str) {
//   if (!str) return 0;
//   return str.trim().split(/\s+/).filter(Boolean).length;
// }

// // simple "time ago" formatter
// function formatTimeAgo(iso) {
//   if (!iso) return "";
//   const diffMs = Date.now() - new Date(iso).getTime();
//   const diffMinutes = Math.floor(diffMs / (1000 * 60));
//   if (diffMinutes < 1) return "Just now";
//   if (diffMinutes < 60) return `${diffMinutes} min ago`;
//   const diffHours = Math.floor(diffMinutes / 60);
//   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//   const diffDays = Math.floor(diffHours / 24);
//   if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
//   return new Date(iso).toLocaleDateString();
// }

// // take first ~40 words as summary
// function makeSummary(content) {
//   if (!content) return "";
//   const words = content.trim().split(/\s+/);
//   if (words.length <= 40) return content;
//   return words.slice(0, 40).join(" ") + "…";
// }
// async function handleReact(postId, type) {
//   try {
//     const res = await fetch(`/api/news/${postId}/reaction`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // auth header is set inside requireAuth using cookies/session; if you're using idToken in header, add it here
//       },
//       body: JSON.stringify({ type }),
//     });

//     const data = await res.json();
//     if (!res.ok || !data.ok) {
//       throw new Error(data.error || "Failed to react");
//     }

//     // Optimistically update local state
//     setArticles((prev) =>
//       prev.map((a) =>
//         a.id === postId
//           ? {
//               ...a,
//               likes: data.post.likesCount,
//               dislikes: data.post.dislikesCount,
//             }
//           : a
//       )
//     );
//   } catch (err) {
//     console.error("Reaction error:", err);
//   }
// }


// export default function NewsFeed({ onOpen, query }) {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch("/api/news");
//         const data = await res.json();

//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load news");
//         }

//         const mapped = (data.posts || []).map((p) => ({
//           id: p._id,
//           source: p.category || "Top Headlines",
//           title: p.title,
//           summary: makeSummary(p.content),
//           image: p.mediaUrl || null,

//           time: formatTimeAgo(p.createdAt),
//           comments: p.commentsCount || 0,
//           shares: 0,
//           likes: p.likesCount || 0,
//           dislikes: p.dislikesCount || 0,

//           // dummy bias until you calculate real values
//           bias: { proA: 0, proB: 0, neutral: 100 },

//           // keep raw fields in case ArticleModal needs them
//           _raw: p,
//         }));

//         if (!cancelled) {
//           setArticles(mapped);
//         }
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) {
//           setError(err.message || "Failed to load news");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // optional search filter by title/content
//   const filtered = articles.filter((a) => {
//     if (!query) return true;
//     const q = query.toLowerCase();
//     return (
//       a.title.toLowerCase().includes(q) ||
//       a.summary.toLowerCase().includes(q)
//     );
//   });

//   if (loading) {
//     return (
//       <div className="space-y-3">
//         <div className="card p-4 animate-pulse">
//           <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
//           <div className="h-3 w-2/3 bg-gray-700 rounded" />
//         </div>
//         <div className="card p-4 animate-pulse">
//           <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
//           <div className="h-3 w-full bg-gray-700 rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card p-4">
//         <p className="card-body text-red-400 text-sm">
//           Failed to load news: {error}
//         </p>
//       </div>
//     );
//   }

//   if (filtered.length === 0) {
//     return (
//       <div className="card p-4">
//         <p className="card-body text-sm">No news found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {filtered.map((a) => (
//         <ArticleCard
//           key={a.id}
//           article={a}
//           onOpen={(art) => onOpen(art)}
//           onReact={(type) => handleReact(a.id, type)}

//         />
//       ))}
//     </div>
//   );
// }
