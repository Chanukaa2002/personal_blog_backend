// db.js (or where you handle DB connection)
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // Reuse existing connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30s timeout (default: 10s)
      socketTimeoutMS: 45000, // 45s timeout
    }).then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }

  return cached.conn;
}

export default connectDB;