import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/backend/lib/db";
import News from "@/backend/models/News";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid creator id" },
        { status: 400 }
      );
    }

    const posts = await News.find({ authorUid: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formatted = posts.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      preview: p.content?.slice(0, 120) || "",
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      ok: true,
      posts: formatted
    });

  } catch (err) {

    console.error("creator posts error:", err);

    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );

  }

}