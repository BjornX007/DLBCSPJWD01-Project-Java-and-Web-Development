// pages/api/orders.js

/**
 * Orders API
  * PURPOSE
 * -------
 * This API endpoint is responsible for creating and storing a customer order
 * during the checkout process.
 *
 * It acts as the single source of truth for orders by:
 * - Validating cart contents
 * - Capturing shipping/customer information
 * - Storing price totals at the time of purchase
 * - Assigning payment and order statuses
 *
 * This endpoint is called AFTER the user reviews their order
 * and BEFORE payment confirmation (for card payments).
 *
 * PAYMENT FLOW
 * ------------
 * - Cash on Delivery (COD):
 *   → Order is created with payment status = "paid"
 *   → No external payment provider is used
 *
 * - Card (Stripe):
 *   → Order is created with payment status = "pending"
 *   → Stripe Checkout is started separately
 *   → Payment status is updated later via webhook or callback
 */

import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

/**
 * API Route Handler
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Ensure MongoDB connection
    await dbConnect();

    /**
     * Expected request body:
     * {
     *   cart: Array,
     *   shipping: Object,
     *   totals: Object,
     *   paymentMethod: "cod" | "card"
     * }
     */
    const { cart, shipping, totals, paymentMethod } = req.body || {};

    // Validate cart
    if (!Array.isArray(cart) || cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }

    // Validate shipping details
    if (!shipping) {
      return res
        .status(400)
        .json({ success: false, message: "Missing shipping" });
    }

    // Validate totals
    if (!totals) {
      return res
        .status(400)
        .json({ success: false, message: "Missing totals" });
    }

    /**
     * Create a new Order document
     */
    const order = new Order({
      products: cart.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        salePrice: i.salePrice || i.price,
        quantity: i.quantity || 1,
      })),

      customer: {
        firstName: shipping.firstName || "",
        lastName: shipping.lastName || "",
        email: shipping.email || "",
        phone: shipping.phone || "",
        address1: shipping.address1 || "",
        address2: shipping.address2 || "",
        city: shipping.city || "",
        postalCode: shipping.postalCode || "",
        country: shipping.country || "",
      },

      totals: {
        subtotal: totals.subtotal || 0,
        shipping: totals.shipping || 0,
        total: totals.total || 0,
        currency: totals.currency || "EUR",
      },

      payment: {
        method: paymentMethod || "cod",
        /**
         * Card payments start as "pending"
         * COD orders are immediately marked as "paid"
         */
        status: paymentMethod === "card" ? "pending" : "paid",
      },

      // Initial order status
      status: "new",
    });

    // Save order to MongoDB
    const saved = await order.save();

    /**
     * Successful response
     */
    return res.status(201).json({
      success: true,
      orderId: saved._id.toString(),
    });
  } catch (err) {
    // Log error for debugging
    console.error("❌ Failed to save order:", err);

    // Generic error response
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to save order",
    });
  }
}
