import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import News from "@/backend/models/News";

export async function GET() {
  await connectToDatabase();

  const now = new Date();

  const posts = await News.find({ status: "published" }).lean();

  const scored = posts.map((post) => {
    const hoursAgo =
      (now.getTime() - new Date(post.createdAt).getTime()) / 36e5;

    let recencyScore = 0;
    if (hoursAgo < 6) recencyScore = 30;
    else if (hoursAgo < 24) recencyScore = 20;
    else if (hoursAgo < 48) recencyScore = 10;

    const score =
      (post.views || 0) * 1 +
      (post.likesCount || 0) * 2 +
      (post.commentsCount || 0) * 3 +
      recencyScore;

    return { ...post, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 5);

  return NextResponse.json({ ok: true, posts: sorted });
}
