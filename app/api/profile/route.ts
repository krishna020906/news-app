// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import User from "@/backend/models/User";
import { requireAuth } from "@/backend/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const { state, profession, hobbies } = await req.json();

    const normalizedHobbies = Array.isArray(hobbies)
      ? hobbies.map((h: string) => h.trim().toLowerCase()).filter(Boolean)
      : [];

    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        state: state?.trim() || undefined,
        profession: profession?.trim().toLowerCase() || undefined,
        hobbies: normalizedHobbies,
        email: decoded.email,
        displayName: decoded.name,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
