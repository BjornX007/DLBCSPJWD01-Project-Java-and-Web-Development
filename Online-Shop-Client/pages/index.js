/**
 * Home Page
 * =========
 * Main landing page of the application.
 *
 * PURPOSE
 * -------
 * This page is responsible only for composing
 * the main homepage sections in the correct order.

 *
 * SECTIONS INCLUDED
 * -----------------
 * 1. Header  → Site navigation & branding
 * 2. Hero    → Main marketing / visual section
 * 3. TerrainPromoSection → Category or promo blocks
 * 4. Footer  → Legal links, secondary navigation
 */

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TerrainPromoSection from "@/components/TerrainPromoSection";

export default function Home() {
  return (
    <>
      {/* Top site navigation and branding */}
      <Header />

      {/* Primary hero banner / marketing section */}
      <Hero />

      {/* Promotional section (terrain categories or featured content) */}
      <TerrainPromoSection />

      {/* Bottom footer with links and legal information */}
      <Footer />
    </>
  );
}
