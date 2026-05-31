// pages/api/hero.js

/**
 * Hero Section API
 * -----------------
 * Fetches hero content (title, description, image)
 * from the "settings" collection in MongoDB.
 *
 * Used by the homepage Hero component.
 */

import clientPromise from "@/lib/mongodb";

/**
 * API Route Handler
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    /**
     * Fetch hero image settings
     * Expected document structure:
     * {
     *   key: "heroImage",
     *   title?: string,
     *   description?: string,
     *   url?: string
     * }
     */
    const doc = await db
      .collection("settings")
      .findOne({ key: "heroImage" });

    /**
     * If no hero image is configured,
     * return fallback content
     */
    if (!doc || !doc.url) {
      return res.status(404).json({
        title: "Hero Coming Soon",
        description: "No hero image has been uploaded yet.",
        imageUrl: null,
      });
    }

    /**
     * Return hero data with safe fallbacks
     */
    return res.status(200).json({
      title: doc.title || "Welcome to Our Shop",
      description:
        doc.description ||
        "Discover our latest collections and best deals.",
      imageUrl: doc.url,
    });
  } catch (err) {
    // Log server-side error
    console.error("Hero API error:", err);

    // Generic error response
    return res.status(500).json({
      message: "Server error",
    });
  }
}
