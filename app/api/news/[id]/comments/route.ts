// // // app/api/news/[id]/comments/route.ts
// // app/api/news/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";

import News from "@/backend/models/News";
import Comment from "@/backend/models/Comment";
import User from "@/backend/models/User";
import Notification from "@/backend/models/Notification";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  await connectToDatabase();
  const { id } = await context.params;

  const comments = await Comment.find({
    newsId: id,
    parentCommentId: null,
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const serialised = comments.map((c: any) => ({
    id: c._id.toString(),
    text: c.text,
    userName: c.userName || "Anonymous",
    createdAt: c.createdAt?.toISOString() || "",
    likes: c.likes?.length || 0,
    dislikes: c.dislikes?.length || 0,
  }));

  return NextResponse.json({ ok: true, comments: serialised });

}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  await connectToDatabase();

  const { decoded } = await requireAuth(req);
  const uid = decoded.uid;

  const { id } = await context.params;

  const body = await req.json();
  const text = (body.text || "").trim();

  const news = await News.findById(id);

  const profile = await User.findOne({ uid });
  const userName = profile?.name || "Anonymous";

  const comment = await Comment.create({
    newsId: news._id,
    userUid: uid,
    userName,
    text,
    parentCommentId: body.parentCommentId || null,
    likes: [],
    dislikes: [],
  });

  await News.updateOne(
    { _id: news._id },
    { $inc: { commentsCount: 1 } }
  );

  // 🔔 NOTIFY POST OWNER
  if (news.authorUid !== uid) {

    await Notification.create({
      recipientUid: news.authorUid,
      actorUid: uid,
      type: "post_comment",
      entityId: news._id.toString()
    });

  }

  return NextResponse.json(
    {
      ok: true,
      comment: {
        id: comment._id.toString(),
        text: comment.text,
        userName: comment.userName,
        createdAt: comment.createdAt?.toISOString() || "",
      },
    },
    { status: 201 }
  );

}










// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";

// import News from "@/backend/models/News";
// import Comment from "@/backend/models/Comment";
// import User from "@/backend/models/User";


// // GET /api/news/[id]/comments -> list comments
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
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

//     const comments = await Comment.find({
//       newsId: id,
//       parentCommentId: null,
//     })
//       .sort({ createdAt: -1 })
//       .limit(100)
//       .lean();

//     const serialised = comments.map((c: any) => ({
//       id: c._id.toString(),
//       text: c.text,
//       userName: c.userName || "Anonymous",
//       createdAt: c.createdAt?.toISOString() || "",
//       likes: c.likes?.length || 0,
//       dislikes: c.dislikes?.length || 0,
//     }));

//     return NextResponse.json({ ok: true, comments: serialised });

//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json(
//       { ok: false, error: "Internal error" },
//       { status: 500 }
//     );
//   }
// }


// // POST /api/news/[id]/comments -> add comment
// export async function POST(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {

//     await connectToDatabase();

//     const { decoded } = await requireAuth(req);
//     const uid = decoded.uid;

//     const { id } = await context.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid post id" },
//         { status: 400 }
//       );
//     }

//     const body = await req.json();
//     const text: string = (body.text || "").trim();

//     if (!text || text.length < 2) {
//       return NextResponse.json(
//         { ok: false, error: "Comment too short" },
//         { status: 400 }
//       );
//     }

//     if (text.length > 500) {
//       return NextResponse.json(
//         { ok: false, error: "Comment too long (max 500)" },
//         { status: 400 }
//       );
//     }

//     // Ensure article exists
//     const news = await News.findById(id);

//     if (!news) {
//       return NextResponse.json(
//         { ok: false, error: "News not found" },
//         { status: 404 }
//       );
//     }

//     // 🔹 fetch user profile to get name
//     const profile = await User.findOne({ uid });

//     const userName = profile?.name || "Anonymous";

//     // 🔹 create comment
//     const comment = await Comment.create({
//       newsId: news._id,
//       userUid: uid,
//       userName: userName,
//       text,
//       parentCommentId: body.parentCommentId || null,
//       likes: [],
//       dislikes: [],
//     });


//     // increment comment count
//     await News.updateOne(
//       { _id: news._id },
//       { $inc: { commentsCount: 1 } }
//     );

//     return NextResponse.json(
//       {
//         ok: true,
//         comment: {
//           id: comment._id.toString(),
//           text: comment.text,
//           userName: comment.userName,
//           createdAt: comment.createdAt?.toISOString() || "",
//         },
//       },
//       { status: 201 }
//     );

//   } catch (err: any) {

//     console.error("POST /api/news/[id]/comments error:", err);

//     const message = err?.message || "Internal error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token"
//         ? 401
//         : 500;

//     return NextResponse.json({ ok: false, error: message }, { status });

//   }
// }








// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import News from "@/backend/models/News";
// import Comment from "@/backend/models/Comment";
// import User from "@/backend/models/User";   // make sure your user model is importe

// // GET /api/news/[id]/comments -> list comments for a post
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDatabase();
//     const { id } = await context.params;

//     const { searchParams } = new URL(req.url);
//     const sort = searchParams.get("sort");

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid post id" },
//         { status: 400 }
//       );
//     }

//     let comments;

//     if (sort === "new") {
//       comments = await Comment.find({
//         newsId: id,
//         parentCommentId: null,
//       })
//         .sort({ createdAt: -1 })
//         .limit(100)
//         .lean();
//     } else {
//       comments = await Comment.aggregate([
//         {
//           $match: {
//             newsId: new mongoose.Types.ObjectId(id),
//             parentCommentId: null,
//           },
//         },
//         {
//           $addFields: {
//             likeCount: { $size: { $ifNull: ["$likes", []] } },
//           },
//         },
//         { $sort: { likeCount: -1 } },
//         { $limit: 100 },
//       ]);
//     }

//     const serialised = comments.map((c: any) => ({
//       id: c._id.toString(),
//       text: c.text,
//       userName: c.userName || "Anonymous",
      
//       createdAt: c.createdAt?.toISOString() || "",
//       likes: c.likes?.length || 0,
//       dislikes: c.dislikes?.length || 0,
//     }));

//     return NextResponse.json({ ok: true, comments: serialised });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json(
//       { ok: false, error: "Internal error" },
//       { status: 500 }
//     );
//   }
// }
// // export async function GET(
// //   req: NextRequest,
// //   context: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     await connectToDatabase();
// //     const { id } = await context.params;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return NextResponse.json(
// //         { ok: false, error: "Invalid post id" },
// //         { status: 400 }
// //       );
// //     }

// //     const comments = await Comment.find({ newsId: id })
// //       .sort({ createdAt: -1 })
// //       .limit(100)
// //       .lean();

// //     const serialised = comments.map((c: any) => ({
// //       id: c._id.toString(),
// //       text: c.text,
// //       userName: c.userName || c.userEmail || "Anonymous",
// //       userEmail: c.userEmail || "",
// //       createdAt: c.createdAt?.toISOString() || "",
// //     }));

// //     return NextResponse.json({ ok: true, comments: serialised }, { status: 200 });
// //   } catch (err: any) {
// //     console.error("GET /api/news/[id]/comments error:", err);
// //     return NextResponse.json(
// //       { ok: false, error: "Internal error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // POST /api/news/[id]/comments -> add a comment (authed)
// export async function POST(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     const { id } = await context.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid post id" },
//         { status: 400 }
//       );
//     }

//     const body = await req.json();
//     const text: string = (body.text || "").trim();

//     if (!text || text.length < 2) {
//       return NextResponse.json(
//         { ok: false, error: "Comment is too short" },
//         { status: 400 }
//       );
//     }
//     if (text.length > 500) {
//       return NextResponse.json(
//         { ok: false, error: "Comment is too long (max 500 chars)" },
//         { status: 400 }
//       );
//     }

//     // Ensure post exists
//     const news = await News.findById(id);
//     if (!news) {
//       return NextResponse.json(
//         { ok: false, error: "Post not found" },
//         { status: 404 }
//       );
//     }
//     // const comment = await Comment.create({
//     //   newsId: news._id,
//     //   userUid: decoded.uid,
//     //   userName: decoded.name || undefined,
//     //   userEmail: decoded.email || undefined,
//     //   text,
//     //   parentCommentId: body.parentCommentId || null,
//     // });

//     // const comment = await Comment.create({
//     //   newsId: news._id,
//     //   userUid: decoded.uid,
//     //   userName: decoded.name || undefined,
//     //   userEmail: decoded.email || undefined,
//     //   text,
//     // });

//     // increment commentsCount on News
//     await News.updateOne(
//       { _id: news._id },
//       { $inc: { commentsCount: 1 } }
//     );

//     return NextResponse.json(
//       {
//         ok: true,
//         comment: {
//           id: comment._id.toString(),
//           text: comment.text,
//           userName: comment.userName || comment.userEmail || "Anonymous",
//           userEmail: comment.userEmail || "",
//           createdAt: comment.createdAt?.toISOString() || "",
//         },
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("POST /api/news/[id]/comments error:", err);
//     const message = err?.message || "Internal error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

//     return NextResponse.json({ ok: false, error: message }, { status });
//   }
// }
