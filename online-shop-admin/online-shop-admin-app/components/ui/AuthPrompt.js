// Import the Next-Auth signIn method.
// This is used to trigger the authentication flow with a chosen provider.
import { signIn } from "next-auth/react";

export default function AuthPrompt() {
  return (
    // Full-screen centered container shown when user is not authenticated
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-sm space-y-4">

        {/* Page heading displayed above login button */}
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h1>

        {/* Short explanatory message */}
        <p className="text-gray-600">
          Please sign in to access your dashboard.
        </p>

        {/* Authentication button:
            When clicked, it starts the Google OAuth sign-in process */}
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
