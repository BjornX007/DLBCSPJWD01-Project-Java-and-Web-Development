import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Product ID required' });

  try {
    const client = await clientPromise;
    const db = client.db();

    let product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 👇 Check if sale is expired
    const now = new Date();
    if (product.saleEndDate && new Date(product.saleEndDate) < now) {
      // Clean expired salePrice
      product.salePrice = null;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Product API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
