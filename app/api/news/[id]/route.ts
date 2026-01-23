// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import News from "@/backend/models/News";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    // 📄 PUBLIC article fetch
    const post: any = await News.findById(id).lean();

    if (!post || post.status !== "published") {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      post: {
        id: post._id.toString(),

        // Author
        authorUid: post.authorUid,
        authorName: post.authorName || "",
        authorEmail: post.authorEmail || "",

        // Headline
        title: post.title,

        // 🧠 Structured content
        whatHappened: post.whatHappened || "",
        whyItMatters: post.whyItMatters || "",
        analysis: post.analysis || "",
        perspective: post.perspective || "",
        whoBenefits: post.whoBenefits || "",

        // Media
        mediaUrl: post.mediaUrl || "",
        mediaType: post.mediaType || "none",

        // Meta
        category: post.category || "general",
        tags: Array.isArray(post.tags) ? post.tags : [],

        // Engagement
        createdAt: post.createdAt?.toISOString() || "",
        likesCount: post.likesCount || 0,
        dislikesCount: post.dislikesCount || 0,
        commentsCount: post.commentsCount || 0,
      },
    });
  } catch (err) {
    console.error("GET /api/news/[id] error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load post" },
      { status: 500 }
    );
  }
}








// // app/api/news/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/backend/lib/db";
// import News from "@/backend/models/News";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;
//     await connectToDatabase();

//     // 📄 PUBLIC article fetch
//     const post: any = await News.findById(id).lean();

//     if (!post || post.status !== "published") {
//       return NextResponse.json(
//         { ok: false, error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       ok: true,
//       post: {
//         id: post._id.toString(),

//         authorUid: post.authorUid,
//         authorName: post.authorName || "",
//         authorEmail: post.authorEmail || "",

//         title: post.title,
//         content: post.content,
//         mediaUrl: post.mediaUrl || "",
//         mediaType: post.mediaType || "none",
//         category: post.category || "general",
//         tags: Array.isArray(post.tags) ? post.tags : [],

//         createdAt: post.createdAt?.toISOString() || "",
//         likesCount: post.likesCount || 0,
//         dislikesCount: post.dislikesCount || 0,
//         commentsCount: post.commentsCount || 0,
//       },
//     });
//   } catch (err) {
//     console.error("GET /api/news/[id] error:", err);
//     return NextResponse.json(
//       { ok: false, error: "Failed to load post" },
//       { status: 500 }
//     );
//   }
// }







