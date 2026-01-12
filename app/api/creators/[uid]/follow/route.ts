// app/api/creators/[uid]/follow/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/backend/lib/auth";
import { connectToDatabase } from "@/backend/lib/db";
import User from "@/backend/models/User";

export async function POST(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const followerUid = decoded.uid;
    const creatorUid = params.uid;

    if (followerUid === creatorUid) {
      return NextResponse.json(
        { ok: false, error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

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
      // UNFOLLOW
      follower.followingCreators.pull(creatorUid);
      creator.followers.pull(followerUid);
    } else {
      // FOLLOW
      follower.followingCreators.addToSet(creatorUid);
      creator.followers.addToSet(followerUid);
    }

    await follower.save();
    await creator.save();

    return NextResponse.json({
      ok: true,
      following: !isFollowing,
      followersCount: creator.followers.length,
    });
  } catch (err: any) {
    console.error("Follow error", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
