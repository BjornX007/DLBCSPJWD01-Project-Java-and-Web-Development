// API Route: /api/get-orders
//
// Purpose:
//  - Retrieves all orders from the database
//  - Used in the admin panel to display and manage customer orders

import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  // Allow only GET requests for this endpoint
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Connect to MongoDB using the shared connection instance
    const client = await clientPromise;

    // Explicitly select the "test" database
    // (MongoDB clusters can contain multiple databases)
    const db = client.db("test");

    /**
     * Fetch all orders from the "orders" collection
     * - sort newest → oldest using createdAt
     */
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    /**
     * MongoDB ObjectId + Date objects are not JSON-serializable
     * so we convert them into strings for the frontend
     */
    const normalizedOrders = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),

      // Convert timestamps to ISO strings if they exist
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : null,

      updatedAt: order.updatedAt
        ? new Date(order.updatedAt).toISOString()
        : null,
    }));

    // Send normalized response to client
    res.status(200).json({ success: true, orders: normalizedOrders });
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);

    // Generic fallback error response
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch orders" });
  }
}
