// pages/sale.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
export default function SalePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("discount");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/sale-prod");
        const data = await res.json();

        const now = new Date();
        const saleProducts = data.products.filter((p) => {
          const saleStart = p.saleStart ? new Date(p.saleStart) : null;
          const saleEnd = p.saleEnd ? new Date(p.saleEnd) : null;

          return (
            p.salePrice &&
            p.salePrice < p.price &&
            saleStart &&
            saleEnd &&
            now >= saleStart &&
            now <= saleEnd
          );
        });

        setProducts(saleProducts);
        setFiltered(saleProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🟢 Apply filters & sorting whenever search/sort/products change
  useEffect(() => {
    let results = [...products];

    // Filter by search
    if (search.trim() !== "") {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sort === "lowToHigh") {
      results.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sort === "highToLow") {
      results.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sort === "newest") {
      results.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "discount") {
      results.sort(
        (a, b) =>
          (b.price - b.salePrice) / b.price -
          (a.price - a.salePrice) / a.price
      );
    }

    setFiltered(results);
  }, [search, sort, products]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <Layout>
      <Navbar />

 {/* 🟠 Hero Banner */}
<div className="relative w-full py-45 ">
  {/* Gradient background */}
  <div className="absolute inset-0 bg-gradient-to-r from-black via-red-600 to-black"></div>

  {/* Text overlay */}
  <div className="absolute inset-0 flex flex-col items-center  pt-7  justify-center text-center text-white px-4">
    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
     Mega Sale
    </h1>
    <p className="text-lg drop-shadow-md">
      Up to 70% off selected items • Limited time only!
    </p>
   
  </div>
</div>


      {/* 🟢 Filters + Sorting */}
      <div className="container mx-auto px-5 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Search sale products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full sm:w-1/3"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="discount">Biggest Discount</option>
            <option value="lowToHigh">Price: Low → High</option>
            <option value="highToLow">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* 🟣 Product Grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-600">No products match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((product) => {
              const discount = Math.round(
                ((product.price - product.salePrice) / product.price) * 100
              );

              return (
                <div
                  key={product._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col group hover:shadow-xl transition"
                >
                  {/* Image with hover */}
                  <Link href={`/product/${product._id}`}>
                    <div className="relative">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                      {/* Discount badge */}
                      <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                        -{discount}%
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <Link href={`/product/${product._id}`}>
                      <h2 className="text-lg font-semibold mb-2 hover:underline">
                        {product.title}
                      </h2>
                    </Link>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-gray-400 line-through mr-2">
                        €{product.price}
                      </span>
                      <span className="text-xl font-bold text-red-600">
                        €{product.salePrice}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() =>
                          addToCart({
                            id: product._id,
                            title: product.title,
                            images: product.images,
                            quantity: 1,
                            price: product.salePrice,
                          })
                        }
                        className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                      >
                        Add to Cart
                      </button>
                      <button className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
