/**
 * MongoDB Connection Utility
 * --------------------------------------------------
 * Purpose:
 * - Creates and manages a MongoDB client connection
 * - Reuses the connection during development to avoid
 *   creating multiple database connections
 * - Exports a shared connection promise for reuse
 *
 * This file centralizes database access for the project.
 */

import { MongoClient } from "mongodb";

// Read MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;
const options = {};

// Fail early if MongoDB URI is missing
if (!uri) {
  throw new Error("❌ Please define the MONGODB_URI in .env.local");
}

let client;
let clientPromise;

/**
 * Development vs Production handling
 * --------------------------------------------------
 * In development, Next.js hot reload can cause multiple
 * connections. To prevent this, we store the client
 * promise on the global object.
 */
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  /**
   * In production, create a new MongoDB client
   * (this runs once in a server environment)
   */
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Export MongoDB client promise
 * --------------------------------------------------
 * Used across API routes and server-side logic
 */
export default clientPromise;

/**
 * Helper function: getDb
 * --------------------------------------------------
 * Returns a reference to the requested database
 *
 * @param {string} dbName - Name of the database
 * @returns {Promise<Db>} MongoDB database instance
 */
export async function getDb(dbName = "shopdb") {
  const client = await clientPromise;
  return client.db(dbName);
}
