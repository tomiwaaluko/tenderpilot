"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import { useToast } from "@/components/Toast";

// Inbox page: provides a form to ingest a message for a case and
// immediately triggers classification after ingestion.

export default function Inbox() {
  const [caseId, setCaseId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  // Load last used caseId from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tp.caseId");
    if (saved) setCaseId(saved);
  }, []);

  // Save caseId to localStorage when it changes
  useEffect(() => {
    if (caseId) localStorage.setItem("tp.caseId", caseId);
  }, [caseId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
        push({ title: "Ingest failed", description: "Could not save message" });
        return;
      }

      // Call classify API
      await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, messageId: ingestData.messageId }),
      });

      push({
        title: "Message ingested",
        description: "Saved & classified successfully",
      });
      setText("");
    } catch (error) {
      push({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process message",
      });
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste your case UUID from Supabase or use any identifier
          </p>
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
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full border rounded px-4 py-2 ${
            loading
              ? "opacity-50 cursor-not-allowed bg-gray-400"
              : "bg-black text-white hover:bg-gray-800"
          } transition-colors`}
        >
          {loading ? "Processing..." : "Submit & Classify"}
        </button>
      </form>
    </main>
  );
}
