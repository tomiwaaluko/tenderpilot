import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Approval endpoint: record a reviewer decision (approve or reject) for
// a proposed task. Updates the status of the task and writes an audit log.

export async function POST(req: NextRequest) {
  const { taskId, approve, reviewer } = await req.json();
  // Insert approval decision
  await supabase.from('approvals').insert({
    task_id: taskId,
    status: approve ? 'approved' : 'rejected',
    reviewer,
  });
  // Update task status
  await supabase
    .from('tasks')
    .update({ status: approve ? 'approved' : 'rejected' })
    .eq('id', taskId);
  // Record audit log
  await supabase.from('audit_logs').insert({
    subject_type: 'task',
    subject_id: taskId,
    action: approve ? 'approved' : 'rejected',
    payload: {},
  });
  return NextResponse.json({ ok: true });
}
