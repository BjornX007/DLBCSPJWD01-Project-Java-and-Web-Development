// pages/orders/index.js or index.tsx
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/get-orders");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-100 p-6">
        <h1 className="text-2xl font-bold mb-5 text-primary">Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-md p-4 shadow flex flex-col gap-2"
              >
                <div className="text-sm text-gray-700">
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div className="text-sm">
                  <strong>Customer:</strong> {order.customerName || "N/A"} —{" "}
                  {order.email}
                </div>
                <div className="text-sm">
                  <strong>Products:</strong>{" "}
                  {order.products.map((p) => p.title).join(", ")}
                </div>
                <div className="text-sm">
                  <strong>Total:</strong> €{order.total}
                </div>
                <div className="text-sm">
                  <strong>Status:</strong> {order.status}
                </div>

                {/* Optional actions */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={async () => {
                      const confirmed = confirm("Mark this order as shipped?");
                      if (confirmed) {
                        try {
                          await axios.put("/api/update-order-status", {
                            id: order._id,
                            status: "Shipped",
                          });
                          setOrders((prev) =>
                            prev.map((o) =>
                              o._id === order._id
                                ? { ...o, status: "Shipped" }
                                : o
                            )
                          );
                        } catch (err) {
                          console.error("Failed to update status:", err);
                        }
                      }
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Mark as Shipped
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
