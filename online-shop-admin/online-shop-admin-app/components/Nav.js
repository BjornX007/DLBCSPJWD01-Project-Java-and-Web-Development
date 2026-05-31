/**
 * Purpose:
 * This Nav component provides the main sidebar navigation for the admin
 * dashboard. It supports both desktop and mobile layouts, including a
 * collapsible slide-in sidebar for smaller screens. The component also handles
 * session-based rendering, showing user account details and logout controls
 * only when an authenticated user is present. It serves as the central
 * navigation hub for accessing dashboard pages such as products, orders, and
 * settings.
 */

// React state hook — used to control sidebar open/close state
import { useState } from "react";

// Session hook + logout action from NextAuth
import { useSession, signOut } from "next-auth/react";

// Next.js components for navigation + routing
import Link from "next/link";
import { useRouter } from "next/router";

// Icons from lucide-react library
import {
  Menu,
  X,
  LayoutDashboard,
  Box,
  Layers,
  Settings,
} from "lucide-react";

export default function Nav() {
  // Get active user session from NextAuth (if logged in)
  const { data: session } = useSession();

  // Controls whether mobile sidebar is open
  const [isOpen, setIsOpen] = useState(false);

  // Router used to detect current active page
  const router = useRouter();

  // Toggles sidebar visibility
  const toggleMenu = () => setIsOpen(!isOpen);

  // Closes sidebar (used when selecting a link)
  const closeMenu = () => setIsOpen(false);

  // Sidebar navigation link configuration
  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Products", icon: Box },
    { href: "/orders", label: "Orders", icon: Layers },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* ─────────────────────────────
          MOBILE TOP NAV BAR (visible only on small screens)
      ───────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center px-4">
        {/* Hamburger button */}
        <button
          onClick={toggleMenu}
          className="text-gray-800 p-2"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* App title */}
        <h1 className="ml-4 text-lg font-bold text-blue-600">ShopAdmin</h1>
      </div>

      {/* ─────────────────────────────
          SIDEBAR — Mobile & Desktop
      ───────────────────────────── */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 bg-white
          text-gray-800 transition-transform duration-300
          flex flex-col justify-between overflow-y-auto

          /* Slide-in / slide-out on mobile */
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          /* Set width sizes */
          w-3/4 max-w-xs lg:w-64

          /* Desktop: always visible */
          lg:translate-x-0 lg:shadow-lg
        `}
      >
        <div className="p-6 pt-8 space-y-4 relative">
          {/* Close button (mobile view only) */}
          <button
            className="lg:hidden absolute top-4 right-4 text-gray-600"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          {/* Desktop logo */}
          <h1 className="text-2xl font-bold text-blue-600 hidden lg:block">
            ShopAdmin
          </h1>

          {/* ─────────────────────────────
              NAVIGATION LINKS
          ───────────────────────────── */}
          <nav className="flex flex-col space-y-2 font-medium">
            {navLinks.map(({ href, label, icon: Icon }) => {
              // Determine whether current link is the active page
              const isActive = router.pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded px-3 py-2 transition-colors
                    ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 hover:text-blue-700 text-gray-800"
                    }
                  `}
                >
                  {/* Icon rendered dynamically */}
                  <Icon size={20} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ─────────────────────────────
            SIDEBAR FOOTER — shows only when logged in
        ───────────────────────────── */}
        {session && (
          <div className="p-6 text-sm text-gray-600 border-t border-gray-200">
            {/* Display signed-in user email */}
            <p className="mb-2">
              Signed in as <br />
              <strong>{session.user.email}</strong>
            </p>

            {/* Logout button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Sign out
            </button>

            {/* Static app version label */}
            <p className="mt-4 text-xs text-gray-500">Version 1.0.0</p>
          </div>
        )}
      </div>
    </>
  );
}
