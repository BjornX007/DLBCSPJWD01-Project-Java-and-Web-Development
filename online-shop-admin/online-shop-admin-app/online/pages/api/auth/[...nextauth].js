import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const allowedAdmins = ["bjorni.k2005@gmail.com"]; // or fetch from DB

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

 callbacks: {
  async signIn({ user }) {
    const client = await clientPromise;
    const db = client.db();
    const dbUser = await db.collection("users").findOne({ email: user.email });

    // Only allow sign-in if user has role: "admin"
    return dbUser?.role === "admin";
  },
  async session({ session }) {
    const client = await clientPromise;
    const db = client.db();
    const dbUser = await db.collection("users").findOne({ email: session.user.email });

    if (dbUser?.role === "admin") {
      session.user.role = "admin";
    }

    return session;
  }
},


  events: {
  async signIn({ user }) {
    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { email: user.email },
      { $set: { lastLogin: new Date() } }
    );
  }
}

});
