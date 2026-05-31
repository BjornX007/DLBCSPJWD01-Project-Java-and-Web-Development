/**
 * ReviewStep Component
 * --------------------------------------------------
 * Purpose:
 * - Allows the user to review their order before placing it
 * - Displays selected payment method and final total price
 * - Shows errors if order placement fails
 * - Provides navigation to go back or confirm the order
 *
 * This is typically the final review step
 * before payment or order confirmation.
 */

/**
 * @param {Array} cart - List of items in the cart
 * @param {Object} shippingForm - User's shipping information
 * @param {number} subtotal - Cart subtotal before shipping
 * @param {number} shipping - Shipping cost
 * @param {number} total - Final order total
 * @param {string} paymentMethod - Selected payment method
 * @param {function} placeOrder - Function that submits the order
 * @param {boolean} busy - Indicates whether the order is being processed
 * @param {string} error - Error message to display if order fails
 * @param {function} setStep - Updates the current checkout step
 */
export default function ReviewStep({
  cart,
  shippingForm,
  subtotal,
  shipping,
  total,
  paymentMethod,
  placeOrder,
  busy,
  error,
  setStep,
}) {
  return (
    <div>
      {/* Section title */}
      <h2 className="text-xl font-semibold mb-4">
        Review Order
      </h2>

      {/* Order summary (can be expanded later) */}
      {/* TODO: Render full cart and shipping summary */}
      <p>
        Payment Method: {paymentMethod}
      </p>

      <p>
        Total: €{total.toFixed(2)}
      </p>

      {/* Display error message if one exists */}
      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 mt-6">
        {/* Go back to previous checkout step */}
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 border rounded-lg"
        >
          Back
        </button>

        {/* Submit order */}
        <button
          onClick={placeOrder}
          disabled={busy}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          {busy ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  )
}
