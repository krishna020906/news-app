// lib/auth.ts
import { verifyIdToken } from "./firebase";
import { connectToDatabase } from "./db";
import User from "../models/User";

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.slice(7);
  const decoded = await verifyIdToken(token);
  if (!decoded) throw new Error("Invalid token");

  // Ensure DB connection and upsert user
  await connectToDatabase();
  const user = await User.findOneAndUpdate(
    { uid: decoded.uid },
    { uid: decoded.uid, email: decoded.email },
    { upsert: true, new: true }
  );
  return { decoded, user };
}
