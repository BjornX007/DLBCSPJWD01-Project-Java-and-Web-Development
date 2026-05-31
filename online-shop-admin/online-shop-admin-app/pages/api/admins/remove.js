import clientPromise from "@/lib/mongodb";
// API Route: /api/admins/remove
//
// Purpose:
//  - Demotes an admin user back to regular user by removing the `role` field
//  - Used in the admin panel to remove user roles
//
export default async function handler(req, res) {
  // Allow only POST requests — prevents accidental role removal via GET, etc.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  // Basic validation — email must be provided in request body
  if (!email) {
    return res.status(400).json({ success: false, message: "Missing email" });
  }

  try {
    // Reuse existing MongoDB connection
    const client = await clientPromise;
    const db = client.db();

    // Access the users collection
    const users = db.collection("users");

    // Remove the `role` field from the user document
    // Effectively de-promotes the user (removes admin role)
    await users.updateOne(
      { email },              // Match by email
      { $unset: { role: "" } } // Remove the role key
    );

    // Respond success regardless of matched count
    res.json({ success: true });

  } catch (error) {
    // Log server-side error for debugging
    console.error("Error removing admin:", error);

    // Send generic failure response
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
