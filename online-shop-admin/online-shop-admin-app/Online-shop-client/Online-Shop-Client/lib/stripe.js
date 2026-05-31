import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error(
        "⚠️ Stripe publishable key is missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local"
      );
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
