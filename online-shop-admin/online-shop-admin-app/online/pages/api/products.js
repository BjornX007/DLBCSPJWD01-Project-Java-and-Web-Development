import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "../../lib/mongodb";

// Disable body parsing to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Setup Cloudinary using .env
cloudinary.config(process.env.CLOUDINARY_URL);

export default async function handler(req, res) {
  // GET: Health check
  if (req.method === "GET") {
    console.log("👋 GET request received — API is alive!");
    return res.status(200).json({ message: "API is alive! 🎉" });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("🛰️ Incoming POST request");

  const form = new IncomingForm({
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("🛑 Error parsing form data:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    try {
      console.log("📦 Received fields:", fields);
      console.log("🖼️ Received files:", files);

      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection("products");

      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description;
      const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;

      if (!title?.trim() || !description?.trim() || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Normalize uploaded images
      const uploadedFiles = files.images
        ? Array.isArray(files.images)
          ? files.images
          : [files.images]
        : [];

      let imageUrls = [];

      if (uploadedFiles.length > 0) {
        console.log("📤 Uploading images to Cloudinary...");
        const uploads = await Promise.all(
          uploadedFiles.map(async (file, index) => {
            console.log(`⬆️ Uploading image ${index + 1}: ${file.originalFilename}`);
            const result = await cloudinary.uploader.upload(file.filepath, {
              folder: "products",
            });
            console.log(`✅ Image ${index + 1} uploaded: ${result.secure_url}`);
            return result.secure_url;
          })
        );
        imageUrls = uploads;
      }

      const newProduct = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        images: imageUrls,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newProduct);
      console.log("✅ Product inserted with ID:", result.insertedId);

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
