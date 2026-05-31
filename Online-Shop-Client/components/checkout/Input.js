/**
 * Input Component
 * --------------------------------------------------
 * Purpose:
 * - Provides a reusable input field with a label
 * - Handles user input and passes changes back to the parent component
 * - Supports different input types (text, email, password, etc.)
 * - Displays a required indicator (*) when needed
 *
 * This component helps keep forms clean and consistent
 * across the application.
 */

/**
 * @param {string} label - Text displayed above the input field
 * @param {string} value - Current value of the input
 * @param {function} onChange - Function called when the input value changes
 * @param {string} name - Name of the input field (used for forms)
 * @param {string} className - Optional additional CSS classes
 * @param {string} type - HTML input type (default is "text")
 * @param {boolean} required - Determines whether the field is mandatory
 */
export default function Input({
  label,
  value,
  onChange,
  name,
  className = '',
  type = 'text',
  required = false
}) {
  return (
    <label className={`block ${className}`}>
      {/* Input label text */}
      <span className="text-sm text-gray-700">
        {label}

        {/* Show red asterisk if field is required */}
        {required && (
          <span className="text-red-500"> *</span>
        )}
      </span>

      {/* Reusable input element */}
      <input
        type={type}
        value={value}
        required={required}

        // Send only the input value back to the parent component
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
      />
    </label>
  )
}
