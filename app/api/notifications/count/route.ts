import { NextResponse } from "next/server";
import { requireAuth } from "@/backend/lib/auth";
import { connectToDatabase } from "@/backend/lib/db";
import Notification from "@/backend/models/Notification";

export async function GET(req: Request) {

  const { decoded } = await requireAuth(req);
  await connectToDatabase();

  const count = await Notification.countDocuments({
    recipientUid: decoded.uid,
    isRead: false
  });

  return NextResponse.json({
    ok: true,
    count
  });
}