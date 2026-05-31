// pages/api/upload-hero-image.js
// Purpose:
//  - Uploads a new hero image and associated text for the online shop's homepage
//  - Handles image uploads via Formidable and Cloudinary
//  - Stores hero section image as a URL in MongoDB
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
import clientPromise from "@/lib/mongodb";

// Disable Next.js default body parser so Formidable
// can correctly handle multipart form-data file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary using environment variable connection string
cloudinary.config(process.env.CLOUDINARY_URL);

/**
 * Helper function — parses multipart form-data requests
 * (used when uploading images)
 */
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    // Create a Formidable parser
    const form = new IncomingForm({ keepExtensions: true });

    // Parse request → returns uploaded files + text fields
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  // Connect to MongoDB
  const client = await clientPromise;
  const db = client.db();

  /**
   * ──────────────────────────────
   * GET request → Fetch hero image data
   * ──────────────────────────────
   * Fetches stored hero image url + text
   */
  if (req.method === "GET") {
    const doc = await db.collection("settings").findOne({ key: "heroImage" });

    return res.status(200).json({
      url: doc?.url || null,
      title: doc?.title || "",
      description: doc?.description || "",
    });
  }

  /**
   * ──────────────────────────────
   * DELETE request → Remove hero image
   * ──────────────────────────────
   * Deletes heroImage entry from DB
   * (does not delete Cloudinary file)
   */
  if (req.method === "DELETE") {
    await db.collection("settings").deleteOne({ key: "heroImage" });

    return res.status(200).json({ message: "Hero image deleted" });
  }

  /**
   * ──────────────────────────────
   * POST request → Upload new hero image
   * ──────────────────────────────
   * 1) Parse form-data
   * 2) Upload image to Cloudinary
   * 3) Save URL + text content in MongoDB
   */
  if (req.method === "POST") {
    try {
      // Parse uploaded file + fields
      const { fields, files } = await parseForm(req);

      // Support both single + array uploads
      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      const file = fileArray[0];

      // Validate file exists
      if (!file?.filepath) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload image to Cloudinary folder
      const uploadRes = await cloudinary.uploader.upload(file.filepath, {
        folder: "shop/hero",
      });

      // Store hero section data in MongoDB
      await db.collection("settings").updateOne(
        { key: "heroImage" },
        {
          $set: {
            url: uploadRes.secure_url, // saved Cloudinary URL
            title: fields.title || "Welcome to Our Shop",
            description:
              fields.description ||
              "Discover our latest collections and best deals.",
          },
        },
        { upsert: true } // create document if missing
      );

      // Return stored result to frontend
      return res.status(200).json({
        url: uploadRes.secure_url,
        title: fields.title || "",
        description: fields.description || "",
      });
    } catch (err) {
      console.error("Upload failed:", err);

      return res.status(500).json({ message: "Upload failed" });
    }
  }

  // Reject unsupported HTTP methods
  return res.status(405).json({ message: "Method not allowed" });
}
