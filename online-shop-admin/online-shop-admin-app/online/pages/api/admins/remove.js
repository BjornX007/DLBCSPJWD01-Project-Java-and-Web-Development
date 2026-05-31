import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Missing email" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.updateOne(
      { email },
      { $unset: { role: "" } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
