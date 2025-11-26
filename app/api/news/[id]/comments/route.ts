// app/api/news/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";
import Comment from "@/backend/models/Comment";

// GET /api/news/[id]/comments -> list comments for a post
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid post id" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ newsId: id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const serialised = comments.map((c: any) => ({
      id: c._id.toString(),
      text: c.text,
      userName: c.userName || c.userEmail || "Anonymous",
      userEmail: c.userEmail || "",
      createdAt: c.createdAt?.toISOString() || "",
    }));

    return NextResponse.json({ ok: true, comments: serialised }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/news/[id]/comments error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

// POST /api/news/[id]/comments -> add a comment (authed)
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid post id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const text: string = (body.text || "").trim();

    if (!text || text.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Comment is too short" },
        { status: 400 }
      );
    }
    if (text.length > 500) {
      return NextResponse.json(
        { ok: false, error: "Comment is too long (max 500 chars)" },
        { status: 400 }
      );
    }

    // Ensure post exists
    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const comment = await Comment.create({
      newsId: news._id,
      userUid: decoded.uid,
      userName: decoded.name || undefined,
      userEmail: decoded.email || undefined,
      text,
    });

    // increment commentsCount on News
    await News.updateOne(
      { _id: news._id },
      { $inc: { commentsCount: 1 } }
    );

    return NextResponse.json(
      {
        ok: true,
        comment: {
          id: comment._id.toString(),
          text: comment.text,
          userName: comment.userName || comment.userEmail || "Anonymous",
          userEmail: comment.userEmail || "",
          createdAt: comment.createdAt?.toISOString() || "",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/news/[id]/comments error:", err);
    const message = err?.message || "Internal error";
    const status =
      message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
