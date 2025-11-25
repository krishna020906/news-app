// app/profile-setup/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config"; // make sure Firebase is initialized

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

export default function ProfileSetupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [locality, setLocality] = useState("");
  const [profession, setProfession] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [age, setAge] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to set up your profile.");
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          state,
          locality,
          profession,
          hobbies, // string, API turns into array
          age: age ? Number(age) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      // Go to homepage after success
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg, #020617)]">
      <div className="card w-full max-w-lg p-8 rounded-2xl">
        <h1 className="card-title text-2xl font-semibold mb-2">
          Tell us about you
        </h1>

        <p className="card-body text-sm mb-4 flex items-start gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[var(--card-border)] text-xs mr-1">
            i
          </span>
          We use this info only to show you more personalised news
          (location & interests). You can keep it generic if you want.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm card-body">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Krishna"
            />
          </div>

          <div>
            <label className="text-sm card-body">State (India)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm card-body">City / Locality</label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Mumbai, Andheri West"
            />
          </div>

          <div>
            <label className="text-sm card-body">Profession</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Student, Software Dev, Trader..."
            />
          </div>

          <div>
            <label className="text-sm card-body">
              Hobbies / Interests{" "}
              <span className="text-xs opacity-70">
                (comma separated: cricket, tech, politics)
              </span>
            </label>
            <input
              type="text"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm card-body">Age (optional)</label>
            <input
              type="number"
              min="10"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm mt-1">{error}</div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm card-body underline underline-offset-4"
            >
              Skip for now
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl font-medium bg-orange-500 text-white shadow-md hover:opacity-95 transition-all duration-150 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save & continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
