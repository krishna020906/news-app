// File: components/Header.jsx
import React from 'react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

export default function Header({ onSearch }) {
  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)"
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
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
          <SearchBar onChange={onSearch} />
          <button
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
            className="hidden md:block px-3 py-2 rounded-md"
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)"
            }}
          >
            Get Started
          </button>

          <div
            className="h-8 w-8 rounded-full"
            style={{ background: "var(--card-border)" }}
          />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar onChange={onSearch} mobile />
      </div>
    </header>
  );
}


