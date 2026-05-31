import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    if (id) {
      // ✅ Return single product
      const product = await collection.findOne({ _id: new ObjectId(id) });
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.status(200).json({ product });
    }

    // ✅ Return all products
    const products = await collection.find().sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ products });
  } catch (err) {
    console.error("❌ Failed to fetch product(s):", err);
    return res.status(500).json({ message: "Server error" });
  }
}
