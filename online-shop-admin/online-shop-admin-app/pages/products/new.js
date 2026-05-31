// pages/products/new.js
// Purpose:
//  - Provides an interface to add a new product to the online shop
//  - Handles image uploads and form submission to backend API
import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewProduct() {

  /**
   * Form state values
   * These represent the new product fields entered by the admin
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");
  const [images, setImages] = useState([]);

  /**
   * Local blob preview image URLs
   * Used only for frontend display before upload
   */
  const [previewUrls, setPreviewUrls] = useState([]);

  const [category, setCategory] = useState("");

  // UI control + feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  /**
   * Cleanup created preview URLs when the component unmounts
   * Prevents memory leaks from unused object URLs
   */
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  /**
   * Predefined category dropdown options
   */
  const categoryOptions = [
    "Mountain Trails",
    "Road Ride",
    "City",
    "E-Bikes"
  ];

  /**
   * Handles image file selection from input
   * - Stores image files in state for upload
   * - Generates local preview URLs for display
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Generate preview blob URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // Append new files + previews to state
    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  /**
   * Removes selected image + preview
   * - Revokes URL to free memory
   */
  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Submits new product to backend API
   * - Uses FormData because images are uploaded
   * - Sends sale scheduling fields if provided
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      // Build multipart form payload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("salePrice", salePrice);
      formData.append("saleStart", saleStart);
      formData.append("saleEnd", saleEnd);
      formData.append("category", category);

      // Append all uploaded images
      images.forEach((image) => formData.append("images", image));

      // Send request to API route
      const res = await axios.post("/api/products", formData);

      // If insert success → reset form + show success message
      if (res.status === 201) {
        setSuccess(true);

        setTitle("");
        setDescription("");
        setPrice("");
        setSalePrice("");
        setSaleStart("");
        setSaleEnd("");
        setCategory("");
        setImages([]);
        setPreviewUrls([]);
      }

    } catch (err) {
      console.error("❌ Failed to create product:", err);

      // Show server or fallback error message
      setError(
        err.response?.data?.message ||
        "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="relative w-full flex justify-center px-4 py-10">

        {/* Back navigation button */}
        <button
          onClick={() => router.push("/products")}
          className="absolute top-2 left-4 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition z-20"
        >
          ← Back to Products
        </button>

        <div className="w-full max-w-xl">
          <div className="p-6 shadow-lg text-center w-full rounded-lg bg-white mt-6">

            <h1 className="text-2xl text-primary font-bold mb-6">
              Add a New Product
            </h1>

            {/* Product creation form */}
            <form className="space-y-4 text-left" onSubmit={handleSubmit}>

              {/* Product Name */}
              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 w-full rounded"
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
                  className="border p-2 w-full rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Optional Sale Price */}
              <div>
                <label className="block font-medium mb-1">Sale Price (€)</label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="border p-2 w-full rounded"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Scheduled Sale Start */}
              <div>
                <label className="block font-medium mb-1">Sale Start Date</label>
                <input
                  type="datetime-local"
                  value={saleStart}
                  onChange={(e) => setSaleStart(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </div>

              {/* Scheduled Sale End */}
              <div>
                <label className="block font-medium mb-1">Sale End Date</label>
                <input
                  type="datetime-local"
                  value={saleEnd}
                  onChange={(e) => setSaleEnd(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </div>

              {/* Category select */}
              <div>
                <label className="block font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border p-2 w-full rounded bg-white"
                  required
                >
                  <option value="">-- Select a Category --</option>

                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload Input */}
              <div>
                <label className="block font-medium mb-1">Upload Product Images</label>

                {/* Styled upload dropzone */}
                <div
                  onClick={() => document.getElementById("images").click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition"
                >
                  <span className="text-gray-500">
                    📤 Click or drag to upload
                  </span>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Image Preview Thumbnails */}
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 object-cover rounded border"
                      />

                      {/* Remove image button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-2xl hover:from-blue-400 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>

              {/* Success + Error messages */}
              {success && (
                <p className="text-green-600 mt-3">
                  ✅ Product added successfully!
                </p>
              )}

              {error && (
                <p className="text-red-600 mt-3">
                  ⚠️ {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
