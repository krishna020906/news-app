// app/components/PostNewsButton.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/backend/firebase/config"; // ensure Firebase client is initialized
import { getAuth } from "firebase/auth";


export default function PostNewsButton() {
  const [user, setUser] = useState<any | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setChecking(false);
    });

    return () => unsub();
  }, []);

  // While we don't yet know the auth state, render a neutral placeholder to prevent layout shift
  if (checking) {
    return (
      <div className="inline-block px-4 py-2 rounded-xl `bg-[var(--badge-bg)]` text-sm animate-pulse">
        Loading…
      </div>
    );
  }

  if (user) {
    // Signed-in user -> show Post News
    return (
      <Link href="/post-news" className="inline-block">
        <button
          className="px-5 py-2 rounded-xl font-medium bg-[var(--button-bg)] text-[var(--button-text)] shadow-md hover:opacity-95 transition-all duration-150"
          aria-label="Post news"
        >
          Post News
        </button>
      </Link>
    );
  }

  // Guest -> show Sign Up
  return (
    <Link href="/sign-up" className="inline-block">
      <button
        className="px-5 py-2 rounded-xl font-medium border border-[var(--card-border)] bg-transparent text-[var(--text-title)] hover:bg-[var(--badge-bg)] transition-all duration-150"
        aria-label="Sign up"
      >
        Sign Up
      </button>
    </Link>
  );
}
