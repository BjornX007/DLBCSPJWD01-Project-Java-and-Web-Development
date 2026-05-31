export default function TotalsCard({ subtotal, shipping, total }) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50 mt-4">
      <div className="flex justify-between mb-2"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
      <div className="flex justify-between mb-2"><span>Shipping</span><span>€{shipping.toFixed(2)}</span></div>
      <hr className="my-2" />
      <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>€{total.toFixed(2)}</span></div>
    </div>
  )
}
