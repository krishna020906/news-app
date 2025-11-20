"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config"

export default function PostNewsClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        // replace instead of push to avoid back button confusion
        router.replace("/sign-in");
      } else {
        setChecking(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (checking) {
    // show a skeleton/loading so nothing sensitive is visible
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div>Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}

