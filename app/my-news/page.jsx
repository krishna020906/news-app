"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";
import ArticleCard from "../components/ArticleCard";

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

function makeSummary(content) {
  if (!content) return "";
  const words = content.trim().split(/\s+/);
  if (words.length <= 40) return content;
  return words.slice(0, 40).join(" ") + "…";
}

export default function MyNewsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);         // loading posts
  const [authChecking, setAuthChecking] = useState(true); // waiting for Firebase
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();

    const unsub = auth.onAuthStateChanged(async (user) => {
      setAuthChecking(false);

      if (!user) {
        // not logged in
        setError("You must be logged in to view your posts.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const idToken = await user.getIdToken();

        const res = await fetch("/api/my/news", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load your news");
        }

        const mapped = (data.posts || []).map((p) => ({
          id: p.id,
          source: p.category || "My posts",
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

        setArticles(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load your news");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // while Firebase is still resolving the session
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[var(--bg, var(--card-bg))] flex justify-center">
        <div className="max-w-4xl w-full px-4 py-6">
          <div className="card p-4 animate-pulse">
            <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
            <div className="h-3 w-2/3 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!authChecking && error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg, var(--card-bg))] flex items-center justify-center">
        <div className="card p-6 w-full max-w-lg text-center">
          <p className="card-body mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-xl font-medium bg-[var(--button-bg)] text-[var(--button-text)]"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg, var(--card-bg))] flex justify-center">
        <div className="max-w-4xl w-full px-4 py-6 space-y-3">
          <div className="card p-4 animate-pulse">
            <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
            <div className="h-3 w-2/3 bg-gray-700 rounded" />
          </div>
          <div className="card p-4 animate-pulse">
            <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
            <div className="h-3 w-full bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg, var(--card-bg))]">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="card-title text-xl md:text-2xl font-semibold">
            Your posted news
          </h1>
          <button
            onClick={() => router.push("/post-news")}
            className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--button-bg)] text-[var(--button-text)] hover:opacity-90 transition"
          >
            + Post new
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="card p-4">
            <p className="card-body text-sm">
              You haven&apos;t posted any news yet. Try creating your first post!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                article={a}
                onOpen={(art) => router.push(`/news/${art.id}`)}
                onReact={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}









// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config";
// import ArticleCard from '../components/ArticleCard'

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

// // simple summary helper like in NewsFeed
// function makeSummary(content) {
//   if (!content) return "";
//   const words = content.trim().split(/\s+/);
//   if (words.length <= 40) return content;
//   return words.slice(0, 40).join(" ") + "…";
// }

// export default function MyNewsPage() {
//   const router = useRouter();
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");

//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) {
//           // if not logged in, you can redirect to sign-in
//           setError("You must be logged in to view your posts.");
//           setLoading(false);
//           return;
//         }

//         const idToken = await user.getIdToken();

//         const res = await fetch("/api/my/news", {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//           },
//         });
//         const data = await res.json();

//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load your news");
//         }

//         const mapped = (data.posts || []).map((p) => ({
//           id: p.id,
//           source: p.category || "My posts",
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
//         if (!cancelled) setError(err.message || "Failed to load your news");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[var(--bg, var(--card-bg))] flex justify-center">
//         <div className="max-w-4xl w-full px-4 py-6 space-y-3">
//           <div className="card p-4 animate-pulse">
//             <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
//             <div className="h-3 w-2/3 bg-gray-700 rounded" />
//           </div>
//           <div className="card p-4 animate-pulse">
//             <div className="h-4 w-1/2 bg-gray-600 rounded mb-2" />
//             <div className="h-3 w-full bg-gray-700 rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[var(--bg, var(--card-bg))] flex items-center justify-center">
//         <div className="card p-6 w-full max-w-lg text-center">
//           <p className="card-body mb-4">{error}</p>
//           <button
//             onClick={() => router.push("/")}
//             className="px-4 py-2 rounded-xl font-medium bg-[var(--button-bg)] text-[var(--button-text)]"
//           >
//             Go back home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[var(--bg, var(--card-bg))]">
//       <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
//         <div className="flex items-center justify-between">
//           <h1 className="card-title text-xl md:text-2xl font-semibold">
//             Your posted news
//           </h1>
//           <button
//             onClick={() => router.push("/post-news")}
//             className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--button-bg)] text-[var(--button-text)] hover:opacity-90 transition"
//           >
//             + Post new
//           </button>
//         </div>

//         {articles.length === 0 ? (
//           <div className="card p-4">
//             <p className="card-body text-sm">
//               You haven&apos;t posted any news yet. Try creating your first post!
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {articles.map((a) => (
//               <ArticleCard
//                 key={a.id}
//                 article={a}
//                 onOpen={(art) => router.push(`/news/${art.id}`)}
//                 onReact={() => {}} // optional: you can wire likes here later if you want
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
