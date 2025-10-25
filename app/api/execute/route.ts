// src/app/api/execute/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Executes an approved task by interpreting task.output.actions[].
 * We log simulated steps in audit_logs (great for the demo).
 * Supported actions:
 *  - draft_message: write audit step "draft_message_sent"
 *  - extract_table: persist rows into artifacts.extracted_fields and log
 *  - fill_form: write "computer_use_step" audit with a URL to /mock-portal
 */
export async function POST(req: NextRequest) {
  const { taskId } = await req.json();

  const { data: task, error: tErr } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (tErr || !task)
    return NextResponse.json(
      { ok: false, error: tErr?.message ?? "Task not found" },
      { status: 400 }
    );

  const actions: any[] = task.output?.actions ?? [];
  const logs: any[] = [];

  for (const a of actions) {
    switch (a.kind) {
      case "draft_message": {
        // simulate a safe send; we only log
        logs.push({
          subject_type: "task",
          subject_id: taskId,
          action: "draft_message_sent",
          payload: {
            to: a.data?.to,
            subject: a.data?.subject,
            preview: a.data?.body?.slice(0, 160) ?? "",
          },
        });
        break;
      }
      case "extract_table": {
        // For demo we just log the rows; optionally you could persist
        // into artifacts.extracted_fields or a separate evidence table.
        const rows = a.data?.rows ?? [];
        logs.push({
          subject_type: "task",
          subject_id: taskId,
          action: "evidence_table_saved",
          payload: { rowsCount: rows.length, sample: rows[0] ?? null },
        });
        break;
      }
      case "fill_form": {
        // Simulate Computer Use by logging a step and pointing to /mock-portal
        logs.push({
          subject_type: "task",
          subject_id: taskId,
          action: "computer_use_step",
          payload: {
            url: "/mock-portal",
            fields: a.data ?? {},
            note: "Simulated UI automation step; see mock-portal",
          },
        });
        break;
      }
      default: {
        logs.push({
          subject_type: "task",
          subject_id: taskId,
          action: "execution_skipped",
          payload: { reason: `Unknown action kind: ${a.kind}` },
        });
      }
    }
  }

  if (logs.length) {
    await supabase.from("audit_logs").insert(logs);
  }

  await supabase.from("tasks").update({ status: "executed" }).eq("id", taskId);

  return NextResponse.json({ ok: true, actionsProcessed: actions.length });
}
