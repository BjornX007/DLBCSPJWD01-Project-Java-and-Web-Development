// API Route: /api/hero-image
//
// Purpose:
//  - Manages the hero image and associated text for the online shop's homepage
//  - Supports fetching and deleting the hero section data 
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    // Re-use global MongoDB connection
    const client = await clientPromise;

    // Get active database
    const db = client.db();

    // Use a single "settings" collection for global site config
    const collection = db.collection("settings");

    // ===========================
    //  GET → Fetch hero image data
    // ===========================
    if (req.method === "GET") {
      /**
       * We store the hero section inside a single document
       * identified by `key: "heroImage"`
       */
      const doc = await collection.findOne({ key: "heroImage" });

      // Return saved data or fallback defaults
      return res.status(200).json({
        url: doc?.url || null,
        title: doc?.title || "",
        description: doc?.description || "",
      });
    }
//PUT 
if (req.method === "PUT") {
  const { url, title, description } = req.body;

  await collection.updateOne(
    { key: "heroImage" },
    {
      $set: { url, title, description },
    },
    { upsert: true }
  );

  return res.status(200).json({ success: true });
}
    // ===========================
    //  DELETE → Reset hero image data
    // ===========================
    if (req.method === "DELETE") {
      /**
       * Instead of deleting the document,
       * we simply wipe the stored fields.
       *
       * `upsert: true` ensures the document always exists.
       */
      await collection.updateOne(
        { key: "heroImage" },
        {
          $set: {
            url: null,
            title: "",
            description: "",
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    }

    // ===========================
    //  Block unsupported methods
    // ===========================
    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error("Hero image API error:", err);

    // Fallback server error response
    return res.status(500).json({ message: "Server error" });
  }
}
