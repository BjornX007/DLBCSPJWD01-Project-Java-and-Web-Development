export default function Confirmation({ orderId, email }) {
  return (
    <div className="text-center  p-6 rounded-3xl shadow-sm bg-gray-300 text-black">
      <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
      <p>Your order has been placed successfully.</p>
      {orderId && <p className="mt-2">Order ID: {orderId}</p>}
      {email && <p className="mt-2">A confirmation was sent to {email}</p>}
      <button className="mt-6 px-6 py-2 bg-black text-white rounded-2xl hover:bg-gray-800" onClick={() => window.location.href = '/'}>
        Continue Shopping
      </button>
    </div>
  )
}
