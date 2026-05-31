// components/checkout/ShippingStep.js
export default function ShippingStep({ form, setForm, onNext, onBack }) {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="address1"
        placeholder="Address"
        value={form.address1}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="address2"
        placeholder="Address 2 (optional)"
        value={form.address2}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="postalCode"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border rounded-lg"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  )
}
