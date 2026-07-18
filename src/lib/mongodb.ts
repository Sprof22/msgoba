import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = global as typeof globalThis & { mongooseCache?: Cache };
const cached = globalWithMongoose.mongooseCache ?? { conn: null, promise: null };
globalWithMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (!MONGODB_URI) throw new Error("Set MONGODB_URI in your environment before using database features.");
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
