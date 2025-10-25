import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CLASSIFIER_PROMPT } from '@/lib/prompts';
import { callGeminiJSON } from '@/lib/llm';

// Classification endpoint: given a message ID, fetch the raw text and use
// Gemini to produce task candidates. For local development, a mock
// response is returned. Each candidate becomes a proposed task row in
// the database.

export async function POST(req: NextRequest) {
  const { caseId, messageId } = await req.json();
  const { data: msg } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();
  if (!msg) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
  // Mock candidate list for local testing
  const mockCandidates = [
    {
      type: 'evidence_sort',
      rationale: 'Attached bills detected',
      required_fields: ['provider', 'amount'],
      confidence: 0.86,
    },
    {
      type: 'client_update',
      rationale: 'Client asked for next steps',
      required_fields: [],
      confidence: 0.79,
    },
  ];
  let candidates;
  try {
    candidates = await callGeminiJSON(CLASSIFIER_PROMPT, msg.raw_text ?? '', mockCandidates);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
  // Insert tasks for each candidate
  const rows = (candidates as any[]).map((c) => ({
    case_id: caseId,
    type: c.type,
    status: 'pending',
    assignee_agent: c.type === 'evidence_sort' ? 'evidence_sorter' : 'client_comms',
    input: { messageId, rationale: c.rationale, required_fields: c.required_fields },
    confidence: c.confidence,
  }));
  const { error } = await supabase.from('tasks').insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, created: rows.length });
}
