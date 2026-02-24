"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function SettingsPage() {
  const [email, setEmail] = useState("admin@email.com");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-white rounded shadow p-6 max-w-md">
          <form
            onSubmit={e => {
              e.preventDefault();
              alert("Settings updated! (dummy)");
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Settings</button>
          </form>
        </div>
      </main>
    </div>
  );
}
