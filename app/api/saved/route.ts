import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import User from "@/backend/models/User";
import News from "@/backend/models/News";

export async function GET(req: Request) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const user = await User.findOne({ uid: decoded.uid }).lean();
    if (!user) return Response.json({ ok: true, posts: [] });

    const savedIds = user.savedNews || [];

    const posts = await News.find({ _id: { $in: savedIds } })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ ok: true, posts });
  } catch (e: any) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

