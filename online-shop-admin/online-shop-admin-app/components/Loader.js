// This component displays a full-screen loading screen.
// It is useful while waiting for data, routes, or async operations.

export default function Loader() {
  return (
    // Full-height container centered both vertically and horizontally
    <div className="h-screen flex items-center justify-center text-gray-600">
      {/* The visible loading text */}
      Loading...
    </div>
  );
}
