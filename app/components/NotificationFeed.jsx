"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function NotificationFeed() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.ok) setItems(data.notifications);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }

    load();

  }, []);

  if (loading) return <p>Loading notifications...</p>;

  if (items.length === 0) {
    return <p className="opacity-70">No notifications yet</p>;
  }

  return (
    <div className="space-y-4">

      {items.map((n) => (

        <div
          key={n.id}
          className="flex items-start gap-3 p-4 hover:-translate-y-[1px] rounded-xl border border-[var(--card-border)] hover:border-orange-500 hover:ring-1 hover:ring-orange-500/40 hover:bg-[var(--badge-bg)] transition-all duration-200 cursor-pointer"
        >

          {/* Profile Image */}
          {/* <img
            src={n.actorImage || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
          /> */}
          {n.actorImage ? (

            <img
              src={n.actorImage}
              className="w-10 h-10 rounded-full object-cover"
            />

          ) : (

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-title)",
              }}
            >
              {(n.actorName?.[0] || "?").toUpperCase()}
            </div>

          )}

          {/* Content */}
          <div className="flex-1 text-sm">

            <div>
              <span className="font-semibold">
                {n.actorName}
              </span>{" "}

              {n.type === "follow" && "followed you"}
              {n.type === "post_like" && "liked your post"}
              {n.type === "post_comment" && "commented on your post"}

            </div>

            <div className="text-xs opacity-60 mt-1">
              {timeAgo(n.createdAt)} ago
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}