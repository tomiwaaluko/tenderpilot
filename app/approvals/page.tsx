"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

interface TaskRow {
  id: string;
  case_id: string;
  type: string;
  status: string;
  assignee_agent: string;
  input: any;
  output: any;
  confidence: number;
  created_at: string;
}

/**
 * The Approvals page lists all tasks with status 'proposed' and allows
 * reviewers to approve or reject them. After making a decision, the
 * list refreshes. Each task displays its summary and the first action
 * for context.
 */
export default function ApprovalsPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "proposed")
      .order("created_at", { ascending: false });
    if (!error) setTasks((data as TaskRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
    // Refresh list every 15s in case other clients approve tasks
    const interval = setInterval(fetchTasks, 15000);
    return () => clearInterval(interval);
  }, []);

  async function handleDecision(taskId: string, approve: boolean) {
    setStatusMessage(null);
    await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, approve, reviewer: "demo_user" }),
    });
    setStatusMessage(
      approve ? "✅ Task approved and executed" : "❌ Task rejected"
    );
    await fetchTasks();
    setTimeout(() => setStatusMessage(null), 3000);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Approvals</h1>
      {statusMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          {statusMessage}
        </div>
      )}
      {loading && <p>Loading proposed tasks…</p>}
      {!loading && tasks.length === 0 && (
        <p>
          No tasks awaiting approval. Run the orchestrator to generate
          proposals.
        </p>
      )}
      <div className="space-y-6">
        {tasks.map((task) => {
          const output = task.output || {};
          let actionSummary: string | null = null;
          const citations = output.citations || [];
          try {
            if (output.actions && output.actions.length) {
              const first = output.actions[0];
              if (first.kind === "extract_table") {
                actionSummary = `${first.data.rows.length} evidence rows extracted`;
              } else if (first.kind === "draft_message") {
                actionSummary = `Draft message to ${first.data.to}`;
              } else if (first.kind === "fill_form") {
                actionSummary = "Fill form in portal";
              }
            }
          } catch {}
          return (
            <div
              key={task.id}
              className="border rounded p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-medium capitalize">
                  {task.type.replace("_", " ")} proposal
                </h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    task.confidence >= 0.8
                      ? "bg-green-100 text-green-700"
                      : task.confidence >= 0.6
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {(task.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <p className="text-sm mb-1">
                <strong>Summary:</strong> {output.summary || "n/a"}
              </p>
              {actionSummary && (
                <p className="text-sm mb-2 text-gray-600">
                  <strong>Action:</strong> {actionSummary}
                </p>
              )}
              {citations.length > 0 && (
                <p className="text-xs text-gray-500 mb-2">
                  <strong>Citations:</strong> {citations.length} source(s)
                </p>
              )}
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleDecision(task.id, true)}
                  className="border rounded px-3 py-1 bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(task.id, false)}
                  className="border rounded px-3 py-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <a
                  href="/mock-portal"
                  target="_blank"
                  className="ml-auto text-xs text-blue-600 underline hover:text-blue-800"
                >
                  Open mock portal →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
