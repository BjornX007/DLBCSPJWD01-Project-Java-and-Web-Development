import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const admins = await users
      .find({ role: "admin" })
      .project({ email: 1, lastLogin: 1, _id: 0 })
      .toArray();

    res.json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
