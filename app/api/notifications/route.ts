//app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/backend/lib/auth";
import { connectToDatabase } from "@/backend/lib/db";
import Notification from "@/backend/models/Notification";
import User from "@/backend/models/User";

export async function GET(req: NextRequest) {

  try {

    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const notifications = await Notification.find({
      recipientUid: decoded.uid
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // 🔥 get all actor users
    const actorUids = [...new Set(notifications.map((n: any) => n.actorUid))];

    const users = await User.find({ uid: { $in: actorUids } })
      .select("uid name photoURL")
      .lean();

    const userMap = new Map(users.map((u: any) => [u.uid, u]));

    const formatted = notifications.map((n: any) => {
      const actor = userMap.get(n.actorUid);

      return {
        id: n._id.toString(),
        type: n.type,
        entityId: n.entityId,
        createdAt: n.createdAt,

        actorName: actor?.name || "User",
        actorImage: actor?.photoURL || "",
      };
    });

    return NextResponse.json({
      ok: true,
      notifications: formatted
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { ok: false, error: "Failed to load notifications" },
      { status: 500 }
    );

  }

}







// import { NextRequest, NextResponse } from "next/server";
// import { requireAuth } from "@/backend/lib/auth";
// import { connectToDatabase } from "@/backend/lib/db";
// import Notification from "@/backend/models/Notification";

// export async function GET(req: NextRequest) {

//   try {

//     const { decoded } = await requireAuth(req);

//     await connectToDatabase();

//     const notifications = await Notification.find({
//       recipientUid: decoded.uid
//     })
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .lean();

//     const formatted = notifications.map((n: any) => ({
//       id: n._id.toString(),
//       type: n.type,
//       actorUid: n.actorUid,
//       entityId: n.entityId,
//       createdAt: n.createdAt
//     }));

//     return NextResponse.json({
//       ok: true,
//       notifications: formatted
//     });

//   } catch (err) {

//     console.error(err);

//     return NextResponse.json(
//       { ok: false, error: "Failed to load notifications" },
//       { status: 500 }
//     );

//   }

// }