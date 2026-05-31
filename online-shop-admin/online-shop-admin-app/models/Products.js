import mongoose from "mongoose";

// Purpose: This file defines the Product model used to store and manage
// product data in MongoDB (including pricing, images, and sale scheduling).

// Define the structure of a Product document in MongoDB
const ProductSchema = new mongoose.Schema(
  {
    // Product title (required field)
    title: { type: String, required: true },

    // Optional longer description
    description: String,

    // Base price (required)
    price: { type: Number, required: true },

    // Optional sale price (used only when a sale is active)
    salePrice: { type: Number, default: null },

    // Start date of scheduled sale
    saleStart: { type: Date, default: null },

    // End date of scheduled sale
    saleEnd: { type: Date, default: null },

    // Array of image URLs
    images: [String],

    // Optional product kit / variant info
    kit: { type: String, default: "" },
  },

  // Automatically adds createdAt + updatedAt
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
