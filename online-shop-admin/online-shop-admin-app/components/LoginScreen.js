/**
 * Purpose:
 * This LoginScreen component provides the authentication entry point for the
 * admin dashboard. It presents a simple login interface with a Google sign-in
 * button powered by Next-Auth. The page visually separates the public login
 * area from the protected admin environment and ensures that only authenticated
 * users can proceed into the dashboard.
 */

// Import Next-Auth sign-in function (used to trigger Google login)
import { signIn } from "next-auth/react";

export default function LoginScreen() {
  return (
    // Parent wrapper — creates a stacking context + centers content on screen
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background image (fills entire screen & stays behind content) */}
      <img
        src="/img/login-bg.jpeg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Page title overlayed above background */}
      <h1 className="text-4xl font-bold text-white mb-16 z-10">
        Admin Log In
      </h1>

      {/* Login box container */}
      <div className="bg-white p-15 rounded-xl shadow-xl text-center max-w-sm w-full space-y-11 z-10">
        
        {/* Greeting header */}
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome Back
        </h2>

        {/* Sub-text instruction */}
        <p className="text-gray-600">
          Please sign in to continue
        </p>

        {/* Google sign-in button */}
        <button
          // Calls Next-Auth Google provider popup
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
