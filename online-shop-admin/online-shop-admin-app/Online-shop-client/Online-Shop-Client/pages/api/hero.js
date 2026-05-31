import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const doc = await db.collection("settings").findOne({ key: "heroImage" });

    if (!doc || !doc.url) {
      return res.status(404).json({
        title: "Hero Coming Soon",
        description: "No hero image has been uploaded yet.",
        imageUrl: null,
      });
    }

    return res.status(200).json({
      title: doc.title || "Welcome to Our Shop",
      description: doc.description || "Discover our latest collections and best deals.",
      imageUrl: doc.url,
    });
  } catch (err) {
    console.error("Hero API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
