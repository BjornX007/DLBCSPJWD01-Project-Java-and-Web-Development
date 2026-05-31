import Product from "@/models/Product";
import mongoose from "mongoose";

const categoryMap = {
  mountain: "Mountain Trails",
  road: "Road Ride",
   race: "Road Ride", 
  city: "City",
  "e-bike": "E-Bikes",
};

export default async function handler(req, res) {
  const { slug } = req.query;

  // Connect to MongoDB before querying
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  // Map slug to category name
  const category = categoryMap[slug] || slug;

  try {
    console.log("Slug:", slug);
    console.log("Category used for query:", category);

    const products = await Product.find({ category }).sort({ createdAt: -1 });

    console.log("Products found:", products.length);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
