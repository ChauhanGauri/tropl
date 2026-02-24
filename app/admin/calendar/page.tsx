"use client";
import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

const dummyEvents = [
  { id: 1, title: "Interview: Amit Sharma", date: "2026-02-26", time: "10:00 AM" },
  { id: 2, title: "Client Meeting: Tech Corp", date: "2026-02-27", time: "2:00 PM" },
  { id: 3, title: "Resume Review: Priya Singh", date: "2026-02-28", time: "4:00 PM" },
];

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Calendar</h1>
        <div className="bg-white rounded shadow p-6 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <ul>
            {dummyEvents.map(event => (
              <li key={event.id} className="border-b last:border-b-0 py-2">
                <div className="font-medium text-gray-800">{event.title}</div>
                <div className="text-xs text-gray-500">{event.date} | {event.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
