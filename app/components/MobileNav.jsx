// File: components/MobileNav.jsx
import React from 'react';

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] md:hidden rounded-3xl p-2 flex justify-between items-center"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)"
      }}
    >
      {["Home", "Alerts", "Submit", "Profile"].map((label, index) => (
        <button
          key={index}
          className="flex flex-col items-center text-xs"
          style={{ color: "var(--text-body)" }}
        >
          {label === "Home" && "🏠"}
          {label === "Alerts" && "🔔"}
          {label === "Submit" && "➕"}
          {label === "Profile" && "👤"}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}


