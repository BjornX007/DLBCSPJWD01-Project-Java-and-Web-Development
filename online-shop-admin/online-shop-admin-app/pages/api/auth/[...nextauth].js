// API Route: /api/auth/[...nextauth].js
//
// Purpose:
//  - Configures Next-Auth for user authentication and session management
//  - Integrates Google OAuth provider for login
//  - Uses MongoDBAdapter to store user accounts and sessions in MongoDB
//  - Implements custom sign-in logic to restrict access to admin users only
//  - Enhances session data with user role and ID for frontend use
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export default NextAuth({
  // ---------- AUTH PROVIDERS ----------
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,          // Google OAuth App ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Google OAuth Secret
    }),
  ],

  // ---------- DATABASE STORAGE ----------
  // Stores users + accounts inside MongoDB
  adapter: MongoDBAdapter(clientPromise),

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",   // Use JWT tokens instead of DB session records
  },

  // ---------- AUTH LOGIC ----------
  callbacks: {
    /**
     * Runs when user signs in (before granting access)
     * Here we:
     * 1) Ensure user exists in DB
     * 2) Assign default role = "user"
     * 3) Allow login ONLY if user is admin
     */
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db();

        // Check if user already exists
        const dbUser = await db.collection("users").findOne({ email: user.email });

        // If first-time login → create user entry
        if (!dbUser) {
          await db.collection("users").insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            role: "user",   // default role
            createdAt: new Date(),
          });
        }

        // Fetch user again to read latest role
        const updatedUser = await db.collection("users").findOne({ email: user.email });

        // Admin-only access (block normal users)
        return updatedUser?.role === "admin";
      } catch (err) {
        console.error("signIn error:", err);
        return false; // deny login on failure
      }
    },

    /**
     * Runs whenever session data is created / refreshed
     * Adds:
     *  - user.role
     *  - user.id
     * to session object (so frontend can read it)
     */
    async session({ session }) {
      try {
        const client = await clientPromise;
        const db = client.db();

        const dbUser = await db.collection("users").findOne({
          email: session.user.email,
        });

        if (dbUser) {
          session.user.role = dbUser.role;                 // attach role
          session.user.id = dbUser._id.toString();         // attach DB id
        }

        return session;
      } catch (err) {
        console.error("session error:", err);
        return session; // still return session even if DB lookup fails
      }
    },
  },

  // ---------- EVENTS ----------
  events: {
    /**
     * After successful login:
     * Updates "lastLogin" timestamp
     */
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db();

        await db.collection("users").updateOne(
          { email: user.email },
          { $set: { lastLogin: new Date() } }
        );
      } catch (err) {
        console.error("signIn event error:", err);
      }
    },
  },
});
