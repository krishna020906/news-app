// app/api/my/news/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";

export async function GET(req: NextRequest) {
  try {
    const { decoded } = await requireAuth(req); // get uid
    await connectToDatabase();

    const posts = await News.find({
      authorUid: decoded.uid,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const serialised = posts.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      content: p.content,
      mediaUrl: p.mediaUrl || "",
      mediaType: p.mediaType || "none",
      category: p.category || "general",
      authorName: p.authorName || "",
      authorEmail: p.authorEmail || "",
      createdAt: p.createdAt ? p.createdAt.toISOString() : "",
      likesCount: p.likesCount || 0,
      dislikesCount: p.dislikesCount || 0,
      commentsCount: p.commentsCount || 0,
    }));

    return NextResponse.json({ ok: true, posts: serialised }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/my/news error:", err);
    const message = err?.message || "Internal error";
    const status =
      message === "Unauthorized" || message === "Invalid token" ? 401 : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
