"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

// Inbox page: provides a basic form to ingest a message for a case. It
// immediately triggers classification after ingestion. This page is
// deliberately simple to keep the demo focused on the agent workflow.

export default function Inbox() {
  const [caseId, setCaseId] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);
    try {
      // Call ingest API
      const fd = new FormData();
      fd.append("caseId", caseId);
      fd.append("text", text);
      const ingestRes = await fetch("/api/ingest", {
        method: "POST",
        body: fd,
      });
      const ingestData = await ingestRes.json();
      if (!ingestData.messageId) {
        setStatus("❌ Ingest failed");
        return;
      }
      // Call classify API
      await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, messageId: ingestData.messageId }),
      });
      setStatus("✅ Message ingested and classification queued");
      setText("");
    } catch (error) {
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Inbox</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Case ID</label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CASE-001"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the client's email or message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            required
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border rounded px-4 py-2 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit & Classify"}
        </button>
      </form>
      {status && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            status.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {status}
        </div>
      )}
    </main>
  );
}
