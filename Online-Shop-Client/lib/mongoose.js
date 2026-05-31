/**
 * Mongoose Database Connection Utility
 * --------------------------------------------------
 * Purpose:
 * - Establishes a connection to MongoDB using Mongoose
 * - Prevents multiple connections from being opened
 * - Centralizes database connection logic
 *
 * This file is used by API routes and server-side
 * logic that rely on Mongoose models.
 */

import mongoose from "mongoose";

// Read MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Fail fast if MongoDB URI is missing
if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

/**
 * Track connection state to avoid reconnecting
 */
let isConnected = false;

/**
 * dbConnect
 * --------------------------------------------------
 * Establishes a MongoDB connection if one does not
 * already exist.
 *
 * Uses the "shopdb" database explicitly.
 */
async function dbConnect() {
  // Return early if already connected
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "shopdb", // Explicit database name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

export default dbConnect;
