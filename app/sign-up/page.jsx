"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // next/link + router if using app router
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"; // adjust path if needed

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // <- prevents page reload
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // user created successfully
      console.log("User created:", userCredential.user);
      // redirect to dashboard or welcome page
      router.push("/"); // change destination as needed
    } catch (err) {
      console.error("Sign up error:", err);
      // Show friendly error message
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 `bg-[var(--card-bg)]` transition-colors">
      <div className="card w-full max-w-md p-8 rounded-2xl">
        <h1 className="card-title text-2xl font-semibold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-sm card-body">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-lg border `border-[var(--card-border)]` bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>

          <label className="text-sm card-body">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-2 p-3 rounded-lg border `border-[var(--card-border)]` bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 p-3 rounded-lg bg-orange-500 `text-[var(--button-text)]` font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center card-body text-sm mt-4">
          Already have an account? <a href="/login" className="text-orange-500 font-medium">Login</a>
        </p>
      </div>
    </div>
  );
}










// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
// import {auth} from '@/app/firebase/config'
 

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)

//   const handleSubmit = async(e) => {
//     e.preventDefault()
//     try {
//         const res = await createUserWithEmailAndPassword(email, password)
//         console.log({res})
//         setEmail('')
//         setPassword('')
//     } catch (e) {
//         console.error(e)
        
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 `bg-[var(--card-bg)]` transition-colors">
//       <div className="card w-full max-w-md p-8 rounded-2xl">
//         <h1 className="card-title text-2xl font-semibold text-center mb-6">Create Account</h1>

//         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//           <div className="flex flex-col">
//             <label className="text-sm card-body mb-1">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 rounded-lg border `border-[var(--card-border)]` bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-sm card-body mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 rounded-lg border `border-[var(--card-border)]` bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-2 p-3 rounded-lg bg-orange-500 `text-[var(--button-text)]` font-semibold hover:opacity-90 transition"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-center card-body text-sm mt-4">
//           Already have an account?{" "}
//           <Link href="/login" className="text-orange-500 font-medium">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
