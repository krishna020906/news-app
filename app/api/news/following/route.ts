import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";
import User from "@/backend/models/User";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { decoded } = await requireAuth(req);
    const user = await User.findOne({ uid: decoded.uid }).lean() as any;

    if (!user || !user.followingCreators?.length) {
      return NextResponse.json({ ok: true, posts: [] });
    }

    const posts = await News.find({
      status: "published",
      authorUid: { $in: user.followingCreators },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // fetch authors
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
        content: p.content,
        mediaUrl: p.mediaUrl || "",
        mediaType: p.mediaType || "none",
        category: p.category || "general",
        tags: p.tags || [],

        authorUid: p.authorUid,
        authorName: p.authorName || "",
        authorEmail: p.authorEmail || "",

        isFollowingAuthor: true,
        authorFollowersCount: author?.followers?.length || 0,

        createdAt: p.createdAt?.toISOString() || "",
        likesCount: p.likesCount || 0,
        dislikesCount: p.dislikesCount || 0,
        commentsCount: p.commentsCount || 0,
      };
    });

    return NextResponse.json({ ok: true, posts: serialised });
  } catch (err) {
    console.error("GET /api/news/following error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load following feed" },
      { status: 500 }
    );
  }
}
