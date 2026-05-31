// components/checkout/CartStep.js
import Link from "next/link"

export default function CartStep({ cart, subtotal, shipping, total, onNext }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cart Items */}
          <div className="divide-y border rounded-xl overflow-hidden">
            {cart.map((item) => {
              const price = item?.salePrice ?? item?.price ?? 0
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
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Line Total */}
                  <div className="font-semibold">
                    €{lineTotal.toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
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
