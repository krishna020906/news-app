// app/api/health/route.ts
import { connectToDatabase } from "@/backend/lib/db";
import { verifyIdToken } from "@/backend/lib/firebase";

export async function GET(req: Request) {
  const time = new Date().toISOString();
  let db = "unknown";
  try {
    await connectToDatabase();
    db = "connected";
  } catch (err) {
    console.error("DB error:", err);
    db = "error";
  }

  let user = null;
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const decoded = await verifyIdToken(token);
    if (decoded) user = { uid: decoded.uid, email: decoded.email };
  }

  return new Response(JSON.stringify({ status: "ok", time, db, user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
