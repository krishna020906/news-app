// components/ProfileButton.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "@/backend/firebase/config";

export default function ProfileButton() {
  const router = useRouter();
  const [initials, setInitials] = useState("?");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const base =
          user.displayName || user.email || user.uid || "?";
        const firstChar =
          base.trim().length > 0 ? base.trim()[0].toUpperCase() : "?";
        setInitials(firstChar);
      } else {
        setInitials("?");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    router.push("/profile");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open profile"
      className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm border"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--text-title)",
      }}
    >
      {loading ? "…" : initials}
    </button>
  );
}
