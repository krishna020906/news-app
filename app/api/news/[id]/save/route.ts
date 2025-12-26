import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import User from "@/backend/models/User";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX

    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const alreadySaved = user.savedNews.includes(id);

    if (alreadySaved) {
      user.savedNews = user.savedNews.filter((nid) => nid !== id);
    } else {
      user.savedNews.push(id);
    }

    await user.save();

    return Response.json({
      ok: true,
      saved: !alreadySaved,
    });
  } catch (err) {
    console.error("Save error:", err);
    return Response.json(
      { error: "Failed to save news" },
      { status: 500 }
    );
  }
}








// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import User from "@/backend/models/User";

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // 1️⃣ Verify user
//     const { decoded } = await requireAuth(req);
//     const { id } =  await context.params;

//     await connectToDatabase();

//     // 2️⃣ Fetch user
//     const user = await User.findOne({ uid: decoded.uid });
//     if (!user) {
//       return Response.json({ error: "User not found" }, { status: 404 });
//     }

//     // 3️⃣ Safety: ensure array exists
//     if (!Array.isArray(user.savedNews)) {
//       user.savedNews = [];
//     }

//     // 4️⃣ Toggle save
//     const alreadySaved = user.savedNews.includes(id);

//     if (alreadySaved) {
//       user.savedNews = user.savedNews.filter((id: string) => id !== id);

//     } else {
//       user.savedNews.push(id);
//     }

//     // 5️⃣ Persist
//     await user.save();

//     return Response.json({
//       ok: true,
//       saved: !alreadySaved,
//     });
//   } catch (err: any) {
//     console.error("Save news error:", err);
//     return Response.json(
//       { error: err.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }










// // app/api/news/[id]/save/route.ts
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import User from "@/backend/models/User";

// export async function POST(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { decoded } = await requireAuth(req);
//     const { id: newsId } = await params;

//     await connectToDatabase();

//     const user = await User.findOne({ uid: decoded.uid });
//     if (!user) {
//       return Response.json({ error: "User not found" }, { status: 404 });
//     }

//     // ensure array exists
//     user.savedNews = user.savedNews || [];

//     let saved = false;

//     if (user.savedNews.includes(newsId)) {
//       user.savedNews = user.savedNews.filter((id: string) => id !== newsId);
//     } else {
//       user.savedNews.push(newsId);
//       saved = true;
//     }

//     await user.save();

//     return Response.json({ ok: true, saved });
//   } catch (err: any) {
//     console.error("Save news error:", err);
//     return Response.json(
//       { error: err.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }









// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import User from "@/backend/models/User";
// import News from "@/backend/models/News";

// export async function POST(req: Request, { params }: any) {
//   try {
//     const { decoded } = await requireAuth(req);
//     const newsId = params.id;

//     await connectToDatabase();

//     const user = await User.findOne({ uid: decoded.uid });
//     if (!user) return Response.json({ error: "User not found" }, { status: 404 });

//     if (!user.savedNews) user.savedNews = [];

//     let saved = false;

//     if (user.savedNews.includes(newsId)) {
//       // Unsave
//       user.savedNews = user.savedNews.filter((id: string) => id !== newsId);
//     } else {
//       // Save
//       user.savedNews.push(newsId);
//       saved = true;
//     }

//     await user.save();

//     return Response.json({ ok: true, saved });
//   } catch (e: any) {
//     console.error(e);
//     return Response.json({ error: e.message || "Error" }, { status: 500 });
//   }
// }
