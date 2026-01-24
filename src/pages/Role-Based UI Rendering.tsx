"use client";

import { useState } from "react";

export default function RoleBasedUI() {
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Role-Based UI Rendering
        </h1>

        {/* Role Switcher */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 p-2 border rounded-lg"
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        {/* Common UI */}
        <div className="mb-4 p-3 rounded-lg bg-gray-50">
          <p className="text-gray-700">Welcome to the dashboard 👋</p>
        </div>

        {/* User UI */}
        {role === "user" && (
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
            📄 View content
          </div>
        )}

        {/* Editor UI */}
        {role === "editor" && (
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
            ✏️ Edit content
          </div>
        )}

        {/* Admin UI */}
        {role === "admin" && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 space-y-2">
            <p>🛠 Manage users</p>
            <p>📊 View analytics</p>
            <p>⚠️ System settings</p>
          </div>
        )}
      </div>
    </div>
  );
}
