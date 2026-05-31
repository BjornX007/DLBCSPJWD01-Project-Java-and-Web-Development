// This is the main Dashboard component
export default function Dashboard({ session }) {
  return (
    // ⬇️ This is the main content wrapper
    // You can change overall background here by adding bg-* (e.g., bg-gray-100)
    <main className="flex-1 p-6 mt-14 lg:mt-0 lg:ml-64 bg-gray-100">

      {/* ⬇️ Dashboard title */}
      {/* Change text size with text-*, color with text-*, spacing with mb-* or mt-* */}
      <h2 className="text-2xl font-semibold text-primary">Dashboard</h2>

      {/* ⬇️ Welcome message */}
      {/* Same here: tweak text color, spacing, or font */}
      <p className="mt-2 text-gray-600">
        Welcome back, <b>{session.user.name}</b>
      </p>

      {/* ⬇️ Tailwind test box */}
      {/* Change bg color (e.g., bg-blue-500), text color, padding, border, etc. */}
      <div className="bg-green-500 text-white p-4 rounded mt-4">
        Tailwind is working!
      </div>

      {/* ⬇️ Add any testing content here, like cards, charts, etc. */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
          <p className="text-sm text-gray-600 mt-2">Placeholder for chart or data</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
          <p className="text-sm text-gray-600 mt-2">More dummy content here</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-800">User Feedback</h3>
          <p className="text-sm text-gray-600 mt-2">Test area for reviews, etc.</p>
        </div>
      </div>

    </main>
  );
}
