import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import Loader from "@/components/Loader";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  if (isLoading) return <Loader />;
  if (isUnauthenticated || !session) return <LoginScreen />;

  // ✅ Anyone logged in can access the dashboard now
  return (
    <div className="min-h-screen bg-amber-50 lg:flex">
      <Nav />
      <Dashboard session={session} />
    </div>
  );
}
