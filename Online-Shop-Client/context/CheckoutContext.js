/**
 * Stripe Checkout API Route
 * --------------------------------------------------
 * Purpose:
 * - Creates a Stripe Checkout Session for card payments
 * - Saves a pending order to MongoDB before redirecting
 * - Redirects the user to Stripe’s hosted checkout page
 *
 * This ensures that an order exists in the database
 * even if the user closes the browser during payment.
 */

import Stripe from "stripe";
import clientPromise from "@/lib/mongodb";

// Initialize Stripe using secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * API Route Handler
 * --------------------------------------------------
 * Accepts POST requests only
 */
export default async function handler(req, res) {
  // Block any non-POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart, customer } = req.body;

    /**
     * Basic validation:
     * - Cart must exist
     * - Cart must contain at least one product
     */
    if (!cart || !cart.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    /**
     * Connect to MongoDB
     */
    const client = await clientPromise;
    const db = client.db("shopdb");

    /**
     * Create a pending order BEFORE redirecting to Stripe
     * This allows tracking orders even if payment fails
     */
    const newOrder = {
      products: cart,
      customer,
      status: "Pending",
      paymentMethod: "card",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);

    /**
     * Convert cart items into Stripe line items
     * Stripe requires prices in cents
     */
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(
          (item.salePrice ?? item.price ?? 0) * 100
        ),
      },
      quantity: item.quantity,
    }));

    /**
     * Create Stripe Checkout Session
     */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      // Redirect user after successful payment
      success_url: `${req.headers.origin}/checkout/success?orderId=${result.insertedId}&session_id={CHECKOUT_SESSION_ID}`,

      // Redirect user if payment is cancelled
      cancel_url: `${req.headers.origin}/checkout`,
    });

    /**
     * Return session ID to frontend
     */
    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);

    res.status(500).json({
      error: "Stripe checkout session creation failed",
    });
  }
}
