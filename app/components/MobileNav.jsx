

// File: components/MobileNav.jsx
import React from 'react';

export default function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] md:hidden bg-white rounded-3xl shadow-lg border border-slate-100 p-2 flex justify-between items-center">
      <button className="flex flex-col items-center text-slate-700 text-xs">
        <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Home</span>
      </button>
      <button className="flex flex-col items-center text-slate-700 text-xs">
        🔔<span>Alerts</span>
      </button>
      <button className="flex flex-col items-center text-slate-700 text-xs">
        ➕<span>Submit</span>
      </button>
      <button className="flex flex-col items-center text-slate-700 text-xs">
        👤<span>Profile</span>
      </button>
    </nav>
  );
}



