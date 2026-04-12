import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { getAuth } from '@/core/auth';
import { normalise } from '@/app/api/playground/normalise';
import { processVlmDescriptions } from '@/app/api/playground/translate';
import { makeR2Key, uploadToR2 } from '@/shared/lib/r2-storage';
import { insertParseJob } from '@/shared/lib/supabase-rest';

export interface DetailItem {
  type: 'paragraph' | 'table' | 'image' | 'formula' | 'header' | 'footer';
  text: string;
  bbox: [number, number, number, number];
  page_id: number;
  position: string;
  image_id?: string;
  base64?: string;
}

export interface PageInfo {
  page_id: number;
  width: number;
  height: number;
  image: string;
  angle: number;
}

export interface ParseResult {
  markdown: string;
  detail: DetailItem[];
  pages: PageInfo[];
  raw?: any;
  job_id?: string;
  status?: 'pending' | 'done' | 'error';
}

// ─── TextIn fetch helper ───────────────────────────────────────────────────────

function textinFetch(path: string, init: RequestInit): Promise<Response> {
  const proxyUrl    = (process.env.TEXTIN_PROXY_URL ?? '').replace(/\/$/, '');
  const proxySecret = process.env.TEXTIN_PROXY_SECRET ?? '';

  if (proxyUrl) {
    const url = `${proxyUrl}${path}`;
    const hdrs = new Headers(init.headers as Record<string, string>);
    hdrs.delete('x-ti-app-id');
    hdrs.delete('x-ti-secret-code');
    hdrs.set('x-proxy-token', proxySecret);
    return fetch(url, { ...init, headers: hdrs });
  }

  const appId  = process.env.TEXTIN_APP_ID    ?? '';
  const secret = process.env.TEXTIN_APP_SECRET ?? '';
  const hdrs   = new Headers(init.headers as Record<string, string>);
  hdrs.set('x-ti-app-id', appId);
  hdrs.set('x-ti-secret-code', secret);
  return fetch(`https://api.textin.com${path}`, { ...init, headers: hdrs });
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const hasCredentials =
      process.env.TEXTIN_PROXY_URL ||
      (process.env.TEXTIN_APP_ID && process.env.TEXTIN_APP_SECRET);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as string | null) ?? 'standard';

    if (!file) {
      return NextResponse.json({ code: 400, message: 'No file provided' }, { status: 400 });
    }

    if (!hasCredentials) {
      return NextResponse.json({ code: 200, message: 'no-credentials', result: null });
    }

    const fileBuffer  = await file.arrayBuffer();
    const isImageFile = file.type.startsWith('image/'); // jpg, png, webp, etc.

    // Anonymous session tracking
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown';
    const sessionId = request.headers.get('x-session-id') ?? undefined;

    // Best-effort auth
    let userId: string | undefined;
    let userEmail: string | undefined;
    try {
      const auth    = await getAuth();
      const session = await auth.api.getSession({ headers: await headers() });
      userId    = session?.user?.id;
      userEmail = session?.user?.email ?? undefined;
    } catch { /* anonymous */ }

    // ── VLM mode + image/webp → VLM sync API ─────────────────────────────────
    if (mode === 'vlm' && isImageFile) {
      let fileUrl: string | undefined;
      try {
        fileUrl = await uploadToR2(makeR2Key(file.name), fileBuffer, file.type);
      } catch (e: any) {
        console.warn('[parse] R2 upload failed:', e.message);
      }

      const resp = await textinFetch('/ai/service/v4/recognize/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: fileBuffer,
      });

      if (!resp.ok) throw new Error(`VLM API ${resp.status}: ${await resp.text()}`);

      const data = await resp.json();
      if (data.code !== 200) throw new Error(data.message || 'VLM parse failed');

      // Translate Chinese descriptions in VLM chunk content before normalising
      if (Array.isArray(data.result?.parse_chunk_results)) {
        for (const chunk of data.result.parse_chunk_results) {
          if (chunk.content) chunk.content = await processVlmDescriptions(chunk.content);
          if (chunk.text)    chunk.text    = await processVlmDescriptions(chunk.text);
        }
      }

      const result = normalise(data);
      const { raw: _raw, ...resultToStore } = result;

      insertParseJob({
        id: crypto.randomUUID(),
        user_id: userId, user_email: userEmail,
        file_name: file.name, file_type: file.type, file_size: file.size,
        file_url: fileUrl, status: 'done', parse_mode: 'vlm',
        markdown: result.markdown.slice(0, 100000),
        result_json: JSON.stringify(resultToStore).slice(0, 500000),
        session_id: sessionId, ip,
      }).catch((e) => console.warn('[parse] Supabase insert failed:', e.message));

      return NextResponse.json({ code: 200, result, file_url: fileUrl, mode: 'vlm' });
    }

    // ── VLM mode + PDF/WebP → pdf_to_markdown sync API ───────────────────────
    if (mode === 'vlm' && !isImageFile) {
      let fileUrl: string | undefined;
      try {
        fileUrl = await uploadToR2(makeR2Key(file.name), fileBuffer, file.type || 'application/pdf');
      } catch (e: any) {
        console.warn('[parse] R2 upload failed:', e.message);
      }

      const params = new URLSearchParams({
        parse_mode:          'vlm',
        markdown_details:    '1',
        table_flavor:        'html',
        get_image:           'both',
        page_details:        '1',
        apply_document_tree: '1',
        apply_merge:         '1',
        formula_level:       '1',
      });

      const resp = await textinFetch(
        `/ai/service/v1/pdf_to_markdown?${params.toString()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: fileBuffer,
        }
      );

      if (!resp.ok) throw new Error(`VLM PDF API ${resp.status}: ${await resp.text()}`);

      const data = await resp.json();
      if (data.code !== 200) throw new Error(data.message || 'VLM PDF parse failed');

      // Translate Chinese descriptions in the markdown field before normalising
      if (data.result?.markdown) {
        data.result.markdown = await processVlmDescriptions(data.result.markdown);
      }

      const result = normalise(data);
      const { raw: _raw, ...resultToStore } = result;

      insertParseJob({
        id: crypto.randomUUID(),
        user_id: userId, user_email: userEmail,
        file_name: file.name, file_type: file.type || 'application/pdf',
        file_size: file.size, file_url: fileUrl,
        status: 'done', parse_mode: 'vlm',
        markdown: result.markdown.slice(0, 100000),
        result_json: JSON.stringify(resultToStore).slice(0, 500000),
        session_id: sessionId, ip,
      }).catch((e) => console.warn('[parse] Supabase insert failed:', e.message));

      return NextResponse.json({ code: 200, result, file_url: fileUrl, mode: 'vlm' });
    }

    // ── Standard mode: all file types → xparse async API ─────────────────────
    const proxyBase  = (process.env.TEXTIN_PROXY_URL ?? '').replace(/\/$/, '');
    const webhookBase =
      process.env.WEBHOOK_BASE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      '';
    const webhookUrl = proxyBase
      ? `${proxyBase}/webhook`
      : webhookBase
      ? `${webhookBase.replace(/\/$/, '')}/api/playground/webhook`
      : '';

    const fd = new FormData();
    fd.append('file', new Blob([fileBuffer], { type: file.type }), file.name);
    fd.append('config', JSON.stringify({
      markdown_details: 1,
      table_flavor:     'html',
      get_image:        'both',
      page_details:     1,
      language:         'auto',
      image_caption_language: 'en',
    }));
    if (webhookUrl) {
      fd.append('webhook', webhookUrl);
      console.log(`[parse] async job webhook → ${webhookUrl}`);
    }

    const startResp = await textinFetch('/api/v1/xparse/parse/async', {
      method: 'POST',
      body: fd,
    });

    if (!startResp.ok) throw new Error(`Async API ${startResp.status}: ${await startResp.text()}`);

    const startData = await startResp.json();
    if (startData.code !== 200) throw new Error(startData.message || 'Start async failed');

    const jobId: string = startData.data?.job_id ?? startData.job_id;
    if (!jobId) throw new Error('No job_id in response');

    let fileUrl: string | undefined;
    try {
      fileUrl = await uploadToR2(makeR2Key(file.name), fileBuffer, file.type || 'application/pdf');
      console.log(`[parse] uploaded to R2: ${fileUrl}`);
    } catch (e: any) {
      console.warn('[parse] R2 upload failed:', e.message);
    }

    insertParseJob({
      id: crypto.randomUUID(),
      user_id: userId, user_email: userEmail,
      job_id: jobId,
      file_name: file.name, file_type: file.type || 'application/pdf',
      file_size: file.size, file_url: fileUrl,
      status: 'parsing', parse_mode: 'standard',
      session_id: sessionId, ip,
    }).catch((e) => console.warn('[parse] Supabase insert failed:', e.message));

    return NextResponse.json({ code: 200, job_id: jobId, status: 'pending', file_url: fileUrl, mode: 'standard' });
  } catch (err: any) {
    console.error('[playground/parse]', err);
    return NextResponse.json(
      { code: 500, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
