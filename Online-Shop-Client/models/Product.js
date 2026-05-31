/**
 * Product Model (Mongoose Schema)
 * --------------------------------------------------
 * Purpose:
 * - Defines the structure of a product in the shop
 * - Supports pricing, images, categories, and sales
 * - Used across product listings, cart, and checkout
 */

import mongoose from "mongoose";

/**
 * Product Schema Definition
 */
const ProductSchema = new mongoose.Schema(
  {
    /**
     * Product title
     * - Required
     * - Trimmed to remove accidental whitespace
     */
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },

    /**
     * Product description
     * - Optional
     * - Defaults to an empty string
     */
    description: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Base product price (without discount)
     */
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    /**
     * Product images
     * - Stored as an array of image URLs
     * - Validated to ensure all values are strings
     */
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((url) => typeof url === "string"),
        message: "Images must be an array of strings (URLs)",
      },
    },

    /**
     * Optional product kit or bundle description
     */
    kit: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Product category
     * - Indexed for faster filtering and searching
     */
    category: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    /**
     * Discounted sale price
     * - Null when no sale is active
     */
    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },

    /**
     * Sale start date
     */
    saleStart: {
      type: Date,
      default: null,
    },

    /**
     * Sale end date
     */
    saleEnd: {
      type: Date,
      default: null,
    },

    /**
     * Flag indicating whether the product is currently on sale
     * - Used for UI badges and filtering
     */
    isOnSale: {
      type: Boolean,
      default: false,
    },
  },
  {
    /**
     * Automatically adds:
     * - createdAt
     * - updatedAt
     */
    timestamps: true,
  }
);

/**
 * Instance Method: isSaleActive
 * --------------------------------------------------
 * Checks whether the product sale is currently valid
 * based on price and date range
 */
ProductSchema.methods.isSaleActive = function () {
  const now = new Date();
  return (
    this.salePrice != null &&
    this.saleStart != null &&
    this.saleEnd != null &&
    now >= this.saleStart &&
    now <= this.saleEnd
  );
};

/**
 * Export Product model
 * --------------------------------------------------
 * Prevents model overwrite errors in Next.js
 * during hot reloading
 */
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
