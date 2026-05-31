import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        id: String,
        title: String,
        price: Number,
        salePrice: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      postalCode: String,
      country: String,
    },
    totals: {
      subtotal: Number,
      shipping: Number,
      total: Number,
      currency: { type: String, default: "EUR" },
    },
    payment: {
      method: { type: String, enum: ["cod", "card"], required: true },
      status: { type: String, default: "pending" },
    },
    status: { type: String, default: "new" }, // new | shipped | cancelled
  },
  { timestamps: true } // adds createdAt + updatedAt
);

// Prevent model overwrite on hot reload in Next.js
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
