/**
 * Stripe Client Utility (Frontend)
 * --------------------------------------------------
 * Purpose:
 * - Loads the Stripe.js client on the frontend
 * - Ensures Stripe is initialized only once
 * - Provides a reusable Stripe instance across the app
 *
 * This file is used when redirecting users
 * to Stripe Checkout.
 */

import { loadStripe } from "@stripe/stripe-js";

// Store Stripe instance globally to prevent reloading
let stripePromise;

/**
 * getStripe
 * --------------------------------------------------
 * Returns a Stripe instance wrapped in a Promise.
 *
 * - Uses the publishable key (safe for frontend use)
 * - Loads Stripe only once (singleton pattern)
 * - Logs a warning if the key is missing
 *
 * @returns {Promise<Stripe|null>} Stripe instance or null
 */
export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    // Ensure publishable key exists
    if (!key) {
      console.error(
        "⚠️ Stripe publishable key is missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local"
      );
      return null;
    }

    // Initialize Stripe
    stripePromise = loadStripe(key);
  }

  return stripePromise;
};
