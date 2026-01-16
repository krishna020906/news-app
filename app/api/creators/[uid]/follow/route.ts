// //app/api/creators/[uid]/follow/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/backend/lib/auth";
import { connectToDatabase } from "@/backend/lib/db";
import User from "@/backend/models/User";

export async function POST(
  req: Request,
  context: { params: Promise<{ uid: string }> }
) {
  const { uid: creatorUid } = await context.params;
  console.log("🔥 FOLLOW ROUTE HIT", creatorUid);

  const { decoded } = await requireAuth(req);
  const followerUid = decoded.uid;

  // 🛑 Self-follow guard
  if (followerUid === creatorUid) {
    return NextResponse.json(
      {
        ok: false,
        code: "SELF_FOLLOW",
        error: "You can’t follow yourself",
      },
      { status: 400 }
    );
  }

  await connectToDatabase();

  // Fetch both users
  const follower = await User.findOne({ uid: followerUid });
  const creator = await User.findOne({ uid: creatorUid });

  if (!follower || !creator) {
    return NextResponse.json(
      { ok: false, error: "User not found" },
      { status: 404 }
    );
  }

  const isFollowing = follower.followingCreators.includes(creatorUid);

  if (isFollowing) {
    // 🔁 UNFOLLOW
    follower.followingCreators = follower.followingCreators.filter(
      (id: string) => id !== creatorUid
    );
    creator.followers = creator.followers.filter(
      (id: string) => id !== followerUid
    );
  } else {
    // ➕ FOLLOW
    follower.followingCreators.push(creatorUid);
    creator.followers.push(followerUid);
  }

  await follower.save();
  await creator.save();

  return NextResponse.json({
    ok: true,
    following: !isFollowing,
    followersCount: creator.followers.length,
  });
}









// import { NextResponse } from "next/server";
// import { requireAuth } from "@/backend/lib/auth";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ uid: string }> }
// ) {
//   const { uid: creatorUid } = await context.params;

//   console.log("🔥 FOLLOW ROUTE HIT", creatorUid);

//   const { decoded } = await requireAuth(req);
//   const followerUid = decoded.uid;

//   // 🛑 Self-follow guard
//   if (followerUid === creatorUid) {
//     return NextResponse.json(
//       {
//         ok: false,
//         code: "SELF_FOLLOW",
//         error: "You can’t follow yourself",
//       },
//       { status: 400 }
//     );
//   }

//   // (DB logic will go here later)
//   return NextResponse.json({
//     ok: true,
//     followerUid,
//     creatorUid,
//   });
// }










// // app/api/creators/[uid]/follow/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { requireAuth } from "@/backend/lib/auth";
// import { connectToDatabase } from "@/backend/lib/db";
// import User from "@/backend/models/User";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { uid: string } }
// ) {
//     console.log("[FOLLOW ROUTE HIT]", params.uid);

//     const { decoded } = await requireAuth(req);

//     if (decoded.uid === params.uid) {
//       return NextResponse.json(
//         { ok: false, error: "You can’t follow yourself", code: "SELF_FOLLOW" },
//         { status: 400 }
//       );
//     }
//   try {
//     const { decoded } = await requireAuth(req);
//     await connectToDatabase();

//     const followerUid = decoded.uid;
//     const creatorUid = params.uid;

//     if (followerUid === creatorUid) {
//       console.warn("[FOLLOW] User tried to follow themselves:", followerUid);

//       return NextResponse.json(
//         {
//           ok: false,
//           code: "SELF_FOLLOW",
//           error: "You can’t follow yourself",
//         },
//         { status: 400 }
//       );
//     }


//     const follower = await User.findOne({ uid: followerUid });
//     const creator = await User.findOne({ uid: creatorUid });

//     if (!follower || !creator) {
//       return NextResponse.json(
//         { ok: false, error: "User not found" },
//         { status: 404 }
//       );
//     }

//     const isFollowing = follower.followingCreators.includes(creatorUid);

//     if (isFollowing) {
//       // UNFOLLOW
//       follower.followingCreators.pull(creatorUid);
//       creator.followers.pull(followerUid);
//     } else {
//       // FOLLOW
//       follower.followingCreators.addToSet(creatorUid);
//       creator.followers.addToSet(followerUid);
//     }

//     await follower.save();
//     await creator.save();

//     return NextResponse.json({
//       ok: true,
//       following: !isFollowing,
//       followersCount: creator.followers.length,
//     });
//   } catch (err: any) {
//     console.error("Follow error", err);
//     return NextResponse.json(
//       { ok: false, error: err.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }
