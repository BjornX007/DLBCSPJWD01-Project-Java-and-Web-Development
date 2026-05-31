export default function Input({ label, value, onChange, name, className = '', type = 'text', required = false }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-gray-700">{label}{required && <span className="text-red-500">*</span>}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
      />
    </label>
  )
}
