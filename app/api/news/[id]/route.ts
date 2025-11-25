// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/backend/lib/db";
import News from "@/backend/models/News";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next 15/16: params is a Promise
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
