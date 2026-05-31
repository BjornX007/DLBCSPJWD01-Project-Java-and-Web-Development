import clientPromise from "@/lib/mongodb";

// API Route: /api/get-admins
// Purpose: This API route retrieves all admin users from the database
// and returns their email and last login information.
export default async function handler(req, res) {
  try {
    // Wait for MongoDB client connection
    const client = await clientPromise;

    // Select the default database
    const db = client.db();

    // Access the "users" collection
    const users = db.collection("users");

    /**
     * Query database:
     *  - find all users where role = "admin"
     *  - return ONLY email + lastLogin fields
     *  - exclude _id field
     */
    const admins = await users
      .find({ role: "admin" })
      .project({ email: 1, lastLogin: 1, _id: 0 })
      .toArray();

    // Send admins list back to frontend
    res.json({ admins });

  } catch (error) {
    console.error("Error fetching admins:", error);

    // Return generic error response
    res.status(500).json({ message: "Internal server error" });
  }
}
