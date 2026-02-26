"use client";

import { useRouter } from "next/navigation";

export default function MyNewsButton() {
  const router = useRouter();

  const text = "My News";

  return (
    <button
      onClick={() => router.push("/my-news")}
      className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm btn-animated relative"
      style={{
        background: "var(--button-bg)",
        color: "var(--button-text)",
      }}
    >
      <div className="original">{text}</div>

      <div className="letters">
        {text.split("").map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
    </button>
  );
}





// "use client";

// import { useRouter } from "next/navigation";

// export default function MyNewsButton() {
//   const router = useRouter();

//   return (
//     <button
//       onClick={() => router.push("/my-news")}
//       className="hidden md:block px-3 py-2 rounded-md font-medium text-sm hover:opacity-95 transition"
//       style={{
//         background: "var(--button-bg)",
//         color: "var(--button-text)",
//       }}
//     >
//       My News
//     </button>
//   );
// }
