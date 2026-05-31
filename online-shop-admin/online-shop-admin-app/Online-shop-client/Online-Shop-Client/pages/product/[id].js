import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product?id=${id}`);
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!product) return <p className="p-8 text-red-500">Product not found.</p>;

  // Calculate if sale is active
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

  const displayPrice = isSaleActive ? product.salePrice : product.price;

  return (
    <Layout>
      <Navbar />
      
      <div className="container mx-auto px-5 py-35">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div className="bg-white p-6 shadow-sm">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col text-gray-800 justify-between">
            {/* Title */}
            <h1 className="text-3xl font-semibold mb-6">{product.title}</h1>

            {/* Frame Size Selection (Optional UI) */}
            <div className="mb-6">
              <label
                htmlFor="frameSize"
                className="block text-sm text-gray-600 mb-1"
              >
                Select Frame Size
              </label>
              <select
                id="frameSize"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            {/* Price */}
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

            {/* Add to Cart */}
            <button
             onClick={() =>
  addToCart({
    id: product._id,
    title: product.title,
    images: product.images, // ✅ ensures image is passed
    quantity: 1,
    price:
      product.salePrice &&
      product.saleStart &&
      product.saleEnd &&
      new Date(product.saleStart) <= new Date() &&
      new Date(product.saleEnd) >= new Date()
        ? product.salePrice
        : product.price,
  })
}

              className="bg-black text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-800 transition mb-8"
            >
              Add to Cart
            </button>

            {/* Description */}
            <div className="border-t pt-6 text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
