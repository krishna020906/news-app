//app/news/[id]/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";
import CommentItem from "../../components/CommentItem";
import Link from 'next/link';
import FollowButton from "../../components/FollowButton";
import ReactionBar from "../../components/ReactionBar";

import {
  HandThumbUpIcon as LikeOutline,
  HandThumbDownIcon as DislikeOutline,
} from "@heroicons/react/24/outline";

import {
  HandThumbUpIcon as LikeSolid,
  HandThumbDownIcon as DislikeSolid,
} from "@heroicons/react/24/solid";


function formatTimeAgo(iso) {
  if (!iso) return "";

  const diff = Date.now() - new Date(iso).getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
 
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}


  // const parts = content.split(/##\s*/g);

  // parts.forEach((part) => {
  //   const [title, ...rest] = part.split("\n");
  //   const body = rest.join("\n").trim();

  //   if (/WHAT_HAPPENED/i.test(title)) sections.whatHappened = body;
  //   if (/WHY_IT_MATTERS/i.test(title)) sections.whyItMatters = body;
  //   if (/ANALYSIS/i.test(title)) sections.analysis = body;
  //   if (/PERSPECTIVE/i.test(title)) sections.perspective = body;
  // });




export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [sort, setSort] = useState("top");

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState("");

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // Reading progress (0 - 100)
  const [readingProgress, setReadingProgress] = useState(0);

  // Reference to the article DOM element
  const articleRef = useRef(null);


  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // load the post
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

   async function loadPost() {
    try {
      setLoadingPost(true);
      setPostError("");

      const res = await fetch(`/api/news/${id}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to load post");
      }

      if (!cancelled) setPost(data.post);

    } catch (err) {
      console.error(err);
      if (!cancelled) setPostError(err.message || "Failed to load post");
    } finally {
      if (!cancelled) setLoadingPost(false);
    }
  }
  // const sections = parseSections(post.content);


  async function loadComments() {
  try {
    setLoadingComments(true);
    setCommentsError("");

    const res = await fetch(`/api/news/${id}/comments?sort=${sort}`);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Failed to load comments");
    }

    setComments(data.comments || []);
  } catch (err) {
    console.error(err);
    setCommentsError(err.message || "Failed to load comments");
  } finally {
    setLoadingComments(false);
  }
}

    loadPost();
    loadComments();

    return () => {
      cancelled = true;
    };
  }, [id , sort]);
  useEffect(() => {
    console.log("POST OBJECT:", post);
    function handleScroll() {
      if (!articleRef.current) return;

      const article = articleRef.current;

      const articleTop =
        article.getBoundingClientRect().top + window.scrollY;

      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrollY = window.scrollY;

      // how much user has scrolled INSIDE the article
      const scrolled = scrollY - articleTop;

      const readableHeight = articleHeight - windowHeight;

      // 👇 critical fix
      if (scrolled <= 0) {
        setReadingProgress(0);
        return;
      }

      if (scrolled >= readableHeight) {
        setReadingProgress(100);
        return;
      }

      const progress = (scrolled / readableHeight) * 100;
      setReadingProgress(progress);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  async function handleReact(type) {
    if (!post) return;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("Must be logged in to react");
        return;
      }
      const idToken = await user.getIdToken();

      const res = await fetch(`/api/news/${post.id}/reaction`, {
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

      setPost((prev) =>
        prev
          ? {
              ...prev,
              likesCount: data.post.likesCount,
              dislikesCount: data.post.dislikesCount,
            }
          : prev
      );
      if (type === "like") {
        setLiked((v) => !v);
        setDisliked(false);
      } else {
        setDisliked((v) => !v);
        setLiked(false);
      }
    } catch (err) {
      console.error("Detail react error:", err);
    }
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    try {
      setPostingComment(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("Must be logged in to comment");
        setPostingComment(false);
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(`/api/news/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to post comment");
      }

      // Prepend new comment
      setComments((prev) => [data.comment, ...prev]);
      setNewComment("");
      // bump commentsCount on post
      setPost((prev) =>
        prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : prev
      );
    } catch (err) {
      console.error("Post comment error:", err);
      alert(err.message || "Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  }


  if (loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg, #020617)]">
        <div className="card p-6 w-full max-w-2xl animate-pulse">
          <div className="h-56 bg-gray-700 rounded-2xl mb-4" />
          <div className="h-6 w-2/3 bg-gray-600 rounded mb-2" />
          <div className="h-4 w-full bg-gray-700 rounded" />
        </div>
      </div>
    );
  }


  if (postError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg, #020617)]">
        <div className="card p-6 w-full max-w-lg text-center">
          <p className="card-body mb-4">
            {postError || "Post not found."}
          </p>
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

  const createdLabel = formatTimeAgo(post.createdAt);
  const sections = post?.sections || {};


  return (
    <div className="min-h-screen bg-[var(--bg, var(--card-bg))] text-[var(--text-title,#e5e7eb)]">
    {/* Reading progress bar */}
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-orange-500 transition-[width] duration-100 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>

    {/* {post && (
      <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-transparent">
        <div
          className="h-full bg-orange-500 transition-[width] duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
    )} */}
    

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back / breadcrumb */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--card-border)] card-body hover:bg-[var(--badge-bg)] transition"
          >
            ← Back to feed
          </button>

          <span className="hidden md:inline text-xs card-body opacity-80">
            {createdLabel && `Updated ${createdLabel}`}
          </span>
        </div>

        {/* Main article card */}
        <article ref={articleRef} className="card overflow-hidden rounded-3xl border border-[var(--card-border)] shadow-md">
          {/* Image + overlay */}
          {post.mediaUrl && (
            <div className="relative w-full max-h-[420px] overflow-hidden">
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Top-left chips */}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="text-[10px] md:text-xs px-3 py-1 rounded-full uppercase tracking-wide bg-black/60 text-white border border-white/10">
                  {post.category || "general"}
                </span>
              </div>

              {/* Bottom-left title snippet for large screens */}
              <div className="hidden md:block absolute left-4 bottom-4 max-w-xl">
                <h1 className="text-white text-2xl font-semibold drop-shadow-md">
                  {post.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-5">
            {/* Title (for mobile / if no image) */}
            {!post.mediaUrl && (
              <h1 className="card-title text-2xl md:text-3xl font-semibold">
                {post.title}
              </h1>
            )}
            {post.mediaUrl && (
              <h1 className="md:hidden card-title text-2xl font-semibold">
                {post.title}
              </h1>
            )}

            {/* Meta row */}
            {/* <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm card-body">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <div className="px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[11px] md:text-xs">
                  by{" "}
                  <span className="font-semibold">
                    <Link
                      href={`/creator/${post.authorUid}`}
                      className="hover:text-orange-400 transition"
                    >
                      {post.authorName || post.authorEmail || "Anonymous"}
                    </Link>
                  </span>
                </div>

                {createdLabel && (
                  <span className="opacity-75">
                    {createdLabel}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleReact("like")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm bg-[var(--button-bg)] text-[var(--button-text)] hover:opacity-90 transition"
                >
                  👍 <span>{post.likesCount ?? 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReact("dislike")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm border border-[var(--card-border)] card-body hover:bg-[var(--badge-bg)] transition"
                >
                  👎 <span>{post.dislikesCount ?? 0}</span>
                </button>
              </div>
            </div> */}

            {/* Content */}
            {/* 🧩 Structured News Content */}
            <div className="space-y-6 mt-4">
              {sections.whatHappened && (
                <section className="p-5 rounded-2xl bg-[var(--badge-bg)]">
                  <h3 className="text-sm font-semibold mb-2">📰 What happened</h3>
                  <p className="card-body text-sm leading-relaxed">
                    {sections.whatHappened}
                  </p>
                </section>
              )}

              {sections.whyItMatters && (
                <section className="p-5 rounded-2xl bg-[var(--badge-bg)]">
                  <h3 className="text-sm font-semibold mb-2">📌 Why this matters</h3>
                  <p className="card-body text-sm leading-relaxed">
                    {sections.whyItMatters}
                  </p>
                </section>
              )}

              {sections.analysis && (
                <section className="p-5 rounded-2xl border border-orange-500/40 bg-black/20">
                  <h3 className="text-sm font-semibold mb-2 text-orange-400">
                    🧠 Analysis
                  </h3>
                  <p className="card-body text-sm leading-relaxed">
                    {sections.analysis}
                  </p>
                </section>
              )}

              {sections.perspective && (
                <section className="p-5 rounded-2xl border border-[var(--card-border)]">
                  <h3 className="text-sm font-semibold mb-2">
                    💬 Creator’s perspective
                  </h3>
                  <p className="card-body text-sm leading-relaxed italic opacity-90">
                    {sections.perspective}
                  </p>
                </section>
              )}

              {sections.whoBenefits && (
                <section className="p-5 rounded-2xl bg-[var(--badge-bg)]/60">
                  <h3 className="text-sm font-semibold mb-2">
                    ⚖️ How it affects people
                  </h3>
                  <p className="card-body text-sm leading-relaxed">
                    {sections.whoBenefits}
                  </p>
                </section>
              )}
            </div>







            {/*<div className="space-y-6 mt-4">

              
              {post.whatHappened && (
                <section className="p-5 rounded-2xl bg-[var(--badge-bg)]">
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    📰 What happened
                  </h3>
                  <p className="card-body text-sm leading-relaxed">
                    {post.whatHappened}
                  </p>
                </section>
              )}

              
              {post.whyItMatters && (
                <section className="p-5 rounded-2xl bg-[var(--badge-bg)]">
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    📌 Why this matters
                  </h3>
                  <p className="card-body text-sm leading-relaxed">
                    {post.whyItMatters}
                  </p>
                </section>
              )}

              
              {post.analysis && (
                <section className="p-5 rounded-2xl border border-orange-500/40 bg-black/20">
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2 text-orange-400">
                    🧠 Analysis
                  </h3>
                  <p className="card-body text-sm leading-relaxed">
                    {post.analysis}
                  </p>
                </section>
              )}

            
              {post.perspective && (
                <section className="p-5 rounded-2xl border border-[var(--card-border)]">
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    💬 Creator’s perspective
                  </h3>
                  <p className="card-body text-sm leading-relaxed italic opacity-90">
                    {post.perspective}
                  </p>
                </section>
              )}

             
              {post.whoBenefits && (
                <section className="p-5 rounded-2xl bg-[var(--badge-bg)]/60">
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    ⚖️ How it affects people
                  </h3>
                  <p className="card-body text-sm leading-relaxed">
                    {post.whoBenefits}
                  </p>
                </section>
              )}

            </div>*/}


            {/*<div className="card-body mt-2 space-y-4 leading-relaxed text-sm md:text-base">
              {post.content.split(/\n{2,}/).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>*/}


            {/* Divider */}
            <div className="my-6 h-px w-full bg-[var(--card-border)]" />

            
            {/* Source link */}
            {post.sourceUrl && (
              <div className="flex items-center gap-2 text-xs md:text-sm card-body">
                <span className="opacity-70">Source:</span>
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 underline break-all hover:opacity-90"
                >
                  {post.sourceUrl}
                </a>
              </div>
            )}


            

            {/* Creator + Engagement Section */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-t border-[var(--card-border)]">

              {/* Creator */}
              <div className="flex items-center gap-3">

                <div className="text-sm">
                  <Link
                    href={`/creator/${post.authorUid}`}
                    className="font-semibold hover:text-orange-400 transition"
                  >
                    {post.authorName || "Anonymous"}
                  </Link>

                  <div className="text-xs opacity-70">
                    {formatTimeAgo(post.createdAt)}
                  </div>
                </div>

                <FollowButton
                  authorUid={post.authorUid}
                  initialIsFollowing={post.isFollowingAuthor}
                  initialFollowersCount={post.authorFollowersCount}
                />

              </div>

              {/* Reaction Buttons */}

              <div className="flex items-center gap-6 text-sm">

                <button
                  onClick={() => handleReact("like")}
                  className="flex items-center gap-1"
                >
                  {liked ? (
                    <LikeSolid className="w-5 h-5 text-[var(--button-bg)]" />
                  ) : (
                    <LikeOutline className="w-5 h-5 opacity-70" />
                  )}
                  {post.likesCount ?? 0}
                </button>

                <button
                  onClick={() => handleReact("dislike")}
                  className="flex items-center gap-1"
                >
                  {disliked ? (
                    <DislikeSolid className="w-5 h-5 text-[var(--button-bg)]" />
                  ) : (
                    <DislikeOutline className="w-5 h-5 opacity-70" />
                  )}
                  {post.dislikesCount ?? 0}
                </button>

              </div>

            </div>
            {/* Divider */}
            <div className="my-6 h-px w-full bg-[var(--card-border)]" />

            {/* <ReactionBar
              newsId={post.id}
              initialCounts={post.reactions}
            /> */}
            {post && (
              <ReactionBar 
                newsId={post.id}   // ✅ FIX
                initialCounts={post.reactions}
              />
            )}

            {/* Divider */}
            <div className="my-6 h-px w-full bg-[var(--card-border)]" />

            {/* Comments section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-lg font-semibold">
                  Comments ({post.commentsCount || comments.length || 0})
                </h2>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1 rounded-md text-sm
                  border border-[var(--card-border)]
                  bg-[var(--badge-bg)]
                  text-[var(--text-title)]
                  cursor-pointer"
                >
                  <option value="top">🔥 Top</option>
                  <option value="new">🕒 Newest</option>
                </select>
                
              </div>

              {/* Comment form */}
              <form onSubmit={handleSubmitComment} className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this story..."
                  className="w-full min-h-[80px] p-3 rounded-2xl border border-[var(--card-border)] bg-transparent card-body text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={postingComment || !newComment.trim()}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--button-bg)] text-[var(--button-text)] hover:opacity-90 disabled:opacity-60 transition"
                  >
                    {postingComment ? "Posting..." : "Post comment"}
                  </button>
                </div>
              </form>

              {/* Comments list */}
              {loadingComments ? (
                <p className="card-body text-sm opacity-70">
                  Loading comments...
                </p>
              ) : commentsError ? (
                <p className="card-body text-sm text-red-400">
                  {commentsError}
                </p>
              ) : comments.length === 0 ? (
                <p className="card-body text-sm opacity-70">
                  No comments yet. Be the first one to share your view.
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      postId={post.id}
                      currentUser={getAuth().currentUser?.uid}
                      refreshComments={async () => {
                        const res = await fetch(`/api/news/${post.id}/comments`);
                        const data = await res.json();
                        if (data.ok) setComments(data.comments);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}










// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config"; // ensure Firebase is initialised

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

// export default function NewsDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params?.id;

//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // load the post
//   useEffect(() => {
//     if (!id) return;
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`/api/news/${id}`);
//         const data = await res.json();
//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load post");
//         }
//         if (!cancelled) {
//           setPost(data.post);
//         }
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) setError(err.message || "Failed to load post");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   async function handleReact(type) {
//     if (!post) return;
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         console.error("Must be logged in to react");
//         return;
//       }
//       const idToken = await user.getIdToken();

//       const res = await fetch(`/api/news/${post.id}/reaction`, {
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

//       setPost((prev) =>
//         prev
//           ? {
//               ...prev,
//               likesCount: data.post.likesCount,
//               dislikesCount: data.post.dislikesCount,
//             }
//           : prev
//       );
//     } catch (err) {
//       console.error("Detail react error:", err);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[var(--bg, #020617)]">
//         <div className="card p-6 w-full max-w-2xl animate-pulse">
//           <div className="h-56 bg-gray-700 rounded-2xl mb-4" />
//           <div className="h-6 w-2/3 bg-gray-600 rounded mb-2" />
//           <div className="h-4 w-full bg-gray-700 rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[var(--bg, #020617)]">
//         <div className="card p-6 w-full max-w-lg text-center">
//           <p className="card-body mb-4">
//             {error || "Post not found."}
//           </p>
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

//   const createdLabel = formatTimeAgo(post.createdAt);

//   return (
//     <div className="min-h-screen bg-[var(--bg, var(--card-bg))] text-[var(--text-title,#e5e7eb)]">
//       <div className="max-w-5xl mx-auto px-4 py-6">
//         {/* Back / breadcrumb */}
//         <div className="mb-4 flex items-center justify-between gap-3">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--card-border)] card-body hover:bg-[var(--badge-bg)] transition"
//           >
//             ← Back to feed
//           </button>

//           <span className="hidden md:inline text-xs card-body opacity-80">
//             {createdLabel && `Updated ${createdLabel}`}
//           </span>
//         </div>

//         {/* Main article card */}
//         <article className="card overflow-hidden rounded-3xl border border-[var(--card-border)] shadow-md">
//           {/* Image + overlay */}
//           {post.mediaUrl && (
//             <div className="relative w-full max-h-[420px] overflow-hidden">
//               <img
//                 src={post.mediaUrl}
//                 alt={post.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

//               {/* Top-left chips */}
//               <div className="absolute left-4 top-4 flex flex-wrap gap-2">
//                 <span className="text-[10px] md:text-xs px-3 py-1 rounded-full uppercase tracking-wide bg-black/60 text-white border border-white/10">
//                   {post.category || "general"}
//                 </span>
//               </div>

//               {/* Bottom-left title snippet for large screens */}
//               <div className="hidden md:block absolute left-4 bottom-4 max-w-xl">
//                 <h1 className="text-white text-2xl font-semibold drop-shadow-md">
//                   {post.title}
//                 </h1>
//               </div>
//             </div>
//           )}

//           <div className="p-6 md:p-8 space-y-5">
//             {/* Title (for mobile / if no image) */}
//             {!post.mediaUrl && (
//               <h1 className="card-title text-2xl md:text-3xl font-semibold">
//                 {post.title}
//               </h1>
//             )}
//             {post.mediaUrl && (
//               <h1 className="md:hidden card-title text-2xl font-semibold">
//                 {post.title}
//               </h1>
//             )}

//             {/* Meta row */}
//             <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm card-body">
//               <div className="flex flex-wrap items-center gap-2 md:gap-3">
//                 <div className="px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[11px] md:text-xs">
//                   by{" "}
//                   <span className="font-semibold">
//                     {post.authorName || post.authorEmail || "Anonymous"}
//                   </span>
//                 </div>

//                 {createdLabel && (
//                   <span className="opacity-75">
//                     {createdLabel}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() => handleReact("like")}
//                   className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm bg-[var(--button-bg)] text-[var(--button-text)] hover:opacity-90 transition"
//                 >
//                   👍 <span>{post.likesCount ?? 0}</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleReact("dislike")}
//                   className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm border border-[var(--card-border)] card-body hover:bg-[var(--badge-bg)] transition"
//                 >
//                   👎 <span>{post.dislikesCount ?? 0}</span>
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="card-body mt-2 space-y-4 leading-relaxed text-sm md:text-base">
//               {post.content.split(/\n{2,}/).map((para, idx) => (
//                 <p key={idx}>{para}</p>
//               ))}
//             </div>

//             {/* Divider */}
//             <div className="my-6 h-px w-full bg-[var(--card-border)]" />

//             {/* Comments placeholder */}
//             <section className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <h2 className="card-title text-lg font-semibold">
//                   Comments
//                 </h2>
//                 <span className="text-xs card-body opacity-70">
//                   {post.commentsCount || 0} comments
//                 </span>
//               </div>

//               <p className="card-body text-sm opacity-80">
//                 Comments feature coming soon. You&apos;ll be able to share your
//                 thoughts here.
//               </p>

//               <div className="mt-2 p-4 rounded-2xl border border-dashed border-[var(--button-bg)] bg-[color-mix(in_srgb,var(--button-bg)_6%,transparent)] card-body text-sm">
//                 <p className="mb-1 font-medium">
//                   Want to say something about this story?
//                 </p>
//                 <p className="text-xs opacity-80">
//                   Sign in and stay tuned — soon you&apos;ll be able to add
//                   replies, like comments, and join the discussion.
//                 </p>
//               </div>
//             </section>
//           </div>
//         </article>
//       </div>
//     </div>
//   );
// }









// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config"; // ensure Firebase is initialised

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

// export default function NewsDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params?.id;

//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // load the post
//   useEffect(() => {
//     if (!id) return;
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`/api/news/${id}`);
//         const data = await res.json();
//         if (!res.ok || !data.ok) {
//           throw new Error(data.error || "Failed to load post");
//         }
//         if (!cancelled) {
//           setPost(data.post);
//         }
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) setError(err.message || "Failed to load post");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   async function handleReact(type) {
//     if (!post) return;
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         // you can redirect to sign-in if you want
//         console.error("Must be logged in to react");
//         return;
//       }
//       const idToken = await user.getIdToken();

//       const res = await fetch(`/api/news/${post.id}/reaction`, {
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

//       setPost((prev) =>
//         prev
//           ? {
//               ...prev,
//               likesCount: data.post.likesCount,
//               dislikesCount: data.post.dislikesCount,
//             }
//           : prev
//       );
//     } catch (err) {
//       console.error("Detail react error:", err);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[var(--bg, #020617)]">
//         <div className="card p-6 w-full max-w-2xl animate-pulse">
//           <div className="h-56 bg-gray-700 rounded-xl mb-4" />
//           <div className="h-6 w-2/3 bg-gray-600 rounded mb-2" />
//           <div className="h-4 w-full bg-gray-700 rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[var(--bg, #020617)]">
//         <div className="card p-6 w-full max-w-lg text-center">
//           <p className="card-body mb-4">
//             {error || "Post not found."}
//           </p>
//           <button
//             onClick={() => router.push("/")}
//             className="px-4 py-2 rounded-xl font-medium bg-orange-500 text-white"
//           >
//             Go back home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const createdLabel = formatTimeAgo(post.createdAt);

//   return (
//     <div className="min-h-screen bg-[var(--bg, #020617)] text-[var(--text-title,#e5e7eb)]">
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         {/* Back button */}
//         <button
//           onClick={() => router.back()}
//           className="mb-4 text-sm card-body underline underline-offset-4"
//         >
//           ← Back to feed
//         </button>

//         <article className="card overflow-hidden">
//           {/* Image */}
//           {post.mediaUrl && (
//             <div className="w-full max-h-[420px] overflow-hidden">
//               <img
//                 src={post.mediaUrl}
//                 alt={post.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}

//           <div className="p-6 space-y-4">
//             {/* Category badge */}
//             <div className="flex items-center gap-2">
//               <span
//                 className="text-xs px-3 py-1 rounded-full uppercase tracking-wide"
//                 style={{
//                   background: "var(--badge-bg)",
//                 }}
//               >
//                 {post.category || "general"}
//               </span>
//             </div>

//             {/* Title */}
//             <h1 className="card-title text-2xl md:text-3xl font-semibold">
//               {post.title}
//             </h1>

//             {/* Meta: author + time + reactions */}
//             <div className="flex flex-wrap items-center justify-between gap-3 text-sm card-body">
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                 <span>
//                   by{" "}
//                   <strong>{post.authorName || post.authorEmail || "Anonymous"}</strong>
//                 </span>
//                 <span className="opacity-80">
//                   {createdLabel && `· ${createdLabel}`}
//                 </span>
//               </div>

//               <div className="flex items-center gap-4">
//                 <button
//                   type="button"
//                   onClick={() => handleReact("like")}
//                   className="flex items-center gap-1 hover:opacity-80"
//                 >
//                   👍 <span>{post.likesCount ?? 0}</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleReact("dislike")}
//                   className="flex items-center gap-1 hover:opacity-80"
//                 >
//                   👎 <span>{post.dislikesCount ?? 0}</span>
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="card-body mt-4 space-y-3 leading-relaxed text-sm md:text-base">
//               {post.content.split(/\n{2,}/).map((para, idx) => (
//                 <p key={idx}>{para}</p>
//               ))}
//             </div>

//             {/* Divider */}
//             <hr className="my-6 border-[var(--card-border)]" />

//             {/* Comments placeholder */}
//             <section>
//               <h2 className="card-title text-lg font-semibold mb-2">
//                 Comments
//               </h2>
//               <p className="card-body text-sm opacity-80">
//                 Comments feature coming soon. You’ll be able to share your
//                 thoughts here.
//               </p>

//               {/* Placeholder input area */}
//               <div className="mt-4 p-3 rounded-xl border border-dashed border-[var(--card-border)] card-body text-sm">
//                 Sign in and stay tuned — soon you&apos;ll be able to add comments on each article.
//               </div>
//             </section>
//           </div>
//         </article>
//       </div>
//     </div>
//   );
// }
