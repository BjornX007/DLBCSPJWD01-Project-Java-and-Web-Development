/**
 * Hero Component
 * --------------------------------------------------
 * Purpose:
 * - Displays the main hero section on the homepage
 * - Fetches hero content (title, description, image) from the backend API
 * - Shows a loading state while data is being fetched
 * - Adapts layout for mobile and desktop screens
 *
 * This component is designed to create a strong
 * first impression for users visiting the site.
 */

import { useEffect, useState } from "react";

export default function Hero() {
  // Stores hero data fetched from the API
  const [heroData, setHeroData] = useState(null);

  /**
   * Fetch hero content from the backend API
   * Runs once when the component mounts
   */
  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => setHeroData(data))
      .catch((err) =>
        console.error("Failed to load hero data:", err)
      );
  }, []);

  /**
   * Show loading state while hero data is not yet available
   */
  if (!heroData) {
    return (
      <section className="w-full h-screen bg-black text-white flex items-center justify-center">
        <p>Loading hero section...</p>
      </section>
    );
  }

  // Fallback values in case API data is incomplete
  const title = heroData.title || "Ride the Road With Confidence";
  const description =
    heroData.description || "Premium bikes built strong.";
  const imageUrl = heroData.imageUrl || "";

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col sm:flex-row items-center justify-center px-4 sm:px-12 py-10 sm:py-20 overflow-hidden">
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tl from-black via-blue-400 to-black opacity-50" />

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-8">
        
        {/* Mobile image (shown above text) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Bike"
            className="block sm:hidden w-8/8 max-w-md mx-auto mb-6 object-contain"
          />
        )}

        {/* Text content */}
        <div className="w-full sm:w-1/2 text-center sm:text-left flex flex-col items-center sm:items-start space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow text-neon">
            {title}
          </h1>

          <p className="text-lg text-gray-300 max-w-lg">
            {description}
          </p>

          {/* Call-to-action button */}
          <button className="bg-orange-600 text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition-all shadow-md">
            Shop Now
          </button>
        </div>

        {/* Desktop image (shown beside text) */}
        {imageUrl && (
          <div className="hidden sm:block w-full sm:w-1/2 flex justify-center items-center">
            <img
              src={imageUrl}
              alt="Bike"
              className="w-full h-full object-contain max-h-[500px]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
