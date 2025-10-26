import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Loop tick endpoint: finds recent messages without tasks and classifies them
// This is called periodically from the Tasks page during demo

export async function POST() {
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { data: msgs, error } = await supabase
    .from("messages")
    .select("id, case_id, topic")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );

  const created: string[] = [];
  for (const m of msgs ?? []) {
    const { data: existing } = await supabase
      .from("tasks")
      .select("id")
      .eq("case_id", m.case_id)
      .eq("message_id", m.id)
      .limit(1);
    if (existing && existing.length) continue;

    await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/api/classify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: m.case_id, messageId: m.id }),
      }
    );
    created.push(m.id);
  }

  if (created.length) {
    await supabase.from("audit_logs").insert({
      subject_type: "system",
      subject_id: "loop",
      action: "loop_tick",
      payload: { classifiedMessageIds: created },
    });
  }

  return NextResponse.json({ ok: true, classified: created.length });
}
