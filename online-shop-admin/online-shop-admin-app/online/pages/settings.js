import { useSession } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isSuperAdmin = session?.user?.email === "bjorni.k2005@gmail.com";

  // Use dark mode state and toggle from ThemeContext
  const { darkMode, toggleDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [admins, setAdmins] = useState([]);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  // Load admins and config on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admins");
        const { admins } = await res.json();
        setAdmins(admins);

        const configRes = await fetch("/api/settings/config");
        const config = await configRes.json();
        setAnnouncement(config.announcement || "");
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };

    load();
  }, []);

  const promote = async () => {
    try {
      const res = await fetch("/api/admins/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Admin added.");
        setEmail("");
        const refreshed = await fetch("/api/admins");
        const updated = await refreshed.json();
        setAdmins(updated.admins);
      } else {
        setMessage("❌ Failed to add.");
      }
    } catch (err) {
      console.error("Promotion failed:", err);
      setMessage("❌ Error promoting admin.");
    }
  };

  const removeAdmin = async (emailToRemove) => {
    const confirmed = confirm(`Remove admin access from ${emailToRemove}?`);
    if (!confirmed) return;

    try {
      await fetch("/api/admins/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToRemove }),
      });

      const refreshed = await fetch("/api/admins");
      const updated = await refreshed.json();
      setAdmins(updated.admins);
    } catch (err) {
      console.error("Failed to remove admin:", err);
    }
  };

  const saveConfig = async () => {
    await fetch("/api/settings/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ announcement, darkMode }),
    });
    setMessage("✅ Settings saved.");
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!isAdmin) return <p className="p-8">🔒 Access Denied</p>;

  return (
    <Layout>
      <div className="p-4 space-y-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>

        {/* 🌙 Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          <span className="font-medium">Dark Mode</span>
          <Toggle
            checked={darkMode}
            icons={{ checked: "🌙", unchecked: "☀️" }}
            onChange={toggleDarkMode}
          />
        </div>

        {/* Accordion Sections */}
        {[
          {
            id: "admin",
            title: "Manage Admin Access",
            content: (
              <>
                {/* ➕ Add Admin */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">Add Admin</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={promote}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                      Give Access
                    </button>
                  </div>
                  {message && <p className="text-sm text-green-600">{message}</p>}
                </div>

                {/* 🗑️ Remove Admin */}
                {isSuperAdmin && (
                  <div className="mt-6">
                    <label className="block font-medium mb-2">
                      Remove Admin Access
                    </label>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {admins
                        .filter(
                          (admin) => admin.email !== "bjorni.k2005@gmail.com"
                        )
                        .map((admin) => (
                          <li
                            key={admin.email}
                            className="flex justify-between items-center bg-gray-100 p-2 rounded"
                          >
                            <span>{admin.email}</span>
                            <button
                              onClick={() => removeAdmin(admin.email)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </>
            ),
          },
          {
            id: "announcement",
            title: "Announcements",
            content: (
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Enter announcement..."
                className="w-full p-2 border rounded-xl min-h-[80px]"
              />
            ),
          },
          {
            id: "logs",
            title: "Admin Login Logs",
            content: (
              <ul className="space-y-1 text-sm text-gray-600">
                {admins.map((admin) => (
                  <li key={admin.email}>
                    {admin.email} — Last login:{" "}
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString()
                      : "N/A"}
                  </li>
                ))}
              </ul>
            ),
          },
        ].map(({ id, title, content }) => (
          <div key={id} className="border rounded">
            <button
              onClick={() => toggleSection(id)}
              className="w-full text-left px-4 py-3 font-medium flex justify-between items-center"
            >
              {title}
              <span>{openSection === id ? "▲" : "▼"}</span>
            </button>
            {openSection === id && <div className="p-4 border-t">{content}</div>}
          </div>
        ))}

        <div className="text-right">
          <button
            onClick={saveConfig}
            className="bg-green-600 text-white px-6 py-2 rounded-xl mt-4"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
