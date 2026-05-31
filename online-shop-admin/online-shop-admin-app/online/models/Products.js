import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: Number,
    images: [String], // <-- Add this to store image URLs or paths
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
