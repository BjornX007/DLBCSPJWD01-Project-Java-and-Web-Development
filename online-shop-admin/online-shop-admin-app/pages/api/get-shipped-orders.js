// API Route: /api/get-shipped-orders
//
// Purpose:
//  - Retrieves all orders with status "Shipped" from the database
//  - Used in the admin panel to display and manage shipped orders
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  // Allow ONLY GET requests for this API route
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Re-use global MongoDB connection
    const client = await clientPromise;

    // Select database (must match where your orders collection lives)
    const db = client.db("test"); // make sure this matches your orders DB

    /**
     * Fetch ONLY orders where status === "Shipped"
     * Latest orders first (descending by createdAt)
     */
    const orders = await db
      .collection("orders")
      .find({ status: "Shipped" })
      .sort({ createdAt: -1 })
      .toArray();

    /**
     * Normalize MongoDB objects:
     * - Convert ObjectId → string
     * - Convert dates → ISO strings
     * This prevents Next.js serialization errors
     */
    const normalizedOrders = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : null,
      updatedAt: order.updatedAt
        ? new Date(order.updatedAt).toISOString()
        : null,
    }));

    // Send response to frontend
    res.status(200).json({ success: true, orders: normalizedOrders });

  } catch (err) {
    console.error("❌ Failed to fetch shipped orders:", err);

    // Generic server error response
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch shipped orders" });
  }
}
