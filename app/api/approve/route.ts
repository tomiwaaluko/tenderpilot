// src/app/api/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { taskId, approve, reviewer } = await req.json();

  // record approval
  await supabase.from("approvals").insert({
    task_id: taskId,
    status: approve ? "approved" : "rejected",
    reviewer,
  });

  await supabase
    .from("tasks")
    .update({ status: approve ? "approved" : "rejected" })
    .eq("id", taskId);

  await supabase.from("audit_logs").insert({
    subject_type: "task",
    subject_id: taskId,
    action: approve ? "approved" : "rejected",
    payload: {},
  });

  // auto-execute approved tasks
  if (approve) {
    // call the execute handler internally
    // IMPORTANT: We call the route function directly to avoid needing a base URL.
    // If you prefer, you can do `await fetch("/api/execute", { ... })` from the client.
    const execRes = await fetch(
      new URL(
        "/api/execute",
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      ),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      }
    )
      .then((r) => r.json())
      .catch((e) => ({ ok: false, error: String(e) }));

    // Log the execution result
    await supabase.from("audit_logs").insert({
      subject_type: "task",
      subject_id: taskId,
      action: "execution_result",
      payload: execRes,
    });
  }

  return NextResponse.json({ ok: true });
}
