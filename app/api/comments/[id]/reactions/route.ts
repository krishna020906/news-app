//app/api/comments/[id]/reactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import Comment from "@/backend/models/Comment";
import Notification from "@/backend/models/Notification";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { decoded } = await requireAuth(req);
  await connectToDatabase();

  const { id } = await context.params;
  const { type } = await req.json();

  const comment = await Comment.findById(id);

  if (!comment) {
    return NextResponse.json({ ok: false, error: "Not found" });
  }

  const uid = decoded.uid;

  if (type === "like") {
    comment.dislikes = comment.dislikes.filter((u) => u !== uid);

    if (comment.likes.includes(uid)) {
      comment.likes = comment.likes.filter((u) => u !== uid);
    } else {
      comment.likes.push(uid);
    }
  }

  if (type === "dislike") {
    comment.likes = comment.likes.filter((u) => u !== uid);

    if (comment.dislikes.includes(uid)) {
      comment.dislikes = comment.dislikes.filter((u) => u !== uid);
    } else {
      comment.dislikes.push(uid);
    }
  }

  await comment.save();

  if (type === "like" && comment.userUid !== uid) {
    await Notification.create({
      recipientUid: comment.userUid,
      actorUid: uid,
      type: "comment_like",
      entityId: comment._id.toString()
    });
  }

  return NextResponse.json({
    ok: true,
    likes: comment.likes.length,
    dislikes: comment.dislikes.length,
  });
}