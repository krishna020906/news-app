
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/backend/lib/auth";
import { connectToDatabase } from "@/backend/lib/db";
import User from "@/backend/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { decoded } = await requireAuth(req);

    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" });
    }

    const now = new Date();
    const lastRead = user.lastReadAt;

    let newStreak = user.streak || 0;

    if (!lastRead) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor(
        (now.getTime() - new Date(lastRead).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        // same day → do nothing
      } else if (diffDays === 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    user.streak = newStreak;
    user.lastReadAt = now;

    await user.save();

    return NextResponse.json({
      ok: true,
      streak: newStreak,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to update streak" },
      { status: 500 }
    );
  }
}






// import { NextRequest, NextResponse } from "next/server";
// import { requireAuth } from "@/backend/lib/auth";
// import { connectToDatabase } from "@/backend/lib/db";
// import User from "@/backend/models/User";

// export async function GET(req: NextRequest) {
//   try {
//     console.log("Marking read...");
//     await connectToDatabase();

//     const { decoded } = await requireAuth(req);

//     const user = await User.findOne({ uid: decoded.uid }).lean();

//     if (!user) {
//       return NextResponse.json({ ok: false, error: "User not found" });
//     }

//     return NextResponse.json({
//       ok: true,
//       streak: user.streak || 0,
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { ok: false, error: "Failed to fetch streak" },
//       { status: 500 }
//     );
//   }
// }








// import { NextRequest, NextResponse } from "next/server";
// import { requireAuth } from "@/backend/lib/auth";
// import { connectToDatabase } from "@/backend/lib/db";
// import User from "@/backend/models/User";

// export async function POST(req: NextRequest) {
//   try {
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     const user = await User.findOne({ uid: decoded.uid });

//     if (!user) {
//       return NextResponse.json({ ok: false, error: "User not found" });
//     }

//     const today = new Date();
//     const last = user.lastReadAt ? new Date(user.lastReadAt) : null;

//     let newStreak = user.streak || 0;

//     if (!last) {
//       newStreak = 1;
//     } else {
//       const diffDays = Math.floor(
//         (today.setHours(0,0,0,0) - last.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)
//       );

//       if (diffDays === 0) {
//         // already counted today → do nothing
//       } else if (diffDays === 1) {
//         newStreak += 1;
//       } else {
//         newStreak = 1; // streak broken
//       }
//     }

//     user.streak = newStreak;
//     user.lastReadAt = new Date();

//     await user.save();

//     return NextResponse.json({
//       ok: true,
//       streak: newStreak,
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { ok: false, error: "Failed to update streak" },
//       { status: 500 }
//     );
//   }
// }