// components/checkout/PaymentStep.js
import { useState, useEffect } from "react";
import { getStripe } from "@/lib/stripe";
import { useRouter } from "next/router";

export default function PaymentStep({
  setStep,
  setOrderId,
  cart,
  shippingForm,
  totals,
  paymentMethod = "card",
  clearCart,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper: minimal client-side validation (adjust fields you require)
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

  // Create order on your server with payment.status "pending"
  const createOrder = async () => {
    if (!validateShipping(shippingForm)) {
      throw new Error("Please complete shipping details before continuing.");
    }

    const payload = {
      cart,
      shipping: shippingForm,
      totals,
      paymentMethod: "card",
      // optional: you can send paymentStatus but backend will default to pending for card
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

    // store so it survives redirect
    sessionStorage.setItem("latestOrderId", data.orderId);
    return data.orderId;
  };

  // Start Stripe checkout: first create order (pending), then session
  const handleCardCheckout = async () => {
    setLoading(true);
    try {
      // 1) Create DB order (pending)
      const orderId = await createOrder();
      setOrderId(orderId);

      // 2) Create Stripe session (include orderId in metadata)
      const stripe = await getStripe();
      if (!stripe) {
        alert("Stripe is not configured.");
        return;
      }

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

      // Redirect to Stripe checkout
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.error("❌ Payment start failed:", err);
      alert(err.message || "Payment failed to start.");
    } finally {
      setLoading(false);
    }
  };

  // After Stripe redirects back, mark the pending order as paid (if created)
  useEffect(() => {
    const { session_id } = router.query;
    if (!session_id) return;

    const finalize = async () => {
      try {
        // Prefer the orderId saved before redirect
        const orderId = sessionStorage.getItem("latestOrderId");
        if (!orderId) {
          console.warn("No orderId in sessionStorage — cannot update order to paid.");
          // optionally: you could attempt to verify session server-side and match metadata
          setStep(4);
          return;
        }

        // Call update endpoint to mark paid
        const res = await fetch("/api/orders/updatePayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status: "paid", sessionId: session_id }),
        });

        const data = await res.json();
        if (!res.ok || !data?.success) {
          console.error("Failed to mark order paid:", data);
          // still continue to confirmation view but inform admin later
        }

        // Clean up and finalize UI
        sessionStorage.removeItem("latestOrderId");
        clearCart?.();
        setStep(4);
        setOrderId(orderId);
      } catch (err) {
        console.error("❌ Failed to finalize order after Stripe:", err);
        // proceed to confirmation to avoid blocking user
        clearCart?.();
        setStep(4);
      }
    };

    finalize();
  }, [router.query.session_id, clearCart, setStep, setOrderId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment</h2>
      <p className="text-gray-700">Enter your card details to complete payment via Stripe.</p>

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
