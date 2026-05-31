import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { shipping, cart, totals, paymentMethod } = req.body || {};

    if (!cart?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!shipping || !totals) {
      return res.status(400).json({ error: "Missing shipping or totals data" });
    }

    const client = await clientPromise;
    const db = client.db("shopdb");

    const order = {
      createdAt: new Date(),
      products: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        salePrice: item.salePrice || item.price,
        quantity: item.quantity || 1,
      })),
      customer: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        email: shipping.email,
        phone: shipping.phone,
        address1: shipping.address1,
        address2: shipping.address2,
        city: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country,
      },
      totals: {
        subtotal: totals.subtotal || 0,
        shipping: totals.shipping || 0,
        total: totals.total || 0,
        currency: totals.currency || "EUR",
      },
      payment: {
        method: paymentMethod || "cod",
        status: paymentMethod === "card" ? "paid" : "pending",
      },
      status: "new",
    };

    const result = await db.collection("orders").insertOne(order);

    res.status(201).json({
      success: true,
      orderId: result.insertedId.toString(),
      order,
    });
  } catch (e) {
    console.error("❌ Failed to save order:", e);
    res.status(500).json({ error: "Failed to save order" });
  }
}
