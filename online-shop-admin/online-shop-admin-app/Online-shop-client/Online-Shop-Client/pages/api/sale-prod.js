// pages/api/products.js
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const products = await db.collection('products').find({}).toArray();

    const now = new Date();
    const updatedProducts = products.map((p) => {
      // normalize ObjectId to string for frontend
      p._id = p._id.toString();

      // clean expired sales
      if (p.saleEnd && new Date(p.saleEnd) < now) {
        p.salePrice = null;
      }
      return p;
    });

    res.status(200).json({ products: updatedProducts });
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
