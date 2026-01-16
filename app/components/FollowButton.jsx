//app/components/FollowButton.jsx
"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function FollowButton({
  authorUid,
  initialIsFollowing = false,
  initialFollowersCount = 0,
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  async function handleFollow(e) {
    e.preventDefault();
    e.stopPropagation();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.info("Login to follow creators");
      return;
    }

    if (user.uid === authorUid) {
      toast.warn("You can’t follow yourself 🙂");
      return;
    }

    try {
      setLoading(true);

      const token = await user.getIdToken();
      const res = await fetch(`/api/creators/${authorUid}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update follow");
      }

      // 🔥 THIS IS THE FIX
      setIsFollowing(data.following);
      setFollowersCount(data.followersCount);

      toast.success(
        data.following ? "Following creator" : "Unfollowed creator"
      );
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
    onClick={handleFollow}
    disabled={loading}
    className={`
        px-3 py-1 rounded-full text-xs font-medium transition
        ${
        isFollowing
            ? "bg-[var(--card-bg)] text-[var(--text-title)] border border-[var(--card-border)]"
            : "bg-orange-500 text-white hover:opacity-90"
        }
    `}
    >
    {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>


  );
}









// //app/components/FollowButton.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";

// export default function FollowButton({
//   authorUid,
//   initialIsFollowing = false,
//   initialFollowersCount = 0,
// }) {
//   const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
//   const [followersCount, setFollowersCount] = useState(initialFollowersCount);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setIsFollowing(initialIsFollowing);
//     setFollowersCount(initialFollowersCount);
//   }, [initialIsFollowing, initialFollowersCount]);

//   async function handleFollow(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       toast.info("Login to follow creators");
//       return;
//     }

//     if (user.uid === authorUid) {
//       toast.warn("You can’t follow yourself");
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = await user.getIdToken();

//       const res = await fetch(`/api/creators/${authorUid}/follow`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok || !data.ok) {
//         throw new Error(data.error || "Failed to update follow");
//       }

//       setIsFollowing(data.following);
//       setFollowersCount(data.followersCount ?? followersCount);

//       toast.success(
//         data.following ? "Following creator" : "Unfollowed creator"
//       );
//     } catch (err) {
//       console.error("Follow error:", err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       onClick={handleFollow}
//       disabled={loading}
//       className={`
//         px-3 py-1 rounded-full text-xs font-medium transition
//         ${
//           isFollowing
//             ? "bg-gray-700 text-white"
//             : "bg-orange-500 text-white"
//         }
//         disabled:opacity-60
//       `}
//     >
//       {loading ? "..." : isFollowing ? "Following" : "Follow"}
//     </button>
//   );
// }



