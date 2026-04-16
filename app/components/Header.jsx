

// // File: components/Header.jsx
"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import PostNewsButton from "./PostNewsButton";
import MyNewsButton from "./MyNewsButton";
import ProfileButton from "./ProfileButton";
import Signup from "./SignUp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import "@/backend/firebase/config";

export default function Header() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (timeFilter) params.set("time", timeFilter);

    router.push(`/?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-[var(--card-bg)] border-[var(--card-border)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div>
            <div className="text-sm font-semibold">News App</div>
            <div className="text-[var(--text-body)]">Top Headlines</div>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="hidden md:flex w-[550px] items-center gap-2 relative pl-[45px]">

          <SearchBar
            value={query}
            onChange={setQuery}
            // onSubmit={handleSearch}
          />

          {/* FILTER BUTTON */}
          {/* <button
            onClick={() => setShowFilters((p) => !p)}
            className="px-3 py-2 rounded-lg border border-[var(--card-border)] text-sm hover:bg-orange-500/10"
          >
            Filters
          </button> */}

          {/* DROPDOWN */}
          {showFilters && (
            <div className="absolute top-12 right-0 w-48 rounded-xl border border-[var(--card-border)] shadow-lg p-2 z-50 bg-[var(--card-bg)]">

              <p className="text-xs opacity-60 px-2 py-1">Time</p>

              {[
                ["1h", "Last 1 hour"],
                ["24h", "Today"],
                ["7d", "This week"],
                ["30d", "This month"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTimeFilter(val)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-orange-500/10 ${
                    timeFilter === val ? "text-orange-500 font-semibold" : ""
                  }`}
                >
                  {label}
                </button>
              ))}

              <button
                onClick={() => setTimeFilter(null)}
                className="w-full text-left px-3 py-2 rounded text-red-400 hover:bg-red-500/10"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!user && <Signup />}
          <PostNewsButton />
          <MyNewsButton />
          <ProfileButton />
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden w-full px-4 pb-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
        />
      </div>
    </header>
  );
}









// "use client";

// import React, { useState } from "react";
// import SearchBar from "./SearchBar";
// import ThemeToggle from "./ThemeToggle";
// import PostNewsButton from "./PostNewsButton";
// import MyNewsButton from "./MyNewsButton";
// import ProfileButton from "./ProfileButton";
// import { getAuth , onAuthStateChanged } from "firebase/auth";
// import "@/backend/firebase/config"
// import Signup from "./SignUp"
// import { useEffect } from "react";

// export default function Header({ onSearch }) {
//   const [query, setQuery] = useState("");
//   const [user, setUser] = useState(null); // ✅ auth state
//   const [showFilters, setShowFilters] = useState(false);
//   const [timeFilter, setTimeFilter] = useState(null);

//   // 🔐 Listen to auth state
//   useEffect(() => {
//     const auth = getAuth();
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u); // u = Firebase user or null
//     });
//     return () => unsub();
//   }, []);

//   function runSearch() {
//     console.log("[HEADER] runSearch with:", query);
//     if (!query.trim()) return;
//     onSearch(query.trim()); // 🔥 ONLY THIS
//   }

//   return (
//     <header
//       className="sticky top-0 z-20 border-b"
//       style={{
//         background: "var(--card-bg)",
//         borderColor: "var(--card-border)",
//       }}
//     >
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* LEFT */}
//         <div className="flex items-center gap-3">
//           <ThemeToggle />

//           <button
//             className="p-2 rounded-md"
//             style={{
//               background: "var(--card-bg)",
//               border: "1px solid var(--card-border)",
//             }}
//           >
//             <svg
//               className="h-6 w-6"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//             >
//               <path
//                 d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M9 21V12h6v9"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>

//           <div>
//             <div
//               className="text-sm font-semibold"
//               style={{ color: "var(--text-title)" }}
//             >
//               Rembang, Ind
//             </div>
//             <div style={{ color: "var(--text-body)" }}>
//               Top Headlines
//             </div>
//           </div>
//         </div>

//         {/* SEARCH (DESKTOP) */}
//         <div className="hidden md:flex items-center gap-3">
//           <SearchBar
//             value={query}
//             onChange={setQuery}
//             onSubmit={runSearch}
//           />
//           {/* <button
//             onClick={runSearch}
//             className="px-3 py-2 rounded-md"
//             style={{
//               border: "1px solid var(--card-border)",
//               color: "var(--text-title)",
//             }}
//           >
//             Search
//           </button> */}
//         </div>

 

//         {/* RIGHT */}
//         <div className="flex items-center gap-3 ">
//           {/* Show signup only when not logged in */}
//          {!user && <Signup/>}
//           <PostNewsButton />
//           <MyNewsButton />
//           <ProfileButton />
//         </div>

          

//             {/* <div className="gap-3 flex items-center">
//               <PostNewsButton />
//               <MyNewsButton />
//               <ProfileButton />
//             </div> */}
//         </div>
      

//       {/* SEARCH (MOBILE) */}
//       <div className="md:hidden w-full px-4 pb-3">
//         <SearchBar
//           value={query}
//           onChange={setQuery}
//           onSubmit={runSearch}
//         />
//       </div>
//     </header>
//   );
// }







// // File: components/Header.jsx
// "use client"
// import React , {useState} from 'react';
// import { useRouter } from 'next/navigation';
// import SearchBar from './SearchBar';
// import ThemeToggle from './ThemeToggle';
// import SignUp from './SignUp'
// import PostNewsButton from './PostNewsButton'
// import MyNewsButton from './MyNewsButton';
// import ProfileButton from './ProfileButton'


// export default function Header({ onSearch }) {
//   const [query, setQuery] = useState("");
//   const router = useRouter();
//   const [localQuery, setLocalQuery] = useState("");

//   function runSearch() {
//     if (!query.trim()) return;
//     router.push(`/search?q=${encodeURIComponent(query.trim())}`);
//   }
//   return (
//     <header
//       className="sticky top-0 z-20 border-b"
//       style={{
//         background: "var(--card-bg)",
//         borderColor: "var(--card-border)"
//       }}
//     >
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <ThemeToggle />

//           <button
//             className="p-2 rounded-md"
//             style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
//           >
//             <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//               <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" strokeLinecap="round" strokeLinejoin="round" />
//               <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>

//           <div>
//             <div className="text-sm font-semibold" style={{ color: "var(--text-title)" }}>
//               Rembang, Ind
//             </div>
//             <div style={{ color: "var(--text-body)" }}>
//               Top Headlines
//             </div>
//           </div>
//         </div>

//         <div className="hidden md:flex items-center gap-3">
//           <SearchBar             
//             value={query}
//             onChange={setQuery}
//             onSubmit={runSearch}
//           />
//           <button
//             onClick={runSearch}
//             className="px-3 py-2 rounded-md"
//             style={{
//               border: "1px solid var(--card-border)",
//               color: "var(--text-title)"
//             }}
//           >
//             Search
//           </button>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             className="hidden md:block px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:opacity-95 transition"
//             style={{
//               background: "var(--button-bg)",
//               color: "var(--button-text)"
//             }}
//           >
//             Get Started
//           </button>
//           {/* <SignUp  >
              
//           </SignUp> */}
//           <PostNewsButton>
            
//           </PostNewsButton>
//           <MyNewsButton></MyNewsButton>
//           <ProfileButton/>
//           {/* <div
//             className="h-8 w-8 rounded-full"
//             style={{ background: "var(--card-border)" }}
//           /> */}
          
//         </div>
//       </div>

//       {/* Mobile Search */}
//       <div className="md:hidden px-4 pb-3">
//         <SearchBar
//           value={query}
//           onChange={setQuery}
//           onSubmit={runSearch}
//         />
//       </div>
//     </header>
//   );
// }


