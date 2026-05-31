import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      images.forEach((image) => formData.append("images", image));

      const res = await axios.post("/api/products", formData);

      if (res.status === 201) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setPrice("");
        setImages([]);
        setPreviewUrls([]);
      }
    } catch (err) {
      console.error("❌ Failed to create product:", err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>  <div className="relative w-full flex justify-center px-4 py-10">
    {/* Back Button - positioned absolutely relative to the page */}
    <button
      onClick={() => router.push("/products")}
      className="absolute top-2 left-4 sm:left-6 md:left-8 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition z-20"
    >
      ← Back to Products
    </button>

    {/* Centered Form Container */}
    <div className="w-full max-w-xl">
      <div className="p-6 shadow-lg text-center w-full rounded-lg bg-white mt-6 sm:mt-10">
        <h1 className="text-2xl text-primary font-bold mb-6">
          Add a New Product
        </h1>

            <form className="space-y-4 text-left" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 w-full rounded"
                  rows={4}
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block font-medium mb-1">
                  Price (€)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2 w-full rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Upload Box */}
              <div>
                <label className="block font-medium mb-1">
                  Upload Product Images
                </label>

                <div
                  onClick={() => document.getElementById("images").click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition"
                >
                  <span className="text-gray-500">
                    📤 Click or drag to upload
                  </span>
                </div>

                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-700"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-2xl hover:from-blue-400 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>

              {/* Status Messages */}
              {success && (
                <p className="text-green-600 mt-3">
                  ✅ Product added successfully!
                </p>
              )}
              {error && <p className="text-red-600 mt-3">⚠️ {error}</p>}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
