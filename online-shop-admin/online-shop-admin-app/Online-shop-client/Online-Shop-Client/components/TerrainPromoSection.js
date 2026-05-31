'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function TerrainPromoSection() {
  const [terrains, setTerrains] = useState([]);
  const [saleItems, setSaleItems] = useState([]);

  useEffect(() => {
    // mock data
    setTerrains([
      { id: 1, name: 'Mountain Trails', imageUrl: '/img/mtb.jpg', slug: 'mountain' },
      { id: 2, name: 'Road Ride', imageUrl: '/img/road.jpg', slug: 'race' },
      { id: 3, name: 'City Cruising', imageUrl: '/img/city.jpg', slug: 'city' },
      { id: 4, name: 'E-Bikes', imageUrl: '/img/ebike.jpg', slug: 'e-bike' },
    ]);

    setSaleItems([
      { id: 101, title: '🔥 50% Off Mountain Bikes', imageUrl: '/placeholder.jpg' },
      { id: 102, title: '🚴‍♂️ Urban Ride Gear Deals', imageUrl: '/placeholder.jpg' },
    ]);
  }, []);

  return (
    <section className="relative w-full px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 tracking-tight">
          Pick Your <span className="text-red-500">Bike Type</span>
        </h2>

        {/* Terrains */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {terrains.map((t) => (
            <a
              key={t.id}
              href={`/category/${t.slug}`}
              className="group block relative overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <img
                src={t.imageUrl}
                alt={t.name}
                loading="lazy"
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">{t.name}</h3>
              </div>
            </a>
          ))}
        </div>

        {/* Hot Deals */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 text-center mt-20 mb-12 tracking-tight">
          Hot Deals 🔥
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {saleItems.map((item) => (
            <a
              key={item.id}
              href={`/sale/${item.id}`}
              className="group block relative overflow-hidden rounded-2xl bg-white border border-red-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/70 via-red-600/20 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white drop-shadow-lg">{item.title}</h3>
                <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
