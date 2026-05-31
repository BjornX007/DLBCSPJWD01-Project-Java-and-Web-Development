import { signIn } from "next-auth/react";

export default function LoginScreen() {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image Behind Content */}
      <img
        src="/img/login-bg.jpeg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <h1 className="text-4xl font-bold text-white mb-16">
        Admin Log In
      </h1>

      <div className="bg-white p-15 rounded-xl shadow-xl text-center max-w-sm w-full space-y-11">
        <h2 className="text-xl font-semibold text-gray-800">Welcome Back 👋</h2>
        <p className="text-gray-600">Please sign in to continue</p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
