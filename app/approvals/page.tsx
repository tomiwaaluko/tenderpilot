"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";

interface TaskRow {
  id: string;
  case_id: string;
  type: string;
  status: string;
  assignee_agent: string;
  input: unknown;
  output: {
    summary?: string;
    citations?: string[];
    actions?: Array<{
      kind: string;
      data: Record<string, unknown>;
    }>;
  };
  confidence: number;
  created_at: string;
}

// Confidence badge component
function ConfidenceBadge({ value }: { value?: number }) {
  if (!value) return null;
  const percent = (value * 100).toFixed(1);
  const bg =
    value >= 0.8
      ? "bg-green-100 text-green-800"
      : value >= 0.6
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${bg}`}
    >
      {percent}% confidence
    </span>
  );
}

// Execution preview component
function ExecutionPreview({ output }: { output: TaskRow["output"] }) {
  if (!output?.actions || output.actions.length === 0) return null;
  const first = output.actions[0];

  if (first.kind === "draft_message") {
    const data = first.data as { to?: string; body?: string };
    return (
      <div className="mt-2 bg-blue-50 p-3 rounded text-sm">
        <p className="font-medium text-blue-900 mb-1">
          📧 Draft message to {data.to}
        </p>
        <p className="text-gray-700 line-clamp-3">{data.body}</p>
      </div>
    );
  }

  if (first.kind === "extract_table") {
    const data = first.data as { rows?: unknown[]; columns?: string[] };
    return (
      <div className="mt-2 bg-purple-50 p-3 rounded text-sm">
        <p className="font-medium text-purple-900 mb-1">
          📊 {data.rows?.length ?? 0} evidence rows extracted
        </p>
        <p className="text-gray-700">Columns: {data.columns?.join(", ")}</p>
      </div>
    );
  }

  if (first.kind === "fill_form") {
    const data = first.data as {
      formName?: string;
      fields?: Record<string, unknown>;
    };
    return (
      <div className="mt-2 bg-green-50 p-3 rounded text-sm">
        <p className="font-medium text-green-900">📝 Form: {data.formName}</p>
        <p className="text-gray-700">
          {Object.keys(data.fields ?? {}).length} fields populated
        </p>
      </div>
    );
  }

  return null;
}

/**
 * The Approvals page lists all tasks with status 'proposed' and allows
 * reviewers to approve or reject them. After making a decision, the
 * list refreshes. Each task displays its summary, confidence, citations,
 * and execution preview.
 */
export default function ApprovalsPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "proposed");
    if (!error) setTasks((data as TaskRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    // Initial fetch on mount
    // eslint-disable-next-line react-compiler/react-compiler
    fetchTasks();
    // Refresh list every 15s in case other clients approve tasks
    const interval = setInterval(() => {
      // eslint-disable-next-line react-compiler/react-compiler
      fetchTasks();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  async function handleDecision(taskId: string, approve: boolean) {
    try {
      await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, approve, reviewer: "demo_user" }),
      });
      push({
        title: approve ? "Task approved" : "Task rejected",
        description: approve
          ? "Execution triggered"
          : "Task marked as rejected",
      });
      await fetchTasks();
    } catch (error) {
      push({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process decision",
      });
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Nav />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">✅ Approvals</h1>
        <button
          onClick={fetchTasks}
          className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
        >
          🔄 Refresh
        </button>
      </div>
      {loading && <p className="text-gray-600">Loading proposed tasks…</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-gray-600">
          No tasks awaiting approval. Run the orchestrator to generate
          proposals.
        </p>
      )}
      <div className="space-y-6">
        {tasks.map((task) => {
          const output = task.output || {};
          const citations = output.citations || [];

          return (
            <div
              key={task.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-medium text-lg capitalize">
                  {task.type.replace("_", " ")} proposal
                </h2>
                <ConfidenceBadge value={task.confidence} />
              </div>

              <p className="text-sm mb-2">
                <strong>Summary:</strong> {output.summary || "n/a"}
              </p>

              {citations.length > 0 && (
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Citations:</strong> {citations.join(", ")}
                </div>
              )}

              <ExecutionPreview output={output} />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDecision(task.id, true)}
                  className="border rounded-lg px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleDecision(task.id, false)}
                  className="border rounded-lg px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
