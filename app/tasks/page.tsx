"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import { useToast } from "@/components/Toast";

// Tasks page: provides a simple button to trigger the orchestrator loop.
// In a full implementation this page would list all pending and
// proposed tasks, but for the demo we focus on dispatching tasks to
// their agents.

export default function Tasks() {
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/orchestrator/run", { method: "POST" });
      const data = await res.json();
      push({
        title: "Orchestrator complete",
        description: `Dispatched ${data.dispatched} tasks`,
      });
    } catch (error) {
      push({
        title: "Orchestrator failed",
        description:
          error instanceof Error ? error.message : "Failed to dispatch tasks",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">🚀 Tasks</h1>
      <p className="mb-4 text-gray-600">
        This page triggers the orchestrator to dispatch pending tasks to
        specialist agents.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className={`border rounded-xl px-6 py-3 font-medium ${
          loading
            ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
            : "bg-black text-white hover:bg-gray-800"
        } transition-colors`}
      >
        {loading ? "Working..." : "Run Orchestrator"}
      </button>
    </main>
  );
}
