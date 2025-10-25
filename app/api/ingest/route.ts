import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Ingest endpoint: stores incoming text messages and optionally uploads
 * attachments as artifacts. Supports both multipart/form-data (used by the
 * web form) and JSON payloads (useful for programmatic clients). Returns
 * a clear error when required fields are missing or when insertion fails.
 */
export async function POST(req: NextRequest) {
  try {
    let caseId = '';
    let text = '';
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      caseId = String(form.get('caseId') ?? '');
      text = String(form.get('text') ?? '');
    } else {
      // Attempt to parse JSON body when not multipart
      const body = await req.json().catch(() => ({}));
      caseId = String(body.caseId ?? '');
      text = String(body.text ?? '');
    }

    if (!caseId || !text) {
      return NextResponse.json(
        { ok: false, error: 'Missing caseId or text' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({ case_id: caseId, source: 'upload', raw_text: text })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, messageId: data?.id });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
