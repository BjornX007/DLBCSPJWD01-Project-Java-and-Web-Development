import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";

const poppins = Poppins({ subsets: ["latin"], weight: ["500", "800"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <main className={poppins.className}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
}
