// pages/api/orders/updatePayment.js
/**
 * Update Order Payment Status API
 * --------------------------------------------------
 * Purpose:
 * - Updates an existing order after Stripe checkout
 * - Marks payment as "paid" (or another status)
 * - Optionally stores Stripe session ID for verification
 */

import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  /**
   * Only POST requests are allowed
   */
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    /**
     * Ensure MongoDB connection (Mongoose)
     */
    await dbConnect();

    /**
     * Extract request body
     */
    const { orderId, status = "paid", sessionId } = req.body || {};

    /**
     * Validate required data
     */
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing orderId" });
    }

    /**
     * Update payment status for the order
     * --------------------------------------------------
     * - payment.status is updated (e.g. "paid")
     * - stripeSessionId is stored for future verification/refunds
     */
    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        "payment.status": status,
        stripeSessionId: sessionId,
      },
      { new: true } // return updated document
    );

    /**
     * Handle order not found
     */
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    /**
     * Success response
     */
    return res.status(200).json({
      success: true,
      orderId: updated._id.toString(),
      paymentStatus: updated.payment.status,
    });
  } catch (err) {
    /**
     * Error handling
     */
    console.error("❌ Failed to update payment:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update payment",
    });
  }
}
