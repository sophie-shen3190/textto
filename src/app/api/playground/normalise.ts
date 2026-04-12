/**
 * Normalise any TextIn API response into our internal ParseResult shape.
 *
 * TextIn xparse async returns:
 *   {
 *     elements:       [{ type, text, bbox, page_id, pos, ... }],
 *     markdown:       "...",
 *     metadata:       { pages: [{ page_id, width, height, image, angle }], ... },
 *     schema_version: "1.x",
 *     success_count:  N,
 *     summary:        { ... }
 *   }
 *
 * TextIn VLM returns:
 *   { result: { parse_chunk_results: [{ type, content, coordinates }] } }
 *
 * pdf_to_markdown (legacy) returns:
 *   { result: { markdown, detail, pages } }
 */

import type { DetailItem, PageInfo, ParseResult } from './parse/route';

// ── Image URL rewriter ────────────────────────────────────────────────────────

/**
 * Rewrite TextIn CDN image URLs to go through our proxy.
 * This ensures the client never sees third-party image URLs and the URLs
 * stored in the database also point to our domain.
 * Pattern covers: https://web-api.textin.com/ocr_image/...
 */
const TEXTIN_IMG_RE = /https:\/\/web-api\.textin\.com\/[^\s"'<>)\]\\]+/g;

function proxyUrl(url: string): string {
  const t = Buffer.from(url).toString('base64url');
  return `/api/proxy/file?t=${t}`;
}

export function rewriteTextinUrls(s: string): string {
  return s.replace(TEXTIN_IMG_RE, proxyUrl);
}

// ── Markdown cleaner ──────────────────────────────────────────────────────────

/**
 * Strip TextIn image-description XML blocks from markdown output.
 * TextIn embeds these for image elements:
 *   <description>...Chinese or English description...</description>
 *   <text>12:00</text>
 * These should not appear in the user-facing Markdown.
 */
function cleanMarkdown(md: string): string {
  return rewriteTextinUrls(
    md
      .replace(/<description>[\s\S]*?<\/description>/gi, '')
      .replace(/<text>[\s\S]*?<\/text>/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

// ── Type helpers ──────────────────────────────────────────────────────────────

const KNOWN_TYPES = new Set(['paragraph', 'table', 'image', 'formula', 'header', 'footer']);

function coerceType(raw: string): DetailItem['type'] {
  const t = (raw ?? '').toLowerCase();
  if (t.includes('table'))                       return 'table';
  if (t.includes('image') || t.includes('fig')) return 'image';
  if (t.includes('formula') || t.includes('math')) return 'formula';
  if (t.includes('header') || t.includes('title')) return 'header';
  if (t.includes('footer'))                      return 'footer';
  return 'paragraph';
}

function normBbox(v: any): [number, number, number, number] {
  if (!Array.isArray(v) || v.length < 4) return [0, 0, 100, 20];
  // [x1,y1,x2,y2] → [x,y,w,h]
  if (v[2] > v[0] && v[3] > v[1] && v[2] - v[0] > 1) {
    return [v[0], v[1], v[2] - v[0], v[3] - v[1]];
  }
  return [v[0], v[1], v[2], v[3]];
}

// ── xparse (async PDF) normaliser ─────────────────────────────────────────────

function fromXparse(r: any, raw: any): ParseResult {
  // Elements → detail
  const elements: any[] = Array.isArray(r.elements) ? r.elements : [];
  const detail: DetailItem[] = elements.map((el: any, i: number) => ({
    type:     coerceType(el.type ?? el.category ?? ''),
    text:     rewriteTextinUrls(el.text ?? el.content ?? el.markdown ?? ''),
    bbox:     normBbox(el.bbox ?? el.coordinates ?? el.bounding_box),
    page_id:  el.page_id ?? el.page_number ?? 0,
    position: el.pos ?? el.position ?? el.id ?? `el-${i}`,
    base64:   el.image_base64 ?? el.base64 ?? undefined,
  }));

  // Pages from metadata
  const metadata  = r.metadata ?? {};
  const rawPages: any[] = Array.isArray(r.pages)
    ? r.pages
    : Array.isArray(metadata.pages)
    ? metadata.pages
    : [];

  const pages: PageInfo[] = rawPages.map((p: any, i: number) => ({
    page_id: p.page_id   ?? p.page_number ?? i,
    width:   p.width     ?? p.page_width  ?? 595,
    height:  p.height    ?? p.page_height ?? 842,
    image:   p.image     ?? p.image_base64 ?? p.page_image ?? '',
    angle:   p.angle     ?? 0,
  }));

  // If no pages array but we have elements with page info, synthesise page list
  if (pages.length === 0 && detail.length > 0) {
    const maxPage = Math.max(...detail.map((d) => d.page_id));
    for (let i = 0; i <= maxPage; i++) {
      pages.push({
        page_id: i,
        width:   metadata.page_width  ?? 595,
        height:  metadata.page_height ?? 842,
        image:   '',
        angle:   0,
      });
    }
  }

  return { markdown: cleanMarkdown(r.markdown ?? ''), detail, pages, raw, status: 'done' };
}

// ── VLM normaliser ────────────────────────────────────────────────────────────

function fromVlm(r: any, raw: any): ParseResult {
  const chunks: any[] = r.parse_chunk_results ?? [];
  const detail: DetailItem[] = [];
  const lines:  string[]     = [];

  chunks.forEach((chunk: any, i: number) => {
    const type = coerceType(chunk.type ?? '');
    const text = rewriteTextinUrls(chunk.content ?? chunk.text ?? '');
    const bbox = normBbox(chunk.coordinates ?? chunk.bbox);

    detail.push({ type, text, bbox, page_id: 0, position: `vlm-${i}` });

    if (type === 'table')   lines.push(text.startsWith('<') ? text : `\n${text}\n`);
    else if (type === 'image')   lines.push(`![img-${i}]()\n`);
    else if (type === 'formula') lines.push(`$$${text}$$\n`);
    else if (type === 'header')  lines.push(`## ${text}\n`);
    else                         lines.push(`${text}\n`);
  });

  return {
    markdown: cleanMarkdown(lines.join('\n')),
    detail,
    pages: [{ page_id: 0, width: 595, height: 842, image: '', angle: 0 }],
    raw,
    status: 'done',
  };
}

// ── Public entry point ────────────────────────────────────────────────────────

export function normalise(raw: any): ParseResult {
  // Unwrap common outer envelopes
  const r =
    raw?.result       ??   // { result: { ... } }
    raw?.data?.result ??   // { data: { result: { ... } } }
    raw?.data         ??   // { data: { ... } }
    raw               ??
    {};

  // Detect format by fields present
  if (r.elements !== undefined || r.schema_version !== undefined) {
    // xparse async format
    console.log('[normalise] detected xparse format');
    return fromXparse(r, raw);
  }

  if (r.parse_chunk_results !== undefined) {
    // VLM format
    console.log('[normalise] detected VLM format');
    return fromVlm(r, raw);
  }

  if (r.detail !== undefined || r.markdown !== undefined) {
    // pdf_to_markdown legacy format
    console.log('[normalise] detected pdf_to_markdown format');
    const pages: PageInfo[] = (r.pages ?? []).map((p: any, i: number) => ({
      page_id: p.page_id ?? i,
      width:   p.width   ?? 595,
      height:  p.height  ?? 842,
      image:   p.image   ?? '',
      angle:   p.angle   ?? 0,
    }));
    return { markdown: cleanMarkdown(r.markdown ?? ''), detail: r.detail ?? [], pages, raw, status: 'done' };
  }

  console.warn('[normalise] unknown format — keys:', Object.keys(r).slice(0, 10));
  return { markdown: '', detail: [], pages: [], raw, status: 'done' };
}
