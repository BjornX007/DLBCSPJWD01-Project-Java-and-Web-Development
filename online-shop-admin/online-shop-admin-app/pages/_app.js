// pages/_app.js
// Purpose:
//  - Custom App component to initialize pages in the Next.js application
//  - Wraps all pages with global providers for authentication and theming

// Import global CSS styles so they apply across the entire Next.js app
import "@/styles/globals.css";

// Provides authentication session context to the app (NextAuth)
import { SessionProvider } from "next-auth/react";

// Import the Poppins Google font with selected weights
import { Poppins } from "next/font/google";

// Theme provider to manage light/dark mode across the app
import { ThemeProvider } from "../context/ThemeContext";

// Configure Poppins font (only latin subset + chosen weights)
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "800"] });

// Main custom App component — wraps every page in shared providers
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // Global theme context (dark/light mode, saved preferences, etc.)
    <ThemeProvider>
      {/* Makes authentication session available in all pages */}
      <SessionProvider session={session}>
        {/* Apply Poppins font to the entire app */}
        <main className={poppins.className}>
          {/* Render requested page with its props */}
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
}
