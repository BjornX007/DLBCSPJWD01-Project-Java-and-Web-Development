// pages/products/edit/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch product data
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // ✅ Fix this line in edit/[id].js
const res = await axios.get(`/api/get-products?id=${id}`);


        const prod = res.data.product;

        setProduct(prod);
        setTitle(prod.title);
        setDescription(prod.description);
        setPrice(prod.price);
      } catch (err) {
        console.error("❌ Failed to load product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await axios.put("/api/update-product", {
        id,
        title,
        description,
        price,
      });

      router.push("/products"); // ✅ Go back to product list
    } catch (err) {
      console.error("❌ Update failed:", err);
      setError("Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Layout><p>Loading product...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          {error && <p className="text-red-600 mt-2">⚠️ {error}</p>}
        </form>
      </div>
    </Layout>
  );
}
