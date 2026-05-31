import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * PURPOSE
 * -------
 * This API endpoint retrieves a single product by its MongoDB ObjectId.
 *
 * It is used on:
 * - Product detail pages
 * - Quick views / modals
 * - Checkout validation (price accuracy)
 *
 * SALE LOGIC
 * ----------
 * The endpoint performs a runtime check to ensure that:
 * - Expired sales are NOT shown to customers
 * - A product with an expired `saleEndDate` will have its `salePrice`
 *   cleared before being sent to the frontend
 *
 * IMPORTANT
 * ---------
 * - This does NOT update the database
 * - It only sanitizes the response sent to the client
 * - This prevents outdated discounts from being displayed
 *
 * ERROR HANDLING
 * --------------
 * - 400 → Missing product ID
 * - 404 → Product not found
 * - 500 → Database or server error
 */
export default async function handler(req, res) {
  const { id } = req.query;

  // Validate input
  if (!id) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Fetch product by ObjectId
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    // Handle missing product
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    /**
     * SALE EXPIRATION CHECK
     * ---------------------
     * If the product has a sale end date and it is in the past,
     * remove the salePrice so the frontend shows the normal price.
     */
    const now = new Date();
    if (product.saleEndDate && new Date(product.saleEndDate) < now) {
      product.salePrice = null;
    }

    // Send sanitized product
    res.status(200).json({ product });
  } catch (error) {
    console.error('❌ Product API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
