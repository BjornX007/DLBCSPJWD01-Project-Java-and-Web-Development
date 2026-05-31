/**
 * pages/api/sale.js
 *
 * PURPOSE
 * -------
 * This API endpoint returns ONLY products that are currently on sale.
 *
 * It is used for:
 * - “Sale” / “Deals” pages
 * - Homepage sale sections
 * - Promotional banners (Hot Deals, Discounts, etc.)
 *
 * SALE LOGIC
 * ----------
 * A product is considered on sale ONLY if:
 * - `salePrice` exists and is not null
 * - `saleStartDate` is in the past (or now)
 * - `saleEndDate` is in the future (or now)
 *
 * This ensures:
 * - Expired sales are never shown
 * - Scheduled future sales are hidden until active
 *
 * IMPORTANT
 * ---------
 * - This endpoint DOES NOT modify the database
 * - It filters products at query-time only
 *
 * ERROR HANDLING
 * --------------
 * - 500 → Database or server error
 */

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Current timestamp for sale validation
    const now = new Date();

    /**
     * Fetch ONLY products with an ACTIVE sale
     */
    const saleProducts = await db
      .collection('products')
      .find({
        salePrice: { $exists: true, $ne: null },
        saleStartDate: { $lte: now },
        saleEndDate: { $gte: now },
      })
      .toArray();

    // Return active sale products
    res.status(200).json({ products: saleProducts });
  } catch (error) {
    console.error('❌ Sale API Error:', error);

    // Internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
}
