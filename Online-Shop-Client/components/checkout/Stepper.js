/**
 * Stepper Component
 * --------------------------------------------------
 * Purpose:
 * - Visually displays the progress of the checkout process
 * - Highlights the current step
 * - Marks completed steps as finished
 * - Helps users understand where they are in the checkout flow
 *
 * This component improves user experience by
 * providing clear navigation feedback.
 */

/**
 * @param {number} step - Index of the current checkout step
 * (0 = Cart, 1 = Shipping, 2 = Payment, 3 = Review)
 */
export default function Stepper({ step }) {

  // Labels for each checkout step
  const steps = ['Cart', 'Shipping', 'Payment', 'Review']

  return (
    <div className="mb-6 sm:mb-8 overflow-x-auto">
      {/* Stepper container */}
      <ol className="flex items-center min-w-full p-3 sm:p-6 gap-4 sm:gap-6 bg-white rounded-xl shadow-sm">
        {steps.map((label, idx) => {

          // Determine step state
          const current = idx === step      // Active step
          const done = idx < step            // Completed steps

          return (
            <li key={label} className="flex items-center flex-1 min-w-fit">
              {/* Connector line between steps */}
              {idx !== 0 && (
                <span
                  className={`h-0.5 flex-1 mx-2 ${
                    done ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Step number and label */}
              <div className="flex items-center gap-2 whitespace-nowrap">
                {/* Step circle */}
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${
                      done
                        ? 'bg-black text-white'          // Completed
                        : current
                        ? 'border-2 border-black text-black' // Current
                        : 'bg-gray-200 text-gray-600'     // Upcoming
                    }`}
                >
                  {idx + 1}
                </span>

                {/* Step label */}
                <span
                  className={`text-xs sm:text-sm ${
                    current ? 'font-semibold' : 'text-gray-600'
                  }`}
                >
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
