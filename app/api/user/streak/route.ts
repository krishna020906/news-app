import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import User from "@/backend/models/User";

export async function GET(req: Request) {
  const { decoded } = await requireAuth(req);
  await connectToDatabase();

  const user = await User.findOne({ uid: decoded.uid });
  if (!user) {
    return NextResponse.json({ streak: 0 });
  }

  return NextResponse.json({
    streak: user.streakCount || 0,
  });
}
