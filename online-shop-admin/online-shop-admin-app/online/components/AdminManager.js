// Create this file: components/AdminManager.js

import { useState } from "react";

export default function AdminManager() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const promote = async () => {
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage(`✅ ${email} is now an admin`);
      setEmail("");
    } else {
      setMessage(`❌ Failed to promote`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-2">👤 Add Admin</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@example.com"
        className="w-full p-2 border dark:bg-gray-700 rounded mb-2"
      />
      <button
        onClick={promote}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Promote to Admin
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
