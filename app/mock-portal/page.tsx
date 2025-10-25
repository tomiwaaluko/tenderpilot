"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

// A simple mock provider portal used to demonstrate the Gemini Computer
// Use model. In a real implementation, the Computer Use agent would
// navigate to this page, fill in the form, and submit it.

export default function MockPortal() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    dob: "",
    claimNumber: "",
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <Nav />
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Orlando Care Provider — Records Request
        </h1>
        <p className="text-sm text-blue-700 mt-1">
          Medical Records Portal (Demo)
        </p>
      </div>

      {submitted && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          ✅ Request submitted successfully! Confirmation sent to your email.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Patient Full Name *
          </label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., John Doe"
            value={formData.patientName}
            onChange={(e) =>
              setFormData({ ...formData, patientName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Claim Number</label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CLM-2025-001"
            value={formData.claimNumber}
            onChange={(e) =>
              setFormData({ ...formData, claimNumber: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Notes
          </label>
          <textarea
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Specify date ranges, specific providers, or type of records needed..."
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full border rounded px-4 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Submit Records Request
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        🤖 This is a demo portal for Computer Use demonstrations. No actual
        records will be requested.
      </p>
    </main>
  );
}
