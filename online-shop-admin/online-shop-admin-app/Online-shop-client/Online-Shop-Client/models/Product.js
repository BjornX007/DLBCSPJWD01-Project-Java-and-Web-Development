import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every(url => typeof url === "string"),
        message: "Images must be an array of strings (URLs)",
      },
    },
    kit: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "",
      trim: true,
      index: true, // Adds index for faster queries by category
    },
    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },
    saleStart: {
      type: Date,
      default: null,
    },
    saleEnd: {
      type: Date,
      default: null,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Optional: Add a method to check if the sale is currently active
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

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
