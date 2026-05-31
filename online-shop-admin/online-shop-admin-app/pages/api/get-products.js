// API Route: /api/get-products
//
// Purpose:
//  - Retrieves product(s) from the database
//  - If an ID is provided in the query, returns a single product
//  - If no ID is provided, returns all products
//  - Used in the admin panel to display and manage product listings
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // Only allow GET requests for this API route
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Read product id from URL query (optional)
  const { id } = req.query;

  try {
    // Re-use global MongoDB connection
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    /**
     * If an ID is provided → return ONE product
     */
    if (id) {
      const product = await collection.findOne({ _id: new ObjectId(id) });

      // If product doesn't exist → send 404
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ product });
    }

    /**
     * If NO ID is provided → return ALL products
     * Newest first using createdAt field
     */
    const products = await collection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ products });

  } catch (err) {
    console.error("❌ Failed to fetch product(s):", err);

    // Generic API error response
    return res.status(500).json({ message: "Server error" });
  }
}
