/**
 * Products Page
 * =============
 * Entry page for browsing product categories or featured product sections.
 *
 * PURPOSE
 * -------
 * This page serves as a lightweight wrapper around the
 * `TerrainPromoSection` component.
 *
 * It allows users to:
 * - Browse product categories
 * - Navigate to category-specific product listings
 *

 */

import TerrainPromoSection from "@/components/TerrainPromoSection";

export default function ProductsPage() {
  return (
    <main className="pt-24">
      {/* 
        Top padding ensures page content is not hidden 
        underneath the fixed Header component 
      */}
      <TerrainPromoSection />
    </main>
  );
}
