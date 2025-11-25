// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import User from "@/backend/models/User";

export async function POST(req: NextRequest) {
  try {
    const { decoded } = await requireAuth(req); // get uid, email
    await connectToDatabase();

    const body = await req.json();
    const { name, state, locality, profession, hobbies, age } = body;

    // normalise hobbies (string -> array)
    let hobbiesArray: string[] = [];
    if (Array.isArray(hobbies)) {
      hobbiesArray = hobbies;
    } else if (typeof hobbies === "string") {
      hobbiesArray = hobbies
        .split(",")
        .map((h: string) => h.trim())
        .filter(Boolean);
    }

    const update = {
      name: name || undefined,
      state: state || undefined,
      locality: locality || undefined,
      profession: profession || undefined,
      hobbies: hobbiesArray,
      age: age ? Number(age) : undefined,
      email: decoded.email || undefined,
    };

    const user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      { $set: update, $setOnInsert: { uid: decoded.uid } },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/user/profile error:", err);
    const message = err?.message || "Internal error";
    const status =
      message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
