// -----------------------------------------------------------
// lib/mongodb.js
// -----------------------------------------------------------
// Purpose of this file:
//
// This module establishes a single shared MongoDB connection
// that can be reused across the entire Next.js application.
//
// In development, Next.js automatically reloads files when
// changes occur. Without a shared connection, this would create
// multiple active database connections, which can cause crashes
// and performance issues.
//
// To prevent this, we store the connection instance inside a
// global variable so it persists between reloads.
// -----------------------------------------------------------

import { MongoClient } from "mongodb";

// Read MongoDB connection string from environment variables.
// The value is stored in `.env.local` because it contains
// sensitive authentication credentials.
const uri = process.env.MONGODB_URI;

// Optional connection options (modern drivers do not require these)
const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

// If the connection string is missing → stop execution.
// This ensures the project does not run in an invalid state.
if (!uri) {
  throw new Error(
    "❌ Please define the MONGODB_URI environment variable in your .env.local file."
  );
}

// Variables used to store connection reference
let client;
let clientPromise;

/**
 * Create a single shared MongoDB connection.
 *
 * In development mode, Next.js performs hot reloading,
 * meaning files are re-executed on every change.
 *
 * If we created a new MongoDB connection every time,
 * multiple connections would open simultaneously.
 *
 * To avoid this, we store the connection in a global variable
 * so it is created only once and then reused.
 */
if (process.env.NODE_ENV === "development") {
  // If a connection does not already exist → create one
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  // Reuse existing connection on reloads
  clientPromise = global._mongoClientPromise;
} else {
  // In production, we simply create a fresh connection instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the connection promise so that API routes,
// models, or services can access the same connection.
export default clientPromise;
