// lib/mongodb.ts

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Global cache (important for Next.js hot reload)
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "dreamhouse_db",
      })
      .then((mongoose) => mongoose)
      .catch((error) => {
        // If the first connection attempt fails, don't leave a rejected promise cached forever.
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
  (global as any).mongoose = cached;

  return cached.conn;
}
