/**
 * Order Creation API Route
 * --------------------------------------------------
 * Purpose:
 * - Receives checkout data from the frontend
 * - Validates cart, shipping, and totals
 * - Saves a finalized order into MongoDB
 * - Supports Cash on Delivery (COD) and Card payments
 */

import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  /**
   * Only allow POST requests
   */
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    /**
     * Extract order data from request body
     */
    const { shipping, cart, totals, paymentMethod } = req.body || {};

    /**
     * Basic validation
     */
    if (!cart?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!shipping || !totals) {
      return res.status(400).json({ error: "Missing shipping or totals data" });
    }

    /**
     * Connect to MongoDB
     */
    const client = await clientPromise;
    const db = client.db("shopdb");

    /**
     * Build order document
     * --------------------------------------------------
     * Important:
     * - Prices are copied at purchase time (snapshot)
     * - This protects order history if product prices change later
     */
    const order = {
      createdAt: new Date(),

      /**
       * Ordered products
       */
      products: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        salePrice: item.salePrice || item.price,
        quantity: item.quantity || 1,
      })),

      /**
       * Customer shipping information
       */
      customer: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        email: shipping.email,
        phone: shipping.phone,
        address1: shipping.address1,
        address2: shipping.address2,
        city: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country,
      },

      /**
       * Order totals
       */
      totals: {
        subtotal: totals.subtotal || 0,
        shipping: totals.shipping || 0,
        total: totals.total || 0,
        currency: totals.currency || "EUR",
      },

      /**
       * Payment information
       * - COD orders remain pending
       * - Card orders are marked as paid
       */
      payment: {
        method: paymentMethod || "cod",
        status: paymentMethod === "card" ? "paid" : "pending",
      },

      /**
       * Order lifecycle status
       */
      status: "new",
    };

    /**
     * Insert order into database
     */
    const result = await db.collection("orders").insertOne(order);

    /**
     * Return success response
     */
    res.status(201).json({
      success: true,
      orderId: result.insertedId.toString(),
      order,
    });
  } catch (e) {
    /**
     * Error handling
     */
    console.error("❌ Failed to save order:", e);
    res.status(500).json({ error: "Failed to save order" });
  }
}
