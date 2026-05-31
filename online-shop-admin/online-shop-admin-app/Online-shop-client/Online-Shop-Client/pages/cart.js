// pages/cart.js
import { useCart } from "../context/CartContext"
import { useRouter } from "next/router"

export default function CartPage() {
  const { cart, removeFromCart } = useCart()
  const router = useRouter()
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

  // ✅ calculate total
  const total = cart.reduce((sum, item) => {
    const effectivePrice = item?.salePrice ?? item?.price ?? 0
    const quantity = item?.quantity ?? 1
    return sum + effectivePrice * quantity
  }, 0)

  const goToCheckout = () => {
    router.push(`/checkout?total=${encodeURIComponent(total.toFixed(2))}`)
  }

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return "/placeholder.png"
    const img = images[0]
    return img.startsWith("http") ? img : `${BASE_URL}/${img}`
  }

  return (
    <div className="max-w-6xl mt-17 mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => {
              const effectivePrice = item?.salePrice ?? item?.price ?? 0
              const quantity = item?.quantity ?? 1
              const title = item?.title || "Unknown Product"
              const imageUrl = getImageUrl(item.images)

              return (
                <div
                  key={item.id || title}
                  className="flex gap-4 bg-white rounded-2xl shadow p-5 hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                    {item?.images?.length > 0 ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-fill cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="font-semibold text-lg">{title}</h2>
                      <p className="text-sm text-gray-500">
                        Quantity: {quantity}
                      </p>
                    </div>
                    <button
                    className="text-white bg-red-500 p-1.5 text-sm border rounded-2xl hover:bg-red-600 self-start"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center font-semibold text-gray-900">
                    €{(effectivePrice * quantity).toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Summary */}
      {cart.length > 0 && (
        <div className="lg:sticky lg:top-6 h-fit bg-orange-600 rounded-2xl shadow p-6">
          <h2 className="text-xl text-amber-100 font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between text-gray-200 mb-2">
            <span>Subtotal</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300 text-sm mb-6">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-white mb-6">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <button
            className="w-full bg-black text-white text-lg font-medium px-6 py-3 rounded-2xl hover:bg-gray-800 transition"
            onClick={goToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}
