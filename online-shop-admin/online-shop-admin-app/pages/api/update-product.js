// API Route: /api/update-product
// Purpose:
//  - Updates an existing product's details in the database
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // Allow only PUT requests (update operation)
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract product fields from request body
  const {
    id,
    title,
    description,
    price,
    salePrice,
    saleStart,
    saleEnd,
    kit,
  } = req.body;

  // Validate that required data exists
  if (!id || !title || !description || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Current time — used to determine if sale is active
    const now = new Date();

    // Check whether product is currently within sale period
    const isOnSale =
      salePrice &&
      saleStart &&
      saleEnd &&
      new Date(saleStart) <= now &&
      now <= new Date(saleEnd);

    // Build object containing sanitized + formatted values
    const updateFields = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      kit: kit?.trim() || "",
      salePrice: salePrice ? parseFloat(salePrice) : null,
      saleStart: saleStart || null,
      saleEnd: saleEnd || null,
      isOnSale: !!isOnSale, // convert truthy check to boolean
    };

    // Update product in database by ID
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },   // match product
      { $set: updateFields }       // replace fields with new values
    );

    // Send success response back to frontend
    return res.status(200).json({ message: "Product updated successfully" });

  } catch (error) {
    // Log error to server console
    console.error("❌ Failed to update product:", error);

    // Send error response
    return res.status(500).json({ message: "Internal server error" });
  }
}
