// pages/api/checkout_sessions.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { cart, orderId } = req.body || {};
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title },
        unit_amount: Math.round((item.salePrice ?? item.price ?? 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        orderId: orderId || "",
        cart: JSON.stringify(cart),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("❌ Stripe session failed:", err);
    res.status(500).json({ error: "Stripe checkout session creation failed" });
  }
}
