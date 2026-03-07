import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import Comment from "@/backend/models/Comment";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { decoded } = await requireAuth(req);
  await connectToDatabase();

  const { id } = await context.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    return NextResponse.json({ ok: false });
  }

  if (comment.userUid !== decoded.uid) {
    return NextResponse.json(
      { ok: false, error: "Not allowed" },
      { status: 403 }
    );
  }

  await Comment.findByIdAndDelete(id);

  return NextResponse.json({ ok: true });
}