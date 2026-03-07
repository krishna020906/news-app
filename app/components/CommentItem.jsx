"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolid,
  HandThumbDownIcon as HandThumbDownSolid,
} from "@heroicons/react/24/solid";

function formatTimeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function CommentItem({
  comment,
  postId,
  currentUser,
  refreshComments,
}) {
  const [liked, setLiked] = useState(comment.userReaction === "like");
  const [disliked, setDisliked] = useState(comment.userReaction === "dislike");
  const [likes, setLikes] = useState(comment.likesCount || 0);
  const [dislikes, setDislikes] = useState(comment.dislikesCount || 0);

  async function react(type) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    const res = await fetch(`/api/news/${postId}/comments/${comment.id}/react`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type }),
    });

    const data = await res.json();
    if (!data.ok) return;

    setLikes(data.likesCount);
    setDislikes(data.dislikesCount);
    setLiked(data.userReaction === "like");
    setDisliked(data.userReaction === "dislike");
  }

  return (
    <div className="p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--badge-bg)]/40">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">

        <span className="text-sm font-semibold text-orange-400">
          {comment.userName || "Anonymous"}
        </span>

        <span className="text-xs opacity-60">
          {formatTimeAgo(comment.createdAt)}
        </span>

      </div>

      {/* COMMENT MESSAGE */}
      <p className="text-sm md:text-base leading-relaxed text-[var(--text-title)] mb-3">
        {comment.text}
      </p>

      {/* ACTION BAR */}
      <div className="flex items-center gap-5 text-xs opacity-90">

        {/* LIKE */}
        <button
          onClick={() => react("like")}
          className="flex items-center gap-1 hover:text-orange-400 transition"
        >
          {liked ? (
            <HandThumbUpSolid className="w-4 h-4 text-orange-400" />
          ) : (
            <HandThumbUpIcon className="w-4 h-4" />
          )}
          {likes}
        </button>

        {/* DISLIKE */}
        <button
          onClick={() => react("dislike")}
          className="flex items-center gap-1 hover:text-orange-400 transition"
        >
          {disliked ? (
            <HandThumbDownSolid className="w-4 h-4 text-orange-400" />
          ) : (
            <HandThumbDownIcon className="w-4 h-4" />
          )}
          {dislikes}
        </button>

        {/* REPLY */}
        <button className="hover:text-orange-400 transition">
          Reply
        </button>

      </div>
    </div>
  );
}







// "use client";

// import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";

// export default function CommentItem({
//   comment,
//   postId,
//   currentUser,
//   refreshComments,
// }) {
//   const [likes, setLikes] = useState(comment.likes || 0);
//   const [dislikes, setDislikes] = useState(comment.dislikes || 0);

//   const [replying, setReplying] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const [replies, setReplies] = useState([]);
//   const [showReplies, setShowReplies] = useState(false);

//   async function react(type) {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return;

//     const token = await user.getIdToken();

//     const res = await fetch(`/api/comments/${comment.id}/reaction`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ type }),
//     });

//     const data = await res.json();

//     if (data.ok) {
//       setLikes(data.likes);
//       setDislikes(data.dislikes);
//     }
//   }

//   async function loadReplies() {
//     if (showReplies) {
//       setShowReplies(false);
//       return;
//     }

//     const res = await fetch(`/api/comments/${comment.id}/replies`);
//     const data = await res.json();

//     if (data.ok) {
//       setReplies(data.replies);
//       setShowReplies(true);
//     }
//   }

//   async function submitReply() {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return;

//     const token = await user.getIdToken();

//     await fetch(`/api/news/${postId}/comments`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         text: replyText,
//         parentCommentId: comment.id,
//       }),
//     });

//     setReplyText("");
//     setReplying(false);
//     loadReplies();
//   }

//   async function deleteComment() {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return;

//     const token = await user.getIdToken();

//     await fetch(`/api/comments/${comment.id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     refreshComments();
//   }

//   return (
//     <div className="space-y-3">

//       {/* comment */}
//       <div className="p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--badge-bg)]/60">

//         <div className="flex justify-between items-center text-xs opacity-70">
//           <span className="font-semibold">{comment.userName}</span>
//           <span>{new Date(comment.createdAt).toLocaleString()}</span>
//         </div>

//         <p className="mt-1 text-sm">{comment.text}</p>

//         {/* actions */}
//         <div className="flex items-center gap-4 mt-3 text-xs">

//           <button
//             onClick={() => react("like")}
//             className="hover:text-orange-400 transition"
//           >
//             👍 {likes}
//           </button>

//           <button
//             onClick={() => react("dislike")}
//             className="hover:text-orange-400 transition"
//           >
//             👎 {dislikes}
//           </button>

//           <button
//             onClick={() => setReplying(!replying)}
//             className="hover:text-orange-400 transition"
//           >
//             Reply
//           </button>

//           {currentUser === comment.userUid && (
//             <button
//               onClick={deleteComment}
//               className="text-red-400 hover:text-red-500"
//             >
//               Delete
//             </button>
//           )}

//           <button
//             onClick={loadReplies}
//             className="opacity-70 hover:text-orange-400"
//           >
//             {showReplies ? "Hide replies" : "View replies"}
//           </button>
//         </div>

//         {/* reply input */}
//         {replying && (
//           <div className="mt-3 flex gap-2">
//             <input
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-[var(--card-border)] text-sm"
//               placeholder="Write reply..."
//             />
//             <button
//               onClick={submitReply}
//               className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs"
//             >
//               Reply
//             </button>
//           </div>
//         )}
//       </div>

//       {/* replies */}
//       {showReplies && replies.length > 0 && (
//         <div className="ml-8 space-y-3 border-l border-[var(--card-border)] pl-4">
//           {replies.map((r) => (
//             <div
//               key={r._id}
//               className="p-3 rounded-xl bg-[var(--badge-bg)]/50 text-sm"
//             >
//               <div className="text-xs opacity-70 mb-1">{r.userName}</div>
//               {r.text}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }