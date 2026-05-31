/**
 * Layout Component
 * --------------------------------------------------
 * Purpose:
 * - Provides a consistent page structure across the application
 * - Displays the navigation bar at the top
 * - Displays the footer at the bottom
 * - Renders page-specific content in between
 *
 * This component ensures a shared layout
 * for all pages in the application.
 */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * @param {ReactNode} children - Page content passed into the layout
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation bar */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
}
