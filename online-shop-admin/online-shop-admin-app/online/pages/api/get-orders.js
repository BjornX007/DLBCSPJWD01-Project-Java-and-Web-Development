// pages/api/get-orders.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(); // you can pass db name like db("myShop") if needed
    const orders = await db.collection("orders").find().sort({ createdAt: -1 }).toArray();

    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}
