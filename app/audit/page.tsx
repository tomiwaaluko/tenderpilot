"use client";

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import { supabase } from '@/lib/supabase';

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
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
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
    <main className="max-w-3xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Audit Log</h1>
      {loading && <p>Loading audit log…</p>}
      {!loading && logs.length === 0 && <p>No audit entries found.</p>}
      <ul className="space-y-3">
        {logs.map((row) => (
          <li key={row.id} className="border rounded p-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium capitalize">
                {row.action.replace('_', ' ')} {row.subject_type}
              </span>
              <span className="text-gray-500">
                {new Date(row.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600">
              Subject ID: {row.subject_id}
            </p>
            {row.payload && Object.keys(row.payload).length > 0 && (
              <pre className="mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                {JSON.stringify(row.payload, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
