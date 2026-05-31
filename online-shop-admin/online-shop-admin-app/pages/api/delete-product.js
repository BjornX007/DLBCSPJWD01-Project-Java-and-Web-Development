// API Route: /api/delete-product
//
// Purpose:
//  - Deletes a product from the database based on the provided product ID
//  - Used in the admin panel to manage/delete product listings
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // Only allow DELETE requests for this API route
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // The product ID is passed through the URL query
  const { id } = req.query;

  // If no ID is provided → stop request
  if (!id) {
    return res.status(400).json({ message: "Missing product ID" });
  }

  try {
    // Wait for MongoDB connection
    const client = await clientPromise;
    const db = client.db();

    /**
     * Delete product where _id matches the given ID
     * ObjectId() converts string → MongoDB object format
     */
    await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    // Respond success
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("❌ Failed to delete product:", error);

    // Return server error response
    res.status(500).json({ message: "Internal server error" });
  }
}
