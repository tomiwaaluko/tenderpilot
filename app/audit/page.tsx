"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

interface AuditRow {
  id: string;
  subject_type: string;
  subject_id: string;
  action: string;
  payload: any;
  created_at: string;
}

/**
 * Audit log viewer. Fetches the most recent audit log entries and renders
 * them in a list. This gives reviewers visibility into all actions
 * performed by the system and by humans, supporting the human-in-the-loop
 * narrative.
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
      .limit(100);
    if (!error) setLogs((data as AuditRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes("approved")) return "text-green-700 bg-green-50";
    if (action.includes("rejected")) return "text-red-700 bg-red-50";
    if (action.includes("dispatched")) return "text-blue-700 bg-blue-50";
    if (action.includes("executed") || action.includes("sent"))
      return "text-purple-700 bg-purple-50";
    return "text-gray-700 bg-gray-50";
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Nav />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <button
          onClick={fetchLogs}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {loading && logs.length === 0 && <p>Loading audit log…</p>}
      {!loading && logs.length === 0 && <p>No audit entries found.</p>}
      <div className="space-y-2">
        {logs.map((row) => (
          <div
            key={row.id}
            className="border rounded p-3 text-sm bg-white shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(
                  row.action
                )}`}
              >
                {row.action.replace(/_/g, " ").toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(row.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 mt-2 text-xs">
              <span className="font-medium">{row.subject_type}:</span>{" "}
              {row.subject_id.slice(0, 8)}...
            </p>
            {row.payload && Object.keys(row.payload).length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
                  View payload
                </summary>
                <pre className="mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap text-xs overflow-x-auto">
                  {JSON.stringify(row.payload, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
