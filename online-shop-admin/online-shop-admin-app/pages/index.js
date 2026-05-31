// pages/index.js
// Purpose:
//  - Entry point for the homepage (dashboard)
//  - Manages authentication state and displays appropriate UI

// Homepage (Dashboard Entry)
// Handles authentication state and ensures the correct UI is shown
// depending on whether the user is logged in or not.

import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import Loader from "@/components/Loader";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  // Retrieve authentication session + loading status from NextAuth
  const { data: session, status } = useSession();

  // Track session states for cleaner readability
  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  // While authentication state is being resolved → show loader
  if (isLoading) return <Loader />;

  // If no session exists → show login screen
  if (isUnauthenticated || !session) return <LoginScreen />;

  /*
   * At this point the user is authenticated.
   * Access to dashboard is granted to any logged-in user.
   */
  return (
    <div className="min-h-screen bg-amber-50 lg:flex">
      {/* Navigation sidebar */}
      <Nav />

      {/* Main dashboard content (session passed for personalization) */}
      <Dashboard session={session} />
    </div>
  );
}
