export default async function handler(req, res) {
  const categories = await db.categories.findMany(); // <- from your DB
  res.status(200).json(categories);
}