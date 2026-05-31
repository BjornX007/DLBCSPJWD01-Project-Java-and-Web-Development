import { useEffect, useState } from "react";


export default function Hero() {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => setHeroData(data))
      .catch((err) => console.error("Failed to load hero data:", err));
  }, []);

  if (!heroData) {
    return (
      <section className="w-full h-screen bg-black text-white flex items-center justify-center">
        <p>Loading hero section...</p>
      </section>
    );
  }

  const title = heroData.title || "Ride the Road With Confidence";
  const description = heroData.description || "Premium bikes built strong.";
  const imageUrl = heroData.imageUrl || "";

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col sm:flex-row items-center justify-center px-4 sm:px-12 py-10 sm:py-20 overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-tl from-black via-blue-400 to-black opacity-50" />


<div className="relative z-10 w-full max-w-7xl flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-8">
        {/* Mobile Image — top center */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Bike"
            className="block sm:hidden w-8/8 max-w-md mx-auto mb-6 object-contain"
          />
        )}

        {/* Text Block */}
        <div className="w-full sm:w-1/2 text-center sm:text-left flex flex-col items-center sm:items-start space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow text-neon">
            {title}
          </h1>
          <p className="text-lg text-gray-300 max-w-lg">
            {description}
          </p>
          <button className="bg-orange-600 text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition-all shadow-md">
            Shop Now
          </button>
        </div>

        {/* Desktop Image */}
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
