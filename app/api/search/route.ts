import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import News from "@/backend/models/News";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { ok: true, results: [] },
        { status: 200 }
      );
    }

    const results = await News.find(
      {
        $text: { $search: q },
        status: "published",
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(
      { ok: true, results },
      { status: 200 }
    );
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { ok: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
