"use client";

import { useRouter } from "next/navigation";

export default function MyNewsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/my-news")}
      className="hidden md:block px-3 py-2 rounded-md font-medium text-sm hover:opacity-95 transition"
      style={{
        background: "var(--button-bg)",
        color: "var(--button-text)",
      }}
    >
      My News
    </button>
  );
}
