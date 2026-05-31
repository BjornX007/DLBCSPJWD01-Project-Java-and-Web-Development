// ---------------------------------------------
// Purpose of this file
// ---------------------------------------------
// This module is responsible for establishing and managing
// a reusable MongoDB database connection using Mongoose.
//
// In a Next.js application, API routes can be executed multiple
// times due to hot reloads or serverless function calls.
// Opening a new DB connection every time would be inefficient
// and could crash the database.
//
// To solve this, we implement a global connection cache:
// - If a connection already exists → reuse it
// - Otherwise → create a new one and store it in cache
//
// This improves performance and prevents multiple open connections.
// ---------------------------------------------

import mongoose from "mongoose";

// Get MongoDB connection string from environment variables.
// It is stored in `.env.local` for security reasons and MUST NOT
// be hard-coded in the source code.
const MONGODB_URI = process.env.MONGODB_URI;

// If no database connection string is found → stop execution.
// This prevents the app from running in a broken state.
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Global cache container.
// Reuses the same DB connection between hot reloads / API calls.
// `global.mongoose` persists across server calls in Next.js.
let cached = global.mongoose;

// If cache does not exist yet → initialize it
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If a DB connection already exists → return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is not already being created → start one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // prevents queued DB operations while connecting
    };

    // Create the connection and store the promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for connection to complete
  cached.conn = await cached.promise;

  // Return the established connection instance
  return cached.conn;
}

// Export function so it can be reused anywhere in the application
// (API routes, models, authentication logic, etc.)
export default dbConnect;
