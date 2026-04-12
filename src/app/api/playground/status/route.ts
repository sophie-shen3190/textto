import { NextRequest, NextResponse } from 'next/server';

import { normalise } from '@/app/api/playground/normalise';
import { getJob } from '@/app/api/playground/store';
import { updateParseJobByJobId } from '@/shared/lib/supabase-rest';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('job_id') ?? '';

  if (!jobId) {
    return NextResponse.json({ code: 400, message: 'Missing job_id' }, { status: 400 });
  }

  // ── 1. Webhook cache (instant if callback already fired) ───────────────────
  const cached = getJob(jobId);
  if (cached) {
    console.log(`[status] ${jobId} from webhook cache → ${cached.status}`);
    if (cached.status === 'done') {
      return NextResponse.json({ code: 200, status: 'done', result: cached.result });
    }
    if (cached.status === 'error') {
      return NextResponse.json({ code: 500, message: cached.error }, { status: 500 });
    }
  }

  // ── 2. Poll TextIn directly (via proxy if configured) ─────────────────────
  const proxyUrl    = (process.env.TEXTIN_PROXY_URL ?? '').replace(/\/$/, '');
  const proxySecret = process.env.TEXTIN_PROXY_SECRET ?? '';
  const appId       = process.env.TEXTIN_APP_ID    ?? '';
  const secret      = process.env.TEXTIN_APP_SECRET ?? '';

  if (!proxyUrl && (!appId || !secret)) {
    return NextResponse.json({ code: 400, message: 'API credentials not configured' }, { status: 400 });
  }

  const statusPath = `/api/v1/xparse/parse/async/${encodeURIComponent(jobId)}`;
  const statusTarget = proxyUrl
    ? `${proxyUrl}${statusPath}`
    : `https://api.textin.com${statusPath}`;
  const statusHeaders: Record<string, string> = proxyUrl
    ? { 'x-proxy-token': proxySecret }
    : { 'x-ti-app-id': appId, 'x-ti-secret-code': secret };

  try {
    const statusResp = await fetch(statusTarget, { headers: statusHeaders });

    if (!statusResp.ok) {
      throw new Error(`TextIn status ${statusResp.status}: ${await statusResp.text()}`);
    }

    const statusData = await statusResp.json();
    const jobStatus: string = statusData?.data?.status ?? statusData?.status ?? '';
    console.log(`[status] poll ${jobId} → ${jobStatus}`);

    if (jobStatus === 'pending' || jobStatus === 'in_progress') {
      return NextResponse.json({ code: 202, status: 'pending' });
    }

    if (jobStatus === 'failed') {
      throw new Error(statusData?.data?.message ?? 'Job failed on server');
    }

    // Completed — fetch result from result_url
    const resultUrl: string = statusData?.data?.result_url ?? statusData?.result_url ?? '';
    let resultData: any;

    if (resultUrl) {
      // result_url is a direct CDN link — use TextIn auth directly (not proxied)
      const directHeaders: Record<string, string> = appId
        ? { 'x-ti-app-id': appId, 'x-ti-secret-code': secret }
        : { 'x-proxy-token': proxySecret };
      const rResp = await fetch(resultUrl, { headers: directHeaders });
      if (!rResp.ok) throw new Error(`result_url ${rResp.status}: ${await rResp.text()}`);
      resultData = await rResp.json();
    } else {
      resultData = statusData;
    }

    const result = normalise(resultData);
    console.log(`[status] done — markdown ${result.markdown.length} chars, ${result.detail.length} elements, ${result.pages.length} pages`);

    // Persist result to Supabase (fire-and-forget) — store normalised result (proxy URLs already rewritten)
    const { raw: _raw, ...resultToStore } = result;
    updateParseJobByJobId(jobId, {
      status: 'done',
      markdown: result.markdown.slice(0, 100000),
      result_json: JSON.stringify(resultToStore).slice(0, 500000),
    }).catch((e) => console.warn('[status] Supabase update failed:', e.message));

    return NextResponse.json({ code: 200, status: 'done', result });
  } catch (err: any) {
    console.error('[status]', err);
    return NextResponse.json({ code: 500, message: err.message }, { status: 500 });
  }
}
