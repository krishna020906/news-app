// app/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";
import { uploadToCloudinary } from "@/backend/utils/uploadToCloudinary";

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

const PROFESSION_OPTIONS = [
  "Student",
  "Software Engineer",
  "Web Developer",
  "Data Scientist",
  "Trader",
  "Investor",
  "Entrepreneur",
  "Designer",
  "Freelancer",
  "Other",
];

const HOBBY_OPTIONS = [
  "trading",
  "investing",
  "coding",
  "webdev",
  "gaming",
  "cricket",
  "football",
  "music",
  "movies",
  "anime",
  "reading",
  "startups",
  "productivity",
];

export default function ProfilePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [locality, setLocality] = useState("");
  const [profession, setProfession] = useState("");
  const [hobbies, setHobbies] = useState([]); // ✅ plain JS
  const [age, setAge] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const toggleHobby = (hobby) => {
    setHobbies((prev) =>
      prev.includes(hobby)
        ? prev.filter((h) => h !== hobby)
        : [...prev, hobby]
    );
  };

  // Load current profile
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError("You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const idToken = await user.getIdToken();
        setEmail(user.email || "");

        // 🔹 adjust this if your backend is different
        const res = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        const u = data.user || {};

        setName(u.name || "");
        setState(u.state || "");
        setLocality(u.locality || "");
        setProfession(u.profession || "");
        setAge(u.age ? String(u.age) : "");

        if (Array.isArray(u.hobbies)) {
          setHobbies(u.hobbies);
        } else if (typeof u.hobbies === "string") {
          const arr = u.hobbies
            .split(",")
            .map((h) => h.trim().toLowerCase())
            .filter(Boolean);
          setHobbies(arr);
        } else {
          setHobbies([]);
        }

        setAvatarUrl(u.avatarUrl || "");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    try {
      setAvatarUploading(true);
      setAvatarProgress(0);
      setError("");

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to upload an avatar.");
        setAvatarUploading(false);
        return;
      }

      const folder = `avatars/${user.uid}`;
      const url = await uploadToCloudinary(avatarFile, folder, (percent) => {
        setAvatarProgress(percent);
      });

      setAvatarUrl(url);
      setInfo("Profile picture updated (don’t forget to Save profile).");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setInfo("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to save your profile.");
        setSaving(false);
        return;
      }

      const idToken = await user.getIdToken();

      // 🔹 adjust method/URL if your API is different (e.g. POST instead of PUT)
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          state,
          locality,
          profession,
          hobbies,
          age: age ? Number(age) : null,
          avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      setInfo("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg, #020617)]">
        <div className="card w-full max-w-lg p-8 rounded-2xl">
          <p className="card-body text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg, #020617)]">
      <div className="card w-full max-w-lg p-8 rounded-2xl">
        <h1 className="card-title text-2xl font-semibold mb-2">
          Your Profile
        </h1>
        <p className="card-body text-sm mb-4">
          Edit your details to improve personalised news recommendations.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar + basic info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="h-14 w-14 rounded-full overflow-hidden border flex items-center justify-center text-lg font-semibold"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  color: "var(--text-title)",
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (name || email || "?")
                    .trim()
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className="card-body text-sm">
                <span className="font-medium">Email: </span>
                {email || "—"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="card-body text-xs"
                />
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={!avatarFile || avatarUploading}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-orange-500 text-[var(--button-text)] disabled:opacity-60"
                >
                  {avatarUploading ? "Uploading…" : "Upload Photo"}
                </button>
              </div>
              {avatarUploading && (
                <p className="card-body text-xs mt-1">
                  Upload: {avatarProgress}%
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm card-body">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Your name"
            />
          </div>

          {/* State */}
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

          {/* Locality */}
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

          {/* Profession */}
          <div>
            <label className="text-sm card-body">Profession</label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select your profession</option>
              {PROFESSION_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Hobbies */}
          <div>
            <label className="text-sm card-body">
              Hobbies / Interests
            </label>
            <p className="text-xs card-body opacity-70 mt-1">
              These are used to customise your personalised feed.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {HOBBY_OPTIONS.map((hobby) => {
                const selected = hobbies.includes(hobby);
                return (
                  <button
                    type="button"
                    key={hobby}
                    onClick={() => toggleHobby(hobby)}
                    className={`px-3 py-1 rounded-full text-xs border transition ${
                      selected
                        ? "bg-orange-500 border-orange-500 text-[var(--button-text)]"
                        : "border-[var(--card-border)] card-body"
                    }`}
                  >
                    {hobby}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age */}
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
          {info && (
            <div className="text-green-400 text-sm mt-1">{info}</div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm card-body underline underline-offset-4"
            >
              Back to home
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl font-medium bg-orange-500 text-white shadow-md hover:opacity-95 transition-all duration-150 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
