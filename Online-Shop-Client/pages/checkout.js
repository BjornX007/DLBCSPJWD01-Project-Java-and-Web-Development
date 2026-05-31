/**
 * Checkout Page
 * =============
 * Handles the full checkout flow:
 * - Cart review
 * - Shipping details
 * - Payment
 * - Order review
 * - Confirmation
 *
 * Uses a step-based flow with support for:
 * - Stripe payments (redirect-based)
 * - Cash on Delivery (COD)
 */

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";

// Checkout UI components
import Stepper from "@/components/checkout/Stepper";
import CartStep from "@/components/checkout/CartStep";
import ShippingStep from "@/components/checkout/ShippingStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import Confirmation from "@/components/checkout/Confirmation";

/**
 * Checkout step mapping
 * ---------------------
 * Used to control which component is rendered
 */
const STEPS = {
  CART: 0,
  SHIPPING: 1,
  PAYMENT: 2,
  REVIEW: 3,
  CONFIRM: 4,
};

export default function CheckoutPage() {
  /**
   * Router
   * ------
   * Used for detecting Stripe redirect params
   */
  const router = useRouter();

  /**
   * Cart Context
   * ------------
   * cart      → current cart items
   * clearCart → empties cart after successful order
   */
  const { cart, clearCart } = useCart();

  // Fallback safety in case clearCart is undefined
  const safeClearCart = clearCart || (() => {});

  /**
   * PRICE CALCULATIONS
   * ------------------
   * useMemo is used to avoid unnecessary recalculations
   */

  // Subtotal (uses sale price when available)
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, i) =>
          sum + (i?.salePrice ?? i?.price ?? 0) * (i?.quantity ?? 1),
        0
      ),
    [cart]
  );

  // Shipping rule:
  // - Free over €100
  // - €6.90 otherwise
  // - €0 if cart is empty
  const shipping = useMemo(
    () => (subtotal > 100 ? 0 : subtotal === 0 ? 0 : 6.9),
    [subtotal]
  );

  // Final total
  const total = useMemo(
    () => +(subtotal + shipping).toFixed(2),
    [subtotal, shipping]
  );

  /**
   * STATE
   * -----
   */
  const [step, setStep] = useState(STEPS.CART);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  /**
   * Shipping form state
   */
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "Germany",
  });

  /**
   * Payment method
   * --------------
   * Default: card
   */
  const [paymentMethod, setPaymentMethod] = useState("card");

  /**
   * STRIPE REDIRECT HANDLER
   * ----------------------
   * After successful Stripe payment:
   * - Stripe redirects back with session_id
   * - We update the existing order as "paid"
   * - Cart is cleared
   */
  useEffect(() => {
    const { session_id } = router.query;
    if (!session_id) return;

    const finalize = async () => {
      try {
        // Retrieve stored order ID
        const savedOrderId = sessionStorage.getItem("latestOrderId");
        if (!savedOrderId) {
          console.warn("No orderId found after redirect");
          setStep(STEPS.CONFIRM);
          return;
        }

        // Update payment status instead of creating a new order
        const res = await fetch("/api/orders/updatePayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: savedOrderId,
            status: "paid",
            sessionId: session_id,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Could not update order");
        }

        setOrderId(savedOrderId);
        setStep(STEPS.CONFIRM);
        safeClearCart();
        sessionStorage.removeItem("latestOrderId");
      } catch (err) {
        console.error("❌ Failed to finalize Stripe order:", err);
        setError(err.message || "Order finalization failed");
      }
    };

    finalize();
  }, [router.query.session_id]);

  /**
   * PLACE ORDER (COD or non-Stripe)
   * -------------------------------
   * Creates order immediately without redirect
   */
  const placeOrder = async () => {
    setBusy(true);
    setError("");

    try {
      const payload = {
        cart,
        shipping: shippingForm,
        totals: { subtotal, shipping, total, currency: "EUR" },
        paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Order failed");
      }

      setOrderId(data.orderId);
      setStep(STEPS.CONFIRM);
      safeClearCart();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl pt-32 sm:pt-36 p-4 sm:p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4 mt-0 sm:mb-6">Checkout</h1>

      {/* Stepper (hidden on confirmation) */}
      {step !== STEPS.CONFIRM && (
        <div className="sticky top-20 sm:top-24 bg-white z-30 pb-4">
          <Stepper step={step} />
        </div>
      )}

      {/* CART STEP */}
      {step === STEPS.CART && (
        <CartStep
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onNext={() => setStep(STEPS.SHIPPING)}
        />
      )}

      {/* SHIPPING STEP */}
      {step === STEPS.SHIPPING && (
        <ShippingStep
          form={shippingForm}
          setForm={setShippingForm}
          onNext={() => setStep(STEPS.PAYMENT)}
          onBack={() => setStep(STEPS.CART)}
        />
      )}

      {/* PAYMENT STEP */}
      {step === STEPS.PAYMENT && (
        <PaymentStep
          setStep={setStep}
          setOrderId={setOrderId}
          cart={cart}
          shippingForm={shippingForm}
          totals={{ subtotal, shipping, total, currency: "EUR" }}
          paymentMethod={paymentMethod}
          clearCart={safeClearCart}
          method={paymentMethod}
          setMethod={setPaymentMethod}
          onBack={() => setStep(STEPS.SHIPPING)}
        />
      )}

      {/* REVIEW STEP */}
      {step === STEPS.REVIEW && (
        <ReviewStep
          cart={cart}
          shippingForm={shippingForm}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          paymentMethod={paymentMethod}
          placeOrder={placeOrder}
          busy={busy}
          error={error}
          onBack={() => setStep(STEPS.PAYMENT)}
        />
      )}

      {/* CONFIRMATION */}
      {step === STEPS.CONFIRM && (
        <Confirmation orderId={orderId} email={shippingForm.email} />
      )}
    </div>
  );
}
