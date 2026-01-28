// // app/api/news/for-you/route.ts
// app/api/news/for-you/route.ts
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";
import User from "@/backend/models/User";

export async function GET(req: Request) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || 20);
    const offset = Number(url.searchParams.get("offset") || 0);

    // current user
    const userDoc: any = await User.findOne({ uid: decoded.uid }).lean();

    // ---------- FALLBACK (no profile) ----------
    if (!userDoc) {
      const fallbackPosts = await News.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      const serialisedFallback = fallbackPosts.map((p: any) => ({
        id: p._id.toString(),
        authorUid: p.authorUid,

        title: p.title,
        mediaUrl: p.mediaUrl || "",
        mediaType: p.mediaType || "none",
        category: p.category || "general",
        tags: Array.isArray(p.tags) ? p.tags : [],

        authorName: p.authorName || "",
        authorEmail: p.authorEmail || "",

        isFollowingAuthor: false,
        authorFollowersCount: 0,

        createdAt: p.createdAt?.toISOString() || "",
        likesCount: p.likesCount || 0,
        dislikesCount: p.dislikesCount || 0,
        commentsCount: p.commentsCount || 0,
        score: 0,
      }));

      return new Response(
        JSON.stringify({
          ok: true,
          posts: serialisedFallback,
          total: serialisedFallback.length,
          hasMore: false,
          fallback: "no_profile",
        }),
        { status: 200 }
      );
    }

    // ---------- USER SIGNALS ----------
    const userState = (userDoc.state || "").toLowerCase();
    const userProfession = (userDoc.profession || "").toLowerCase();

    const hobbies: string[] = Array.isArray(userDoc.hobbies)
      ? userDoc.hobbies.map((h: string) => h.toLowerCase())
      : [];

    const interests = [...hobbies];

    // ---------- FETCH CANDIDATES ----------
    const candidates = await News.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    // preload authors for follower counts
    const authorUids = [...new Set(candidates.map((p: any) => p.authorUid))];
    const authors = await User.find({ uid: { $in: authorUids } })
      .select("uid followers")
      .lean();

    const authorMap = new Map(authors.map((a: any) => [a.uid, a]));

    // ---------- SCORE ----------
    const scored = candidates.map((p: any) => {
      let score = 0;

      const category = (p.category || "").toLowerCase();
      const tags: string[] = Array.isArray(p.tags)
        ? p.tags.map((t: string) => t.toLowerCase())
        : [];

      const affectedState = (p.affectedState || "").toLowerCase();

      // 🧠 NEW: profession relevance (STEP 3 + 4)
      const relevantProfessions: string[] = Array.isArray(p.relevantProfessions)
        ? p.relevantProfessions.map((x: string) => x.toLowerCase())
        : [];

      // 🎯 PROFESSION MATCH (strong signal)
      if (
        userProfession &&
        relevantProfessions.length &&
        relevantProfessions.includes(userProfession)
      ) {
        score += 5;
      }

      // 🎯 TAG / HOBBY MATCH
      if (interests.length) {
        const matched = tags.filter((t) => interests.includes(t)).length;
        score += matched * 3;
      }

      // 🎯 CATEGORY MATCH
      if (category && interests.includes(category)) {
        score += 2;
      }

      // 🎯 LOCATION MATCH (strongest)
      if (userState && affectedState && userState === affectedState) {
        score += 6;
      }

      return { ...p, score };
    });

    const withScore = scored.filter((p) => p.score > 0);
    const effectiveList =
      withScore.length > 0
        ? withScore
        : scored.map((p) => ({ ...p, score: 0 }));

    effectiveList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    const slice = effectiveList.slice(offset, offset + limit);

    // ---------- SERIALISE ----------
    const serialised = slice.map((p: any) => {
      const author = authorMap.get(p.authorUid);

      return {
        id: p._id.toString(),
        authorUid: p.authorUid,

        title: p.title,
        mediaUrl: p.mediaUrl || "",
        mediaType: p.mediaType || "none",
        category: p.category || "general",
        tags: Array.isArray(p.tags) ? p.tags : [],

        authorName: p.authorName || "",
        authorEmail: p.authorEmail || "",

        isFollowingAuthor: userDoc.followingCreators?.includes(p.authorUid),
        authorFollowersCount: author?.followers?.length || 0,

        createdAt: p.createdAt?.toISOString() || "",
        likesCount: p.likesCount || 0,
        dislikesCount: p.dislikesCount || 0,
        commentsCount: p.commentsCount || 0,
        score: p.score,
      };
    });

    return new Response(
      JSON.stringify({
        ok: true,
        posts: serialised,
        total: effectiveList.length,
        hasMore: offset + limit < effectiveList.length,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/news/for-you error:", err);
    const message = err?.message || "Server error";
    const status =
      message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

    return new Response(JSON.stringify({ ok: false, error: message }), {
      status,
    });
  }
}


















// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";

// export async function GET(req: Request) {
//   try {
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     const url = new URL(req.url);
//     const limit = Number(url.searchParams.get("limit") || 20);
//     const offset = Number(url.searchParams.get("offset") || 0);

//     // current user
//     const userDoc: any = await User.findOne({ uid: decoded.uid }).lean();

//     // ---------- FALLBACK (no profile) ----------
//     if (!userDoc) {
//       const fallbackPosts = await News.find({ status: "published" })
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .lean();

//       const serialisedFallback = fallbackPosts.map((p: any) => ({
//         id: p._id.toString(),

//         // 🔥 FIX
//         authorUid: p.authorUid,

//         title: p.title,
//         content: p.content,
//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],

//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",

//         isFollowingAuthor: false,
//         authorFollowersCount: 0,

//         createdAt: p.createdAt?.toISOString() || "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//         score: 0,
//       }));

//       return new Response(
//         JSON.stringify({
//           ok: true,
//           posts: serialisedFallback,
//           total: serialisedFallback.length,
//           hasMore: false,
//           fallback: "no_profile",
//         }),
//         { status: 200 }
//       );
//     }

//     // ---------- BUILD INTERESTS ----------
//     const userState = (userDoc.state || "").toLowerCase();
//     const profession = (userDoc.profession || "").toLowerCase();
//     const hobbies: string[] = Array.isArray(userDoc.hobbies)
//       ? userDoc.hobbies.map((h: string) => h.toLowerCase())
//       : [];

//     const interests = [
//       ...(profession ? [profession] : []),
//       ...hobbies,
//     ];

//     // ---------- FETCH CANDIDATES ----------
//     const candidates = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .lean();

//     // preload authors for follower counts
//     const authorUids = [...new Set(candidates.map((p: any) => p.authorUid))];
//     const authors = await User.find({ uid: { $in: authorUids } })
//       .select("uid followers")
//       .lean();

//     const authorMap = new Map(
//       authors.map((a: any) => [a.uid, a])
//     );

//     // ---------- SCORE ----------
//     const scored = candidates.map((p: any) => {
//       let score = 0;

//       const category = (p.category || "").toLowerCase();
//       const tags: string[] = Array.isArray(p.tags)
//         ? p.tags.map((t: string) => t.toLowerCase())
//         : [];

//       const affectedState = (p.affectedState || "").toLowerCase();

//       if (interests.length) {
//         const matched = tags.filter((t) => interests.includes(t)).length;
//         score += matched * 3;
//       }

//       if (category && interests.includes(category)) {
//         score += 2;
//       }

//       if (userState && affectedState && userState === affectedState) {
//         score += 6;
//       }

//       return { ...p, score };
//     });

//     const withScore = scored.filter((p) => p.score > 0);
//     const effectiveList =
//       withScore.length > 0 ? withScore : scored.map((p) => ({ ...p, score: 0 }));

//     effectiveList.sort((a, b) => {
//       if (b.score !== a.score) return b.score - a.score;
//       return (
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//       );
//     });

//     const slice = effectiveList.slice(offset, offset + limit);

//     // ---------- SERIALISE (🔥 FIX HERE) ----------
//     const serialised = slice.map((p: any) => {
//       const author = authorMap.get(p.authorUid);

//       return {
//         id: p._id.toString(),

//         // 🔥 REQUIRED FOR FOLLOW FEATURE
//         authorUid: p.authorUid,

//         title: p.title,
//         content: p.content,
//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],

//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",

//         isFollowingAuthor: userDoc.followingCreators?.includes(p.authorUid),
//         authorFollowersCount: author?.followers?.length || 0,

//         createdAt: p.createdAt?.toISOString() || "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//         score: p.score,
//       };
//     });

//     return new Response(
//       JSON.stringify({
//         ok: true,
//         posts: serialised,
//         total: effectiveList.length,
//         hasMore: offset + limit < effectiveList.length,
//       }),
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("GET /api/news/for-you error:", err);
//     const message = err?.message || "Server error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

//     return new Response(JSON.stringify({ ok: false, error: message }), {
//       status,
//     });
//   }
// }









// // app/api/news/for-you/route.ts
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";

// export async function GET(req: Request) {
//   try {
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     const url = new URL(req.url);
//     const limit = Number(url.searchParams.get("limit") || 20);
//     const offset = Number(url.searchParams.get("offset") || 0);

//     // ✅ IMPORTANT: your user doc uses `uid`, not `firebaseUid`
//     const userDoc: any = await User.findOne({ uid: decoded.uid }).lean();

//     if (!userDoc) {
//       // if you want, you can still fallback to latest here,
//       // but now that profile exists this shouldn't happen.
//       const fallbackPosts = await News.find({ status: "published" })
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .lean();

//       const serialisedFallback = fallbackPosts.map((p: any) => ({
//         id: p._id.toString(),
//         title: p.title,
//         content: p.content,
//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],
//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",
//         createdAt: p.createdAt ? p.createdAt.toISOString() : "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//         score: 0,
//       }));

//       return new Response(
//         JSON.stringify({
//           ok: true,
//           posts: serialisedFallback,
//           total: serialisedFallback.length,
//           hasMore: false,
//           fallback: "no_profile",
//         }),
//         { status: 200 }
//       );
//     }

//     // 🔥 Build interests from profile
//     const userState = (userDoc.state || "").toLowerCase();

//     const profession = (userDoc.profession || "").toLowerCase();
//     const hobbies: string[] = Array.isArray(userDoc.hobbies)
//       ? userDoc.hobbies.map((h: string) => h.toLowerCase())
//       : [];

//     const interests = [
//       ...(profession ? [profession] : []),
//       ...hobbies,
//     ];

//     // Get candidate posts
//     const candidates = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .lean();

//     type Scored = any & { score: number };

//     const scored: Scored[] = candidates.map((p: any) => {
//       let score = 0;

//       const category = (p.category || "").toLowerCase();
//       const tags: string[] = Array.isArray(p.tags)
//         ? p.tags.map((t: string) => t.toLowerCase())
//         : [];

//       const affectedState = (p.affectedState || "").toLowerCase();

//       // Tag / interest scoring (as before)
//       if (interests.length) {
//         const matched = tags.filter((t) => interests.includes(t)).length;
//         score += matched * 3;
//       }

//       if (category && interests.includes(category)) {
//         score += 2;
//       }

//       // 🌍 NEW: location-based scoring
//       if (userState && affectedState && userState === affectedState) {
//         score += 6; // strong boost for local news
//       }

//       return { ...p, score };
//     });


//     // const scored: Scored[] = candidates.map((p: any) => {
//     //   let score = 0;

//     //   const category = (p.category || "").toLowerCase();
//     //   const tags: string[] = Array.isArray(p.tags)
//     //     ? p.tags.map((t: string) => t.toLowerCase())
//     //     : [];

//     //   // tag matches with hobbies/profession
//     //   if (interests.length) {
//     //     const matched = tags.filter((t) => interests.includes(t)).length;
//     //     score += matched * 3;
//     //   }

//     //   // category match
//     //   if (category && interests.includes(category)) {
//     //     score += 2;
//     //   }

//     //   return { ...p, score };
//     // });

//     const withScore = scored.filter((p) => p.score > 0);

//     // If nothing matches, fall back to just latest ordering
//     const effectiveList =
//       withScore.length > 0 ? withScore : scored.map((p) => ({ ...p, score: 0 }));

//     effectiveList.sort((a, b) => {
//       if (b.score !== a.score) return b.score - a.score;
//       return (
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//       );
//     });

//     const slice = effectiveList.slice(offset, offset + limit);

//     const serialised = slice.map((p: any) => ({
//       id: p._id.toString(),
//       title: p.title,
//       content: p.content,
//       mediaUrl: p.mediaUrl || "",
//       mediaType: p.mediaType || "none",
//       category: p.category || "general",
//       tags: Array.isArray(p.tags) ? p.tags : [],
//       authorName: p.authorName || "",
//       authorEmail: p.authorEmail || "",
//       createdAt: p.createdAt ? p.createdAt.toISOString() : "",
//       likesCount: p.likesCount || 0,
//       dislikesCount: p.dislikesCount || 0,
//       commentsCount: p.commentsCount || 0,
//       score: p.score,
//     }));

//     return new Response(
//       JSON.stringify({
//         ok: true,
//         posts: serialised,
//         total: effectiveList.length,
//         hasMore: offset + limit < effectiveList.length,
//       }),
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("GET /api/news/for-you error:", err);
//     const message = err?.message || "Server error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return new Response(JSON.stringify({ ok: false, error: message }), {
//       status,
//     });
//   }
// }












// // app/api/news/for-you/route.ts
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";

// export async function GET(req: Request) {
//   try {
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     const url = new URL(req.url);
//     const limit = Number(url.searchParams.get("limit") || 20);
//     const offset = Number(url.searchParams.get("offset") || 0);

//     // 1) Try to get user profile
//     const userDoc: any = await User.findOne({
//       firebaseUid: decoded.uid,
//     }).lean();

//     // If no profile → just return latest news instead of error
//     if (!userDoc) {
//       const fallbackPosts = await News.find({ status: "published" })
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .lean();

//       const serialisedFallback = fallbackPosts.map((p: any) => ({
//         id: p._id.toString(),
//         title: p.title,
//         content: p.content,
//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],
//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",
//         createdAt: p.createdAt ? p.createdAt.toISOString() : "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//         score: 0,
//       }));

//       return new Response(
//         JSON.stringify({
//           ok: true,
//           posts: serialisedFallback,
//           total: serialisedFallback.length,
//           hasMore: false,
//           fallback: "no_profile", // just info
//         }),
//         { status: 200 }
//       );
//     }

//     // 2) Build interests from profile
//     const profession = (userDoc.profession || "").toLowerCase();
//     const hobbies: string[] = Array.isArray(userDoc.hobbies)
//       ? userDoc.hobbies.map((h: string) => h.toLowerCase())
//       : [];

//     const interests = [
//       ...(profession ? [profession] : []),
//       ...hobbies,
//     ];

//     // 3) Fetch recent published news as candidates
//     const candidates = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .lean();

//     type Scored = any & { score: number };

//     const scored: Scored[] = candidates.map((p: any) => {
//       let score = 0;

//       const category = (p.category || "").toLowerCase();
//       const tags: string[] = Array.isArray(p.tags)
//         ? p.tags.map((t: string) => t.toLowerCase())
//         : [];

//       if (interests.length) {
//         const matched = tags.filter((t) => interests.includes(t)).length;
//         score += matched * 3;
//       }

//       if (category && interests.includes(category)) {
//         score += 2;
//       }

//       return { ...p, score };
//     });

//     const withScore = scored.filter((p) => p.score > 0);
//     const effectiveList =
//       withScore.length > 0 ? withScore : scored.map((p) => ({ ...p, score: 0 }));

//     effectiveList.sort((a, b) => {
//       if (b.score !== a.score) return b.score - a.score;
//       return (
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//       );
//     });

//     const slice = effectiveList.slice(offset, offset + limit);

//     const serialised = slice.map((p: any) => ({
//       id: p._id.toString(),
//       title: p.title,
//       content: p.content,
//       mediaUrl: p.mediaUrl || "",
//       mediaType: p.mediaType || "none",
//       category: p.category || "general",
//       tags: Array.isArray(p.tags) ? p.tags : [],
//       authorName: p.authorName || "",
//       authorEmail: p.authorEmail || "",
//       createdAt: p.createdAt ? p.createdAt.toISOString() : "",
//       likesCount: p.likesCount || 0,
//       dislikesCount: p.dislikesCount || 0,
//       commentsCount: p.commentsCount || 0,
//       score: p.score,
//     }));

//     return new Response(
//       JSON.stringify({
//         ok: true,
//         posts: serialised,
//         total: effectiveList.length,
//         hasMore: offset + limit < effectiveList.length,
//       }),
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("GET /api/news/for-you error:", err);
//     const message = err?.message || "Server error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return new Response(JSON.stringify({ ok: false, error: message }), {
//       status,
//     });
//   }
// }









// // app/api/news/for-you/route.ts
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";

// export async function GET(req: Request) {
//   try {
//     // 1) Auth + DB
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     // 2) Get user profile
//     const rawUser = await User.findOne({ firebaseUid: decoded.uid }).lean();
//     if (!rawUser) {
//       return new Response(
//         JSON.stringify({ ok: false, error: "User profile not found" }),
//         { status: 404 }
//       );
//     }
//     // 👇 explicitly tell TS this shape
//     const user = rawUser as {
//     profession?: string;
//     hobbies?: string[];
//     // add anything else you need
//     };

//     const url = new URL(req.url);
//     const limit = Number(url.searchParams.get("limit") || 20);
//     const offset = Number(url.searchParams.get("offset") || 0);

//     const profession = (user.profession || "").toLowerCase();
//     const hobbies: string[] = Array.isArray(user.hobbies)
//       ? user.hobbies.map((h: string) => h.toLowerCase())
//       : [];

//     const interests = [
//       ...(profession ? [profession] : []),
//       ...hobbies,
//     ];

//     // 3) Fetch recent published news as candidates
//     const candidates = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .lean();

//     type Scored = any & { score: number };

//     const scored: Scored[] = candidates.map((p: any) => {
//       let score = 0;

//       const category = (p.category || "").toLowerCase();
//       const tags: string[] = Array.isArray(p.tags)
//         ? p.tags.map((t: string) => t.toLowerCase())
//         : [];

//       // Match tags with user interests (hobbies + profession)
//       if (interests.length) {
//         const matched = tags.filter((t) => interests.includes(t)).length;
//         score += matched * 3; // weight tags heavily
//       }

//       // Optional: category match with interests/profession
//       if (category && interests.includes(category)) {
//         score += 2;
//       }

//       return { ...p, score };
//     });

//     // 4) Basic filtering & sorting
//     const withScore = scored.filter((p) => p.score > 0);

//     // fallback: if nothing matches, use plain latest
//     const effectiveList =
//       withScore.length > 0 ? withScore : scored.map((p) => ({ ...p, score: 0 }));

//     effectiveList.sort((a, b) => {
//       if (b.score !== a.score) return b.score - a.score;
//       return (
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//       );
//     });

//     const slice = effectiveList.slice(offset, offset + limit);

//     const serialised = slice.map((p: any) => ({
//       id: p._id.toString(),
//       title: p.title,
//       content: p.content,
//       mediaUrl: p.mediaUrl || "",
//       mediaType: p.mediaType || "none",
//       category: p.category || "general",
//       tags: Array.isArray(p.tags) ? p.tags : [],
//       authorName: p.authorName || "",
//       authorEmail: p.authorEmail || "",
//       createdAt: p.createdAt ? p.createdAt.toISOString() : "",
//       likesCount: p.likesCount || 0,
//       dislikesCount: p.dislikesCount || 0,
//       commentsCount: p.commentsCount || 0,
//       score: p.score,
//     }));

//     return new Response(
//       JSON.stringify({
//         ok: true,
//         posts: serialised,
//         total: effectiveList.length,
//         hasMore: offset + limit < effectiveList.length,
//       }),
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("GET /api/news/for-you error:", err);
//     const message = err?.message || "Server error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return new Response(JSON.stringify({ ok: false, error: message }), {
//       status,
//     });
//   }
// }
