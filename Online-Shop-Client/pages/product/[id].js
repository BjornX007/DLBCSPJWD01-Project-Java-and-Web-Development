/**
 * Product Detail Page
 * -------------------
 * Displays a single product with:
 * - Image
 * - Price (with sale handling)
 * - Description
 * - Add-to-cart functionality
 *
 * This page is accessed via /product/[id]
 */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  /**
   * ROUTER
   * ------
   * Extract product ID from URL
   * Example: /product/64f9a... → id = "64f9a..."
   */
  const router = useRouter();
  const { id } = router.query;

  /**
   * STATE
   * -----
   * product → stores fetched product data
   * loading → controls loading UI
   */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * CART CONTEXT
   * ------------
   * addToCart → adds product to cart and opens drawer
   */
  const { addToCart } = useCart();

  /**
   * FETCH PRODUCT
   * -------------
   * Fetch product details once ID is available
   */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product?id=${id}`);
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error('❌ Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /**
   * LOADING & ERROR STATES
   */
  if (loading) return <p className="p-8">Loading...</p>;
  if (!product) return <p className="p-8 text-red-500">Product not found.</p>;

  /**
   * SALE LOGIC
   * ----------
   * Determines whether a sale is currently active
   * based on saleStart, saleEnd and salePrice
   */
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

  /**
   * DISPLAY PRICE
   * -------------
   * Ensures UI & cart always use the same price
   */
  const displayPrice = isSaleActive ? product.salePrice : product.price;

  return (
    <Layout>
      {/* Navbar (already included in Layout, can be removed if duplicated) */}
      <Navbar />

      <div className="container mx-auto px-5 py-35">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT COLUMN — PRODUCT IMAGE */}
          <div className="bg-white p-6 shadow-sm">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>

          {/* RIGHT COLUMN — PRODUCT DETAILS */}
          <div className="flex flex-col text-gray-800 justify-between">

            {/* PRODUCT TITLE */}
            <h1 className="text-3xl font-semibold mb-6">
              {product.title}
            </h1>

            {/* FRAME SIZE (UI ONLY — NOT STORED YET) */}
            <div className="mb-6">
              <label
                htmlFor="frameSize"
                className="block text-sm text-gray-600 mb-1"
              >
                Select Frame Size
              </label>
              <select
                id="frameSize"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            {/* PRICE DISPLAY */}
            <div className="mb-6">
              {isSaleActive ? (
                <div className="flex items-center gap-3">
                  <span className="text-xl text-gray-400 line-through">
                    €{product.price}
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    €{product.salePrice}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  €{product.price}
                </span>
              )}
            </div>

            {/* ADD TO CART */}
            <button
              onClick={() =>
                addToCart({
                  id: product._id,
                  title: product.title,
                  images: product.images, // ensures cart preview image
                  quantity: 1,
                  price: displayPrice, // single source of truth
                })
              }
              className="bg-black text-white text-lg px-6 py-3 rounded-lg
                         hover:bg-gray-800 transition mb-8"
            >
              Add to Cart
            </button>

            {/* PRODUCT DESCRIPTION */}
            <div className="border-t pt-6 text-gray-700">
              <h2 className="text-xl font-semibold mb-2">
                Description
              </h2>
              <p className="leading-relaxed">
                {product.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
