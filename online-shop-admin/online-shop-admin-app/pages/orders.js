// Orders Page (Admin Panel)
// -----------------------------------------------------------
// This page retrieves all customer orders from the backend,
// displays them in a structured card layout, and allows the
// admin to update the shipment status of each order.
//
// Key Features:
// • Fetch orders from API on page load
// • Display order + customer summary info
// • Expandable details panel per order
// • Mark orders as "Shipped" with live UI update
// -----------------------------------------------------------

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios";

export default function Orders() {
  // Stores list of orders returned from backend
  const [orders, setOrders] = useState([]);

  // Controls loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Tracks which order card has expanded details visible
  const [expanded, setExpanded] = useState(null);

  // -----------------------------------------------------------
  // Fetch orders from database when the component loads.
  // useEffect ensures this executes only once on first render.
  // -----------------------------------------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/get-orders");
        setOrders(res.data.orders || []); // Prevent undefined crashes
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // -----------------------------------------------------------
  // Update order status to "Shipped".
  // Confirms the action, sends update request to API,
  // and then updates UI without requiring a page reload.
  // -----------------------------------------------------------
  const handleStatusUpdate = async (id) => {
    const confirmed = confirm("Mark this order as shipped?");
    if (!confirmed) return;

    try {
      await axios.put("/api/update-order-status", { id, status: "Shipped" });

      // Optimistically update local state for instant feedback
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "Shipped" } : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Orders</h1>

        {/* Navigation shortcut to shipped orders history */}
        <button
          onClick={() => (window.location.href = "/shipped-orders")}
          className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          View Shipped Orders
        </button>

        {/* Loading + empty state handling */}
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          // -----------------------------------------------------------
          // Orders Grid
          // Displays each order inside a responsive card layout
          // -----------------------------------------------------------
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* Compact order summary */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 break-all">
                    <strong>Order ID:</strong>{" "}
                    <span className="truncate inline-block max-w-[180px] align-middle">
                      {order._id}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Customer:</strong>{" "}
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Products:</strong>{" "}
                    {order.products.map((p) => p.title).join(", ")}
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    <strong>Total:</strong> €
                    {order?.totals?.total ?? 0}
                  </p>
                </div>

                {/* Toggle details panel */}
                <button
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  className="text-blue-600 text-sm mt-3 hover:underline"
                >
                  {expanded === idx ? "Hide details" : "Show details"}
                </button>

                {/* Expanded customer + payment details */}
                {expanded === idx && (
                  <div className="mt-3 text-sm text-gray-600 border-t pt-3 space-y-1">
                    <p>
                      <strong>Email:</strong> {order.customer?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.customer?.phone}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {order.customer?.address1}, {order.customer?.address2}
                    </p>
                    <p>
                      <strong>City:</strong> {order.customer?.city}{" "}
                      {order.customer?.postalCode}
                    </p>
                    <p>
                      <strong>Country:</strong> {order.customer?.country}
                    </p>
                    <p>
                      <strong>Payment:</strong>{" "}
                      {order.payment?.method} ({order.payment?.status})
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>
                )}

                {/* Status badge + admin action buttons */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Shipped"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Allow shipping action only if not shipped yet */}
                  {order.status !== "Shipped" && (
                    <button
                      onClick={() => handleStatusUpdate(order._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Mark as Shipped
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
