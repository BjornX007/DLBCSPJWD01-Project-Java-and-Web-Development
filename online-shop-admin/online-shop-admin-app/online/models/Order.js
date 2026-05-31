// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    email: String,
    address: String,
    products: [
      {
        productId: String,
        title: String,
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
