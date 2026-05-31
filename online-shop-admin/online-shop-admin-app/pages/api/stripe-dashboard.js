// pages/api/stripe-dashboard.js
// Purpose:
//  - Fetches Stripe payment data for the admin dashboard
//  - Calculates total sales, refunds, and unique customers from Stripe charges
// Import Stripe SDK
import Stripe from "stripe"; 

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  // Only allow GET requests — reject everything else
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 🔹 Fetch up to 100 Stripe charges from the last 30 days
    const charges = await stripe.charges.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // UNIX timestamp for last 30 days
      },
    });

    // 🔹 Calculate total paid + completed sales (exclude refunded)
    const totalSales = charges.data
      .filter(c => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0) / 100; // convert cents → currency

    // 🔹 Calculate total refunded amount
    const totalRefunds = charges.data
      .filter(c => c.refunded)
      .reduce((sum, c) => sum + c.amount_refunded, 0) / 100;

    // 🔹 Count unique customers
    const customersCount = new Set(
      charges.data
        .map(c => c.customer) // extract customer IDs
        .filter(Boolean)      // remove null values
    ).size;

    // Return analytics summary
    res.status(200).json({ 
      totalSales, 
      totalRefunds, 
      customersCount 
    });

  } catch (err) {
    console.error("Stripe API error:", err);

    // Fallback if Stripe request fails
    res.status(500).json({ 
      message: "Failed to fetch Stripe data" 
    });
  }
}
