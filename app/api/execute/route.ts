import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Execution endpoint: interprets the actions array on a task's output and
 * simulates side-effects in a safe, demo-friendly way. Each action
 * results in a corresponding audit log entry. Supported kinds:
 *
 *  - `draft_message`: logs a `draft_message_sent` entry with a preview.
 *  - `extract_table`: logs an `evidence_table_saved` entry with row count.
 *  - `fill_form`: logs a `computer_use_step` entry pointing to the mock portal.
 *  - unknown kinds fall back to `execution_skipped`.
 */
export async function POST(req: NextRequest) {
  const { taskId } = await req.json();

  // Retrieve the task and bail early if not found
  const { data: task, error: tErr } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
  if (tErr || !task) {
    return NextResponse.json(
      { ok: false, error: tErr?.message ?? 'Task not found' },
      { status: 400 }
    );
  }

  const actions: any[] = task.output?.actions ?? [];
  const logs: any[] = [];

  for (const a of actions) {
    if (a.kind === 'draft_message') {
      logs.push({
        subject_type: 'task',
        subject_id: taskId,
        action: 'draft_message_sent',
        payload: {
          to: a.data?.to,
          subject: a.data?.subject,
          preview: a.data?.body?.slice(0, 160) ?? '',
        },
      });
      continue;
    }
    if (a.kind === 'extract_table') {
      const rows = a.data?.rows ?? [];
      logs.push({
        subject_type: 'task',
        subject_id: taskId,
        action: 'evidence_table_saved',
        payload: { rowsCount: rows.length, sample: rows[0] ?? null },
      });
      continue;
    }
    if (a.kind === 'fill_form') {
      logs.push({
        subject_type: 'task',
        subject_id: taskId,
        action: 'computer_use_step',
        payload: {
          url: '/mock-portal',
          fields: a.data ?? {},
          note: 'Simulated UI automation step',
        },
      });
      continue;
    }
    // For unknown actions, record a generic skip
    logs.push({
      subject_type: 'task',
      subject_id: taskId,
      action: 'execution_skipped',
      payload: { reason: `Unknown action ${a.kind}` },
    });
  }

  // Persist all logs
  if (logs.length) {
    await supabase.from('audit_logs').insert(logs);
  }

  // Update the task's status to executed
  await supabase.from('tasks').update({ status: 'executed' }).eq('id', taskId);

  return NextResponse.json({ ok: true, actionsProcessed: actions.length });
}