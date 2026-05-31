import clientPromise from "@/lib/mongodb";
// API Route: /api/admins/promote
//
// Purpose:
//  - Promotes a regular user to admin role by setting `role: "admin"`
//  - Used in the admin panel to manage user roles
export default async function handler(req, res) {
  // Only allow POST requests (prevents unintended role changes via GET)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate request body — prevents empty / malformed payloads
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email required",
    });
  }

  try {
    // Get MongoDB client connection
    const client = await clientPromise;
    const db = client.db();

    // Reference the `users` collection
    const users = db.collection("users");

    // Update the user role to admin
    // ⚠️ Note: Does nothing if no matching user exists
    const result = await users.updateOne(
      { email },
      { $set: { role: "admin" } }
    );


    // Success response
    res.json({
      success: true,
      message: "User promoted to admin",
    });

  } catch (err) {
    // Logs server-side error for debugging
    console.error("Promote error:", err);

    // Generic server failure response
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
