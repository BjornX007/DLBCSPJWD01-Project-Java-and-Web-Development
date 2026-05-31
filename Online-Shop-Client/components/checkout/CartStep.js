// components/checkout/CartStep.js

/**
 * CartStep Component
 * --------------------------------------------------
 * Purpose:
 * - Displays all items currently in the shopping cart
 * - Shows an order summary including subtotal, shipping, and total
 * - Allows the user to proceed to the next checkout step (shipping)
 *
 * This component is used during the checkout process.
 * It receives cart data and pricing values as props
 * instead of managing state locally.
 */

import Link from "next/link"

/**
 * @param {Array} cart - List of products added to the cart
 * @param {number} subtotal - Total price of all cart items before shipping
 * @param {number} shipping - Shipping cost (can be 0 for free shipping)
 * @param {number} total - Final order total (subtotal + shipping)
 * @param {function} onNext - Callback function to move to the next checkout step
 */
export default function CartStep({ cart, subtotal, shipping, total, onNext }) {
  return (
    <div>
      {/* Section Title */}
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

      {/* If the cart is empty, show an empty state message */}
      {cart.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            Your cart is empty.
          </p>

          {/* Link back to homepage so user can continue shopping */}
          <Link
            href="/"
            className="text-blue-600 hover:underline font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ================= CART ITEMS ================= */}
          <div className="divide-y border rounded-xl overflow-hidden">
            {cart.map((item) => {
              /**
               * Determine item price:
               * - Use salePrice if available
               * - Otherwise fall back to regular price
               * - Default to 0 to avoid errors
               */
              const price = item?.salePrice ?? item?.price ?? 0

              /**
               * Calculate line total for each product
               * (price * quantity)
               */
              const lineTotal = price * (item?.quantity ?? 1)

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item?.images?.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Fallback text if no image exists
                      <span className="text-gray-400 text-sm">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Line Total Price */}
                  <div className="font-semibold">
                    €{lineTotal.toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping Cost */}
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "Free"
                  : `€${shipping.toFixed(2)}`}
              </span>
            </div>

            {/* Final Total */}
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* ================= ACTION BUTTON ================= */}
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Proceed to Shipping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
