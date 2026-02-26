"use client";

import { useRouter } from "next/navigation";

export default function PostNewsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/post-news")}
      className="hidden hover:shadow-lg hover:brightness-110  md:inline-flex items-center gap-3 px-3 py-2 rounded-full font-semibold text-sm relative overflow-hidden transition-colors duration-300 group"
      style={{
        background: "var(--button-bg)",
        color: "white",
      }}
    >
      {/* ICON WRAPPER */}
      <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white overflow-hidden">
        
        {/* ORIGINAL ICON */}
        <svg
          className="absolute w-3 h-3 text-[var(--button-bg)] transition-transform duration-300 ease-in-out group-hover:translate-x-6 group-hover:-translate-y-6"
          viewBox="0 0 14 15"
          fill="none"
        >
          <path
            fill="currentColor"
            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          />
        </svg>

        {/* DUPLICATE ICON */}
        <svg
          className="absolute w-3 h-3 text-[var(--button-bg)] translate-x-[-24px] translate-y-[24px] transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"
          viewBox="0 0 14 15"
          fill="none"
        >
          <path
            fill="currentColor"
            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          />
        </svg>
      </span>

      <span className="relative z-10">Post News</span>
    </button>
  );
}








// "use client";

// import { useRouter } from "next/navigation";

// export default function PostNewsButton() {
//   const router = useRouter();

//   return (
//     <button
//       onClick={() => router.push("/post-news")}
//       className="hidden md:block px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:opacity-95 transition"
//       style={{
//         background: "var(--button-bg)",
//         color: "var(--button-text)",
//       }}
//     >
//       Post News
//     </button>
//   );
// }










// // app/components/PostNewsButton.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import "@/backend/firebase/config"; // ensure Firebase client is initialized
// import { getAuth } from "firebase/auth";


// export default function PostNewsButton() {
//   const [user, setUser] = useState<any | null>(null);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsub = auth.onAuthStateChanged((u) => {
//       setUser(u);
//       setChecking(false);
//     });

//     return () => unsub();
//   }, []);

//   // While we don't yet know the auth state, render a neutral placeholder to prevent layout shift
//   if (checking) {
//     return (
//       <div className="inline-block px-4 py-2 rounded-xl `bg-[var(--badge-bg)]` text-sm animate-pulse">
//         Loading…
//       </div>
//     );
//   }

//   if (user) {
//     // Signed-in user -> show Post News
//     return (
//       <Link href="/post-news" className="inline-block">
//         <button
//           className="px-5 py-2 rounded-xl font-medium bg-[var(--button-bg)] text-[var(--button-text)] shadow-md hover:opacity-95 transition-all duration-150"
//           aria-label="Post news"
//         >
//           Post News
//         </button>
//       </Link>
//     );
//   }

//   // Guest -> show Sign Up
//   return (
//     <Link href="/sign-up" className="inline-block">
//       <button
//         className="px-5 py-2 rounded-xl font-medium border border-[var(--card-border)] bg-transparent text-[var(--text-title)] hover:bg-[var(--badge-bg)] transition-all duration-150"
//         aria-label="Sign up"
//       >
//         Sign Up
//       </button>
//     </Link>
//   );
// }
