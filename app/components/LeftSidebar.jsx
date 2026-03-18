// // // components/LeftSidebar.jsx
"use client";

import { useState } from "react";
import { useEffect } from "react";


import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  HomeIcon,
  SparklesIcon,
  UserGroupIcon,
  PencilSquareIcon,
  BookmarkIcon,
  UserCircleIcon,
  BellIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { getAuth, signOut } from "firebase/auth";

export default function LeftSidebar() {
  const [expanded, setExpanded] = useState(true);
  // const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [theme, setTheme] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [notifCount, setNotifCount] = useState(0);
  const tab = searchParams.get("tab");
  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      if (t) {
        setTheme(t);
      } else {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch {
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    if (!theme) return;

    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {

    async function loadCount() {

      try {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const token = await user.getIdToken();

        const res = await fetch("/api/notifications/count", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.ok) {
          setNotifCount(data.count);
        }

      } catch {}

    }

    loadCount();

  }, []);

  const NAV_ITEMS = [
    { key: "home", label: "Top Headlines", href: "/?tab=top", icon: HomeIcon },
    { key: "for-you", label: "For You", href: "/", icon: SparklesIcon },
    { key: "following", label: "Following", href: "/?tab=following", icon: UserGroupIcon },
    { key: "my-news", label: "My News", href: "/my-news", icon: PencilSquareIcon },
    { key: "saved", label: "Saved News", href: "/saved", icon: BookmarkIcon },
    { key: "profile", label: "Profile", href: "/profile", icon: UserCircleIcon },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/");
  };

  // const toggleDark = () => {
  //   setDarkMode(!darkMode);
  //   document.documentElement.classList.toggle("dark");
  // };

  return (
    <aside className="hidden md:flex h-screen">
      <div
        className="flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl"
        style={{
          width: expanded ? "260px" : "80px",
          background: "var(--card-bg)",
          borderRight: "1px solid var(--card-border)",
        }}
      >
        {/* TOP */}
        <div className="p-4 space-y-6">

          {/* Toggle Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-500/10 transition"
          >
            <Bars3Icon className="w-6 h-6 text-orange-500" />
          </button>

          {/* NAV */}
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              let isActive = false;
              if (item.key === "for-you") {
                isActive = pathname === "/" && !tab;
              } else if (item.key === "home") {
                isActive = pathname === "/" && tab === "top";
              } else if (item.key === "following") {
                isActive = pathname === "/" && tab === "following";
              } else {
                isActive = pathname.startsWith(item.href);
              }

              return (
                <button
                  key={item.key}
                  onClick={() => router.push(item.href)}
                  className={`group flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "hover:bg-orange-500/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-[var(--text-body)] group-hover:text-orange-500"
                    }`}
                  />

                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Notifications */}
            <button
              onClick={() => router.push("/?tab=notifications")}
              className="group flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-orange-500/10 transition"
            >
              {/* <BellIcon className="w-5 h-5 text-[var(--text-body)] group-hover:text-orange-500 transition" /> */}
              <div className="relative">

                <BellIcon className="w-5 h-5 text-[var(--text-body)] group-hover:text-orange-500 transition" />

                {notifCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}

              </div>
              {expanded && (
                <span className="text-sm font-medium transition">
                  Notifications
                </span>
              )}
            </button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="p-4 space-y-4">

          {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MoonIcon className="w-5 h-5 text-[var(--text-body)]" />
                {expanded && <span className="text-sm">Dark Mode</span>}
              </div>

              {expanded && (
                <button
                  onClick={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                  className={`relative w-10 h-5 rounded-full transition ${
                    theme === "dark"
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0 left-0 h-5 w-5 bg-white rounded-full shadow transition-transform ${
                      theme === "dark" ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              )}
            </div>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="group flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-red-500/10 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-[var(--text-body)] group-hover:text-red-500 transition" />
            {expanded && (
              <span className="text-sm font-medium group-hover:text-red-500 transition">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="w-[320px] rounded-2xl p-6 shadow-xl"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--text-title)" }}
            >
              Confirm Logout
            </h3>

            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-body)" }}
            >
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm hover:bg-gray-500/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await handleLogout();
                }}
                className="px-4 py-2 rounded-xl text-sm text-white bg-red-500 hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}









// "use client";

// import { useState } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { getAuth, signOut } from "firebase/auth";

// const NAV_ITEMS = [
//   { key: "home", label: "Top Headlines", href: "/?tab=top", icon: "🏠" },
//   { key: "for-you", label: "For You", href: "/", icon: "✨" },
//   { key: "following", label: "Following", href: "/?tab=following", icon: "👥" },
//   { key: "my-news", label: "My News", href: "/my-news", icon: "📝" },
//   { key: "saved", label: "Saved News", href: "/saved", icon: "⭐" },
//   { key: "profile", label: "Profile", href: "/profile", icon: "👤" },
// ];

// export default function LeftSidebar() {
//   const [expanded, setExpanded] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);

//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const tab = searchParams.get("tab");

//   const handleNav = (href) => router.push(href);

//   const handleLogout = async () => {
//     const auth = getAuth();
//     await signOut(auth);
//     router.push("/");
//   };

//   const toggleDark = () => {
//     setDarkMode((v) => !v);
//     document.documentElement.classList.toggle("dark");
//   };

//   return (
//     <aside className="hidden md:block h-screen sticky top-0">
//       <div
//         className={`transition-all duration-300 h-full rounded-r-2xl shadow-lg flex flex-col justify-between`}
//         style={{
//           width: expanded ? "260px" : "80px",
//           background: "var(--card-bg)",
//           borderRight: "1px solid var(--card-border)",
//         }}
//       >
//         {/* TOP SECTION */}
//         <div className="p-4">

//           {/* Toggle Button */}
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="mb-6 flex items-center justify-center w-10 h-10 rounded-xl transition hover:bg-black/10"
//           >
//             {expanded ? "⬅" : "➡"}
//           </button>

//           {/* NAVIGATION */}
//           <div className="flex flex-col gap-2">
//             {NAV_ITEMS.map((item) => {
//               let isActive = false;

//               if (item.key === "for-you") {
//                 isActive = pathname === "/" && !tab;
//               } else if (item.key === "home") {
//                 isActive = pathname === "/" && tab === "top";
//               } else if (item.key === "following") {
//                 isActive = pathname === "/" && tab === "following";
//               } else {
//                 isActive =
//                   pathname === item.href ||
//                   pathname.startsWith(item.href + "/");
//               }

//               return (
//                 <button
//                   key={item.key}
//                   onClick={() => handleNav(item.href)}
//                   className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
//                     isActive
//                       ? "bg-orange-500 text-white"
//                       : "hover:bg-black/10"
//                   }`}
//                 >
//                   <span className="text-lg">{item.icon}</span>

//                   {expanded && (
//                     <span
//                       className="text-sm font-medium"
//                       style={{ color: isActive ? "white" : "var(--text-title)" }}
//                     >
//                       {item.label}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}

//             {/* Notifications */}
//             <button
//               className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/10 transition"
//               onClick={() => router.push("/notifications")}
//             >
//               <span className="text-lg">🔔</span>
//               {expanded && <span className="text-sm">Notifications</span>}
//             </button>
//           </div>
//         </div>

//         {/* BOTTOM SECTION */}
//         <div className="p-4 flex flex-col gap-3">

//           {/* Dark Mode */}
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <span>🌙</span>
//               {expanded && <span className="text-sm">Dark Mode</span>}
//             </div>

//             {expanded && (
//               <button
//                 onClick={toggleDark}
//                 className={`w-10 h-5 rounded-full transition ${
//                   darkMode ? "bg-orange-500" : "bg-gray-300"
//                 }`}
//               >
//                 <div
//                   className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
//                     darkMode ? "translate-x-5" : ""
//                   }`}
//                 />
//               </button>
//             )}
//           </div>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/10 transition"
//           >
//             <span className="text-lg">🚪</span>
//             {expanded && <span className="text-sm">Logout</span>}
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }










// "use client";

// import { useState } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";

// const NAV_ITEMS = [
//   {
//     key: "home",
//     label: "Home / Top Headlines",
//     href: "/?tab=top",   // 👈 only top when explicitly chosen
//     icon: "🏠",
//   },
//   {
//     key: "for-you",
//     label: "For You / Personalized",
//     href: "/",           // 👈 default root = personalised
//     icon: "✨",
//   },
//   {
//     key: "following", // ✅ NEW
//     label: "Following",
//     href: "/?tab=following",
//     icon: "👥",
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
//     href: "/saved",
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
//   const searchParams = useSearchParams();
//   const tab = searchParams.get("tab"); // "top" | null

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
//             <span
//               className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs"
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
//               let isActive = false;

//               if (item.key === "for-you") {
                
//                 isActive = pathname === "/" && !tab;
//               } else if (item.key === "home") {
                
//                   isActive = pathname === "/" && tab === "top";
//               } else if (item.key === "following") {
                
//                   isActive = pathname === "/" && tab === "following";
//               }
//                 else {
//                   isActive = pathname === item.href || pathname.startsWith(item.href + "/");
//               }

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
