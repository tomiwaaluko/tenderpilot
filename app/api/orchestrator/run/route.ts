import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { POST as evidenceSorterHandler } from "@/app/api/agents/evidence-sorter/route";
import { POST as clientCommsHandler } from "@/app/api/agents/client-comms/route";

// Orchestrator run endpoint: dispatch pending tasks to their specialist
// agent endpoints. This simulates a continuous loop, but should be
// called periodically via cron or a client-side timer.
// OPTIMIZATION: Direct handler calls instead of HTTP requests for better performance

export async function POST() {
  // Select pending tasks to dispatch
  const { data: pending, error } = await supabase
    .from("tasks")
    .select("*")
    .in("status", ["pending"])
    .limit(10); // Increased from 5 for better throughput

  if (error) {
    console.error("Error fetching pending tasks:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({ ok: true, dispatched: 0 });
  }

  // Log parallel dispatch
  const caseId = pending[0]?.case_id;
  if (caseId) {
    await supabase.from("audit_logs").insert({
      subject_type: "case",
      subject_id: caseId,
      action: "parallel_dispatch",
      payload: { taskIds: pending.map((t) => t.id) },
    });
  }

  // Dispatch each task by calling its agent handler directly (optimized)
  const runs = pending.map(async (t) => {
    try {
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
    } catch (err) {
      console.error(`Error dispatching task ${t.id}:`, err);
      await supabase.from("audit_logs").insert({
        subject_type: "task",
        subject_id: t.id,
        action: "dispatch_failed",
        payload: { agent: t.assignee_agent, error: String(err) },
      });
    }
  });

  await Promise.all(runs);
  return NextResponse.json({ ok: true, dispatched: pending.length });
}
