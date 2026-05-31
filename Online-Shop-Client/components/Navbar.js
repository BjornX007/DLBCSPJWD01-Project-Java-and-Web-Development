/**
 * Navbar Component
 * --------------------------------------------------
 * Purpose:
 * - Displays the main site navigation bar
 * - Adapts styling based on current route and scroll position
 * - Supports responsive desktop and mobile navigation
 * - Includes cart access and sale highlighting
 *
 * Features:
 * - Transparent navbar on homepage that changes on scroll
 * - Dynamic styling depending on page type
 * - Mobile menu toggle for smaller screens
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  // Controls mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tracks whether the page has been scrolled
  const [scrolled, setScrolled] = useState(false);

  /**
   * Detect scroll position
   * Used to change navbar background on scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Determine current route
   * Used for conditional navbar styling
   */
  const isHome = router.pathname === "/";
  const isProduct = router.pathname.startsWith("/product/");
  const isSale = router.pathname === "/sale";
  const isSlug = router.pathname === "/category/[slug]";

  /**
   * Build dynamic class list for the header
   */
  let headerClasses =
    "fixed top-0 z-50 w-full px-6 py-3 transition-colors duration-300 ";

  if (isHome) {
    headerClasses += scrolled || mobileMenuOpen
      ? "bg-gray-100 shadow-md text-gray-900"
      : "bg-transparent text-gray-200";
  } else if (isProduct) {
    headerClasses += "bg-black shadow-md text-white";
  } else if (isSale || isSlug) {
    headerClasses += scrolled || mobileMenuOpen
      ? "bg-gray-100 shadow-md text-gray-900"
      : "bg-transparent text-gray-200";
  } else {
    headerClasses += "bg-gray-100 shadow-md text-gray-900";
  }

  return (
    <header className={headerClasses}>
      {/* Main container */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="inline-block">
          <img src="/img/logo.png" alt="Logo" width={130} height={40} />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <Link href="/" className="hover:text-primary transition">HOME</Link>
          <Link href="/products" className="hover:text-primary transition">BIKES</Link>
          <Link href="/about" className="hover:text-primary transition">ABOUT</Link>
          <Link href="/sale" className="hover:text-primary text-red-500 transition">SALE</Link>
        </nav>

        {/* Desktop cart icon */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" aria-label="Cart" className="hover:text-primary">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link href="/cart" aria-label="Cart" className="hover:text-primary">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
          </Link>

          {/* Mobile menu toggle button */}
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hover:text-primary focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md p-6 rounded-b-xl flex flex-col space-y-5 md:hidden z-40">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium transition">
            HOME
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium transition">
            BIKES
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium transition">
            ABOUT
          </Link>
          <Link href="/sale" onClick={() => setMobileMenuOpen(false)} className="text-red-600 hover:text-primary font-medium transition">
            SALE
          </Link>
        </nav>
      )}
    </header>
  );
}
