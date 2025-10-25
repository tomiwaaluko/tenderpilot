"use client";

import { useState } from 'react';
import Nav from '@/components/Nav';

// Tasks page: provides a simple button to trigger the orchestrator loop.
// In a full implementation this page would list all pending and
// proposed tasks, but for the demo we focus on dispatching tasks to
// their agents.

export default function Tasks() {
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setResult(null);
    const res = await fetch('/api/orchestrator/run', { method: 'POST' });
    const data = await res.json();
    setResult(`Dispatched ${data.dispatched} tasks`);
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
      <p className="mb-2">This page triggers the orchestrator to dispatch pending tasks.</p>
      <button
        type="button"
        onClick={run}
        className="border rounded px-4 py-2 bg-foreground text-background"
      >
        Run Orchestrator
      </button>
      {result && <p className="text-sm text-gray-600 mt-2">{result}</p>}
    </main>
  );
}
