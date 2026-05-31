import { useCart } from "../context/CartContext";
import { useEffect } from "react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CartPage from "@/pages/cart";
export default function CartDrawer() {
  const { cart, openDrawer, setOpenDrawer, subtotal, shipping, total } = useCart();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Auto-close after 2s
  useEffect(() => {
    if (!openDrawer) return;
    const timer = setTimeout(() => setOpenDrawer(false), 2000);
    return () => clearTimeout(timer);
  }, [openDrawer, setOpenDrawer]);

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return "/placeholder.png";
    const img = images[0];
    return img.startsWith("http") ? img : `${BASE_URL}/${img}`;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
          openDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenDrawer(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-4 right-0 h- w-full max-w-sm bg-white z-50 shadow-lg transition-transform duration-300 rounded-l-2xl ease-in-out ${
          openDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            aria-label="Close cart"
            onClick={() => setOpenDrawer(false)}
            className="p-1"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[65vh]">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            cart.map((item) => {
              const imageUrl = getImageUrl(item.images);
              return (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold">
                      €{((item.salePrice ?? item.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">€{subtotal.toFixed(2)}</span>
            </div>
          
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-bold">€{total.toFixed(2)}</span>
            </div>

            <Link href="/cart">
              <button
                onClick={() => setOpenDrawer(false)}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Go to Cart
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
