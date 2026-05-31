// pages/api/orders.js
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    await dbConnect();

    const { cart, shipping, totals, paymentMethod } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!shipping) {
      return res.status(400).json({ success: false, message: "Missing shipping" });
    }
    if (!totals) {
      return res.status(400).json({ success: false, message: "Missing totals" });
    }

    const order = new Order({
      products: cart.map(i => ({
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
        status: paymentMethod === "card" ? "pending" : "paid",
      },
      status: "new",
    });

    const saved = await order.save();

    res.status(201).json({ success: true, orderId: saved._id.toString() });
  } catch (err) {
    console.error("❌ Failed to save order:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to save order" });
  }
}
