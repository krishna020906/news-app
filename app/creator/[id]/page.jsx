"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CreatorPage() {

  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("posts");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!id) return;

    async function loadCreator() {

      try {

        const res = await fetch(`/api/creator/${id}`);
        const data = await res.json();

        if (data.ok) {
          setCreator(data.creator);
        }

      } catch (err) {
        console.error(err);
      }

    }

    async function loadPosts() {

      try {

        const res = await fetch(`/api/creator/${id}/posts`);
        const data = await res.json();

        if (data.ok) {
          setPosts(data.posts);
        }

      } catch (err) {
        console.error(err);
      }

    }

    Promise.all([loadCreator(), loadPosts()])
      .finally(() => setLoading(false));

  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Creator not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-title)]">

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold">
            {creator.name?.[0]}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">
              {creator.name}
            </h1>

            <p className="text-sm opacity-70">
              {creator.city}, {creator.state}
            </p>

            <p className="text-sm opacity-70">
              {creator.profession}
            </p>
          </div>

        </div>


        {/* FILTER CHIPS */}

        <div className="flex gap-4 border-b border-[var(--card-border)] mb-6">

          <button
            onClick={() => setTab("posts")}
            className={`pb-2 text-sm ${
              tab === "posts"
                ? "border-b-2 border-orange-500 text-orange-400"
                : "opacity-70"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => setTab("about")}
            className={`pb-2 text-sm ${
              tab === "about"
                ? "border-b-2 border-orange-500 text-orange-400"
                : "opacity-70"
            }`}
          >
            About
          </button>

        </div>


        {/* POSTS TAB */}

        {tab === "posts" && (

          <div className="space-y-6">

            {posts.length === 0 && (
              <p className="opacity-70">
                This creator has not posted yet.
              </p>
            )}

            {posts.map((post) => (

              <Link
                key={post.id}
                href={`/news/${post.id}`}
                className="block p-4 rounded-xl border border-[var(--card-border)] hover:bg-[var(--badge-bg)] transition"
              >

                <h3 className="font-semibold mb-2">
                  {post.title}
                </h3>

                <p className="text-sm opacity-70 line-clamp-2">
                  {post.preview}
                </p>

              </Link>

            ))}

          </div>

        )}


        {/* ABOUT TAB */}

        {tab === "about" && (

          <div className="space-y-4 text-sm">

            <div>
              <span className="opacity-60">Name:</span>{" "}
              {creator.name}
            </div>

            <div>
              <span className="opacity-60">City:</span>{" "}
              {creator.city}
            </div>

            <div>
              <span className="opacity-60">State:</span>{" "}
              {creator.state}
            </div>

            <div>
              <span className="opacity-60">Profession:</span>{" "}
              {creator.profession}
            </div>

            <div>
              <span className="opacity-60">Age:</span>{" "}
              {creator.age}
            </div>

            <div>
              <span className="opacity-60">Interests:</span>{" "}
              {creator.interests}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}