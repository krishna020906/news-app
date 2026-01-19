// //app/following/page.jsx
"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";
import ArticleCard from "../components/ArticleCard";

export default function FollowingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("Login to see creators you follow");
        }

        const token = await user.getIdToken();

        const res = await fetch("/api/news/following", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load following feed");
        }

        if (!cancelled) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* 🔄 SAME SLOT AS NEWS FEED */

  if (loading) {
    return <p className="card-body opacity-70">Loading following feed…</p>;
  }

  if (error) {
    return <p className="card-body text-red-400">{error}</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="card p-6 text-center">
        <h2 className="card-title text-lg mb-1">
          You’re not following anyone yet
        </h2>
        <p className="card-body opacity-70">
          Follow creators to see their news here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Feed title like Search */}
      <h1 className="card-title text-xl mb-4">Following</h1>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.id} article={post} />
        ))}
      </div>
    </>
  );
}










// "use client";

// import { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config";
// import ArticleCard from "../components/ArticleCard"

// export default function FollowingPage() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function loadFollowingFeed() {
//       try {
//         setLoading(true);
//         setError("");

//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user) {
//           throw new Error("You must be logged in to view your following feed.");
//         }

//         const token = await user.getIdToken();

//         const res = await fetch("/api/news/following", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load following feed");
//         }

//         if (!cancelled) setPosts(data.posts || []);
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) setError(err.message);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadFollowingFeed();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="card-body">Loading your following feed…</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="card-body text-red-400">{error}</p>
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center">
//         <div>
//           <h2 className="card-title text-xl mb-2">
//             You’re not following anyone yet
//           </h2>
//           <p className="card-body opacity-70">
//             Follow creators to see their news here.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       <h1 className="card-title text-2xl mb-6">Following</h1>

//       <div className="grid gap-6">
//         {posts.map((post) => (
//           <ArticleCard key={post.id} article={post} />
//         ))}
//       </div>
//     </div>
//   );
// }
