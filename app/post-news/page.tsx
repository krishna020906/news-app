
"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import PostNewsClientGuard from "../components/PostNewsClientGuard";
export default function PostNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const idToken = await user.getIdToken();
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // success
      router.push("/"); // or news list
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostNewsClientGuard>
      <div className="min-h-screen flex items-center justify-center p-6 `bg-[var(--card-bg)]`">
        <div className="card w-full max-w-2xl p-8 rounded-2xl">
          <h1 className="card-title text-2xl font-semibold mb-6">Post News</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="p-3 border rounded" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={8} className="p-3 border rounded"></textarea>
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-orange-500 text-[var(--button-text)]">
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    </PostNewsClientGuard>
    
  );
}
