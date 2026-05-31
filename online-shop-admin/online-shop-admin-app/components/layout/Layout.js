/**
 * Purpose:
 * This Layout component provides the core structural wrapper for the admin
 * dashboard. It manages authentication and role-based access control using
 * Next-Auth, ensuring only authenticated admin users can access dashboard
 * pages. The component also controls the responsive sidebar navigation
 * behavior across desktop and mobile screens and prevents layout rendering
 * during redirects or session-loading states to provide a secure and stable
 * user experience.
 */

// React state hook used to control the sidebar toggle state
import { useState, useEffect } from "react";

// Sidebar navigation component shared across the admin dashboard
import Nav from "../Nav";

// Next-Auth hook for session state
import { useSession } from "next-auth/react";

// Icon used for the mobile hamburger toggle button
import { Menu } from "lucide-react";

// Next.js router used for redirecting to /LoginScreen
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Controls whether the sidebar is visible on mobile devices
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect users who are NOT logged in
  useEffect(() => {
    // Wait until session state is resolved
    if (status === "unauthenticated") {
      router.push("/LoginScreen");
    }
  }, [status, router]);

  // While Next-Auth is resolving session state,
  // show a loading screen to avoid layout flashing
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // Prevent layout rendering during redirect
  if (status === "unauthenticated") {
    return null;
  }

  // Role-based access control — only admin allowed
  if (session?.user?.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50 text-red-600 font-medium">
        🔒 Access Denied — Admins only
      </div>
    );
  }

  // Main admin layout (only visible for authenticated admins)
  return (
    <div className="min-h-screen bg-neutral-100 flex text-gray-900">
      <Nav
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header bar */}
        <div className="lg:hidden fixed top-0 left-0 w-full z-40 bg-white shadow-md p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <span className="font-semibold text-lg text-blue-600">
            MyApp
          </span>
        </div>

        {/* Main page content */}
        <main className="p-6 pt-20 lg:pt-6 lg:ml-64 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
