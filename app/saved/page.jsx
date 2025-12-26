"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import ArticleCard from "../components/ArticleCard";

export default function SavedPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const res = await fetch("/api/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSaved(data.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  if (saved.length === 0)
    return <p className="card p-4 text-center">No saved news yet.</p>;

  return (
    <div className="space-y-4">
      {saved.map((a) => (
        <ArticleCard key={a._id} article={a} />
      ))}
    </div>
  );
}
