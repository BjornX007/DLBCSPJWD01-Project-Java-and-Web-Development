/**
 * Order Model (Mongoose Schema)
 * --------------------------------------------------
 * Purpose:
 * - Defines the structure of an order document
 * - Stores product, customer, payment, and total data
 * - Used for order creation and order management
 *
 * This schema represents a complete purchase order
 * in the e-commerce system.
 */

import mongoose from "mongoose";

/**
 * Order Schema Definition
 */
const OrderSchema = new mongoose.Schema(
  {
    /**
     * Products included in the order
     */
    products: [
      {
        id: String,
        title: String,
        price: Number,
        salePrice: Number,
        quantity: { type: Number, default: 1 },
      },
    ],

    /**
     * Customer shipping and contact information
     */
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

    /**
     * Order totals and currency
     */
    totals: {
      subtotal: Number,
      shipping: Number,
      total: Number,
      currency: { type: String, default: "EUR" },
    },

    /**
     * Payment information
     */
    payment: {
      method: {
        type: String,
        enum: ["cod", "card"], // cash on delivery or card
        required: true,
      },
      status: {
        type: String,
        default: "pending", // pending | paid | failed
      },
    },

    /**
     * Order status used for fulfillment
     */
    status: {
      type: String,
      default: "new", // new | shipped | cancelled
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
 * Export Order model
 * --------------------------------------------------
 * Prevents model overwrite errors during
 * Next.js hot reloading
 */
export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
