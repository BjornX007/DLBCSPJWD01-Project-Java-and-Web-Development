// AdminManager Component
// This component allows an existing admin to promote another user
// to admin status by submitting their email address. The request is
// sent to a protected API route that updates the user role in the database.

import { useState } from "react";

export default function AdminManager() {
  // Stores the email entered in the input field
  const [email, setEmail] = useState("");

  // Stores success or error feedback messages for the user
  const [message, setMessage] = useState("");

  // Sends promotion request to backend API
  const promote = async () => {
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      // Email is sent in the request body as JSON
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    // Displays feedback depending on backend response
    if (data.success) {
      setMessage(`✅ ${email} is now an admin`);
      setEmail(""); // clear input field after success
    } else {
      setMessage(`❌ Failed to promote`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md">
      {/* Section title */}
      <h2 className="text-xl font-bold mb-2">👤 Add Admin</h2>

      {/* Email input field used to identify user to promote */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@example.com"
        className="w-full p-2 border dark:bg-gray-700 rounded mb-2"
      />

      {/* Button triggers admin promotion request */}
      <button
        onClick={promote}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Promote to Admin
      </button>

      {/* Conditional user feedback message */}
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
