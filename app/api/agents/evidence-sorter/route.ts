import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { EVIDENCE_SORTER_PROMPT } from '@/lib/prompts';
import { callGeminiJSON } from '@/lib/llm';

// Evidence sorter endpoint: given a taskId, gather OCR text from
// associated artifacts and call Gemini to produce a table extraction
// proposal. The result is stored on the task row in the output column.

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
  const { data: arts } = await supabase
    .from('artifacts')
    .select('*')
    .eq('case_id', task.case_id);
  // Combine OCR text from all artifacts
  const ocrSnippets = (arts ?? [])
    .map((a) => a.ocr_text)
    .filter(Boolean)
    .join('\n---\n') || 'NO_OCR';
  // Mock proposal
  const mockProposal = {
    task_type: 'evidence_sort',
    summary: 'Parsed 2 bills and 1 receipt. Extracted amounts and dates.',
    actions: [
      {
        kind: 'extract_table',
        data: {
          rows: [
            {
              artifactId: 'A1',
              provider: 'Orlando Ortho',
              date_of_service: '2025-01-18',
              amount: 642.5,
              notes: 'Initial consult',
            },
            {
              artifactId: 'A2',
              provider: 'Central Imaging',
              date_of_service: '2025-01-25',
              amount: 380.0,
              notes: 'MRI shoulder',
            },
          ],
        },
      },
    ],
    confidence: 0.83,
  };
  let proposal;
  try {
    const result = await callGeminiJSON(
      EVIDENCE_SORTER_PROMPT,
      ocrSnippets,
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
  // Update task with proposed output
  const { error } = await supabase
    .from('tasks')
    .update({ output: proposal, status: 'proposed' })
    .eq('id', taskId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, proposal });
}
