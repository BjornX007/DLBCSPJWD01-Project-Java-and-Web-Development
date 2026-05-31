// pages/products/edit/[id].js
// Purpose:
//  - Provides an interface to edit existing product details
//  - Fetches current product data and populates form fields
//  - Submits updated product data to the backend API
// React + Next.js imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";

export default function EditProduct() {
  // Access router to read dynamic product ID from URL
  const router = useRouter();
  const { id } = router.query;

  // Product state values (form inputs + entity)
  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");
  const [kit, setKit] = useState("");

  // UI + validation states
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetches the existing product details when:
   * - the page loads
   * - AND a valid product ID is available from the route
   */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // Request product from backend API using id query param
        const res = await axios.get(`/api/get-products?id=${id}`);
        const prod = res.data.product;

        // Populate form fields with current product values
        setProduct(prod);
        setTitle(prod.title);
        setDescription(prod.description);
        setPrice(prod.price);

        // Optional sale fields (fallback to empty)
        setSalePrice(prod.salePrice ?? "");
        setSaleStart(prod.saleStart ? prod.saleStart.slice(0, 16) : "");
        setSaleEnd(prod.saleEnd ? prod.saleEnd.slice(0, 16) : "");

        // Kit field (optional metadata)
        setKit(prod.kit || "");
      } catch (err) {
        // Error message displayed in UI
        console.error("❌ Failed to load product:", err);
        setError("Failed to load product.");
      } finally {
        // Stop loading spinner after request completes
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /**
   * Handles submission of the edit form.
   * Converts numeric + nullable fields,
   * sends update request to backend API,
   * and redirects to product list on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Convert values into correct numeric format
      const priceNum = parseFloat(price);
      const salePriceNum = parseFloat(salePrice);

      // Structured payload sent to API
      const payload = {
        id,
        title,
        description,
        price: priceNum,
        salePrice: salePrice ? salePriceNum : null,
        saleStart: saleStart || null,
        saleEnd: saleEnd || null,
        kit: kit.trim(),
      };

      // Send PUT request to update product
      await axios.put("/api/update-product", payload);

      // Redirect to products list after successful update
      router.push("/products");
    } catch (err) {
      console.error("❌ Update failed:", err);
      setError("Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state shown while product data is being fetched
  if (loading)
    return (
      <Layout>
        <p>Loading product...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Product</h1>

        {/* Product Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Product Title */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
              required
            />
          </div>

          {/* Base Price */}
          <div>
            <label className="block font-medium mb-1">Price (€)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Optional Scheduled Sale Price */}
          <div>
            <label className="block font-medium mb-1">Sale Price (€)</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
              step="0.01"
            />
          </div>

          {/* Scheduled Sale Start */}
          <div>
            <label className="block font-medium mb-1">Sale Start</label>
            <input
              type="datetime-local"
              value={saleStart}
              onChange={(e) => setSaleStart(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Scheduled Sale End */}
          <div>
            <label className="block font-medium mb-1">Sale End</label>
            <input
              type="datetime-local"
              value={saleEnd}
              onChange={(e) => setSaleEnd(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Optional Product Kit Label */}
          <div>
            <label className="block font-medium mb-1">Kit</label>
            <input
              type="text"
              value={kit}
              onChange={(e) => setKit(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Optional (e.g. Starter Kit)"
            />
          </div>

          {/* Submit / Save Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          {/* Error Feedback Message */}
          {error && <p className="text-red-600 mt-2">⚠️ {error}</p>}
        </form>
      </div>
    </Layout>
  );
}

