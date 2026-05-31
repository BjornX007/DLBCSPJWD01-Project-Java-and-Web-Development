export default function Stepper({ step }) {
  const steps = ['Cart', 'Shipping', 'Payment', 'Review']

  return (
    <div className="mb-6 sm:mb-8 overflow-x-auto">
      <ol className="flex items-center min-w-full p-3 sm:p-6 gap-4 sm:gap-6 bg-white rounded-xl shadow-sm">
        {steps.map((label, idx) => {
          const current = idx === step
          const done = idx < step
          return (
            <li key={label} className="flex items-center flex-1 min-w-fit">
              {idx !== 0 && (
                <span className={`h-0.5 flex-1 mx-2 ${done ? 'bg-black' : 'bg-gray-300'}`} />
              )}
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${done ? 'bg-black text-white' : current ? 'border-2 border-black text-black' : 'bg-gray-200 text-gray-600'}`}
                >
                  {idx + 1}
                </span>
                <span className={`text-xs sm:text-sm ${current ? 'font-semibold' : 'text-gray-600'}`}>
                  {label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
