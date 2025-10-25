"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

// Tasks page: provides a simple button to trigger the orchestrator loop.
// In a full implementation this page would list all pending and
// proposed tasks, but for the demo we focus on dispatching tasks to
// their agents.

export default function Tasks() {
  const [result, setResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function run() {
    setResult(null);
    setIsRunning(true);
    try {
      const res = await fetch("/api/orchestrator/run", { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        setResult(`❌ Error: ${res.status} - ${text}`);
        return;
      }
      const data = await res.json();
      setResult(
        `✅ Dispatched ${data.dispatched} task${
          data.dispatched !== 1 ? "s" : ""
        }`
      );
    } catch (error) {
      setResult(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
      <p className="mb-4 text-gray-600">
        This page triggers the orchestrator to dispatch pending tasks to their
        specialist agents.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={isRunning}
        className="w-full border rounded px-4 py-2 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRunning ? "Running..." : "Run Orchestrator"}
      </button>
      {result && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            result.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {result}
        </div>
      )}
    </main>
  );
}
