// pages/api/categories.js
//Purpose:
//- Provides a list of product categories
//- Used for navigation and filtering products
//- Fetches categories from the database
export default async function handler(req, res) {
  const categories = await db.categories.findMany(); // <- from your DB
  res.status(200).json(categories);
}