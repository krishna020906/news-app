// //app/components/signup.jsx
"use client";

import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const text = "Sign Up";

  return (
    <button
      onClick={() => router.push("/sign-up")}
      className="inline-flex items-center justify-center px-6 py-2.5 text-sm btn-animated relative"
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







// 'use client'; // This component must be client-side to use hooks

// import { useRouter } from 'next/navigation';

// export default function Signup() {
//   const router = useRouter(); // Initialize the router hook

//   const handleSignUpRedirect = () => {
//     router.push('/sign-up'); // Define the redirect logic
//   };

//   return (
//     <button
//       onClick={handleSignUpRedirect} // Attach the handler directly
//       className="px-5 py-2 rounded-m font-medium bg-[var(--button-bg)] text-[var(--button-text)] shadow-md hover:opacity-90 transition-all duration-200"
//     >
//       Sign Up
//     </button>
//   );
// }
