import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("❌ Please define MONGODB_URI in .env.local");

let isConnected = false;

async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, { dbName: "shopdb",          // <<< make sure this is here
  useNewUrlParser: true,
  useUnifiedTopology: true,});
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

export default dbConnect;
