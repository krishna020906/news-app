// app/api/news/route.ts
import { requireAuth } from "@/backend/lib/auth";
import News from "@/backend/models/News";

export async function POST(req: Request) {
  try {
    const { decoded, user } = await requireAuth(req); // will throw on invalid
    const body = await req.json();
    const { title, content } = body;
    if (!title || !content) {
      return new Response(JSON.stringify({ error: "Missing title or content" }), { status: 400 });
    }

    // If you want only admins to post:
    // if (user.role !== 'admin') return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

    const news = await News.create({
      title,
      content,
      authorUid: decoded.uid,
      authorEmail: decoded.email,
    });

    return new Response(JSON.stringify({ ok: true, news }), { status: 201 });
  } catch (err: any) {
    console.error("POST /api/news error:", err);
    const message = err?.message || "Unauthorized";
    const status = message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
