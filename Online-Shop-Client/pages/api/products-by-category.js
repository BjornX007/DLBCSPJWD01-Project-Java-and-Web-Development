import Product from "@/models/Product";
import mongoose from "mongoose";

/**
 * CATEGORY SLUG → DB CATEGORY MAP
 * ------------------------------
 * Maps URL-friendly category slugs to the actual
 * category values stored in the database.
 *
 * This allows:
 * - Clean URLs (/category/mountain)
 * - Flexible internal naming
 * - Multiple slugs pointing to the same category
 */
const categoryMap = {
  mountain: "Mountain Trails",
  road: "Road Ride",
  race: "Road Ride", // alias
  city: "City",
  "e-bike": "E-Bikes",
};

/**
 * PURPOSE
 * -------
 * Fetch all products belonging to a specific category.
 *
 * Used on:
 * - Category listing pages
 * - Filtered product views
 * - SEO-friendly category routes
 *
 * FLOW
 * ----
 * 1. Read category slug from URL
 * 2. Ensure MongoDB connection exists
 * 3. Translate slug → category name
 * 4. Fetch products sorted by newest first
 * 5. Return products as JSON
 *
 * ERROR HANDLING
 * --------------
 * - Returns empty array if no products found
 * - Returns 500 on database or server error
 */
export default async function handler(req, res) {
  const { slug } = req.query;

  /**
   * Ensure MongoDB connection
   * -------------------------
   * Prevents multiple connections in Next.js hot reload
   */
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  /**
   * Resolve category name
   * ---------------------
   * Falls back to slug itself if not mapped
   * (useful for dynamic or future categories)
   */
  const category = categoryMap[slug] || slug;

  try {
    console.log("📂 Category slug:", slug);
    console.log("🔎 Query category:", category);

    /**
     * Fetch products
     * --------------
     * - Filter by category
     * - Sort newest first
     */
    const products = await Product
      .find({ category })
      .sort({ createdAt: -1 });

    console.log("✅ Products found:", products.length);

    res.status(200).json({ products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
