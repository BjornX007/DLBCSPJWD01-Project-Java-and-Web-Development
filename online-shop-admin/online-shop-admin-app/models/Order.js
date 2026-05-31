// models/Order.js
// ------------------------------------------------------------------
// Purpose of this file:
//
// This file defines the MongoDB data model for customer orders.
// The schema formalizes how order data is structured, stored, and
// validated inside the database. It ensures consistency across all
// application modules that create or process orders, and supports
// features such as order tracking, product history retention, and
// total price calculation.
// ------------------------------------------------------------------

import mongoose from "mongoose";

// Define the structure (schema) of an Order document in MongoDB
const orderSchema = new mongoose.Schema(
  {
    // Customer details
    customerName: String,
    email: String,
    address: String,

    // List of purchased products
    products: [
      {
        productId: String, // ID of product
        title: String,     // Product name at time of order
        quantity: Number,  // How many units were bought
      },
    ],

    // Total order price
    total: Number,

    // Order processing status — default = "Pending"
    status: {
      type: String,
      default: "Pending",
    },
  },

  // timestamps = automatically add createdAt + updatedAt fields
  { timestamps: true }
);



export default mongoose.models.Order || mongoose.model("Order", orderSchema);
