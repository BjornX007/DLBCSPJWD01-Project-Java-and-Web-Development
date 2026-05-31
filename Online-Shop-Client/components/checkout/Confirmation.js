/**
 * Confirmation Component
 * --------------------------------------------------
 * Purpose:
 * - Displays a success message after an order is placed
 * - Shows the order ID so the user can reference their purchase
 * - Confirms that a confirmation email has been sent
 * - Provides a button to return to the shop and continue shopping
 *
 * This component is shown as the final step of the checkout process.
 */

/**
 * @param {string} orderId - Unique identifier for the placed order
 * @param {string} email - Email address where the confirmation was sent
 */
export default function Confirmation({ orderId, email }) {
  return (
    <div className="text-center p-6 rounded-3xl shadow-sm bg-gray-300 text-black">
      {/* Success Heading */}
      <h2 className="text-2xl font-bold mb-4">
        Thank You!
      </h2>

      {/* General confirmation message */}
      <p>
        Your order has been placed successfully.
      </p>

      {/* Display order ID only if it exists */}
      {orderId && (
        <p className="mt-2">
          Order ID: {orderId}
        </p>
      )}

      {/* Display confirmation email only if it exists */}
      {email && (
        <p className="mt-2">
          A confirmation was sent to {email}
        </p>
      )}

      {/* Button to return user to homepage */}
      <button
        className="mt-6 px-6 py-2 bg-black text-white rounded-2xl hover:bg-gray-800"
        onClick={() => window.location.href = '/'}
      >
        Continue Shopping
      </button>
    </div>
  )
}
