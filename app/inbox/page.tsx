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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
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
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Inbox</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Case ID"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Paste the client's email or message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          required
        />
        <button
          type="submit"
          className="border rounded px-4 py-2 bg-foreground text-background"
        >
          Submit &amp; Classify
        </button>
      </form>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </main>
  );
}
