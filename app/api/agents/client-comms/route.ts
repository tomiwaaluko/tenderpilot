import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CLIENT_COMMS_PROMPT } from "@/lib/prompts";
import { callGeminiJSON } from "@/lib/llm";

// Client communication endpoint: given a taskId, fetch the message
// associated with this task and use Gemini to generate a draft reply.

export async function POST(req: NextRequest) {
  const { taskId } = await req.json();
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  const messageId = task.input?.messageId;
  const { data: msg } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();
  if (!msg) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // A2A handoff: Load evidence sorter task for the same case
  const { data: evidenceTask } = await supabase
    .from("tasks")
    .select("*")
    .eq("case_id", task.case_id)
    .eq("type", "evidence_sorter")
    .in("status", ["proposed", "approved", "executed"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let evidenceSummary = "";
  if (evidenceTask?.output?.actions) {
    const tableAction = evidenceTask.output.actions.find(
      (a: { kind: string }) => a.kind === "table_insert"
    );
    if (tableAction?.data?.rows) {
      const rows = tableAction.data.rows.slice(0, 2);
      evidenceSummary = rows
        .map(
          (r: { provider: string; date: string; amount: number }) =>
            `${r.provider} (${r.date}): $${r.amount}`
        )
        .join("; ");
    }
  }

  const mockProposal = {
    task_type: "client_update",
    summary: evidenceSummary
      ? `Explains next steps and references evidence: ${evidenceSummary}`
      : "Explains next steps and requests missing info politely.",
    actions: [
      {
        kind: "draft_message",
        data: {
          to: "client",
          subject: "Case Update",
          body: evidenceSummary
            ? `Hi — thanks for sending those documents. We have reviewed the evidence: ${evidenceSummary}. Here is what we are doing next: (1) compile medical records, (2) confirm billing totals, and (3) schedule a check-in. If you notice any missing items, reply here. We will keep you posted.`
            : "Hi — thanks for sending those documents. Here is what we are doing next: (1) compile medical records, (2) confirm billing totals, and (3) schedule a check-in. If you notice any missing items, reply here. We will keep you posted.",
          style: "empathetic",
        },
      },
    ],
    confidence: 0.82,
  };
  let proposal;
  try {
    const result = await callGeminiJSON(
      CLIENT_COMMS_PROMPT,
      msg.topic ?? "",
      mockProposal
    );
    // Accept the model output if it looks like a proposal, otherwise fall back to mock
    if (
      result &&
      typeof result === "object" &&
      "task_type" in result &&
      result.task_type
    ) {
      proposal = result;
    } else {
      proposal = mockProposal;
    }
  } catch {
    // On error, use the mock proposal
    proposal = mockProposal;
  }
  const { error } = await supabase
    .from("tasks")
    .update({ output: proposal, status: "proposed" })
    .eq("id", taskId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log A2A handoff if evidence was used
  if (evidenceSummary) {
    await supabase.from("audit_logs").insert({
      subject_type: "case",
      subject_id: task.case_id,
      action: "a2a_handoff",
      payload: {
        from: "evidence_sorter",
        to: "client_comms",
        took: "summary_included",
      },
    });
  }

  return NextResponse.json({ ok: true, proposal });
}
