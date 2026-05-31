// components/checkout/PaymentStep.js

/**
 * PaymentStep Component
 * --------------------------------------------------
 * Purpose:
 * - Handles the payment step of the checkout process
 * - Creates an order in the database with a "pending" payment status
 * - Starts a Stripe Checkout session for card payments
 * - Finalizes the order after Stripe redirects the user back
 * - Clears the cart and moves the user to the confirmation step
 *
 * This component is responsible for integrating Stripe
 * and ensuring the order lifecycle is handled correctly.
 */

import { useState, useEffect } from "react";
import { getStripe } from "@/lib/stripe";
import { useRouter } from "next/router";

/**
 * @param {function} setStep - Updates the current checkout step
 * @param {function} setOrderId - Stores the created order ID
 * @param {Array} cart - List of cart items being purchased
 * @param {Object} shippingForm - Shipping information entered by the user
 * @param {Object} totals - Pricing totals (subtotal, shipping, total)
 * @param {string} paymentMethod - Selected payment method (default: "card")
 * @param {function} clearCart - Clears cart after successful checkout
 */
export default function PaymentStep({
  setStep,
  setOrderId,
  cart,
  shippingForm,
  totals,
  paymentMethod = "card",
  clearCart,
}) {
  // Indicates whether payment process is currently loading
  const [loading, setLoading] = useState(false);

  // Used to read query parameters after Stripe redirect
  const router = useRouter();

  /**
   * Minimal client-side validation for shipping details
   * Ensures required fields are filled before creating an order
   */
  const validateShipping = (s) => {
    if (!s) return false;
    if (!s.firstName?.trim()) return false;
    if (!s.lastName?.trim()) return false;
    if (!s.email?.trim()) return false;
    if (!s.address1?.trim()) return false;
    if (!s.city?.trim()) return false;
    if (!s.postalCode?.trim()) return false;
    return true;
  };

  /**
   * Creates an order on the server with payment status "pending"
   * This is done BEFORE redirecting to Stripe Checkout
   */
  const createOrder = async () => {
    if (!validateShipping(shippingForm)) {
      throw new Error("Please complete shipping details before continuing.");
    }

    // Data sent to backend API
    const payload = {
      cart,
      shipping: shippingForm,
      totals,
      paymentMethod: "card",
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Failed to create order");
    }

    // Save order ID so it persists through Stripe redirect
    sessionStorage.setItem("latestOrderId", data.orderId);

    return data.orderId;
  };

  /**
   * Handles card payment flow using Stripe Checkout
   * 1. Create order in database (pending)
   * 2. Create Stripe checkout session
   * 3. Redirect user to Stripe
   */
  const handleCardCheckout = async () => {
    setLoading(true);

    try {
      // Step 1: Create order
      const orderId = await createOrder();
      setOrderId(orderId);

      // Step 2: Load Stripe
      const stripe = await getStripe();
      if (!stripe) {
        alert("Stripe is not configured.");
        return;
      }

      // Step 3: Create Stripe checkout session
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, orderId }),
      });

      const session = await res.json();

      if (!res.ok || !session?.id) {
        console.error("Stripe session error:", session);
        throw new Error("Could not start checkout session.");
      }

      // Step 4: Redirect user to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.error("❌ Payment start failed:", err);
      alert(err.message || "Payment failed to start.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * After Stripe redirects back to the site:
   * - Mark the order as paid in the database
   * - Clear cart
   * - Move user to confirmation step
   */
  useEffect(() => {
    const { session_id } = router.query;
    if (!session_id) return;

    const finalize = async () => {
      try {
        // Retrieve stored order ID
        const orderId = sessionStorage.getItem("latestOrderId");

        if (!orderId) {
          console.warn("No orderId found in sessionStorage.");
          setStep(4);
          return;
        }

        // Update order payment status to "paid"
        const res = await fetch("/api/orders/updatePayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            status: "paid",
            sessionId: session_id,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
          console.error("Failed to mark order as paid:", data);
        }

        // Cleanup and finalize checkout
        sessionStorage.removeItem("latestOrderId");
        clearCart?.();
        setOrderId(orderId);
        setStep(4);
      } catch (err) {
        console.error("❌ Order finalization failed:", err);
        clearCart?.();
        setStep(4);
      }
    };

    finalize();
  }, [router.query.session_id, clearCart, setStep, setOrderId]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold">Payment</h2>

      {/* Instructions */}
      <p className="text-gray-700">
        Enter your card details to complete payment via Stripe.
      </p>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="px-6 py-3 border rounded-lg hover:bg-gray-100 transition"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleCardCheckout}
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Redirecting..." : "Pay with Card"}
        </button>
      </div>
    </div>
  );
}
