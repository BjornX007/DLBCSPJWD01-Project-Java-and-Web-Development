// A reusable confirmation modal component
// — Appears when `show` is true
// — Displays a message
// — Runs onConfirm() when user confirms
// — Runs onClose() when user cancels or after confirm

export default function ConfirmModal({ show, message, onConfirm, onClose }) {

  // If `show` is false → don't render anything
  if (!show) return null;

  return (
    // Fixed positioned container — top-right corner
    <div className="fixed top-7 right-6 z-50 animate-slide-in">
      
      {/* Modal box */}
      <div className="bg-red-600 text-white p-4 rounded-xl shadow-lg w-80">

        {/* Message text */}
        <h1 className="text-m">{message}</h1>

        {/* Buttons row */}
        <div className="mt-3 flex justify-end gap-2">

          {/* Cancel button — closes modal only */}
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white text-black rounded hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>

          {/* Confirm button
              1) run confirm callback
              2) then close modal */}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1 bg-red-800 text-white rounded hover:bg-red-900 text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
