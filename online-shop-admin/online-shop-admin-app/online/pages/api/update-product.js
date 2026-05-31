import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, title, description, price } = req.body;

  if (!id || !title || !description || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          price: parseFloat(price),
        },
      }
    );

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("❌ Failed to update product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
