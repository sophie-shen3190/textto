import { NextRequest, NextResponse } from 'next/server';

import { normalise } from '@/app/api/playground/normalise';
import { setJob } from '@/app/api/playground/store';
import { updateParseJobByJobId } from '@/shared/lib/supabase-rest';

export async function POST(request: NextRequest) {
  let body: any;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, message: 'Invalid JSON' }, { status: 400 }); }

  const jobId:     string = body?.job_id    ?? '';
  const status:    string = body?.status    ?? '';
  const resultUrl: string = body?.result_url ?? '';

  console.log(`[webhook] job_id=${jobId} status=${status}`);
  if (!jobId) return NextResponse.json({ ok: false, message: 'Missing job_id' }, { status: 400 });

  if (status === 'failed') {
    setJob(jobId, { status: 'error', error: body?.message ?? 'Job failed' });
    return NextResponse.json({ ok: true });
  }
  if (status !== 'completed') return NextResponse.json({ ok: true }); // intermediate

  const appId  = process.env.TEXTIN_APP_ID    ?? '';
  const secret = process.env.TEXTIN_APP_SECRET ?? '';
  // result_url is a direct CDN link — always use TextIn auth directly
  const authHeaders = { 'x-ti-app-id': appId, 'x-ti-secret-code': secret };

  try {
    if (!resultUrl) throw new Error('No result_url in webhook payload');

    const resp = await fetch(resultUrl, { headers: authHeaders });
    if (!resp.ok) throw new Error(`result_url ${resp.status}: ${await resp.text()}`);

    const resultData = await resp.json();
    const result = normalise(resultData);

    setJob(jobId, { status: 'done', result });
    console.log(`[webhook] cached ${jobId} — ${result.markdown.length} chars, ${result.detail.length} elements`);

    // Persist to Supabase — store the normalised result (proxy URLs already rewritten)
    const { raw: _raw, ...resultToStore } = result;
    updateParseJobByJobId(jobId, {
      status: 'done',
      markdown: result.markdown.slice(0, 100000),
      result_json: JSON.stringify(resultToStore).slice(0, 500000),
    }).catch((e) => console.warn('[webhook] Supabase update failed:', e.message));
  } catch (err: any) {
    console.error('[webhook]', err);
    setJob(jobId, { status: 'error', error: err.message });
  }

  return NextResponse.json({ ok: true });
}
