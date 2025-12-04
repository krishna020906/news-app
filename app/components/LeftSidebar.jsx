// components/LeftSidebar.jsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const NAV_ITEMS = [
  {
    key: "home",
    label: "Home / Top Headlines",
    href: "/?tab=top",   // 👈 only top when explicitly chosen
    icon: "🏠",
  },
  {
    key: "for-you",
    label: "For You / Personalized",
    href: "/",           // 👈 default root = personalised
    icon: "✨",
  },
  {
    key: "my-news",
    label: "My News",
    href: "/my-news",
    icon: "📝",
  },
  {
    key: "saved",
    label: "Saved News",
    href: "/saved",
    icon: "⭐",
  },
  {
    key: "profile",
    label: "Profile",
    href: "/profile",
    icon: "👤",
  },
];

export default function LeftSidebar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab"); // "top" | null

  const handleNav = (href) => {
    router.push(href);
  };

  return (
    <aside className="hidden md:block">
      <div
        className="card rounded-2xl p-3 shadow-md sticky top-20"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* header with collapse toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-sm font-medium hover:bg-black/10 transition"
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs"
              style={{ borderColor: "var(--card-border)" }}
            >
              N
            </span>
            <span style={{ color: "var(--text-title)" }}>Menu</span>
          </span>
          <span className="text-xs" style={{ color: "var(--text-body)" }}>
            {open ? "Hide ▲" : "Show ▼"}
          </span>
        </button>

        {open && (
          <nav className="mt-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              let isActive = false;

              if (item.key === "for-you") {
                // default: personalised when at "/" and NOT explicitly tab=top
                isActive = pathname === "/" && tab !== "top";
              } else if (item.key === "home") {
                // only active when tab=top
                isActive = pathname === "/" && tab === "top";
              } else {
                isActive = pathname.startsWith(item.href);
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition ${
                    isActive
                      ? "bg-orange-500 text-[var(--button-text)]"
                      : "hover:bg-black/10 card-body"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </aside>
  );
}










// // components/LeftSidebar.jsx
// "use client";

// import { useState } from "react";
// import { useRouter, usePathname } from "next/navigation";

// const NAV_ITEMS = [
//   {
//     key: "home",
//     label: "Home / Top Headlines",
//     href: "/",
//     icon: "🏠",
//   },
//   {
//     key: "for-you",
//     label: "For You / Personalized",
//     href: "/?tab=for-you", // future: you can read this tab param
//     icon: "✨",
//   },
//   {
//     key: "my-news",
//     label: "My News",
//     href: "/my-news",
//     icon: "📝",
//   },
//   {
//     key: "saved",
//     label: "Saved News",
//     href: "/saved", // you will build this later
//     icon: "⭐",
//   },
//   {
//     key: "profile",
//     label: "Profile",
//     href: "/profile",
//     icon: "👤",
//   },
// ];

// export default function LeftSidebar() {
//   const [open, setOpen] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleNav = (href) => {
//     router.push(href);
//   };

//   return (
//     <aside className="hidden md:block">
//       <div
//         className="card rounded-2xl p-3 shadow-md sticky top-20"
//         style={{
//           background: "var(--card-bg)",
//           border: "1px solid var(--card-border)",
//         }}
//       >
//         {/* header with collapse toggle */}
//         <button
//           type="button"
//           onClick={() => setOpen((v) => !v)}
//           className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-sm font-medium hover:bg-black/10 transition"
//         >
//           <span className="flex items-center gap-2">
//             <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs"
//               style={{ borderColor: "var(--card-border)" }}
//             >
//               N
//             </span>
//             <span style={{ color: "var(--text-title)" }}>Menu</span>
//           </span>
//           <span className="text-xs" style={{ color: "var(--text-body)" }}>
//             {open ? "Hide ▲" : "Show ▼"}
//           </span>
//         </button>

//         {open && (
//           <nav className="mt-3 flex flex-col gap-1">
//             {NAV_ITEMS.map((item) => {
//               const isActive =
//                 item.href === "/"
//                   ? pathname === "/"
//                   : pathname.startsWith(item.href.replace(/\?.*$/, ""));

//               return (
//                 <button
//                   key={item.key}
//                   type="button"
//                   onClick={() => handleNav(item.href)}
//                   className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition ${
//                     isActive
//                       ? "bg-orange-500 text-[var(--button-text)]"
//                       : "hover:bg-black/10 card-body"
//                   }`}
//                 >
//                   <span className="text-base">{item.icon}</span>
//                   <span>{item.label}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         )}
//       </div>
//     </aside>
//   );
// }
