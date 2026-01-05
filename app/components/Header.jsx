







// File: components/Header.jsx
"use client"
import React , {useState} from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import SignUp from './SignUp'
import PostNewsButton from './PostNewsButton'
import MyNewsButton from './MyNewsButton';
import ProfileButton from './ProfileButton'


export default function Header({ onSearch }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function runSearch() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)"
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            className="p-2 rounded-md"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-title)" }}>
              Rembang, Ind
            </div>
            <div style={{ color: "var(--text-body)" }}>
              Top Headlines
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <SearchBar             
            value={query}
            onChange={setQuery}
            onSubmit={runSearch}
          />
          <button
            onClick={runSearch}
            className="px-3 py-2 rounded-md"
            style={{
              border: "1px solid var(--card-border)",
              color: "var(--text-title)"
            }}
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden md:block px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:opacity-95 transition"
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)"
            }}
          >
            Get Started
          </button>
          {/* <SignUp  >
              
          </SignUp> */}
          <PostNewsButton>
            
          </PostNewsButton>
          <MyNewsButton></MyNewsButton>
          <ProfileButton/>
          {/* <div
            className="h-8 w-8 rounded-full"
            style={{ background: "var(--card-border)" }}
          /> */}
          
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={runSearch}
        />
      </div>
    </header>
  );
}


