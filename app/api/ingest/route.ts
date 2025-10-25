import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Ingest endpoint: stores incoming text messages and (optionally) uploads
// attachments as artifacts. This endpoint expects multipart/form-data with
// fields: caseId (string) and text (string). File uploads are not
// implemented in this basic version; real uploads should use Supabase
// storage or another blob store.

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const caseId = String(formData.get('caseId'));
  const text = String(formData.get('text') || '');
  // Insert a new message row associated with the case
  const { data: msg, error } = await supabase
    .from('messages')
    .insert({ case_id: caseId, source: 'upload', raw_text: text })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // TODO: handle file uploads and create artifacts rows here
  return NextResponse.json({ ok: true, messageId: msg?.id });
}
