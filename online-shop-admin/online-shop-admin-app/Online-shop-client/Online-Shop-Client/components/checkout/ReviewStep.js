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
      <h2 className="text-xl font-semibold mb-4">Review Order</h2>
      {/* TODO: render summary of cart + shipping */}
      <p>Payment Method: {paymentMethod}</p>
      <p>Total: €{total.toFixed(2)}</p>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 border rounded-lg"
        >
          Back
        </button>
        <button
          onClick={placeOrder}
          disabled={busy}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          {busy ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
