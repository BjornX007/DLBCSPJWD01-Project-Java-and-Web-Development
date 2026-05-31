/**
 * Global App Wrapper (_app.js)
 * ---------------------------
 * This file wraps EVERY page in the application.
 *
 * Responsibilities:
 * - Load global styles
 * - Provide global context (Cart)
 * - Render persistent UI (Header, CartDrawer)
 * - Prepare Stripe (future-ready)
 */

import "@/styles/globals.css";

/**
 * CART CONTEXT
 * ------------
 * Makes cart state available across the entire app
 */
import { CartProvider } from "../context/CartContext";

/**
 * GLOBAL COMPONENTS
 * -----------------
 * CartDrawer → slide-out cart UI
 * Header → top navigation (Navbar wrapper)
 */
import CartDrawer from "../components/CartDrawer";
import Header from "@/components/Header";

/**
 * STRIPE (CLIENT)
 * ---------------
 * Stripe Elements setup (not yet used directly here,
 * but ready if you wrap checkout pages later)
 */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/**
 * Initialize Stripe using public key
 * (safe to expose in frontend)
 */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

/**
 * APP COMPONENT
 * -------------
 * This component wraps every page component.
 *
 * Props:
 * - Component → the active page
 * - pageProps → props passed to the page
 */
export default function App({ Component, pageProps }) {
  return (
    /**
     * CART PROVIDER
     * -------------
     * Enables cart access everywhere:
     * - Navbar
     * - Product pages
     * - CartDrawer
     * - Checkout
     */
    <CartProvider>

      {/* 
        HEADER
        ------
        Persistent top navigation across all pages
      */}
      <div className="bg-gray-600 text-black">
        <Header />
      </div>

      {/*
        PAGE CONTENT
        ------------
        This renders the current route's page
      */}
      <Component {...pageProps} />

      {/*
        CART DRAWER
        -----------
        Always mounted so it can slide in/out
        from anywhere in the app
      */}
      <CartDrawer />

    </CartProvider>
  );
}
