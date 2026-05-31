// components/checkout/ShippingStep.js

/**
 * ShippingStep Component
 * --------------------------------------------------
 * Purpose:
 * - Collects the user's shipping and contact information
 * - Updates the shipping form state as the user types
 * - Allows navigation between checkout steps
 *
 * This component represents the shipping details
 * step in the checkout process.
 */

/**
 * @param {Object} form - Current shipping form values
 * @param {function} setForm - Updates the shipping form state
 * @param {function} onNext - Moves to the next checkout step
 * @param {function} onBack - Returns to the previous checkout step
 */
export default function ShippingStep({ form, setForm, onNext, onBack }) {

  /**
   * Handles changes for all input fields
   * Uses the input "name" attribute to update the correct field
   */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form className="space-y-4">
      {/* Section title */}
      <h2 className="text-2xl font-bold mb-4">
        Shipping Details
      </h2>

      {/* Name fields */}
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

      {/* Contact information */}
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

      {/* Address fields */}
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

      {/* City, postal code, and country */}
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

      {/* Navigation buttons */}
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
