"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";

export default function NotificationsPage() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const token = await user.getIdToken();

        const res = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.ok) {
          setNotifications(data.notifications);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }

    load();

  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-xl font-semibold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="opacity-70">No notifications yet</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl border border-[var(--card-border)]"
            >
              {n.type === "follow" && (
                <p>Someone followed you</p>
              )}

              {n.type === "post_like" && (
                <p>Someone liked your post</p>
              )}

              {n.type === "post_comment" && (
                <p>Someone commented on your post</p>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}