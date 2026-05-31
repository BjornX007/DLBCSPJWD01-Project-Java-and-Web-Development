// pages/api/orders/updatePayment.js
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    await dbConnect();
    const { orderId, status = "paid", sessionId } = req.body || {};

    if (!orderId) return res.status(400).json({ success: false, message: "Missing orderId" });

    const updated = await Order.findByIdAndUpdate(orderId, { "payment.status": status, stripeSessionId: sessionId }, { new: true });

    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, orderId: updated._id.toString(), paymentStatus: updated.payment.status });
  } catch (err) {
    console.error("❌ Failed to update payment:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to update payment" });
  }
}
