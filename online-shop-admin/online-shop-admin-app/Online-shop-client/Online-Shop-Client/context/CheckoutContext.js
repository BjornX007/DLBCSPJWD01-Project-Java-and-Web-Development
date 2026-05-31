import Stripe from "stripe";
import clientPromise from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { cart, customer } = req.body;

    if (!cart || !cart.length) return res.status(400).json({ error: "Cart is empty" });

    const client = await clientPromise;
    const db = client.db("shopdb");

    // Save pending order BEFORE redirect
    const newOrder = {
      products: cart,
      customer,
      status: "Pending",
      paymentMethod: "card",
      createdAt: new Date(),
    };
    const result = await db.collection("orders").insertOne(newOrder);

    // Stripe line items
    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title },
        unit_amount: Math.round((item.salePrice ?? item.price ?? 0) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.origin}/checkout/success?orderId=${result.insertedId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe checkout session creation failed" });
  }
}
