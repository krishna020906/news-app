// app/api/news/[id]/reaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";
import Reaction from "@/backend/models/Reaction";



export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  try {
    const { decoded } = await requireAuth(req);

    // ✅ UNWRAP PARAMS
    const { id } = await context.params;
    const newsId = id;
    console.log("[reaction] incoming newsId:", newsId);

    const body = await req.json();
    const { type } = body;

    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { ok: false, error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Debug: list all news IDs in this DB
    const allNews = await News.find({})
      .select("_id title createdAt")
      .lean();
    console.log(
      "[reaction] all news IDs in this DB:",
      allNews.map((n: any) => n._id.toString())
    );

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      console.log("[reaction] invalid ObjectId:", newsId);
      return NextResponse.json(
        { ok: false, error: "Invalid post id" },
        { status: 400 }
      );
    }

    const news = await News.findById(newsId);
    console.log("[reaction] found news doc:", news?._id?.toString());

    if (!news) {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Existing reaction?
    const existing = await Reaction.findOne({
      newsId: news._id,
      userUid: decoded.uid,
    });

    let likesDelta = 0;
    let dislikesDelta = 0;

    if (!existing) {
      // first reaction
      await Reaction.create({
        newsId: news._id,
        userUid: decoded.uid,
        type,
      });
      if (type === "like") likesDelta = 1;
      else dislikesDelta = 1;
    } else if (existing.type === type) {
      // same reaction => remove
      await Reaction.deleteOne({ _id: existing._id });
      if (type === "like") likesDelta = -1;
      else dislikesDelta = -1;
    } else {
      // switch reaction
      const oldType = existing.type;
      existing.type = type;
      await existing.save();

      if (oldType === "like") {
        likesDelta = -1;
        dislikesDelta = 1;
      } else {
        likesDelta = 1;
        dislikesDelta = -1;
      }
    }

    // Update counts
    await News.updateOne(
      { _id: news._id },
      {
        $inc: {
          likesCount: likesDelta,
          dislikesCount: dislikesDelta,
        },
      }
    );

    const updated: any = await News.findById(news._id).lean();

    return NextResponse.json(
      {
        ok: true,
        post: {
          id: updated?._id?.toString(),
          likesCount: updated?.likesCount || 0,
          dislikesCount: updated?.dislikesCount || 0,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/news/[id]/reaction error:", err);
    const message = err?.message || "Internal error";
    const status =
      message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}



// ✅ NEW: GET /api/news/[id]  -> public, returns one post
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params; // Next 15: params is a Promise
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid post id" },
        { status: 400 }
      );
    }

    const post: any = await News.findById(id).lean();
    if (!post || post.status !== "published") {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const serialised = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl || "",
      mediaType: post.mediaType || "none",
      category: post.category || "general",
      authorName: post.authorName || "",
      authorEmail: post.authorEmail || "",
      createdAt: post.createdAt ? post.createdAt.toISOString() : "",
      likesCount: post.likesCount || 0,
      dislikesCount: post.dislikesCount || 0,
      commentsCount: post.commentsCount || 0,
    };

    return NextResponse.json({ ok: true, post: serialised }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/news/[id] error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}








// // app/api/news/[id]/reaction/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import Reaction from "@/backend/models/Reaction";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { decoded } = await requireAuth(req);

//     const newsId = params.id;
//     console.log("[reaction] incoming newsId:", newsId);

//     const body = await req.json();
//     const { type } = body;

//     if (type !== "like" && type !== "dislike") {
//       return NextResponse.json(
//         { ok: false, error: "Invalid reaction type" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Log what exists in this DB
//     const allNews = await News.find({})
//       .select("_id title createdAt")
//       .lean();
//     console.log(
//       "[reaction] all news IDs in this DB:",
//       allNews.map((n: any) => n._id.toString())
//     );

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(newsId)) {
//       console.log("[reaction] invalid ObjectId:", newsId);
//       return NextResponse.json(
//         { ok: false, error: "Invalid post id" },
//         { status: 400 }
//       );
//     }

//     // Find post
//     const news = await News.findById(newsId);
//     console.log("[reaction] found news doc:", news?._id?.toString());

//     if (!news) {
//       return NextResponse.json(
//         { ok: false, error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     // Existing reaction from this user on this post?
//     const existing = await Reaction.findOne({
//       newsId: news._id,
//       userUid: decoded.uid,
//     });

//     let likesDelta = 0;
//     let dislikesDelta = 0;

//     if (!existing) {
//       // first time reacting
//       await Reaction.create({
//         newsId: news._id,
//         userUid: decoded.uid,
//         type,
//       });
//       if (type === "like") likesDelta = 1;
//       else dislikesDelta = 1;
//     } else if (existing.type === type) {
//       // same reaction again -> remove it
//       await Reaction.deleteOne({ _id: existing._id });
//       if (type === "like") likesDelta = -1;
//       else dislikesDelta = -1;
//     } else {
//       // switch reaction
//       const oldType = existing.type;
//       existing.type = type;
//       await existing.save();

//       if (oldType === "like") {
//         likesDelta = -1;
//         dislikesDelta = 1;
//       } else {
//         likesDelta = 1;
//         dislikesDelta = -1;
//       }
//     }

//     // Update counts
//     await News.updateOne(
//       { _id: news._id },
//       {
//         $inc: {
//           likesCount: likesDelta,
//           dislikesCount: dislikesDelta,
//         },
//       }
//     );

//     const updated: any = await News.findById(news._id).lean();

//     return NextResponse.json(
//       {
//         ok: true,
//         post: {
//           id: updated?._id?.toString(),
//           likesCount: updated?.likesCount || 0,
//           dislikesCount: updated?.dislikesCount || 0,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("POST /api/news/[id]/reaction error:", err);
//     const message = err?.message || "Internal error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

//     return NextResponse.json({ ok: false, error: message }, { status });
//   }
// }









// // app/api/news/[id]/reaction/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import Reaction from "@/backend/models/Reaction";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { decoded } = await requireAuth(req);

//     const newsId = params.id; // this is already the clean string id

//     const body = await req.json();
//     const { type } = body;

//     if (type !== "like" && type !== "dislike") {
//       return NextResponse.json(
//         { ok: false, error: "Invalid reaction type" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Find post
//     const news = await News.findById(newsId);
//     if (!news) {
//       return NextResponse.json(
//         { ok: false, error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     // Check existing reaction
//     const existing = await Reaction.findOne({
//       newsId: news._id,      // Mongo always uses _id
//       userUid: decoded.uid,
//     });

//     let likesDelta = 0;
//     let dislikesDelta = 0;

//     if (!existing) {
//       // first time reacting
//       await Reaction.create({
//         newsId: news._id,
//         userUid: decoded.uid,
//         type,
//       });
//       if (type === "like") likesDelta = 1;
//       else dislikesDelta = 1;

//     } else if (existing.type === type) {
//       // same reaction again = remove it
//       await Reaction.deleteOne({ _id: existing._id });
//       if (type === "like") likesDelta = -1;
//       else dislikesDelta = -1;

//     } else {
//       // switching reaction
//       const oldType = existing.type;
//       existing.type = type;
//       await existing.save();

//       if (oldType === "like") {
//         likesDelta = -1;
//         dislikesDelta = 1;
//       } else {
//         likesDelta = 1;
//         dislikesDelta = -1;
//       }
//     }

//     // Update counts
//     await News.updateOne(
//       { _id: news._id },
//       {
//         $inc: {
//           likesCount: likesDelta,
//           dislikesCount: dislikesDelta,
//         },
//       }
//     );

//     const updated: any = await News.findById(news._id).lean();

//     return NextResponse.json(
//       {
//         ok: true,
//         post: {
//           id: updated?._id.toString(),              // <-- changed from _id to id
//           likesCount: updated?.likesCount || 0,
//           dislikesCount: updated?.dislikesCount || 0,
//         },
//       },
//       { status: 200 }
//     );

//   } catch (err: any) {
//     console.error("POST /api/news/[id]/reaction error:", err);
//     const message = err?.message || "Internal error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

//     return NextResponse.json({ ok: false, error: message }, { status });
//   }
// }




// // app/api/news/[id]/reaction/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/backend/lib/db"; // adjust path if it's /library/db
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import Reaction from "@/backend/models/Reaction";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { decoded } = await requireAuth(req); // verifies Firebase token
//     const newsId = params.id;

//     const body = await req.json();
//     const { type } = body; // "like" or "dislike"

//     if (type !== "like" && type !== "dislike") {
//       return NextResponse.json(
//         { ok: false, error: "Invalid reaction type" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     const news = await News.findById(newsId);
//     if (!news) {
//       return NextResponse.json(
//         { ok: false, error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     // Existing reaction from this user on this post?
//     const existing = await Reaction.findOne({
//       newsId: news._id,
//       userUid: decoded.uid,
//     });

//     let likesDelta = 0;
//     let dislikesDelta = 0;

//     if (!existing) {
//       // First time reacting
//       await Reaction.create({
//         newsId: news._id,
//         userUid: decoded.uid,
//         type,
//       });
//       if (type === "like") likesDelta = 1;
//       else dislikesDelta = 1;
//     } else if (existing.type === type) {
//       // Same reaction again -> toggle OFF (remove)
//       await Reaction.deleteOne({ _id: existing._id });
//       if (type === "like") likesDelta = -1;
//       else dislikesDelta = -1;
//     } else {
//       // Switching from like -> dislike or dislike -> like
//       const oldType = existing.type;
//       existing.type = type;
//       await existing.save();
//       if (oldType === "like") {
//         likesDelta = -1;
//         dislikesDelta = 1;
//       } else {
//         likesDelta = 1;
//         dislikesDelta = -1;
//       }
//     }

//     // Update counts atomically
//     await News.updateOne(
//       { _id: news._id },
//       {
//         $inc: {
//           likesCount: likesDelta,
//           dislikesCount: dislikesDelta,
//         },
//       }
//     );

//     const updated: any = await News.findById(news._id).lean();

//     return NextResponse.json(
//       {
//         ok: true,
//         post: {
//           id: updated?._id.toString(),
//           likesCount: updated?.likesCount || 0,
//           dislikesCount: updated?.dislikesCount || 0,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("POST /api/news/[id]/reaction error:", err);
//     const message = err?.message || "Internal error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return NextResponse.json({ ok: false, error: message }, { status });
//   }
// }
