import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

const benchCandidates = [
  {
    name: "Amit Sharma",
    skill: "React, Node.js",
    experience: "4 years",
    availableFrom: "2026-03-01",
    location: "Bangalore",
    contact: "amit.sharma@email.com",
  },
  {
    name: "Priya Singh",
    skill: "Java, Spring Boot",
    experience: "6 years",
    availableFrom: "2026-02-28",
    location: "Delhi",
    contact: "priya.singh@email.com",
  },
  {
    name: "Rahul Verma",
    skill: "Python, Django",
    experience: "3 years",
    availableFrom: "2026-03-05",
    location: "Hyderabad",
    contact: "rahul.verma@email.com",
  },
];

export default function BenchSalesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Bench Sales Dashboard</h1>
        <p className="text-lg text-gray-700 mb-8">List of available candidates on bench ready for deployment.</p>
        <div className="bg-white rounded shadow p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Available From</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              </tr>
            </thead>
            <tbody>
              {benchCandidates.map((candidate, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-2 font-semibold text-gray-800">{candidate.name}</td>
                  <td className="px-4 py-2 text-gray-700">{candidate.skill}</td>
                  <td className="px-4 py-2 text-gray-700">{candidate.experience}</td>
                  <td className="px-4 py-2 text-gray-700">{candidate.availableFrom}</td>
                  <td className="px-4 py-2 text-gray-700">{candidate.location}</td>
                  <td className="px-4 py-2 text-blue-600 underline">{candidate.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
