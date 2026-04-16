
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/backend/lib/auth";
import { connectToDatabase } from "@/backend/lib/db";
import User from "@/backend/models/User";

export async function GET(req: NextRequest) {
  type UserLean = {
    uid: string;
    streak?: number;
    lastReadAt?: Date;
    };
  try {
    await connectToDatabase();

    const { decoded } = await requireAuth(req);

    const user = await User.findOne({ uid: decoded.uid }).lean<UserLean>();

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" });
    }

    return NextResponse.json({
      ok: true,
      streak: user.streak ?? 0, // ✅ FIXED
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch streak" },
      { status: 500 }
    );
  }
}




// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import User from "@/backend/models/User";

// export async function GET(req: Request) {
//   const { decoded } = await requireAuth(req);
//   await connectToDatabase();

//   const user = await User.findOne({ uid: decoded.uid });
//   if (!user) {
//     return NextResponse.json({ streak: 0 });
//   }

//   return NextResponse.json({
//     streak: user.streakCount || 0,
//   });
// }
