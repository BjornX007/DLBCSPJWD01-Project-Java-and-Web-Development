/**
 * Purpose:
 * This Dashboard component serves as the main administrative control panel
 * for the e-commerce platform. It allows the site administrator to manage
 * the hero section content (image, title and description) and provides an
 * overview of key business statistics such as total sales, refunds and
 * customer count pulled from Stripe. The Orders Overview widget pulls real
 * order data from MongoDB and displays total order count, latest order date,
 * and the 3 most recent orders. The Other Metrics widget calculates net
 * revenue, refund rate, and average order value from combined Stripe and
 * MongoDB data. The feature supports content editing, image uploading,
 * deletion, and real-time preview.
 */

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Euro,
  RefreshCw,
  Users,
  ShoppingBag,
  Clock,
  BarChart2,
  TrendingDown,
  CreditCard,
} from "lucide-react";
export default function Dashboard({ session }) {
  // === Hero section state ===
  const [heroImage, setHeroImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dbHeroImageUrl, setDbHeroImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  // === Stripe dashboard statistics ===
  const [stripeStats, setStripeStats] = useState({
    totalSales: 0,
    totalRefunds: 0,
    customersCount: 0,
  });

  // === Orders state ===
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch saved hero section data from backend (image + text)
  useEffect(() => {
    async function fetchHeroData() {
      try {
        const res = await axios.get("/api/hero-image");
        setDbHeroImageUrl(res.data.url);
        setPreview(res.data.url);
        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
      } catch (err) {
        console.error("Failed to load hero data:", err);
      }
    }
    fetchHeroData();
  }, []);

  // Fetch Stripe statistics for dashboard widgets
  useEffect(() => {
    async function fetchStripeStats() {
      try {
        const res = await axios.get("/api/stripe-dashboard");
        setStripeStats(res.data);
      } catch (err) {
        console.error("Failed to fetch Stripe stats:", err);
      }
    }
    fetchStripeStats();
  }, []);

  // Fetch all orders from MongoDB for the Orders Overview widget
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get("/api/get-orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, []);

  // Handle hero image file selection + local preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload hero image + text to backend
  const uploadHeroImage = async () => {
    // Prevent empty submission
    if (!heroImage && !title && !description) return;

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      if (heroImage) formData.append("file", heroImage);
      formData.append("title", title);
      formData.append("description", description);

      const res = await axios.put("/api/hero-image", formData);

      // Store updated image URL returned from backend
      setDbHeroImageUrl(res.data.url);
      alert("Hero section updated!");
      setShowEditor(false);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      setError("Upload failed.");
    } finally {
      setUploading(false);
      setHeroImage(null);
    }
  };

  // Delete hero image + text from database and reset local state
  const deleteHeroImage = async () => {
    if (!confirm("Are you sure you want to delete the hero image and text?")) return;

    try {
      setDeleting(true);
      await axios.delete("/api/hero-image");

      // Reset all hero-related state
      setDbHeroImageUrl(null);
      setPreview(null);
      setTitle("");
      setDescription("");

      alert("Hero image deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Derived metrics calculated from orders + Stripe data
   * order.totals.total is stored in cents → divide by 100 for display
   */
  const totalOrderCount = orders.length;

  // Latest order date from the most recent order in the sorted list
  const latestOrderDate = orders[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString("en-DE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // Net revenue = total sales minus total refunds (both from Stripe)
  const netRevenue = (stripeStats.totalSales - stripeStats.totalRefunds).toFixed(2);

  // Refund rate as a percentage of total sales
  const refundRate =
    stripeStats.totalSales > 0
      ? ((stripeStats.totalRefunds / stripeStats.totalSales) * 100).toFixed(1)
      : "0.0";

  // Average order value = total Stripe sales divided by number of MongoDB orders
  const avgOrderValue =
    totalOrderCount > 0
      ? (stripeStats.totalSales / totalOrderCount).toFixed(2)
      : "—";

  // === Dashboard UI ===
  return (
    <main className="flex-1 p-6 mt-14 lg:mt-0 lg:ml-64 bg-gray-100">
      <h2 className="text-4xl font-semibold text-primary">Dashboard</h2>
      <p className="mt-2 text-gray-600">
        Welcome back, <b>{session.user.name}</b>
      </p>

      {/* Stats grid section */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Stripe stats widget */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Stripe Stats (Last 30 days)</h3>
        <p className="text-gray-700 mb-2 flex items-center gap-2">
  <Euro className="w-4 h-4 text-indigo-500" />
  Total Sales: €{stripeStats.totalSales}
</p>

<p className="text-gray-700 mb-2 flex items-center gap-2">
  <RefreshCw className="w-4 h-4 text-red-400" />
  Total Refunds: €{stripeStats.totalRefunds}
</p>

<p className="text-gray-700 mb-2 flex items-center gap-2">
  <Users className="w-4 h-4 text-green-500" />
  Customers: {stripeStats.customersCount}
</p>

<p className="text-gray-700 mb-2 flex items-center gap-2">
  <ShoppingBag className="w-4 h-4 text-indigo-500" />
  Total Orders: {totalOrderCount}
</p>

        </div>

        {/* Orders Overview widget — pulls real data from /api/get-orders */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>

          {loadingOrders ? (
            // Show loading state while orders are being fetched
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <>
              {/* Summary stats */}
           <p className="text-gray-700 mb-2 flex items-center gap-2">
  <Clock className="w-4 h-4 text-gray-400" />
  Latest: {latestOrderDate}
</p>

<p className="text-gray-700 mb-2 flex items-center gap-2">
  <BarChart2 className="w-4 h-4 text-indigo-500" />
  Net Revenue: €{netRevenue}
</p>

              {/* 3 most recent orders — totals.total is in cents so divide by 100 */}
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between text-sm text-gray-500 border-t pt-2 mt-2"
                >
                  <span>#{order._id.slice(-6).toUpperCase()}</span>
                  <span>€{order.totals.total.toFixed(2)}</span>
                </div>
              ))}

              {/* Fallback when no orders exist yet */}
              {totalOrderCount === 0 && (
                <p className="text-gray-400 text-sm">No orders yet.</p>
              )}
            </>
          )}
        </div>

        {/* Other Metrics widget — calculated from Stripe + MongoDB order data */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Other Metrics</h3>
          {/* Net revenue after subtracting refunds from total sales */}
      <p className="text-gray-700 mb-2 flex items-center gap-2">
  <BarChart2 className="w-4 h-4 text-indigo-500" />
  Net Revenue: €{netRevenue}
</p>
          {/* Percentage of total sales that were refunded */}
         <p className="text-gray-700 mb-2 flex items-center gap-2">
  <TrendingDown className="w-4 h-4 text-red-400" />
  Refund Rate: {refundRate}%
</p>
          {/* Average order value across all MongoDB orders */}
         <p className="text-gray-700 mb-2 flex items-center gap-2">
  <CreditCard className="w-4 h-4 text-green-500" />
  Avg Order Value: €{avgOrderValue}
</p>
        </div>
      </div>

      {/* Toggle hero editor panel */}
      <div className="mt-10 text-center">
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
        >
          {showEditor ? "Cancel Hero Edit" : "Change Hero Section"}
        </button>
      </div>

      {/* Hero editor panel — only visible when showEditor is true */}
      {showEditor && (
        <div className="bg-white p-6 rounded shadow mt-8 max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Hero Section</h3>

          {/* Error message */}
          {error && <p className="text-red-600 mb-2">{error}</p>}

          {/* Image preview */}
          {preview && (
            <img src={preview} alt="Preview" className="h-48 rounded mb-4 object-cover w-full" />
          )}

          {/* Hero title input */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3 w-full border border-gray-300 rounded p-2"
          />

          {/* Hero description input */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-3 w-full border border-gray-300 rounded p-2"
            rows="3"
          />

          {/* Image file upload input */}
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4 w-full" />

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={uploadHeroImage}
              disabled={uploading || (!heroImage && !title && !description)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex-1"
            >
              {uploading ? "Uploading..." : "Update Hero"}
            </button>

            {/* Delete button — only shown when a hero image exists in the database */}
            {dbHeroImageUrl && (
              <button
                onClick={deleteHeroImage}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded flex-1"
              >
                {deleting ? "Deleting..." : "Delete Hero"}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}