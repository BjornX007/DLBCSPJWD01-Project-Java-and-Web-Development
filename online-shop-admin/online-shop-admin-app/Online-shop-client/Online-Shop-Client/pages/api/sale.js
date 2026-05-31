// pages/api/sale.js
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();

    // fetch only products with active sale
    const saleProducts = await db
      .collection('products')
      .find({
        salePrice: { $exists: true, $ne: null },
        saleStartDate: { $lte: now },
        saleEndDate: { $gte: now },
      })
      .toArray();

    res.status(200).json({ products: saleProducts });
  } catch (error) {
    console.error('Sale API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
