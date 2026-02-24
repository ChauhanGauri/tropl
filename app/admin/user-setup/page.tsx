"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

const dummyUsers = [
  { id: 1, name: "Amit Sharma", role: "Recruiter", email: "amit.sharma@email.com" },
  { id: 2, name: "Priya Singh", role: "Admin", email: "priya.singh@email.com" },
  { id: 3, name: "Rahul Verma", role: "Candidate", email: "rahul.verma@email.com" },
];

export default function UserSetupPage() {
  const [newUser, setNewUser] = useState({ name: "", role: "Recruiter", email: "" });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">User Setup</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User List */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
            <ul>
              {dummyUsers.map(user => (
                <li key={user.id} className="border-b last:border-b-0 py-2">
                  <div className="font-medium text-gray-800">{user.name} ({user.role})</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Add User */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                alert("User added! (dummy)");
                setNewUser({ name: "", role: "Recruiter", email: "" });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  required
                >
                  <option value="Recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                  <option value="Candidate">Candidate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add User</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
