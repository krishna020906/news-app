import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";
import User from "@/backend/models/User";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 Authenticate user
    const { decoded } = await requireAuth(req);

    // 🧠 Get route param (MUST be awaited)
    const { id } = await context.params;

    await connectToDatabase();

    // 📄 Fetch article
    const post = await News.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 👤 Fetch user
    const user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔥 STREAK LOGIC
    const today = new Date();
    const last = user.lastReadAt ? new Date(user.lastReadAt) : null;

    const isSameDay = (a: Date, b: Date) =>
      a.toDateString() === b.toDateString();

    const isYesterday = (date: Date) => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return date.toDateString() === d.toDateString();
    };

    if (!last) {
      user.streakCount = 1;
    } else if (isSameDay(last, today)) {
      // no change
    } else if (isYesterday(last)) {
      user.streakCount += 1;
    } else {
      user.streakCount = 1;
    }

    user.lastReadAt = today;
    await user.save();

    // ✅ response
    return NextResponse.json({
      ok: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
      },
      streak: user.streakCount,
    });
  } catch (err) {
    console.error("GET /api/news/[id] error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}









// // app/api/news/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDatabase } from "@/backend/lib/db";
// import News from "@/backend/models/News";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } // Next 15/16: params is a Promise
// ) {
//   try {
//     await connectToDatabase();

//     const { id } = await context.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid post id" },
//         { status: 400 }
//       );
//     }

//     const post: any = await News.findById(id).lean();
//     if (!post || post.status !== "published") {
//       return NextResponse.json(
//         { ok: false, error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     const serialised = {
//       id: post._id.toString(),
//       title: post.title,
//       content: post.content,
//       mediaUrl: post.mediaUrl || "",
//       mediaType: post.mediaType || "none",
//       category: post.category || "general",
//       authorName: post.authorName || "",
//       authorEmail: post.authorEmail || "",
//       createdAt: post.createdAt ? post.createdAt.toISOString() : "",
//       likesCount: post.likesCount || 0,
//       dislikesCount: post.dislikesCount || 0,
//       commentsCount: post.commentsCount || 0,
//     };
//     // --- STREAK LOGIC START ---
//     const today = new Date();
//     const last = user.lastReadAt ? new Date(user.lastReadAt) : null;

//     const isSameDay = (a, b) =>
//       a.toDateString() === b.toDateString();

//     const isYesterday = (date) => {
//       const d = new Date();
//       d.setDate(d.getDate() - 1);
//       return date.toDateString() === d.toDateString();
//     };

//     if (!last) {
//       user.streakCount = 1;
//     } else if (isSameDay(last, today)) {
//       // do nothing, already counted today
//     } else if (isYesterday(last)) {
//       user.streakCount += 1;
//     } else {
//       user.streakCount = 1;
//     }

//     user.lastReadAt = today;
//     await user.save();
//     // --- STREAK LOGIC END ---


//     return NextResponse.json({ ok: true, post: serialised }, { status: 200 });
//   } catch (err: any) {
//     console.error("GET /api/news/[id] error:", err);
//     return NextResponse.json(
//       { ok: false, error: "Internal error" },
//       { status: 500 }
//     );
//   }
  
// }
