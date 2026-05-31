import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/Navbar";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products-by-category?slug=${slug}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <Layout>
      <Navbar />
      {/* 🟠 Hero Banner */}
<div className="relative w-full py-50 text-center mb-10">
  {/* Gradient background */}
  <div className="absolute inset-0 bg-gradient-to-r from-black via-blue-600 to-black"></div>

  {/* Text overlay */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
    <h1 className="text-4xl font-bold capitalize text-center mb-10 tracking-wide ">
          {slug} Bikes
        </h1>
 
  </div>
</div>

      <div className="min-h-screen py-12 px-4 bg-white text-white">
        
        {loading ? (
          <p className="text-center text-xl text-black">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const now = new Date();
              const saleStart = product.saleStart ? new Date(product.saleStart) : null;
              const saleEnd = product.saleEnd ? new Date(product.saleEnd) : null;

              const isSaleActive =
                product.salePrice &&
                product.salePrice < product.price &&
                saleStart &&
                saleEnd &&
                now >= saleStart &&
                now <= saleEnd;

              return (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className="bg-white p-3 shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 text-gray-900 rounded-xl cursor-pointer">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="h-40 w-full object-contain mb-3 rounded-lg"
                    />
                    <h2 className="text-md font-semibold mb-2 line-clamp-1">
                      {product.title}
                    </h2>

                    {isSaleActive ? (
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-500 line-through">€{product.price}</p>
                          <p className="text-red-600 font-bold text-lg">€{product.salePrice}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between space-x-1.5 mb-2">
                        <p className="text-gray-500 font-bold text-lg">€{product.price}</p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
