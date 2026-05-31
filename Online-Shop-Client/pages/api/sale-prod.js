import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Fetch all products
    const products = await db
      .collection('products')
      .find({})
      .toArray();

    const now = new Date();

    // Sanitize products before sending to frontend
    const updatedProducts = products.map((p) => {
      // Convert ObjectId to string for frontend usage
      p._id = p._id.toString();

      /**
       * SALE EXPIRATION CHECK
       * ---------------------
       * If a product has a saleEnd date and it has passed,
       * remove the salePrice so normal price is shown.
       */
      if (p.saleEnd && new Date(p.saleEnd) < now) {
        p.salePrice = null;
      }

      return p;
    });

    // Return sanitized product list
    res.status(200).json({ products: updatedProducts });
  } catch (error) {
    console.error('❌ Products API Error:', error);

    // Internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
}