// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  // You can add custom options here if needed
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

if (!uri) {
  throw new Error("❌ Please define the MONGODB_URI environment variable in your .env.local file.");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve value across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
