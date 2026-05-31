/**
 * TotalsCard Component
 * --------------------------------------------------
 * Purpose:
 * - Displays a pricing summary for the order
 * - Shows subtotal, shipping cost, and final total
 * - Formats prices consistently for the user
 *
 * This component is reusable and can be used
 * in multiple checkout steps.
 */

/**
 * @param {number} subtotal - Total price of items before shipping
 * @param {number} shipping - Shipping cost
 * @param {number} total - Final order total (subtotal + shipping)
 */
export default function TotalsCard({ subtotal, shipping, total }) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50 mt-4">
      {/* Subtotal row */}
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping row */}
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>€{shipping.toFixed(2)}</span>
      </div>

      {/* Divider */}
      <hr className="my-2" />

      {/* Total row */}
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
