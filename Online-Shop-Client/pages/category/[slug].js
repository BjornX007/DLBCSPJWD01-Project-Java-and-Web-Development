import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout/Layout";

/**
 * CategoryPage
 * ------------
 * Displays all products for a given category slug.
 *
 * Route:
 * /category/[slug]
 *
 * Example:
 * /category/mountain
 * /category/road
 */
export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch products when slug becomes available
   */
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
      {/* CATEGORY HERO */}
      <div className="relative w-full py-24 text-center mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-blue-600 to-black" />

        <div className="absolute inset-0 flex items-center justify-center text-white px-4">
          <h1 className="text-4xl font-bold capitalize tracking-wide">
            {slug} Bikes
          </h1>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="min-h-screen py-12 px-4 bg-white">
        {loading ? (
          <p className="text-center text-xl text-black">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              /**
               * SALE STATE CHECK
               * ----------------
               * Determines whether the sale is active
               * based on price + date range
               */
              const now = new Date();
              const saleStart = product.saleStart
                ? new Date(product.saleStart)
                : null;
              const saleEnd = product.saleEnd
                ? new Date(product.saleEnd)
                : null;

              const isSaleActive =
                product.salePrice &&
                product.salePrice < product.price &&
                saleStart &&
                saleEnd &&
                now >= saleStart &&
                now <= saleEnd;

              return (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className="bg-white p-3 shadow-xl border border-gray-200 hover:shadow-2xl transition rounded-xl cursor-pointer">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="h-40 w-full object-contain mb-3 rounded-lg"
                    />

                    <h2 className="text-md font-semibold mb-2 line-clamp-1 text-gray-900">
                      {product.title}
                    </h2>

                    {isSaleActive ? (
                      <div>
                        <p className="text-sm text-gray-500 line-through">
                          €{product.price}
                        </p>
                        <p className="text-red-600 font-bold text-lg">
                          €{product.salePrice}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-900 font-bold text-lg">
                        €{product.price}
                      </p>
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
