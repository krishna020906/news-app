// // lib/db.ts
import mongoose from "mongoose";

// 1. Solve ECONNREFUSED only on the server
if (typeof window === "undefined") {
  const dns = require("node:dns/promises");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Please define the MONGO_URI environment variable");

// 2. Stronger TypeScript global typing
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

// In Next.js dev mode, the global object survives hot-reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGO_URI!, opts).then((m) => {
      console.log("✅ MongoDB Connected Successfully");
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null; // Reset if connection fails
    throw e;
  }

  return cached!.conn;
}




// import mongoose from "mongoose";
// require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


// const MONGO_URI = process.env.MONGO_URI;
// if (!MONGO_URI) throw new Error("MONGO_URI not defined");

// declare global {
//   // caching for serverless environments
//   var mongooseCache: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   } 
// }

// global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

// export async function connectToDatabase() {
//   if (global.mongooseCache.conn) {
//     // console.log("Using cached MongoDB connection");
//     return global.mongooseCache.conn;
//   }
//   if (!global.mongooseCache.promise) {
//     global.mongooseCache.promise = mongoose.connect(MONGO_URI!).then((mongooseInstance) => {
//       console.log("MongoDB connected");
//       return mongooseInstance;
//     });
//   }
//   global.mongooseCache.conn = await global.mongooseCache.promise;
//   return global.mongooseCache.conn;
// }
