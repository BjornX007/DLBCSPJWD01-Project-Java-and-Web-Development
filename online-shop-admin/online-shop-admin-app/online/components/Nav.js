import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  X,
  LayoutDashboard,
  Box,
  Layers,
  Settings,
} from "lucide-react";

export default function Nav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Products", icon: Box },
    { href: "/orders", label: "Orders", icon: Layers },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center px-4">
        <button
          onClick={toggleMenu}
          className="text-gray-800 p-2"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-lg font-bold text-blue-600">ShopAdmin</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 bg-white
          text-gray-800
          transition-transform duration-300
          flex flex-col justify-between overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-3/4 max-w-xs lg:w-64 lg:translate-x-0 lg:shadow-lg
        `}
      >
        <div className="p-6 pt-8 space-y-4 relative">
          {/* Close button (mobile) */}
          <button
            className="lg:hidden absolute top-4 right-4 text-gray-600"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600 hidden lg:block">
            ShopAdmin
          </h1>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2 font-medium">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = router.pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100 hover:text-blue-700 text-gray-800"
                  }`}
                  onClick={closeMenu}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer - user info */}
        {session && (
          <div className="p-6 text-sm text-gray-600 border-t border-gray-200">
            <p className="mb-2">
              Signed in as <br />
              <strong>{session.user.email}</strong>
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Sign out
            </button>
            <p className="mt-4 text-xs text-gray-500">Version 1.0.0</p>
          </div>
        )}
      </div>
    </>
  );
}
