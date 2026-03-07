import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import Comment from "@/backend/models/Comment";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await context.params;

  const replies = await Comment.find({
    parentCommentId: id,
  })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({
    ok: true,
    replies,
  });
}