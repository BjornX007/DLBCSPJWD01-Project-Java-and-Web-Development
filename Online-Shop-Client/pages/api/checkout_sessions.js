// pages/api/checkout_sessions.js

/**
 * Stripe Checkout Session API
 * --------------------------------
 * Creates a Stripe Checkout session for card payments.
 * Receives cart items from the frontend and converts them
 * into Stripe-compatible line items.
 */

import Stripe from "stripe";

// Initialize Stripe with secret key (server-side only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * API Route Handler
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  // ❌ Only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Destructure request body safely
    const { cart, orderId } = req.body || {};

    // ❌ Validate cart data
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    /**
     * Convert cart items into Stripe line items
     * - Prices must be in CENTS
     * - Sale price has priority over regular price
     */
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title, // Product title shown in Stripe checkout
        },
        unit_amount: Math.round(
          (item.salePrice ?? item.price ?? 0) * 100
        ), // Convert € → cents
      },
      quantity: item.quantity || 1,
    }));

    /**
     * Create Stripe Checkout session
     */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      // Redirect URLs after checkout
      success_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,

      // Metadata stored with the Stripe session (useful for webhooks)
      metadata: {
        orderId: orderId || "",
        cart: JSON.stringify(cart),
      },
    });

    // ✅ Return session ID to frontend
    res.status(200).json({ id: session.id });

  } catch (err) {
    // ❌ Stripe or server error
    console.error("❌ Stripe session failed:", err);

    res.status(500).json({
      error: "Stripe checkout session creation failed",
    });
  }
}
