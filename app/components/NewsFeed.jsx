// // //NEWSFEED.JSX
// // components/NewsFeed.jsx
// "use client";

// import { useEffect, useState } from "react";
// import ArticleCard from "./ArticleCard";
// import { getAuth } from "firebase/auth";

// export default function NewsFeed({ mode, query, category, onOpen }) {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");

//         let url = "/api/news";
//         let headers = {};

//         // 🔀 MODE ROUTING
//         if (mode === "top") {
//           url = "/api/news/top";
//         }

//         if (mode === "following") {
//           const auth = getAuth();
//           const user = auth.currentUser;

//           if (!user) {
//             setArticles([]);
//             setLoading(false);
//             return;
//           }

//           const token = await user.getIdToken();
//           headers.Authorization = `Bearer ${token}`;
//           url = "/api/news/following";
//         }

//         if (query) {
//           url = `/api/search?q=${encodeURIComponent(query)}`;
//         }

//         if (category) {
//           url += `${url.includes("?") ? "&" : "?"}category=${category}`;
//         }

//         const res = await fetch(url, { headers });
//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error || "Failed to load feed");

//         const results =
//           data.posts || data.results || [];

//         if (!cancelled) setArticles(results);
//       } catch (err) {
//         if (!cancelled) setError(err.message);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [mode, query, category]);

//   if (loading) {
//     return (
//       <div className="card p-6 text-center card-body">
//         Loading…
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card p-6 text-center text-red-400">
//         {error}
//       </div>
//     );
//   }

//   if (articles.length === 0) {
//     return (
//       <div className="card p-8 text-center">
//         <h3 className="card-title mb-2">
//           Nothing to show
//         </h3>
//         <p className="card-body opacity-70">
//           {mode === "following"
//             ? "Follow creators to see their news here."
//             : "No articles found."}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6">
//       {articles.map((article) => (
//         <ArticleCard
//           key={article.id}
//           article={article}
//           onOpen={onOpen}
//         />
//       ))}
//     </div>
//   );
// }









"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";
import ArticleCard from "./ArticleCard";

function ArticleSkeleton() {
  

  return (
    <div className="card p-4 animate-[pulse_2s_ease-in-out_infinite]">
      {/* Image placeholder */}
      <div className="h-40 w-full bg-gray-700 rounded mb-4" />

      {/* Title */}
      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-600 rounded w-full" />
        <div className="h-3 bg-gray-600 rounded w-5/6" />
        <div className="h-3 bg-gray-600 rounded w-2/3" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-3">
          <div className="h-4 w-8 bg-gray-600 rounded" />
          <div className="h-4 w-8 bg-gray-600 rounded" />
          <div className="h-4 w-8 bg-gray-600 rounded" />
        </div>

        <div className="h-6 w-16 bg-gray-600 rounded" />
      </div>
    </div>
  );
}




export default function NewsFeed({ onOpen, query, category, mode }) {
  console.log("[NEWSFEED] component rendered with query:", query);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState(null);
  console.log("🔥 NewsFeed rendered with articles:", articles.length);

  /* 🔐 AUTH — ONCE */
  useEffect(() => {
    console.log("[AUTH] subscribing");

    const auth = getAuth();
    const unsub = auth.onAuthStateChanged((u) => {
      console.log("[AUTH] resolved", !!u);
      setUser(u);
      setAuthChecking(false);
    });

    return () => unsub();
  }, []);

  /* 📰 FETCH — AFTER AUTH */
  useEffect(() => {
    if (authChecking) {
      console.log("[FETCH] waiting for auth");
      return;
    }
    console.log("[NEWSFEED] useEffect fired");
    console.log("[NEWSFEED] query used for fetch:", query); // ✅ HERE

    console.log("[FETCH] start");
    let cancelled = false;
    console.log("[NEWSFEED] fetching with query:", query);


    async function load() {
      try {
        setLoading(true);
        setError("");
        let url = "/api/news";
        let options = {};

        // 🔴 SEARCH HAS ABSOLUTE PRIORITY
        if (query && query.trim().length > 0) {
          console.log("[NEWSFEED] SEARCH MODE ACTIVE");
          url = `/api/search?q=${encodeURIComponent(query)}`;
        }

        // 🟢 FOR-YOU ONLY WHEN NOT SEARCHING
        else if (mode === "for-you" && user) {
          console.log("[NEWSFEED] FOR-YOU MODE");
          const token = await user.getIdToken();
          url = "/api/news/for-you";
          options.headers = {
            Authorization: `Bearer ${token}`,
          };
        }

        // 🟡 ELSE = NORMAL FEED (/api/news)


        // let url = "/api/news";
        // let options = {};
        
        // // 🔍 SEARCH HAS HIGHEST PRIORITY
        // if (query && query.trim().length > 0) {
        //   console.log("[NEWSFEED] SEARCH API HIT with:", query); // ✅ HERE
        //   url = `/api/search?q=${encodeURIComponent(query)}`;
        // }
        // // 🎯 For-you only when NOT searching
        // else if (mode === "for-you" && user) {
        //   const token = await user.getIdToken();
        //   url = "/api/news/for-you";
        //   options.headers = {
        //     Authorization: `Bearer ${token}`,
        //   };
        // }


        // if (mode === "for-you" && user) {
        //   const token = await user.getIdToken();
        //   url = "/api/news/for-you";
        //   options.headers = {
        //     Authorization: `Bearer ${token}`,
        //   };
        // }

        const res = await fetch(url, options);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load news");
        }

        if (!cancelled) {
          // setArticles(data.posts || []);
          const items = data.posts ?? data.results ?? [];
          setArticles(items);
          console.log("[NEWSFEED] first article keys:", Object.keys(items[0] || {}));
          console.log("[NEWSFEED] first article:", items[0]);

        }
       


      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authChecking, mode, user, query]);

  /* 🧱 UI STATES */
if (authChecking || (loading && articles.length === 0)) {
  return (
    <div className="space-y-4">
      <ArticleSkeleton />
      <ArticleSkeleton />
      <ArticleSkeleton />
    </div>
  );
}


  if (error) {
    return <div className="card p-4 text-red-400">{error}</div>;
  }
  if (!loading && query && articles.length === 0) {
    return (
      <div className="card p-6 text-center opacity-70">
        No results found for <b>{query}</b>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {query && (
        <div className="text-sm opacity-70">
          Showing results for{" "}
          <span className="font-semibold">“{query}”</span>
        </div>
      )}

      {articles.map((a) => (
        <ArticleCard
          key={a._id || a.id}
          article={a}
          onOpen={onOpen}
        />
      ))}
    </div>
  );

}





















// // components/NewsFeed.jsx
// "use client";


// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config";
// import ArticleCard from "./ArticleCard";
// import { useEffect, useState, useRef } from "react";


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

// export default function NewsFeed({ onOpen, query, category, mode }) {
//   console.log("[RENDER] NewsFeed render", {
//     mode,
//   });
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [authChecking, setAuthChecking] = useState(true);
//   const [user, setUser] = useState(null);
//   const hasFetchedRef = useRef(false);

 





//   useEffect(() => {
//     console.log("[AUTH EFFECT] subscribing to auth state");

//     const auth = getAuth();

//     const unsub = auth.onAuthStateChanged((u) => {
//       console.log("[AUTH STATE CHANGED]", u ? "LOGGED IN" : "LOGGED OUT");
//       setUser(u);
//       setAuthChecking(false);
//     });

//     return () => {
//       console.log("[AUTH EFFECT] unsubscribed");
//       unsub();
//     };
//   }, []);

//   useEffect(() => {
//     console.log("[FETCH EFFECT] triggered");

//     if (hasFetchedRef.current) {
//       console.log("[FETCH EFFECT] already fetched, skipping");
//       return;
//     }

//     hasFetchedRef.current = true;
//   } , []);

//   useEffect(() => {
//     const auth = getAuth();

//     const unsub = auth.onAuthStateChanged((u) => {
//       setUser(u);
//       setAuthChecking(false);
//     });

//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     if (hasFetchedRef.current) return;
//     hasFetchedRef.current = true;

//     let cancelled = false;



//     async function load() {
//       console.log("[LOAD] start");

//       try {
//         setLoading(true);
//         console.log("[LOAD] setLoading(true)");

//         let url = "/api/news";
//         let fetchOptions = {};

//         if (mode === "for-you") {
//           console.log("[LOAD] for-you mode");

//           const auth = getAuth();

//           await new Promise((resolve) => {
//             const unsub = auth.onAuthStateChanged((user) => {
//               console.log("[LOAD] auth resolved inside fetch", user ? "YES" : "NO");
//               unsub();
//               resolve(user);
//             });
//           });

//           const user = auth.currentUser;

//           console.log("[LOAD] currentUser", user);

//           setAuthChecking(false);

//           if (user) {
//             const idToken = await user.getIdToken();
//             console.log("[LOAD] got idToken");

//             url = "/api/news/for-you";
//             fetchOptions = {
//               headers: {
//                 Authorization: `Bearer ${idToken}`,
//               },
//             };
//           } else {
//             console.warn("[LOAD] no user, fallback to top headlines");
//           }
//         } else {
//           console.log("[LOAD] top headlines mode");
//           setAuthChecking(false);
//         }

//         console.log("[LOAD] fetching", url);

//         const res = await fetch(url, fetchOptions);
//         const data = await res.json();

//         console.log("[LOAD] response", { ok: res.ok, data });

//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load news");
//         }

//         const posts = data.posts || [];
//         console.log("[LOAD] posts length", posts.length);

//         if (!cancelled) {
//           setArticles(posts);
//           console.log("[LOAD] setArticles");
//         }
//       } catch (err) {
//         console.error("[LOAD ERROR]", err);
//         if (!cancelled) setError(err.message);
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//           console.log("[LOAD] setLoading(false)");
//         }
//       }
//     }


//     // async function load() {
//     //   try {
//     //     setLoading(true);
//     //     setError("");

//     //     let url = "/api/news";
//     //     let fetchOptions = {};

//     //     if (mode === "for-you") {
//     //       const auth = getAuth();

//     //       await new Promise((resolve) => {
//     //         const unsub = auth.onAuthStateChanged((user) => {
//     //           unsub();
//     //           resolve(user);
//     //         });
//     //       });

//     //       const user = auth.currentUser;

//     //       setAuthChecking(false);

//     //       if (user) {
//     //         const idToken = await user.getIdToken();
//     //         url = "/api/news/for-you";
//     //         fetchOptions = {
//     //           headers: {
//     //             Authorization: `Bearer ${idToken}`,
//     //           },
//     //         };
//     //       } else {
//     //         console.warn(
//     //           "Not logged in, falling back to top headlines instead of personalised feed."
//     //         );
//     //       }
//     //     } else {
//     //       setAuthChecking(false);
//     //     }


//     //     const res = await fetch(url, fetchOptions);
//     //     const data = await res.json();

//     //     if (!res.ok || !data.ok) {
//     //       throw new Error(data.error || "Failed to load news");
//     //     }

//     //     const posts = data.posts || [];

//     //     const mapped = posts.map((p) => ({
//     //       id: p.id || p._id,
//     //       source: p.category || "Top Headlines",
//     //       title: p.title,
//     //       summary: makeSummary(p.content),
//     //       image: p.mediaUrl || null,
//     //       time: formatTimeAgo(p.createdAt),
//     //       comments: p.commentsCount || 0,
//     //       shares: 0,
//     //       likes: p.likesCount || 0,
//     //       dislikes: p.dislikesCount || 0,
//     //       category: p.category || "general",
//     //       bias: { proA: 0, proB: 0, neutral: 100 },
//     //       _raw: p,
//     //     }));

//     //     if (!cancelled) {
//     //       setArticles(mapped);
//     //     }
//     //   } catch (err) {
//     //     console.error(err);
//     //     if (!cancelled) {
//     //       setError(err.message || "Failed to load news");
//     //     }
//     //   } finally {
//     //     if (!cancelled) setLoading(false);
//     //   }
//     // }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []); // 👈 reload when switching top <-> for-you

//   // like/dislike handler unchanged
//   async function handleReact(postId, type) {
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

//   // filter by category + search query
//   const filtered = articles.filter((a) => {
//     if (category && a.category !== category) {
//       return false;
//     }
//     if (!query) return true;
//     const q = query.toLowerCase();
//     return (
//       a.title.toLowerCase().includes(q) ||
//       a.summary.toLowerCase().includes(q)
//     );
//   });
//     // ⏳ Waiting for Firebase auth to resolve
//   if (authChecking) {
//     return (
//       <div className="space-y-3">
//         <div className="card p-4 animate-pulse h-24" />
//         <div className="card p-4 animate-pulse h-24" />
//         <div className="card p-4 animate-pulse h-24" />
//       </div>
//     );
//   }


//   if (loading) {
//     if (authChecking) {
//       console.log("[RENDER] authChecking = true → auth skeleton");
//     if (loading) {
//       console.log("[RENDER] loading = true → loading skeleton");

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

// export default function NewsFeed({ onOpen, query , category }) {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // 🔥 NEW: mode state – controls which feed we load
//   // "latest" = /api/news, "forYou" = /api/news/for-you
//   const [mode, setMode] = useState("latest");

//   useEffect(() => {
//     let cancelled = false;

//     async function loadLatest() {
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
//           category: p.category || "general",   // 👈 NEW
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

//     async function loadForYou() {
//       try {
//         setLoading(true);
//         setError("");

//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) {
//           if (!cancelled) {
//             setError("Log in and complete your profile to see personalised news.");
//             setArticles([]);
//           }
//           return;
//         }

//         const idToken = await user.getIdToken();

//         const res = await fetch("/api/news/for-you?limit=20", {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//           },
//         });

//         const data = await res.json();
//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load personalised feed");
//         }

//         const mapped = (data.posts || []).map((p) => ({
//           id: p.id,
//           source: p.category || "For You",
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
//           setError(err.message || "Failed to load personalised news");
//           setArticles([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     if (mode === "latest") {
//       loadLatest();
//     } else {
//       loadForYou();
//     }

//     return () => {
//       cancelled = true;
//     };
//   }, [mode]);

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

//     // optional search filter by title/content
//   const filtered = articles.filter((a) => {
//     // 1) category filter
//     if (category && a.category !== category) {
//       return false;
//     }

//     // 2) search query filter
//     if (!query) return true;

//     const q = query.toLowerCase();
//     return (
//       a.title.toLowerCase().includes(q) ||
//       a.summary.toLowerCase().includes(q)
//     );
//   });


//   return (
//     <div className="space-y-4">
//       {/* 🔥 NEW: toggle buttons – only affect which endpoint NewsFeed uses */}
//       <div className="flex gap-2 mb-1">
//         <button
//           type="button"
//           onClick={() => setMode("latest")}
//           className={`px-3 py-1 rounded-full text-xs border transition ${
//             mode === "latest"
//               ? "bg-orange-500 text-[var(--button-text)] border-orange-500"
//               : "border-[var(--card-border)] card-body"
//           }`}
//         >
//           Top Headlines
//         </button>
//         <button
//           type="button"
//           onClick={() => setMode("forYou")}
//           className={`px-3 py-1 rounded-full text-xs border transition ${
//             mode === "forYou"
//               ? "bg-orange-500 text-[var(--button-text)] border-orange-500"
//               : "border-[var(--card-border)] card-body"
//           }`}
//         >
//           For You / Personalized
//         </button>
//       </div>

//       {loading && (
//         <div className="space-y-3">
//           <div className="card p-4 animate-pulse">
//             <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
//             <div className="h-3 w-2/3 bg-gray-700 rounded" />
//           </div>
//           <div className="card p-4 animate-pulse">
//             <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
//             <div className="h-3 w-full bg-gray-700 rounded" />
//           </div>
//         </div>
//       )}

//       {!loading && error && (
//         <div className="card p-4">
//           <p className="card-body text-red-400 text-sm">
//             {error}
//           </p>
//         </div>
//       )}

//       {!loading && !error && filtered.length === 0 && (
//         <div className="card p-4">
//           <p className="card-body text-sm">No news found.</p>
//         </div>
//       )}

//       {!loading && !error && filtered.length > 0 && (
//         <div className="space-y-4">
//           {filtered.map((a) => (
//             <ArticleCard
//               key={a.id}
//               article={a}
//               onOpen={(art) => onOpen(art)}
//               onReact={(type) => handleReact(a.id, type)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }









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
