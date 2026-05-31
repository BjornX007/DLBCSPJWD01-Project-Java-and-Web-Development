// LoadingScreen Component
// Displays a minimal full-screen loading state while authentication
// or page data is being fetched. This prevents UI flicker and provides
// feedback to the user during async operations.

export default function LoadingScreen() {
  return (
    // Centered loading text inside a full-height container
    <div className="h-screen flex items-center justify-center text-gray-600">
      Loading...
    </div>
  );
}
