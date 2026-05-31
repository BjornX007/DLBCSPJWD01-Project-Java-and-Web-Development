// pages/api/products.js
// Purpose:
//  - Handles adding new products to the online shop
//  - Supports product image uploads via Formidable and Cloudinary
//  - Stores product data in MongoDB
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "../../lib/mongodb";

// Tell Next.js NOT to process the body —
// Formidable needs full control of multipart form data (file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary using environment variable
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export default async function handler(req, res) {
  // Simple test endpoint — useful to confirm API is running
  if (req.method === "GET") {
    console.log("👋 GET request received — API is alive!");
    return res.status(200).json({ message: "API is alive! 🎉" });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("🛰️ Incoming POST request");

  // Initialize Formidable
  const form = new IncomingForm({
    keepExtensions: true, // preserves file extensions
    multiples: true,      // allows uploading multiple images
  });

  // Parse incoming multipart form (fields + files)
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("🛑 Error parsing form data:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    try {
      console.log("📦 Received fields:", fields);
      console.log("🖼️ Received files:", files);

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection("products");

      // Formidable sometimes wraps values in arrays
      // These normalize values so we always get a clean string
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;

      // Extract sale fields safely
      const salePriceRaw = Array.isArray(fields.salePrice) ? fields.salePrice[0] : fields.salePrice;
      const saleStartRaw = Array.isArray(fields.saleStart) ? fields.saleStart[0] : fields.saleStart;
      const saleEndRaw = Array.isArray(fields.saleEnd) ? fields.saleEnd[0] : fields.saleEnd;

      // Convert sale fields to correct data types
      const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;
      const saleStart = saleStartRaw ? new Date(saleStartRaw) : null;
      const saleEnd = saleEndRaw ? new Date(saleEndRaw) : null;

      // Determine if product is currently on sale
      const now = new Date();
      const isOnSale =
        salePrice &&
        saleStart &&
        saleEnd &&
        saleStart <= now &&
        now <= saleEnd;

      // Validate required product fields
      if (!title?.trim() || !description?.trim() || !price || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Make sure images array is always iterable
      const uploadedFiles = files.images
        ? Array.isArray(files.images)
          ? files.images
          : [files.images]
        : [];

      let imageUrls = [];

      // ================================
      // Upload images to Cloudinary which works as a S3 bucket for saving images in the cloud and returning their URLs

      // ================================
      if (uploadedFiles.length > 0) {
        console.log("📤 Uploading images to Cloudinary...");

        const uploads = await Promise.all(
          uploadedFiles.map(async (file, index) => {
            const filePath = file.filepath || file.path; // backward-compat support

            console.log(`⬆️ Uploading image ${index + 1}: ${file.originalFilename}`);

            const result = await cloudinary.uploader.upload(filePath, {
              folder: "products", // store inside Cloudinary "products" folder
            });

            console.log(`✅ Image ${index + 1} uploaded: ${result.secure_url}`);

            return result.secure_url;
          })
        );

        imageUrls = uploads;
      }

      // Build product object to insert
      const newProduct = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        images: imageUrls,
        createdAt: new Date(),

        // sale fields
        salePrice,
        saleStart,
        saleEnd,
        isOnSale,
      };

      // Save to MongoDB
      const result = await collection.insertOne(newProduct);
      console.log("✅ Product inserted with ID:", result.insertedId);

      // Send response back to frontend
      return res.status(201).json({
        message: "Product added successfully",
        productId: result.insertedId,
        images: imageUrls,
      });

    } catch (error) {
      console.error("🔥 Error inserting product:", error);

      return res.status(500).json({
        message: "Failed to insert product",
        error: error.message,
      });
    }
  });
}
