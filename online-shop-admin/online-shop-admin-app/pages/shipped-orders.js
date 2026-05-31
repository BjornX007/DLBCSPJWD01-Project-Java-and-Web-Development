// This page displays all orders that have already been shipped.
// The goal of this page is to give admins a quick overview of fulfilled orders,
// including customer information and order details.

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios";

export default function ShippedOrders() {

  // I store the shipped orders returned from the backend
  const [orders, setOrders] = useState([]);

  // Used to show loading state while fetching orders
  const [loading, setLoading] = useState(true);

  // Stores which order card is currently expanded to show extra details
  const [expanded, setExpanded] = useState(null);

  // When the page loads, I fetch all shipped orders from my API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // I call my custom API route that returns only shipped orders
        const res = await axios.get("/api/get-shipped-orders");

        // If no orders exist, I still safely set an empty array
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch shipped orders:", err);
      } finally {
        // Stop the loading state whether request succeeds or fails
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        
        {/* Page title */}
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Shipped Orders
        </h1>

        {/* Display loading, empty state, or orders */}
        {loading ? (
          <p className="text-gray-500">Loading shipped orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No shipped orders found.</p>
        ) : (

          // Orders grid layout
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >

                {/* Basic order information shown by default */}
                <div className="space-y-2">

                  {/* I show order ID so admins can reference it */}
                  <p className="text-sm text-gray-500 break-all">
                    <strong>Order ID:</strong> {order._id}
                  </p>

                  {/* Customer name */}
                  <p className="text-sm text-gray-700">
                    <strong>Customer:</strong>{" "}
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>

                  {/* List all purchased products in a single line */}
                  <p className="text-sm text-gray-700">
                    <strong>Products:</strong>{" "}
                    {order.products.map((p) => p.title).join(", ")}
                  </p>

                  {/* Total order price */}
                  <p className="text-sm font-semibold text-gray-900">
                    <strong>Total:</strong> €{order?.totals?.total ?? 0}
                  </p>
                </div>

                {/* Button to toggle expanded order details */}
                <button
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  className="text-blue-600 text-sm mt-3 hover:underline"
                >
                  {expanded === idx ? "Hide details" : "Show details"}
                </button>

                {/* Extra customer + payment information
                    I only show this when the user expands the card */}
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
                      <strong>Payment:</strong> {order.payment?.method} (
                      {order.payment?.status})
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
