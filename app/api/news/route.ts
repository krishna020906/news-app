// app/api/news/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";
import User from "@/backend/models/User";

/* ===================== GET ===================== */
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    let currentUser: any = null;
    try {
      const { decoded } = await requireAuth(req);
      currentUser = await User.findOne({ uid: decoded.uid }).lean();
    } catch {}

    const posts = await News.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const authorUids = [...new Set(posts.map((p: any) => p.authorUid))];
    const authors = await User.find({ uid: { $in: authorUids } })
      .select("uid followers")
      .lean();

    const authorMap = new Map(authors.map((a: any) => [a.uid, a]));

    const serialised = posts.map((p: any) => {
      const author = authorMap.get(p.authorUid);

      return {
        id: p._id.toString(),
        title: p.title,

        // 👇 structured sections
        sections: p.sections,

        sourceUrl: p.sourceUrl || "",
        mediaUrl: p.mediaUrl || "",
        mediaType: p.mediaType || "none",
        category: p.category || "general",
        tags: Array.isArray(p.tags) ? p.tags : [],

        authorUid: p.authorUid,
        authorName: p.authorName || "",
        authorEmail: p.authorEmail || "",

        isFollowingAuthor: currentUser
          ? currentUser.followingCreators?.includes(p.authorUid)
          : false,
        authorFollowersCount: author?.followers?.length || 0,

        createdAt: p.createdAt?.toISOString() || "",
        likesCount: p.likesCount || 0,
        dislikesCount: p.dislikesCount || 0,
        commentsCount: p.commentsCount || 0,
      };
    });

    return NextResponse.json({ ok: true, posts: serialised });
  } catch (err) {
    console.error("GET /api/news error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load posts" },
      { status: 500 }
    );
  }
}

/* ===================== POST ===================== */
export async function POST(req: Request) {
  try {
    const { decoded, user } = await requireAuth(req);
    await connectToDatabase();

    const body = await req.json();
    const {
      title,
      sourceUrl,
      mediaUrl,
      category,
      tags,
      affectedState,
      sections,
    } = body;

    // 🔒 STRICT validation for structured content
    if (
      !title ||
      !sourceUrl ||
      !mediaUrl ||
      !sections?.whatHappened ||
      !sections?.whyItMatters ||
      !sections?.analysis ||
      !sections?.perspective
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const post = await News.create({
      title,
      sourceUrl,
      mediaUrl,
      mediaType: mediaUrl.includes("video") ? "video" : "image",
      category,
      tags,
      affectedState,

      // 👇 store structured content
      sections,

      authorUid: decoded.uid,
      authorEmail: decoded.email,
      authorName: user?.name || "",
      status: "published",
    });

    return NextResponse.json({
      ok: true,
      postId: post._id.toString(),
    });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}

















// // // app/api/news/route.ts
// // app/api/news/route.ts
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";

// /* ===================== GET ===================== */
// export async function GET(req: Request) {
//   try {
//     await connectToDatabase();

//     let currentUser: any = null;
//     try {
//       const { decoded } = await requireAuth(req);
//       currentUser = await User.findOne({ uid: decoded.uid }).lean();
//     } catch {}

//     const posts = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean();

//     const authorUids = [...new Set(posts.map((p: any) => p.authorUid))];
//     const authors = await User.find({ uid: { $in: authorUids } })
//       .select("uid followers")
//       .lean();

//     const authorMap = new Map(authors.map((a: any) => [a.uid, a]));

//     const serialised = posts.map((p: any) => {
//       const author = authorMap.get(p.authorUid);

//       return {
//         id: p._id.toString(),
//         title: p.title,
//         content: p.content,
//         sourceUrl: p.sourceUrl || "",
//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],

//         authorUid: p.authorUid,
//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",

//         isFollowingAuthor: currentUser
//           ? currentUser.followingCreators?.includes(p.authorUid)
//           : false,
//         authorFollowersCount: author?.followers?.length || 0,

//         createdAt: p.createdAt?.toISOString() || "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//       };
//     });

//     return NextResponse.json({ ok: true, posts: serialised });
//   } catch (err) {
//     console.error("GET /api/news error:", err);
//     return NextResponse.json(
//       { ok: false, error: "Failed to load posts" },
//       { status: 500 }
//     );
//   }
// }

// /* ===================== POST ===================== */
// export async function POST(req: Request) {
//   try {
//     const { decoded, user } = await requireAuth(req);
//     await connectToDatabase();

//     const body = await req.json();
//     const {
//       title,
//       content,
//       sourceUrl,
//       mediaUrl,
//       category,
//       tags,
//       affectedState,
//     } = body;

//     // 🔒 Backend validation (important)
//     if (!title || !content || !mediaUrl || !sourceUrl) {
//       return NextResponse.json(
//         { ok: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const post = await News.create({
//       title,
//       content,
//       sourceUrl,
//       mediaUrl,
//       mediaType: mediaUrl.includes("video") ? "video" : "image",
//       category,
//       tags,
//       affectedState,
//       authorUid: decoded.uid,
//       authorEmail: decoded.email,
//       authorName: user?.name || "",
//       status: "published",
//     });

//     return NextResponse.json({
//       ok: true,
//       postId: post._id.toString(),
//     });
//   } catch (err) {
//     console.error("POST /api/news error:", err);
//     return NextResponse.json(
//       { ok: false, error: "Failed to create post" },
//       { status: 500 }
//     );
//   }
// }










// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";

// export async function GET(req: Request) {
//   try {
//     await connectToDatabase();

//     // Try to get logged-in user (optional)
//     let currentUser: any = null;
//     try {
//       const { decoded } = await requireAuth(req);
//       currentUser = await User.findOne({ uid: decoded.uid }).lean();
//     } catch {
//       // user not logged in → allowed
//     }

//     const posts = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean();

//     // Fetch all authors in one go (important for performance)
//     const authorUids = [...new Set(posts.map((p: any) => p.authorUid))];
//     const authors = await User.find({ uid: { $in: authorUids } })
//       .select("uid followers")
//       .lean();

//     const authorMap = new Map(authors.map((a: any) => [a.uid, a]));

//     const serialised = posts.map((p: any) => {
//       const author = authorMap.get(p.authorUid);

//       return {
//         id: p._id.toString(),
//         title: p.title,
//         content: p.content,

//         // ✅ SOURCE LINK (NEW)
//         sourceUrl: p.sourceUrl || "",

//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],

//         // 👇 AUTHOR INFO
//         authorUid: p.authorUid,
//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",

//         // 👇 FOLLOW DATA
//         isFollowingAuthor: currentUser
//           ? currentUser.followingCreators?.includes(p.authorUid)
//           : false,
//         authorFollowersCount: author?.followers?.length || 0,

//         createdAt: p.createdAt?.toISOString() || "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//       };
//     });

//     return new Response(
//       JSON.stringify({ ok: true, posts: serialised }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("GET /api/news error:", err);
//     return new Response(
//       JSON.stringify({ ok: false, error: "Failed to load posts" }),
//       { status: 500 }
//     );
//   }
// }









// // app/api/news/route.ts
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import User from "@/backend/models/User";
// export async function GET(req: Request) {
//   try {
//     await connectToDatabase();

//     // Try to get logged-in user (optional)
//     let currentUser:any = null;
//     try {
//       const { decoded } = await requireAuth(req);
//       currentUser = await User.findOne({ uid: decoded.uid }).lean();
//     } catch {
//       // user not logged in → allowed
//     }

//     const posts = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean();

//     // Fetch all authors in one go (important for performance)
//     const authorUids = [...new Set(posts.map(p => p.authorUid))];
//     const authors = await User.find({ uid: { $in: authorUids } })
//       .select("uid followers")
//       .lean();

//     const authorMap = new Map(
//       authors.map(a => [a.uid, a])
//     );

//     const serialised = posts.map((p: any) => {
//       const author = authorMap.get(p.authorUid);

//       return {
//         id: p._id.toString(),
//         title: p.title,
//         content: p.content,
//         mediaUrl: p.mediaUrl || "",
//         mediaType: p.mediaType || "none",
//         category: p.category || "general",
//         tags: Array.isArray(p.tags) ? p.tags : [],

//         // 👇 AUTHOR INFO
//         authorUid: p.authorUid,
//         authorName: p.authorName || "",
//         authorEmail: p.authorEmail || "",

//         // 👇 FOLLOW DATA
//         isFollowingAuthor: currentUser
//           ? currentUser.followingCreators?.includes(p.authorUid)
//           : false,
//         authorFollowersCount: author?.followers?.length || 0,

//         createdAt: p.createdAt?.toISOString() || "",
//         likesCount: p.likesCount || 0,
//         dislikesCount: p.dislikesCount || 0,
//         commentsCount: p.commentsCount || 0,
//       };
//     });

//     return new Response(
//       JSON.stringify({ ok: true, posts: serialised }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("GET /api/news error:", err);
//     return new Response(
//       JSON.stringify({ ok: false, error: "Failed to load posts" }),
//       { status: 500 }
//     );
//   }
// }












// // app/api/news/route.ts
// import { connectToDatabase } from "@/backend/lib/db"; // adjust to /lib/db if needed
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";

// export async function POST(req: Request) {
//   try {
//     // Verify Firebase ID token and upsert user
//     const { decoded, user } = await requireAuth(req); // will throw on invalid

//     const body = await req.json();
//     const {
//       title,
//       content,
//       mediaUrl,
//       mediaType,     // optional, frontend can send "image" or "video"
//       mediaPublicId, // optional, if you later capture Cloudinary public_id
//       category,
//       tags,
//       affectedState,
//     } = body;

//     console.log("API /api/news body:", body);  // 👈 add this
    
//     // Normalize tags a bit for consistent matching
//     const normalizedTags = Array.isArray(tags)
//       ? tags
//           .map((t: string) => t.trim().toLowerCase())
//           .filter(Boolean)
//       : [];



//     if (!title || !content) {
//       return new Response(
//         JSON.stringify({ error: "Missing title or content" }),
//         { status: 400 }
//       );
//     }

//     // Ensure DB connection
//     await connectToDatabase();

//     const news = await News.create({
//       title,
//       content,

//       // media fields
//       mediaUrl: mediaUrl || undefined,
//       mediaType: mediaType || (mediaUrl ? "image" : "none"),
//       mediaPublicId: mediaPublicId || undefined,

//       // classification
//       category: category || "general",
//       tags: normalizedTags , 
//       // Array.isArray(tags) ? tags : [],

//       // author info
//       authorUid: decoded.uid,
//       authorEmail: decoded.email,
//       authorName: user?.name || decoded.name || undefined,

//       // status defaults in schema: status: "published"

//       affectedState: affectedState?.trim() || undefined,
//     });

//     return new Response(
//       JSON.stringify({
//         ok: true,
//         news: {
//           _id: news._id.toString(),
//           title: news.title,
//           content: news.content,
//           mediaUrl: news.mediaUrl,
//           mediaType: news.mediaType,
//         },
//       }),
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("POST /api/news error:", err);
//     const message = err?.message || "Unauthorized";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return new Response(JSON.stringify({ error: message }), { status });
//   }
// }

// // NEW: GET /api/news -> list latest published posts (for homepage/feed)
// export async function GET(req: Request) {
//   try {
//     await connectToDatabase();

//     const posts = await News.find({ status: "published" })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean();

//     const serialised = posts.map((p: any) => ({
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
//     }));

//     return new Response(
//       JSON.stringify({ ok: true, posts: serialised }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("GET /api/news error:", err);
//     return new Response(
//       JSON.stringify({ ok: false, error: "Failed to load posts" }),
//       { status: 500 }
//     );
//   }
// }




// // app/api/news/route.ts
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";

// export async function POST(req: Request) {
//   try {
//     const { decoded, user } = await requireAuth(req); // will throw on invalid
//     const body = await req.json();
//     const { title, content } = body;
//     if (!title || !content) {
//       return new Response(JSON.stringify({ error: "Missing title or content" }), { status: 400 });
//     }

//     // If you want only admins to post:
//     // if (user.role !== 'admin') return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

//     const news = await News.create({
//       title,
//       content,
//       authorUid: decoded.uid,
//       authorEmail: decoded.email,
//     });

//     return new Response(JSON.stringify({ ok: true, news }), { status: 201 });
//   } catch (err: any) {
//     console.error("POST /api/news error:", err);
//     const message = err?.message || "Unauthorized";
//     const status = message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return new Response(JSON.stringify({ error: message }), { status });
//   }
// }
