import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.updateOne({ email }, { $set: { role: "admin" } });
    res.json({ success: true });
  } catch (err) {
    console.error("Promote error:", err);
    res.status(500).json({ success: false });
  }
}
