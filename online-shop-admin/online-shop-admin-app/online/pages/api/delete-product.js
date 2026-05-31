import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Missing product ID" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("❌ Failed to delete product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
