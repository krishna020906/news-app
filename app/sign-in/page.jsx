"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"; // adjust path if needed

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      router.push("/");
    } catch (err) {
      console.error("Sign in error:", err);
      // Firebase errors often come as err.code / err.message
      setError(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 `bg-[var(--card-bg)]` transition-colors">
      <div className="card w-full max-w-md p-8 rounded-2xl">
        <h1 className="card-title text-2xl font-semibold text-center mb-6">Sign In</h1>

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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center card-body text-sm mt-4">
          Don't have an account? <a href="/sign-up" className="text-orange-500 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}






