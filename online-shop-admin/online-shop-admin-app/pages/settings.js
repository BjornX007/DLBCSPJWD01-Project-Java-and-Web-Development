// Settings page for the admin panel.
// Here I manage admin roles, dark mode, announcements and logs.

import { useSession } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { useTheme } from "../context/ThemeContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function Settings() {
  // I use NextAuth to get the logged-in user session
  const { data: session, status } = useSession();

  // Only admins should be able to access this page
  const isAdmin = session?.user?.role === "admin";

  // Super admin has extended rights (can remove other admins)
  const isSuperAdmin = session?.user?.email === "bjorni.k2005@gmail.com";

  // Dark mode state comes from my global Theme Context
  const { darkMode, toggleDarkMode } = useTheme();

  // Local states used in this page
  const [email, setEmail] = useState(""); // email for adding new admin
  const [message, setMessage] = useState(""); // feedback message
  const [announcement, setAnnouncement] = useState(""); // global announcement text
  const [admins, setAdmins] = useState([]); // list of all admins
  const [openSection, setOpenSection] = useState(null); // accordion toggle

  // Custom modal I made to confirm dangerous actions (like removing admin)
  const { confirm, Modal } = useConfirmModal();

  // Toggle accordion sections open / closed
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  // When the page loads I fetch admins + saved settings from backend
  useEffect(() => {
    const load = async () => {
      try {
        // Fetch existing admins from database
        const res = await fetch("/api/admins");
        const { admins } = await res.json();
        setAdmins(admins);

        // Load saved settings (announcement + dark mode value)
        const configRes = await fetch("/api/settings/config");
        const config = await configRes.json();
        setAnnouncement(config.announcement || "");
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };

    load();
  }, []);

  // Function for promoting a user to admin by email
  const promote = async () => {
    try {
      const res = await fetch("/api/admins/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      // If success, refresh admin list
      if (data.success) {
        setMessage("Admin added successfully.");
        setEmail("");

        const refreshed = await fetch("/api/admins");
        const updated = await refreshed.json();
        setAdmins(updated.admins);
      } else {
        setMessage("Failed to add admin.");
      }
    } catch (err) {
      console.error("Promotion failed:", err);
      setMessage("Error while promoting admin.");
    }
  };

  // Function for removing admin access (only super admin can do this)
  const removeAdmin = async (emailToRemove) => {
    try {
      await fetch("/api/admins/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToRemove }),
      });

      // Refresh list after removing admin
      const refreshed = await fetch("/api/admins");
      const updated = await refreshed.json();
      setAdmins(updated.admins);
    } catch (err) {
      console.error("Failed to remove admin:", err);
    }
  };

  // Saves global settings such as announcement + dark mode preference
  const saveConfig = async () => {
    await fetch("/api/settings/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ announcement, darkMode }),
    });

    setMessage("Settings saved successfully.");
  };

  // Loading state while session is being checked
  if (status === "loading") return <p>Loading...</p>;

  // If user is not admin, block page access
  if (!isAdmin) return <p className="p-8">Access Denied</p>;

  return (
    <Layout>
      {/* Main settings container */}
      <div className="max-w-4xl ml-5 mt-6 space-y-5 px-4 rounded-2xl p-3 shadow-2xl">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>

        {/* Dark mode switch (shared across app using context) */}
        <div className="flex items-center gap-6 mb-4">
          <span>Dark Mode</span>
          <Toggle
            checked={darkMode}
            icons={{ checked: "🌙", unchecked: "☀️" }}
            onChange={toggleDarkMode}
          />
        </div>

        {/* Settings sections (Accordion UI) */}
        {[
          {
            id: "admin",
            title: "Manage Admin Access",

            // Section for adding + removing admins
            content: (
              <>
                {/* Add new admin */}
                <div className="mb-3">
                  <label className="block mb-3">
                    Add Admin (by email)
                  </label>

                  <div className="flex gap-2 mb-1">
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

                  {message && (
                    <p className="text-sm text-green-600">{message}</p>
                  )}
                </div>

                {/* Remove admin — only visible for super admin */}
                {isSuperAdmin && (
                  <div className="mt-4">
                    <label className="block mb-2">
                      Remove Admin Access
                    </label>

                    <ul className="space-y-1 text-sm">
                      {admins
                        .filter(
                          (admin) =>
                            admin.email !== "bjorni.k2005@gmail.com"
                        )
                        .map((admin) => (
                          <li
                            key={admin.email}
                            className="flex justify-between items-center bg-gray-100 p-2 rounded"
                          >
                            <span>{admin.email}</span>

                            {/* I use my custom confirm modal here */}
                            <button
                              className="text-red-600"
                              onClick={() =>
                                confirm(
                                  `Remove admin rights from ${admin.email}?`,
                                  () => removeAdmin(admin.email)
                                )
                              }
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

            // Admin can publish a message that appears in shop UI
            content: (
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Write an announcement..."
                className="w-full p-2 border rounded-xl min-h-[80px]"
              />
            ),
          },

          {
            id: "logs",
            title: "Admin Login Logs",

            // Shows last login time of each admin
            content: (
              <ul className="space-y-1 text-sm text-white">
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
          <div
            key={id}
            className="shadow-2xl rounded-3xl bg-gray-600 text-white"
          >
            {/* Accordion header */}
            <button
              onClick={() => toggleSection(id)}
              className="w-full text-left px-4 py-3 flex justify-between"
            >
              {title}
              <span>{openSection === id ? "▲" : "▼"}</span>
            </button>

            {/* If section is active display its content */}
            {openSection === id && <div className="p-4 border-t">{content}</div>}
          </div>
        ))}

        {/* Save settings button */}
        <div className="text-right mt-4">
          <button
            onClick={saveConfig}
            className="bg-green-600 text-white px-6 py-2 rounded-xl"
          >
            Save All Settings
          </button>
        </div>
      </div>

      {/* Confirm modal used across page */}
      <Modal />
    </Layout>
  );
}
