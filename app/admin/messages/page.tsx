"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

const dummyMessages = [
  {
    id: 1,
    sender: "Priya Singh",
    subject: "New Candidate Available",
    content: "Hi, we have a new candidate available for React roles.",
    date: "2026-02-24",
  },
  {
    id: 2,
    sender: "Rahul Verma",
    subject: "Interview Feedback",
    content: "The interview for Amit Sharma went well.",
    date: "2026-02-23",
  },
];

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({ subject: "", content: "" });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inbox */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Inbox</h2>
            <ul>
              {dummyMessages.map((msg) => (
                <li
                  key={msg.id}
                  className="border-b last:border-b-0 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="font-medium text-gray-800">{msg.subject}</div>
                  <div className="text-xs text-gray-500">From: {msg.sender} | {msg.date}</div>
                </li>
              ))}
            </ul>
            {selectedMessage && (
              <div className="mt-4 border-t pt-4">
                <div className="font-bold text-lg mb-2">{selectedMessage.subject}</div>
                <div className="text-gray-700 mb-2">{selectedMessage.content}</div>
                <div className="text-xs text-gray-500">From: {selectedMessage.sender} | {selectedMessage.date}</div>
                <button className="mt-2 px-4 py-2 bg-gray-200 rounded" onClick={() => setSelectedMessage(null)}>Close</button>
              </div>
            )}
          </div>

          {/* Send Message */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Send Message</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                alert("Message sent! (dummy)");
                setNewMessage({ subject: "", content: "" });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={newMessage.subject}
                  onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={5}
                  value={newMessage.content}
                  onChange={e => setNewMessage({ ...newMessage, content: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
