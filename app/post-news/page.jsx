// app/post-news/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import "@/backend/firebase/config";
import { uploadToCloudinary } from "@/backend/utils/uploadToCloudinary";

// ---- NEW: category + tag options ----
const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "politics", label: "Politics" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "finance", label: "Finance" },
  { value: "trading", label: "Trading" },
];

const HOBBY_TAGS = [
  "coding",
  "webdev",
  "trading",
  "investing",
  "crypto",
  "cricket",
  "football",
  "gaming",
  "anime",
  "movies",
  "music",
  "startups",
  "productivity",
];

export default function PostNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // NEW: category & tags state
  const [category, setCategory] = useState("general");
  const [selectedTags, setSelectedTags] = useState([]);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const MIN_TITLE_WORDS = 3;
  const MAX_TITLE_WORDS = 15;

  const MIN_CONTENT_WORDS = 30;
  const MAX_CONTENT_WORDS = 600;

  const countWords = (str) =>
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const titleWords = countWords(title);
  const contentWords = countWords(content);

  const isTitleValid =
    titleWords >= MIN_TITLE_WORDS && titleWords <= MAX_TITLE_WORDS;

  const isContentValid =
    contentWords >= MIN_CONTENT_WORDS && contentWords <= MAX_CONTENT_WORDS;

  const hasMedia = !!mediaUrl;

  const canSubmit =
    isTitleValid && isContentValid && hasMedia && !loading && !uploading;

  // ---- NEW: tag toggle handler ----
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;

    const maxBytes = 20 * 1024 * 1024;
    if (selected.size > maxBytes) {
      setError("File too large. Max 20MB.");
      return;
    }

    setError("");
    setFile(selected);
    setUploadProgress(0);
    setMediaUrl("");

    const preview = URL.createObjectURL(selected);
    setPreviewUrl(preview);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to upload.");
        setUploading(false);
        return;
      }

      const folder = `news/${user.uid}`;

      const url = await uploadToCloudinary(file, folder, (percent) => {
        setUploadProgress(percent);
      });

      setMediaUrl(url);
      setUploading(false);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError(err.message || "Upload failed");
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const idToken = await user.getIdToken();

      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          mediaUrl: mediaUrl || null,
          // ---- NEW: send category + tags ----
          category,
          tags: selectedTags,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post news");

      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--card-bg)]">
      <div className="card w-full max-w-2xl p-8 rounded-2xl">
        <h1 className="card-title text-2xl font-semibold mb-6">Post News</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p
              className={`text-xs card-body ${
                titleWords === 0
                  ? ""
                  : isTitleValid
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              Title words: {titleWords} (required: {MIN_TITLE_WORDS}–{MAX_TITLE_WORDS})
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={6}
              className="p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p
              className={`text-xs card-body ${
                contentWords === 0
                  ? ""
                  : isContentValid
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              Content words: {contentWords} (required: {MIN_CONTENT_WORDS}–{MAX_CONTENT_WORDS})
            </p>
          </div>

          {/* ---- NEW: Category select ---- */}
          <div className="flex flex-col gap-1">
            <label className="card-body text-sm font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-[var(--card-bg)]"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ---- NEW: Tags (hobbies / interests) ---- */}
          <div className="flex flex-col gap-2">
            <label className="card-body text-sm font-medium">
              Tags (topics / hobbies)
            </label>
            <p className="card-body text-xs opacity-70">
              Select a few topics this news belongs to. These will be used for personalised feeds.
            </p>
            <div className="flex flex-wrap gap-2">
              {HOBBY_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs border transition ${
                      isSelected
                        ? "bg-orange-500 border-orange-500 text-[var(--button-text)]"
                        : "border-[var(--card-border)] card-body"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* File upload section */}
          <div className="flex flex-col gap-2">
            <label className="card-body text-sm font-medium">
              Media (image/video)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="card-body text-sm"
            />

            {previewUrl && (
              <div className="mt-2">
                <p className="card-body text-xs mb-1">Preview</p>
                {file && file.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-48 rounded-lg border border-[var(--card-border)] object-contain"
                  />
                ) : file && file.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-48 rounded-lg border border-[var(--card-border)] object-contain"
                  />
                ) : (
                  <p className="card-body text-xs">Selected: {file?.name}</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleUpload}
                className="px-4 py-2 rounded-lg bg-orange-500 text-[var(--button-text)] text-sm font-semibold disabled:opacity-60"
              >
                {uploading ? "Uploading..." : mediaUrl ? "Re-upload" : "Upload File"}
              </button>

            {uploading && (
              <span className="card-body text-xs">
                {uploadProgress}%
              </span>
            )}
            {!uploading && mediaUrl && (
              <span className="card-body text-xs text-green-500">
                Uploaded ✓
              </span>
            )}
          </div>

          {mediaUrl && (
            <p className="card-body text-xs break-all mt-1">
              URL:{" "}
              <a
                href={mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 underline"
              >
                open
              </a>
            </p>
          )}
          {!mediaUrl && (
            <p className="card-body text-xs text-red-500 mt-1">
              Please upload an image or video to enable posting (Only PNG,WEBP,JPG,JPEG ALLOWED).
            </p>
          )}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className={`mt-4 px-4 py-3 rounded-lg font-semibold transition
              ${
                canSubmit
                  ? " bg-[var(--button-bg)]  text-[var(--button-text)] "
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  </div>
  );
}











// // app/post-news/page.jsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import "@/backend/firebase/config"; // make sure Firebase client is initialized
// import { uploadToCloudinary } from "@/backend/utils/uploadToCloudinary";


// export default function PostNewsPage() {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [mediaUrl, setMediaUrl] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const MIN_TITLE_WORDS = 3;
//   const MAX_TITLE_WORDS = 15;

//   const MIN_CONTENT_WORDS = 30;
//   const MAX_CONTENT_WORDS = 600;

//   const countWords = (str) =>
//     str
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean).length;

//   const titleWords = countWords(title);
//   const contentWords = countWords(content);

//   const isTitleValid =
//     titleWords >= MIN_TITLE_WORDS && titleWords <= MAX_TITLE_WORDS;

//   const isContentValid =
//     contentWords >= MIN_CONTENT_WORDS && contentWords <= MAX_CONTENT_WORDS;


//   const hasMedia = !!mediaUrl;
//   // previous canSubmit was:
//   // const canSubmit = title && content && !loading && !uploading;
//   const canSubmit = isTitleValid && isContentValid && hasMedia && !loading && !uploading;


//   const handleFileChange = (e) => {
//     const selected = e.target.files && e.target.files[0];
//     if (!selected) return;

//     // Optional size limit: 20MB
//     const maxBytes = 20 * 1024 * 1024;
//     if (selected.size > maxBytes) {
//       setError("File too large. Max 20MB.");
//       return;
//     }

//     setError("");
//     setFile(selected);
//     setUploadProgress(0);
//     setMediaUrl("");

//     const preview = URL.createObjectURL(selected);
//     setPreviewUrl(preview);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Choose a file first.");
//       return;
//     }

//     try {
//       setUploading(true);
//       setError("");

//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) {
//         setError("You must be logged in to upload.");
//         setUploading(false);
//         return;
//       }

//       const folder = `news/${user.uid}`;

//       const url = await uploadToCloudinary(file, folder, (percent) => {
//         setUploadProgress(percent);
//       });

//       setMediaUrl(url);
//       setUploading(false);
//     } catch (err) {
//       console.error("Cloudinary upload error:", err);
//       setError(err.message || "Upload failed");
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) throw new Error("Not authenticated");

//       const idToken = await user.getIdToken();

//       const res = await fetch("/api/news", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           content,
//           mediaUrl: mediaUrl || null,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to post news");

//       router.push("/");
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const canSubmit = title && content && !loading && !uploading;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--card-bg)]">
//       <div className="card w-full max-w-2xl p-8 rounded-2xl">
//         <h1 className="card-title text-2xl font-semibold mb-6">Post News</h1>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {/* Title */}
//           <div className="flex flex-col gap-1">
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Title"
//               className="p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             <p
//               className={`text-xs card-body ${
//                 titleWords === 0
//                   ? ""
//                   : isTitleValid
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//             >
//               Title words: {titleWords} (required: {MIN_TITLE_WORDS}–{MAX_TITLE_WORDS})
//             </p>
//           </div>


//           {/* Content */}
//           <div className="flex flex-col gap-1">
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Content"
//               rows={6}
//               className="p-3 rounded-lg border border-[var(--card-border)] bg-transparent card-body focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             <p
//               className={`text-xs card-body ${
//                 contentWords === 0
//                   ? ""
//                   : isContentValid
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//             >
//               Content words: {contentWords} (required: {MIN_CONTENT_WORDS}–{MAX_CONTENT_WORDS})
//             </p>
//           </div>

//           {/* File upload section */}
//           <div className="flex flex-col gap-2">
//             <label className="card-body text-sm font-medium">
//               Media (image/video)
//             </label>
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//               className="card-body text-sm"
//             />

//             {previewUrl && (
//               <div className="mt-2">
//                 <p className="card-body text-xs mb-1">Preview</p>
//                 {file && file.type.startsWith("image/") ? (
//                   <img
//                     src={previewUrl}
//                     alt="preview"
//                     className="max-h-48 rounded-lg border border-[var(--card-border)] object-contain"
//                   />
//                 ) : file && file.type.startsWith("video/") ? (
//                   <video
//                     src={previewUrl}
//                     controls
//                     className="max-h-48 rounded-lg border border-[var(--card-border)] object-contain"
//                   />
//                 ) : (
//                   <p className="card-body text-xs">Selected: {file?.name}</p>
//                 )}
//               </div>
//             )}

//             <div className="flex items-center gap-3 mt-2">
//               <button
//                 type="button"
//                 onClick={handleUpload}
//                 // disabled={!file || uploading}
//                 className="px-4 py-2 rounded-lg bg-orange-500 text-[var(--button-text)] text-sm font-semibold disabled:opacity-60"
//               >
//                 {uploading ? "Uploading..." : mediaUrl ? "Re-upload" : "Upload File"}
//               </button>

//               {uploading && (
//                 <span className="card-body text-xs">
//                   {uploadProgress}%
//                 </span>
//               )}
//               {!uploading && mediaUrl && (
//                 <span className="card-body text-xs text-green-500">
//                   Uploaded ✓
//                 </span>
//               )}
//             </div>

//             {mediaUrl && (
//               <p className="card-body text-xs break-all mt-1">
//                 URL:{" "}
//                 <a
//                   href={mediaUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-orange-400 underline"
//                 >
//                   open
//                 </a>
//               </p>
//             )}
//             {!mediaUrl && (
//               <p className="card-body text-xs text-red-500 mt-1">
//                 Please upload an image or video to enable posting (Only PNG,WEBP,JPG,JPEG ALLOWED).
//               </p>
//             )}
//           </div>

//           {error && <div className="text-red-500 text-sm">{error}</div>}

//           <button
//             type="submit"
//             // disabled={!canSubmit}
//             className={`mt-4 px-4 py-3 rounded-lg font-semibold transition
//               ${
//                 canSubmit
//                   ? " bg-[var(--button-bg)]  text-[var(--button-text)] "
//                   : "bg-gray-500 text-gray-300 cursor-not-allowed"
//               }`}
//           >
//             {loading ? "Posting..." : "Create Post"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }











// "use client";
// import { useState } from "react";
// import { getAuth } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import PostNewsClientGuard from "../components/PostNewsClientGuard";
// export default function PostNewsPage() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) throw new Error("Not authenticated");
//       const idToken = await user.getIdToken();
//       const res = await fetch("/api/news", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title, content }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed");
//       // success
//       router.push("/"); // or news list
//     } catch (err: any) {
//       setError(err.message || "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PostNewsClientGuard>
//       <div className="min-h-screen flex items-center justify-center p-6 `bg-[var(--card-bg)]`">
//         <div className="card w-full max-w-2xl p-8 rounded-2xl">
//           <h1 className="card-title text-2xl font-semibold mb-6">Post News</h1>
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="p-3 border rounded" />
//             <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={8} className="p-3 border rounded"></textarea>
//             {error && <div className="text-red-500">{error}</div>}
//             <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-orange-500 text-[var(--button-text)]">
//               {loading ? "Posting..." : "Post"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </PostNewsClientGuard>
    
//   );
// }
