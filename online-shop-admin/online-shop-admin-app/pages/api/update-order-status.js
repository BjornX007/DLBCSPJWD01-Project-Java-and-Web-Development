import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * API Route: /api/update-order-status
 *
 * Purpose:
 *  - Updates the status of an existing order in the database
 *  - Used in the admin panel to manage order lifecycle
 *
 * Request Type:
 *  - PUT (Only)
 *
 * Expected Request Body:
 *  {
 *    id: "<MongoDB ObjectId as string>",
 *    status: "<New order status>"
 *  }
 *
 * Possible Use Cases:
 *  - Mark order as "Processing", "Shipped", "Delivered", etc.
 *  - Order management functionality in an e-commerce system
 */

export default async function handler(req, res) {

  // Enforce that only PUT requests are allowed for safety and consistency
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract order ID and new status from request body
    const { id, status } = req.body;

    // Input validation — prevents undefined database updates
    if (!id || !status) {
      return res.status(400).json({
        error: "Missing parameters: 'id' and 'status' are required",
      });
    }

    // Establish connection with MongoDB using shared client instance
    const client = await clientPromise;

    // Select database (in this project: "test")
    const db = client.db("test");

    /**
     * Update the order document in MongoDB
     *
     * - Convert the order ID string into a MongoDB ObjectId
     * - Only update the `status` field (other fields remain unchanged)
     */
    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    // Respond with success state for frontend handling
    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Order status update failed:", err);

    // Return a generic error response to avoid leaking server details
    res.status(500).json({
      success: false,
      error: "Failed to update status due to a server error",
    });
  }
}
