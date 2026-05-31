import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";

import Stepper from "@/components/checkout/Stepper";
import CartStep from "@/components/checkout/CartStep";
import ShippingStep from "@/components/checkout/ShippingStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import Confirmation from "@/components/checkout/Confirmation";

const STEPS = {
  CART: 0,
  SHIPPING: 1,
  PAYMENT: 2,
  REVIEW: 3,
  CONFIRM: 4,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const safeClearCart = clearCart || (() => {});

  // totals
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, i) =>
          sum + (i?.salePrice ?? i?.price ?? 0) * (i?.quantity ?? 1),
        0
      ),
    [cart]
  );
  const shipping = useMemo(
    () => (subtotal > 100 ? 0 : subtotal === 0 ? 0 : 6.9),
    [subtotal]
  );
  const total = useMemo(
    () => +(subtotal + shipping).toFixed(2),
    [subtotal, shipping]
  );

  // state
  const [step, setStep] = useState(STEPS.CART);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
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
  const [paymentMethod, setPaymentMethod] = useState("card"); // default card

  // ✅ After Stripe redirect: mark pending order as paid instead of re-saving
  useEffect(() => {
    const { session_id } = router.query;
    if (!session_id) return;

    const finalize = async () => {
      try {
        const savedOrderId = sessionStorage.getItem("latestOrderId");
        if (!savedOrderId) {
          console.warn("No orderId found after redirect");
          setStep(STEPS.CONFIRM);
          return;
        }

        const res = await fetch("/api/orders/updatePayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: savedOrderId, status: "paid", sessionId: session_id }),
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

  // COD orders still created directly
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
      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Order failed");

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

      {step !== STEPS.CONFIRM && (
        <div className="sticky top-20 sm:top-24 bg-white z-30 pb-4">
          <Stepper step={step} />
        </div>
      )}

      {step === STEPS.CART && (
        <CartStep
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onNext={() => setStep(STEPS.SHIPPING)}
        />
      )}

      {step === STEPS.SHIPPING && (
        <ShippingStep
          form={shippingForm}
          setForm={setShippingForm}
          onNext={() => setStep(STEPS.PAYMENT)}
          onBack={() => setStep(STEPS.CART)}
        />
      )}

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

      {step === STEPS.CONFIRM && (
        <Confirmation orderId={orderId} email={shippingForm.email} />
      )}
    </div>
  );
}
