import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { taskId, approve, reviewer } = await req.json();

  await supabase
    .from("approvals")
    .insert({
      task_id: taskId,
      status: approve ? "approved" : "rejected",
      reviewer,
    });
  await supabase
    .from("tasks")
    .update({ status: approve ? "approved" : "rejected" })
    .eq("id", taskId);
  await supabase
    .from("audit_logs")
    .insert({
      subject_type: "task",
      subject_id: taskId,
      action: approve ? "approved" : "rejected",
      payload: {},
    });

  if (approve) {
    const url = new URL(
      "/api/execute",
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    );
    const exec = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    })
      .then((r) => r.json())
      .catch((e) => ({ ok: false, error: String(e) }));
    await supabase
      .from("audit_logs")
      .insert({
        subject_type: "task",
        subject_id: taskId,
        action: "execution_result",
        payload: exec,
      });
  }

  return NextResponse.json({ ok: true });
}
