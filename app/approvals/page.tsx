"use client";

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import { supabase } from '@/lib/supabase';

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

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'proposed');
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
    await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, approve, reviewer: 'demo_user' }),
    });
    await fetchTasks();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Nav />
      <h1 className="text-2xl font-semibold mb-4">Approvals</h1>
      {loading && <p>Loading proposed tasks…</p>}
      {!loading && tasks.length === 0 && (
        <p>No tasks awaiting approval. Run the orchestrator to generate proposals.</p>
      )}
      <div className="space-y-6">
        {tasks.map((task) => {
          const output = task.output || {};
          let actionSummary: string | null = null;
          try {
            if (output.actions && output.actions.length) {
              const first = output.actions[0];
              if (first.kind === 'extract_table') {
                actionSummary = `${first.data.rows.length} evidence rows extracted`;
              } else if (first.kind === 'draft_message') {
                actionSummary = `Draft message to ${first.data.to}`;
              }
            }
          } catch {}
          return (
            <div key={task.id} className="border rounded p-4">
              <h2 className="font-medium mb-2 capitalize">
                {task.type.replace('_', ' ')} proposal
              </h2>
              <p className="text-sm mb-1">
                <strong>Summary:</strong> {output.summary || 'n/a'}
              </p>
              {actionSummary && (
                <p className="text-sm mb-2 text-gray-600">
                  <strong>Action:</strong> {actionSummary}
                </p>
              )}
              <p className="text-xs text-gray-500 mb-3">
                Confidence: {(task.confidence * 100).toFixed(1)}%
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(task.id, true)}
                  className="border rounded px-3 py-1 bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(task.id, false)}
                  className="border rounded px-3 py-1 bg-red-600 text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
