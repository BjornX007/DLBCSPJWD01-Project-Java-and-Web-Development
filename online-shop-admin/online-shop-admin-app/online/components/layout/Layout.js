import { useState, useEffect } from "react";
import Nav from "../Nav";
import { useSession, signIn } from "next-auth/react";
import { Menu } from "lucide-react";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome Back 👋
          </h1>
          <p className="text-gray-600">
            Please sign in to access your dashboard.
          </p>
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

  if (!session || session.user.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50 text-red-600 font-medium">
        🔒 Access Denied – Admins only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex text-gray-900">
      {/* Sidebar */}
      <Nav
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden fixed top-0 left-0 w-full z-40 bg-white shadow-md p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <span className="font-semibold text-lg text-blue-600">MyApp</span>
        </div>

        {/* Main content */}
        <main className="p-6 pt-20 lg:pt-6 lg:ml-64 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
