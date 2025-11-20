// lib/db.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI not defined");

declare global {
  // caching for serverless environments
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } 
}

global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase() {
  if (global.mongooseCache.conn) {
    // console.log("Using cached MongoDB connection");
    return global.mongooseCache.conn;
  }
  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(MONGO_URI!).then((mongooseInstance) => {
      console.log("MongoDB connected");
      return mongooseInstance;
    });
  }
  global.mongooseCache.conn = await global.mongooseCache.promise;
  return global.mongooseCache.conn;
}
