"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

const dummyExpenses = [
  { id: 1, description: "Job Portal Subscription", amount: 1200, date: "2026-02-10" },
  { id: 2, description: "Candidate Travel Reimbursement", amount: 500, date: "2026-02-15" },
  { id: 3, description: "Interview Snacks", amount: 150, date: "2026-02-20" },
];

export default function ExpensesPage() {
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", date: "" });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Expenses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Expense List */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Expense History</h2>
            <ul>
              {dummyExpenses.map(exp => (
                <li key={exp.id} className="border-b last:border-b-0 py-2">
                  <div className="font-medium text-gray-800">{exp.description}</div>
                  <div className="text-xs text-gray-500">Amount: ₹{exp.amount} | Date: {exp.date}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Add Expense */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                alert("Expense added! (dummy)");
                setNewExpense({ description: "", amount: "", date: "" });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={newExpense.description}
                  onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={newExpense.date}
                  onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Expense</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
