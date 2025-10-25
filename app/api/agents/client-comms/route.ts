import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CLIENT_COMMS_PROMPT } from '@/lib/prompts';
import { callGeminiJSON } from '@/lib/llm';

// Client communication endpoint: given a taskId, fetch the message
// associated with this task and use Gemini to generate a draft reply.

export async function POST(req: NextRequest) {
  const { taskId } = await req.json();
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  const messageId = task.input?.messageId;
  const { data: msg } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();
  if (!msg) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
  const mockProposal = {
    task_type: 'client_update',
    summary: 'Explains next steps and requests missing info politely.',
    actions: [
      {
        kind: 'draft_message',
        data: {
          to: 'client',
          subject: 'Case Update',
          body:
            'Hi — thanks for sending those documents. Here’s what we’re doing next: (1) compile medical records, (2) confirm billing totals, and (3) schedule a check-in. If you notice any missing items, reply here. We’ll keep you posted.',
          style: 'empathetic',
        },
      },
    ],
    confidence: 0.82,
  };
  let proposal;
  try {
    const result = await callGeminiJSON(
      CLIENT_COMMS_PROMPT,
      msg.raw_text ?? '',
      mockProposal
    );
    // Accept the model output if it looks like a proposal, otherwise fall back to mock
    if (result && (result as any).task_type) {
      proposal = result;
    } else {
      proposal = mockProposal;
    }
  } catch (err) {
    // On error, use the mock proposal
    proposal = mockProposal;
  }
  const { error } = await supabase
    .from('tasks')
    .update({ output: proposal, status: 'proposed' })
    .eq('id', taskId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, proposal });
}
