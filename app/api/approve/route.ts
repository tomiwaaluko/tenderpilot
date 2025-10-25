import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Approval endpoint: record a reviewer decision (approve or reject) for
// a proposed task. Updates the status of the task and writes an audit log.

export async function POST(req: NextRequest) {
  const { taskId, approve, reviewer } = await req.json();

  // Record the approval decision
  await supabase.from('approvals').insert({
    task_id: taskId,
    status: approve ? 'approved' : 'rejected',
    reviewer,
  });

  // Update the task status accordingly
  await supabase
    .from('tasks')
    .update({ status: approve ? 'approved' : 'rejected' })
    .eq('id', taskId);

  // Write an audit log entry for the approval action
  await supabase.from('audit_logs').insert({
    subject_type: 'task',
    subject_id: taskId,
    action: approve ? 'approved' : 'rejected',
    payload: {},
  });

  // If the task is approved, automatically execute it and log the result.
  if (approve) {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    // Invoke the execute endpoint via fetch. Errors are captured as JSON.
    const exec = await fetch(new URL('/api/execute', base), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    })
      .then((r) => r.json())
      .catch((e) => ({ ok: false, error: String(e) }));

    // Persist the execution result to the audit log for visibility
    await supabase.from('audit_logs').insert({
      subject_type: 'task',
      subject_id: taskId,
      action: 'execution_result',
      payload: exec,
    });
  }

  return NextResponse.json({ ok: true });
}
