// File: components/Header.jsx
import React from 'react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle'

export default function Header({ onSearch }) {
  return (
    <header className="bg-white sticky top-0 z-20 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThemeToggle/>
          <button className="p-2 rounded-md bg-gray-100">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div>
            <div className="text-sm text-slate-900 font-semibold">Rembang, Ind</div>
            <div className=" text-slate-700 ">Top Headlines</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <SearchBar onChange={onSearch} />
          <button className="px-3 py-2 text-slate-700 rounded-md border">Search</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block px-3 py-2 rounded-md bg-orange-500 text-white">Get Started</button>
          <div className="h-8 w-8 rounded-full bg-slate-200" />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar onChange={onSearch} mobile />
      </div>
    </header>
  );
}


