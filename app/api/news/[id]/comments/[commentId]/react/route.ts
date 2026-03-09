import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import Comment from "@/backend/models/Comment";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string; commentId: string }> }
) {

  try {

    await connectToDatabase();

    const { decoded } = await requireAuth(req);

    const { commentId } = await context.params;

    const { type } = await req.json();

    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { ok: false, error: "Invalid reaction" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { ok: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const uid = decoded.uid;

    const likes = new Set(comment.likes || []);
    const dislikes = new Set(comment.dislikes || []);

    if (type === "like") {

      if (likes.has(uid)) {
        likes.delete(uid);
      } else {
        likes.add(uid);
        dislikes.delete(uid);
      }

    } else {

      if (dislikes.has(uid)) {
        dislikes.delete(uid);
      } else {
        dislikes.add(uid);
        likes.delete(uid);
      }

    }

    comment.likes = Array.from(likes);
    comment.dislikes = Array.from(dislikes);

    await comment.save();

    return NextResponse.json({
      ok: true,
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length,
    });

  } catch (err) {

    console.error("comment reaction error:", err);

    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );

  }
}