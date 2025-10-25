"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

interface AuditRow {
  id: string;
  subject_type: string;
  subject_id: string;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
}

// Action pill component with color coding
function ActionPill({ action }: { action: string }) {
  const colorMap: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    executed: "bg-blue-100 text-blue-800",
    created: "bg-gray-100 text-gray-800",
    classified: "bg-purple-100 text-purple-800",
    dispatched: "bg-yellow-100 text-yellow-800",
  };
  const bg = colorMap[action] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${bg}`}
    >
      {action.replace("_", " ")}
    </span>
  );
}

/**
 * Audit log viewer. Fetches the most recent audit log entries and renders
 * them in a compact timeline view. This gives reviewers visibility into all
 * actions performed by the system and by humans, supporting the
 * human-in-the-loop narrative.
 */
export default function AuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error) setLogs((data as AuditRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Nav />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">📋 Audit Log</h1>
        <button
          onClick={fetchLogs}
          className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
        >
          🔄 Refresh
        </button>
      </div>
      {loading && <p className="text-gray-600">Loading audit log…</p>}
      {!loading && logs.length === 0 && (
        <p className="text-gray-600">No audit entries found.</p>
      )}

      {/* Compact timeline view */}
      <div className="space-y-2">
        {logs.map((row) => {
          const reviewer = row.payload?.reviewer as string | undefined;
          const dispatched = row.payload?.dispatched as number | undefined;

          return (
            <div
              key={row.id}
              className="border-l-4 border-gray-300 pl-4 py-2 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <ActionPill action={row.action} />
                <span className="text-sm capitalize text-gray-700">
                  {row.subject_type}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {row.subject_id.slice(0, 8)}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(row.created_at).toLocaleString()}
                </span>
              </div>

              {/* Show relevant payload details */}
              {reviewer && (
                <p className="text-xs text-gray-600 mt-1">
                  Reviewer: {reviewer}
                </p>
              )}
              {dispatched !== undefined && (
                <p className="text-xs text-gray-600 mt-1">
                  Dispatched {dispatched} task(s)
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
