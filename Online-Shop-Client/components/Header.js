// components/Header.js

/**
 * Header Component
 * --------------------------------------------------
 * Purpose:
 * - Acts as a wrapper for the main navigation bar
 * - Provides a clear entry point for header-related content
 * - Keeps the layout structure organized
 *
 * This component currently renders the Navbar,
 * but allows for easy expansion in the future
 * (e.g., banners, announcements, or search bars).
 */

import Navbar from "./Navbar"; // Import main navigation component

export default function Header() {
  // Render the navigation bar as the header
  return <Navbar />;
}
