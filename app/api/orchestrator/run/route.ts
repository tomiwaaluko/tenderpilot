import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { POST as evidenceSorterHandler } from "@/app/api/agents/evidence-sorter/route";
import { POST as clientCommsHandler } from "@/app/api/agents/client-comms/route";

// Orchestrator run endpoint: dispatch pending tasks to their specialist
// agent endpoints. This simulates a continuous loop, but should be
// called periodically via cron or a client-side timer.

export async function POST() {
  // Select a few pending tasks to dispatch
  const { data: pending } = await supabase
    .from("tasks")
    .select("*")
    .in("status", ["pending"])
    .limit(5);
  if (!pending || pending.length === 0) {
    return NextResponse.json({ ok: true, dispatched: 0 });
  }
  // Dispatch each task by calling its agent handler directly
  const runs = pending.map(async (t) => {
    const handler =
      t.assignee_agent === "evidence_sorter"
        ? evidenceSorterHandler
        : clientCommsHandler;

    // Create a mock request with the taskId
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/orchestrator/run",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: t.id }),
      }
    );

    await handler(mockRequest);

    await supabase.from("audit_logs").insert({
      subject_type: "task",
      subject_id: t.id,
      action: "dispatched",
      payload: { agent: t.assignee_agent },
    });
  });
  await Promise.all(runs);
  return NextResponse.json({ ok: true, dispatched: pending.length });
}
