'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  AlignLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileCode2,
  FileImage,
  FileText,
  FileType2,
  ImageIcon,
  Loader2,
  Maximize2,
  RotateCcw,
  RotateCw,
  Sparkles,
  Table2,
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { toast } from 'sonner';

import { MarkdownPreview } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { getPendingFile } from '@/shared/lib/pending-file-store';
import { useSession } from '@/core/auth/client';

import type { DetailItem, PageInfo, ParseResult } from '@/app/api/playground/parse/route';

// ─── Types ────────────────────────────────────────────────────────────────────

type FileStatus = 'idle' | 'uploading' | 'parsing' | 'polling' | 'done' | 'error';
type ResultTab = 'markdown' | 'json' | 'tables' | 'images';
type ParseMode = 'standard' | 'vlm';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: FileStatus;
  preview?: string;
  result?: ParseResult;
  error?: string;
  jobId?: string;
  mode: ParseMode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_EXTS = ['.pdf', '.png', '.jpg', '.jpeg', '.tif', '.tiff', '.webp'];
const MAX_SIZE_MB = 20;
const POLL_INTERVAL = 2500;
const POLL_TIMEOUT = 120_000;

const BBOX_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  paragraph: { fill: 'rgba(37,99,235,0.07)',  stroke: '#2563EB', label: 'Paragraph' },
  table:     { fill: 'rgba(5,150,105,0.07)',  stroke: '#059669', label: 'Table'     },
  image:     { fill: 'rgba(124,58,237,0.07)', stroke: '#7C3AED', label: 'Image'     },
  formula:   { fill: 'rgba(217,119,6,0.07)',  stroke: '#D97706', label: 'Formula'   },
  header:    { fill: 'rgba(220,38,38,0.07)',  stroke: '#DC2626', label: 'Header'    },
  footer:    { fill: 'rgba(220,38,38,0.07)',  stroke: '#DC2626', label: 'Footer'    },
};

const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

const fmtBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1_048_576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1_048_576).toFixed(1)} MB`;
};

// ─── JSON syntax highlight ────────────────────────────────────────────────────

function highlightJson(s: string) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (m) => {
        if (/^"/.test(m)) {
          return /:$/.test(m)
            ? `<span style="color:#1d4ed8">${m}</span>`   // keys: blue
            : `<span style="color:#16a34a">${m}</span>`;   // strings: green
        }
        if (/true|false/.test(m)) return `<span style="color:#7c3aed">${m}</span>`; // purple
        if (/null/.test(m))       return `<span style="color:#dc2626">${m}</span>`; // red
        return `<span style="color:#ea580c">${m}</span>`;  // numbers: orange
      }
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: FileStatus }) {
  const cfg: Record<FileStatus, { dot: string; text: string; label: string }> = {
    idle:      { dot: 'bg-slate-300',   text: 'text-slate-500',  label: 'Ready'     },
    uploading: { dot: 'bg-amber-400',   text: 'text-amber-700',  label: 'Uploading' },
    parsing:   { dot: 'bg-blue-500',    text: 'text-blue-700',   label: 'Parsing'   },
    polling:   { dot: 'bg-blue-400',    text: 'text-blue-700',   label: 'Processing'},
    done:      { dot: 'bg-emerald-500', text: 'text-emerald-700',label: 'Done'      },
    error:     { dot: 'bg-red-500',     text: 'text-red-600',    label: 'Error'     },
  };
  const { dot, text, label } = cfg[status];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', text)}>
      {(status === 'parsing' || status === 'polling' || status === 'uploading') ? (
        <Loader2 className={cn('h-2.5 w-2.5 animate-spin', dot.replace('bg-', 'text-'))} />
      ) : (
        <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      )}
      {label}
    </span>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf')                          return <FileText className="h-5 w-5 text-rose-500" />;
  if (['png','jpg','jpeg','tif','tiff'].includes(ext)) return <FileImage className="h-5 w-5 text-sky-500" />;
  return <FileType2 className="h-5 w-5 text-slate-400" />;
}

function ToolBtn({
  onClick, disabled = false, tip, children,
}: {
  onClick: () => void; disabled?: boolean; tip: string; children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-[#4A5568] transition-colors',
            'hover:bg-[#EDF2F7] hover:text-[#1A202C] disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-[11px]">{tip}</TooltipContent>
    </Tooltip>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DocumentPlayground() {
  const { data: session } = useSession();
  const [files, setFiles]           = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [zoom, setZoom]             = useState(1);
  const [rotation, setRotation]     = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab]   = useState<ResultTab>('markdown');
  const [curPosition, setCurPosition] = useState<string | null>(null);
  const [parseMode, setParseMode]   = useState<ParseMode>('standard');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPanning, setIsPanning]   = useState(false);
  const [panOffset, setPanOffset]   = useState({ x: 0, y: 0 });
  const [panStart, setPanStart]     = useState({ x: 0, y: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);

  // ── Resizable panel widths ────────────────────────────────────────────────
  const [leftWidth, setLeftWidth]   = useState(252);
  const [rightWidth, setRightWidth] = useState(520);
  const resizeRef = useRef<{ side: 'left' | 'right'; startX: number; startW: number } | null>(null);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const viewerRef     = useRef<HTMLDivElement>(null);
  const pollTimers    = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const parseResult   = currentFile?.result ?? null;
  const pages: PageInfo[] = parseResult?.pages ?? [];
  const totalPages    = pages.length;
  // Fallback page info so the PDF iframe can render even before API returns page images
  const curPageInfo: PageInfo | null = pages[currentPage] ?? (
    currentFile
      ? { page_id: 0, width: 595, height: 842, image: '', angle: 0 }
      : null
  );
  const curPageItems  = (parseResult?.detail ?? []).filter((d) => d.page_id === currentPage);
  const tables        = (parseResult?.detail ?? []).filter((d) => d.type === 'table');
  const images        = (parseResult?.detail ?? []).filter((d) => d.type === 'image' && d.base64);

  // Extract image URLs from markdown/detail — by now all TextIn URLs are already
  // rewritten to /api/proxy/file?url=... by the server-side normalise() function.
  // We collect proxy URLs and also bare https image URLs (e.g. from older history records).
  const markdownImageUrls: string[] = (() => {
    const md = parseResult?.markdown ?? '';
    const urls = new Set<string>();
    // Proxy URLs already rewritten by server
    for (const m of md.matchAll(/!\[.*?\]\((\/api\/proxy\/file\?url=[^\s)]+)\)/g)) urls.add(m[1]);
    for (const m of md.matchAll(/<img[^>]+src=["'](\/api\/proxy\/file\?url=[^\s"']+)["']/gi)) urls.add(m[1]);
    // Fallback: bare https image URLs (legacy history records not yet rewritten)
    for (const m of md.matchAll(/\b(https?:\/\/[^\s<>"')]+\.(?:jpg|jpeg|png|gif|webp|bmp|tiff?)(?:[?#][^\s<>"')]*)?)/gi)) {
      urls.add(`/api/proxy/file?url=${encodeURIComponent(m[1])}`);
    }
    // Also scan table HTML in detail items
    for (const item of (parseResult?.detail ?? [])) {
      for (const m of item.text.matchAll(/<img[^>]+src=["'](\/api\/proxy\/file\?url=[^\s"']+)["']/gi)) urls.add(m[1]);
      for (const m of item.text.matchAll(/<img[^>]+src=["'](https?:\/\/[^\s"']+)["']/gi)) {
        urls.add(`/api/proxy/file?url=${encodeURIComponent(m[1])}`);
      }
    }
    return [...urls];
  })();

  const allImages = images; // base64 images from detail
  const hasAnyImages = allImages.length > 0 || markdownImageUrls.length > 0;
  const isLoading     = currentFile?.status === 'uploading' || currentFile?.status === 'parsing' || currentFile?.status === 'polling';
  const isError       = currentFile?.status === 'error';

  // ── Helpers ──────────────────────────────────────────────────────────────

  const patchFile = useCallback((id: string, patch: Partial<FileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    setCurrentFile((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const selectFile = (f: FileItem) => {
    setCurrentFile(f);
    setCurrentPage(0);
    setZoom(1);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
    setCurPosition(null);
  };

  // ── Polling ──────────────────────────────────────────────────────────────

  const startPolling = useCallback(
    (fileId: string, jobId: string) => {
      const start = Date.now();

      const tick = async () => {
        if (Date.now() - start > POLL_TIMEOUT) {
          patchFile(fileId, { status: 'error', error: 'Parsing timed out' });
          return;
        }

        try {
          const resp = await fetch(`/api/playground/status?job_id=${encodeURIComponent(jobId)}`);
          const data = await resp.json();

          console.log('[poll]', data.code, data.status, !!data.result);

          if (data.code === 500) throw new Error(data.message);

          // Still processing — keep polling
          if (data.code === 202 || data.status === 'pending') {
            const t = setTimeout(tick, POLL_INTERVAL);
            pollTimers.current.set(fileId, t);
            return;
          }

          // Done — result may have empty markdown in demo/error cases, still stop polling
          if (data.code === 200 && data.status === 'done') {
            patchFile(fileId, { status: 'done', result: data.result ?? {} });
            pollTimers.current.delete(fileId);
            return;
          }

          // Unexpected response — keep polling cautiously
          const t = setTimeout(tick, POLL_INTERVAL);
          pollTimers.current.set(fileId, t);
        } catch (e: any) {
          patchFile(fileId, { status: 'error', error: e.message });
        }
      };

      const t = setTimeout(tick, POLL_INTERVAL);
      pollTimers.current.set(fileId, t);
    },
    [patchFile]
  );

  // Stop poll timers on unmount
  useEffect(() => {
    return () => pollTimers.current.forEach((t) => clearTimeout(t));
  }, []);

  // ── Process file ──────────────────────────────────────────────────────────

  const processFile = useCallback(
    async (item: FileItem) => {
      patchFile(item.id, { status: 'uploading' });
      await new Promise((r) => setTimeout(r, 200));
      patchFile(item.id, { status: 'parsing' });

      try {
        const fd = new FormData();
        fd.append('file', item.file);
        fd.append('mode', item.mode);

        const resp = await fetch('/api/playground/parse', { method: 'POST', body: fd });
        const data = await resp.json();

        if (!resp.ok || data.code >= 400) throw new Error(data.message || 'Parse failed');

        // No credentials — show guidance
        if (data.message === 'no-credentials') {
          patchFile(item.id, {
            status: 'error',
            error: 'API keys not configured. Add TEXTIN_APP_ID + TEXTIN_APP_SECRET to .env.local',
          });
          return;
        }

        // Image: synchronous result
        if (data.result) {
          patchFile(item.id, { status: 'done', result: data.result });
          return;
        }

        // PDF: async job
        if (data.job_id) {
          // If R2 URL returned, use it as preview (more stable than object URL)
          const updates: Partial<FileItem> = { status: 'polling', jobId: data.job_id };
          if (data.file_url) updates.preview = data.file_url;
          patchFile(item.id, updates);
          startPolling(item.id, data.job_id);
          return;
        }

        throw new Error('Unexpected response from parse API');
      } catch (e: any) {
        patchFile(item.id, { status: 'error', error: e.message });
        toast.error(`${item.name}: ${e.message}`);
      }
    },
    [patchFile, startPolling]
  );

  // ── Add files ─────────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (incoming: File[]) => {
      const valid = incoming.filter((f) => {
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        if (!ACCEPTED_EXTS.includes(ext)) {
          toast.error(`Unsupported format: ${f.name}`);
          return false;
        }
        if (f.size > MAX_SIZE_MB * 1_048_576) {
          toast.error(`File too large (max ${MAX_SIZE_MB} MB): ${f.name}`);
          return false;
        }
        return true;
      });

      const newItems: FileItem[] = valid.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        size: f.size,
        status: 'idle' as FileStatus,
        mode: parseMode,  // always respect the user's current mode selection
        preview: URL.createObjectURL(f),
      }));

      setFiles((prev) => [...prev, ...newItems]);
      if (newItems.length > 0) selectFile(newItems[0]);
      newItems.forEach(processFile);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processFile, parseMode]
  );

  // ── Auto-load file passed from landing page ───────────────────────────────
  const addFilesRef = useRef<((files: File[]) => void) | null>(null);
  useEffect(() => { addFilesRef.current = addFiles; }, [addFiles]);

  useEffect(() => {
    const pending = getPendingFile();
    if (!pending) return;
    // Apply the mode that was selected on the landing page
    setParseMode(pending.mode);
    const t = setTimeout(() => { addFilesRef.current?.([pending.file]); }, 80);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run once on mount

  // ── Load history for logged-in users ────────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    setHistoryLoading(true);
    fetch('/api/playground/history?limit=30')
      .then((r) => r.json())
      .then(({ jobs }) => {
        if (!jobs?.length) return;
        const historyItems: FileItem[] = jobs.map((job: any) => {
          const fakeFile = new File([], job.file_name, { type: job.file_type });
          return {
            id: job.id,
            file: fakeFile,
            name: job.file_name,
            size: job.file_size ?? 0,
            status: (job.status === 'done' ? 'done' : job.status === 'parsing' ? 'polling' : 'error') as FileStatus,
            preview: job.file_url ?? undefined,
            result: job.result ?? undefined,
            jobId: job.job_id ?? undefined,
            mode: (job.parse_mode ?? 'standard') as ParseMode,
          } satisfies FileItem;
        });
        setFiles((prev) => {
          // Merge: history goes at bottom, current session files stay on top
          const existingIds = new Set(prev.map((f) => f.id));
          const newHistory = historyItems.filter((h) => !existingIds.has(h.id));
          return [...prev, ...newHistory];
        });
      })
      .catch(() => { /* non-fatal */ })
      .finally(() => setHistoryLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const deleteFile = (id: string) => {
    clearTimeout(pollTimers.current.get(id));
    pollTimers.current.delete(id);
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (currentFile?.id === id) {
        const nxt = next[0] ?? null;
        if (nxt) selectFile(nxt); else setCurrentFile(null);
      }
      return next;
    });
  };

  // ── Drag & drop ───────────────────────────────────────────────────────────

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  // ── Zoom / pan ────────────────────────────────────────────────────────────

  const zoomIn  = () => { setZoom((z) => ZOOM_STEPS.find((s) => s > z) ?? z); setPanOffset({ x: 0, y: 0 }); };
  const zoomOut = () => { setZoom((z) => [...ZOOM_STEPS].reverse().find((s) => s < z) ?? z); setPanOffset({ x: 0, y: 0 }); };
  const fitPage = () => { setZoom(1); setPanOffset({ x: 0, y: 0 }); };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };
  const onMouseUp = () => setIsPanning(false);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.deltaY < 0 ? zoomIn() : zoomOut();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  });

  // ── Sync highlight ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!curPosition || !rightPanelRef.current) return;
    const el = rightPanelRef.current.querySelector<HTMLElement>(`[data-position="${curPosition}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el.dataset.flash = '1';
    setTimeout(() => { if (el) delete el.dataset.flash; }, 1200);
  }, [curPosition]);

  // ── Panel resize ──────────────────────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = e.clientX - resizeRef.current.startX;
      if (resizeRef.current.side === 'left') {
        setLeftWidth(Math.max(160, Math.min(480, resizeRef.current.startW + delta)));
      } else {
        setRightWidth(Math.max(240, Math.min(640, resizeRef.current.startW - delta)));
      }
    };
    const onUp = () => { resizeRef.current = null; document.body.style.cursor = ''; document.body.style.userSelect = ''; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const startResize = (side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { side, startX: e.clientX, startW: side === 'left' ? leftWidth : rightWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // ── Export helpers ────────────────────────────────────────────────────────

  const copyMarkdown = () => {
    if (!parseResult?.markdown) return;
    navigator.clipboard.writeText(parseResult.markdown);
    toast.success('Copied to clipboard');
  };

  const downloadMarkdown = () => {
    if (!parseResult?.markdown) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([parseResult.markdown], { type: 'text/markdown' })),
      download: `${currentFile?.name.replace(/\.[^.]+$/, '') ?? 'document'}.md`,
    });
    a.click();
  };

  const copyJson = () => {
    if (!parseResult) return;
    const json = JSON.stringify({ markdown: parseResult.markdown, detail: parseResult.detail, pages: parseResult.pages }, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('Copied to clipboard');
  };

  const downloadJson = () => {
    if (!parseResult) return;
    const json = JSON.stringify({ markdown: parseResult.markdown, detail: parseResult.detail, pages: parseResult.pages }, null, 2);
    Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([json], { type: 'application/json' })),
      download: `${currentFile?.name.replace(/\.[^.]+$/, '') ?? 'document'}.json`,
    }).click();
  };

  const downloadAllImages = () => {
    markdownImageUrls.forEach((url, i) => {
      // url is already a proxy URL (/api/proxy/file?url=...)
      const a = Object.assign(document.createElement('a'), { href: url, download: `image-${i + 1}.jpg` });
      a.click();
    });
    allImages.forEach((img, i) => {
      Object.assign(document.createElement('a'), {
        href: `data:image/jpeg;base64,${img.base64}`,
        download: `image-p${img.page_id + 1}-${i + 1}.jpg`,
      }).click();
    });
  };

  const downloadTableCsv = (html: string, idx: number) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const csv = Array.from(doc.querySelectorAll('tr'))
      .map((row) =>
        Array.from(row.querySelectorAll('th,td'))
          .map((c) => `"${c.textContent?.replace(/"/g, '""') ?? ''}"`)
          .join(',')
      )
      .join('\n');
    Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `table-${idx + 1}.csv`,
    }).click();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        [data-flash="1"] { animation: pg-flash 1.1s ease-out; }
        @keyframes pg-flash {
          0%   { background:#dbeafe; border-radius:6px; }
          100% { background:transparent; }
        }
        .bbox-rect { cursor:pointer; }
        .bbox-rect:hover rect { stroke-width:2px; }
        .pg-json pre::-webkit-scrollbar { height:6px; }
        .pg-json pre::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
        .tbl-html table { border-collapse:collapse; width:100%; font-size:12px; }
        .tbl-html th, .tbl-html td { border:1px solid #e2e8f0; padding:5px 10px; }
        .tbl-html th { background:#f8fafc; font-weight:600; color:#334155; }
        .tbl-html tr:nth-child(even) td { background:#f8fafc; }
      `}</style>

      <div className="flex h-[calc(100vh-48px)] flex-col overflow-hidden bg-[#F1F4F9] pt-12">

        {/* ══ BODY ════════════════════════════════════════════════════════ */}
        <div className="flex min-h-0 flex-1">

          {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
          <aside className="flex shrink-0 flex-col border-r border-slate-200" style={{ background: 'rgb(231,237,252)', width: leftWidth + 'px' }}>

            {/* Parse mode selector */}
            <div className="p-3 pb-0">
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  { value: 'standard' as const, icon: <AlignLeft className="h-3 w-3" />, label: 'Standard' },
                  { value: 'vlm'      as const, icon: <Sparkles  className="h-3 w-3" />, label: 'VLM' },
                ] as const).map(({ value, icon, label }) => {
                  const active = parseMode === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setParseMode(value)}
                      title={value === 'vlm' ? 'Vision-Language Model — describe images in natural language' : 'High-accuracy layout & structure recognition'}
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all duration-150',
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white/60 text-slate-500 hover:bg-white hover:text-slate-700'
                      )}
                    >
                      {icon}{label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload zone */}
            <div className="p-3">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); }}
                className={cn(
                  'group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed py-8 transition-all duration-200',
                  isDragOver
                    ? 'border-blue-500 bg-blue-50 shadow-inner'
                    : 'border-blue-300 bg-gradient-to-b from-blue-50/60 to-white hover:border-blue-500 hover:from-blue-50 hover:shadow-md'
                )}
              >
                <div className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200',
                  isDragOver
                    ? 'bg-blue-500 shadow-lg shadow-blue-200'
                    : 'bg-blue-600 shadow-md shadow-blue-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-300'
                )}>
                  <Upload className="text-white" style={{ height: '20px', width: '20px' }} />
                </div>
                <div className="text-center">
                  <p className={cn('text-[13px] font-semibold transition-colors', isDragOver ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600')}>
                    {isDragOver ? 'Drop to upload' : 'Click or drag files here'}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-slate-400">
                    PDF · PNG · JPG · TIFF · WEBP · max {MAX_SIZE_MB} MB
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={ACCEPTED_EXTS.join(',')}
                multiple
                onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
              />
            </div>

            <Separator className="bg-slate-100" />

            {/* File list */}
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-0.5 p-2">
                {files.length === 0 && historyLoading && (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                    <p className="text-[11px] text-slate-400">Loading history…</p>
                  </div>
                )}
                {files.length === 0 && !historyLoading && (
                  <p className="py-8 text-center text-[11px] text-slate-400">No files yet</p>
                )}
                {files.map((f) => (
                  <div
                    key={f.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => selectFile(f)}
                    onKeyDown={(e) => e.key === 'Enter' && selectFile(f)}
                    className={cn(
                      'group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors',
                      currentFile?.id === f.id
                        ? 'bg-white/80 ring-1 ring-blue-300'
                        : 'hover:bg-white/60'
                    )}
                  >
                    {/* Thumb */}
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-slate-100 ring-1 ring-black/5">
                      {f.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.preview} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileIcon name={f.name} />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-slate-700">{f.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">{fmtBytes(f.size)}</span>
                        <span className="text-slate-200">·</span>
                        <StatusPill status={f.status} />
                        <span className={cn(
                          'rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                          f.mode === 'vlm'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-slate-100 text-slate-500'
                        )}>{f.mode}</span>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      className="shrink-0 rounded-md p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50"
                      onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Examples */}
            <Separator className="bg-slate-100" />
            <div className="p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Examples
              </p>
              {['Research Paper', 'Invoice', 'Slide Deck'].map((name) => (
                <button
                  key={name}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11.5px] text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  onClick={() => toast.info('Upload your own document to try the playground')}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                  {name}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Left resize handle ── */}
          <div
            className="group relative z-10 w-1 shrink-0 cursor-col-resize bg-slate-200 hover:bg-blue-400 active:bg-blue-500 transition-colors"
            onMouseDown={(e) => startResize('left', e)}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>

          {/* ══ CENTER PANEL ════════════════════════════════════════════ */}
          <section className="flex min-w-0 flex-1 flex-col">

            {/* Toolbar */}
            <div className="flex h-10 shrink-0 items-center gap-0.5 border-b border-slate-200 bg-white px-2.5">
              {/* Image-only controls: zoom / rotate / page */}
              {currentFile?.file.type !== 'application/pdf' && (
                <>
                  <ToolBtn onClick={zoomOut} disabled={zoom <= ZOOM_STEPS[0]} tip="Zoom out">
                    <ZoomOut className="h-3.5 w-3.5" />
                  </ToolBtn>
                  <span className="min-w-[44px] text-center text-[11.5px] font-medium text-slate-600 tabular-nums">
                    {Math.round(zoom * 100)}%
                  </span>
                  <ToolBtn onClick={zoomIn} disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]} tip="Zoom in">
                    <ZoomIn className="h-3.5 w-3.5" />
                  </ToolBtn>
                  <ToolBtn onClick={fitPage} tip="Fit page">
                    <Maximize2 className="h-3 w-3" />
                  </ToolBtn>
                  <div className="mx-1.5 h-4 w-px bg-slate-200" />
                  <ToolBtn onClick={() => setRotation((r) => r - 90)} tip="Rotate left">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </ToolBtn>
                  <ToolBtn onClick={() => setRotation((r) => r + 90)} tip="Rotate right">
                    <RotateCw className="h-3.5 w-3.5" />
                  </ToolBtn>
                  <div className="mx-1.5 h-4 w-px bg-slate-200" />
                  <ToolBtn onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} tip="Previous page">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </ToolBtn>
                  <span className="min-w-[52px] text-center text-[11.5px] text-slate-600 tabular-nums">
                    {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : '— / —'}
                  </span>
                  <ToolBtn onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1} tip="Next page">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </ToolBtn>
                </>
              )}

              {/* PDF file name badge */}
              {currentFile?.file.type === 'application/pdf' && (
                <span className="text-[12px] font-medium text-slate-500 truncate max-w-[300px]">
                  {currentFile.name}
                </span>
              )}

              {/* Bbox legend — images only */}
              {parseResult && currentFile?.file.type !== 'application/pdf' && (
                <>
                  <div className="mx-2 h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-3">
                    {Object.entries(BBOX_COLORS).slice(0, 4).map(([type, c]) => (
                      <div key={type} className="flex items-center gap-1">
                        <div
                          className="h-2.5 w-2.5 rounded-sm border"
                          style={{ background: c.fill, borderColor: c.stroke }}
                        />
                        <span className="text-[10px] capitalize text-slate-400">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Viewer */}
            <div
              ref={viewerRef}
              className={cn(
                'relative flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden',
                'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] bg-slate-100',
                zoom > 1 && isPanning ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : ''
              )}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); }}
            >
              {/* ── Empty state ── */}
              {!currentFile && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-16 transition-all duration-200',
                    isDragOver ? 'border-blue-400 bg-blue-50/80' : 'border-slate-300 bg-white/60 hover:border-blue-300 hover:bg-blue-50/40'
                  )}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-200">
                    <Upload className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-semibold text-slate-700">
                      {isDragOver ? 'Drop your document here' : 'Upload a document to get started'}
                    </p>
                    <p className="mt-1 text-[12px] text-slate-400">
                      Drag & drop or <span className="text-blue-500 underline underline-offset-2">click to browse</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['PDF', 'PNG', 'JPG', 'TIFF'].map((ext) => (
                      <span key={ext} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Loading overlay ── */}
              {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100/70 backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-7 shadow-xl shadow-slate-200/80">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full border-[3px] border-blue-100" />
                      <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-[3px] border-transparent border-t-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-slate-700">
                        {currentFile?.status === 'uploading'
                          ? 'Uploading…'
                          : currentFile?.status === 'polling'
                          ? 'Processing document…'
                          : 'Parsing document…'}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {currentFile?.status === 'polling' ? 'Async job in progress — this may take a moment' : 'Extracting text, tables & structure'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Error state ── */}
              {isError && (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-sm ring-1 ring-red-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-slate-800">Parse failed</p>
                    <p className="mt-1 max-w-[260px] text-[12px] text-slate-500">{currentFile?.error}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[12px]"
                    onClick={() => currentFile && processFile(currentFile)}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {/* ── PDF: native iframe viewer (full height, no sidebar) ── */}
              {currentFile && !isError && currentFile.file.type === 'application/pdf' && currentFile.preview && (
                <iframe
                  src={`${currentFile.preview}#navpanes=0&toolbar=0&view=FitH`}
                  title={currentFile.name}
                  className="absolute inset-0 h-full w-full border-0 bg-white"
                />
              )}

              {/* ── Image: custom viewer with bbox overlay ── */}
              {currentFile && !isError && currentFile.file.type !== 'application/pdf' && curPageInfo && (
                <div
                  className="relative shadow-2xl shadow-black/20 ring-1 ring-black/5"
                  style={{
                    transform: `translate(${panOffset.x}px,${panOffset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 0.15s ease',
                  }}
                >
                  {curPageInfo.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`data:image/jpeg;base64,${curPageInfo.image}`}
                      alt={`Page ${currentPage + 1}`}
                      className="block max-h-[calc(100vh-152px)] max-w-full"
                      draggable={false}
                    />
                  ) : currentFile?.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentFile.preview}
                      alt={`Page ${currentPage + 1}`}
                      className="block max-h-[calc(100vh-152px)] max-w-full"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-white"
                      style={{ width: '595px', height: '842px', maxHeight: 'calc(100vh - 152px)' }}>
                      <div className="flex flex-col items-center gap-3 text-slate-200">
                        <FileText className="h-16 w-16" />
                        <p className="text-[12px] text-slate-400">No preview available</p>
                      </div>
                    </div>
                  )}

                  {/* SVG bbox overlay */}
                  {curPageInfo.image && (
                    <svg
                      className="pointer-events-none absolute inset-0"
                      style={{ width: '100%', height: '100%' }}
                      viewBox={`0 0 ${curPageInfo.width} ${curPageInfo.height}`}
                      preserveAspectRatio="none"
                    >
                      {curPageItems.map((item) => {
                        const [x, y, w, h] = item.bbox;
                        const c = BBOX_COLORS[item.type] ?? BBOX_COLORS.paragraph;
                        const isActive = curPosition === item.position;
                        return (
                          <rect
                            key={item.position}
                            x={x} y={y} width={w} height={h}
                            fill={isActive ? c.fill.replace('0.07', '0.20') : c.fill}
                            stroke={c.stroke}
                            strokeWidth={isActive ? 2 : 1}
                            rx={3}
                            style={{ pointerEvents: 'all', cursor: 'pointer', transition: 'all 0.1s' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurPosition(item.position);
                              setActiveTab('markdown');
                            }}
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>
              )}

              {/* Waiting but no result */}
              {currentFile && !isLoading && !isError && !parseResult && (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-[12px]">Waiting…</p>
                </div>
              )}
            </div>
          </section>

          {/* ── Right resize handle ── */}
          <div
            className="group relative z-10 w-1 shrink-0 cursor-col-resize bg-slate-200 hover:bg-blue-400 active:bg-blue-500 transition-colors"
            onMouseDown={(e) => startResize('right', e)}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>

          {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
          <aside className="flex shrink-0 flex-col border-l border-slate-200 bg-white" style={{ width: rightWidth + 'px' }}>

            {/* Tab bar */}
            <div className="flex h-10 shrink-0 items-center border-b border-slate-100 px-3">
              <div className="flex flex-1 items-center gap-0.5">
                {(
                  [
                    { v: 'markdown' as const, icon: FileText,  label: 'Markdown', count: undefined },
                    { v: 'json'     as const, icon: FileCode2, label: 'JSON',     count: undefined },
                    { v: 'tables' as const,  icon: Table2,    label: 'Tables', count: tables.length  },
                    { v: 'images' as const,  icon: ImageIcon, label: 'Images', count: allImages.length + markdownImageUrls.length },
                  ]
                ).map(({ v, icon: Icon, label, count }) => (
                  <button
                    key={v}
                    onClick={() => setActiveTab(v)}
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11.5px] font-medium transition-colors',
                      activeTab === v
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                    {count !== undefined && count > 0 && (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 tabular-nums">
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              {parseResult && (
                <div className="flex items-center gap-0.5">
                  {activeTab === 'markdown' && (<>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={copyMarkdown} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Copy className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px]">Copy markdown</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={downloadMarkdown} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Download className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px]">Download .md</TooltipContent>
                    </Tooltip>
                  </>)}

                  {activeTab === 'json' && (<>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={copyJson} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Copy className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px]">Copy JSON</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={downloadJson} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Download className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px]">Download .json</TooltipContent>
                    </Tooltip>
                  </>)}

                  {activeTab === 'images' && hasAnyImages && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={downloadAllImages} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Download className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px]">Download all images</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>

            {/* Panel body */}
            <div className="min-h-0 flex-1 overflow-hidden">

              {/* No result */}
              {!parseResult && (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                    <FileText className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-[12px] font-medium text-slate-500">Results will appear here</p>
                  <p className="text-[11px] text-slate-400">Upload and parse a document to view its content</p>
                </div>
              )}

              {/* ── Markdown ── */}
              {parseResult && activeTab === 'markdown' && (
                <div className="h-full overflow-y-auto overflow-x-hidden">
                  <div ref={rightPanelRef} className="px-5 py-4">
                    <style>{`
                      .pg-md-wrap { max-width: 100%; }
                      .pg-md-wrap .markdown-body { max-width: 100%; }
                      .pg-md-wrap table { border-collapse: collapse; width: max-content; min-width: 100%; font-size: 12px; display: block; overflow-x: auto; }
                      .pg-md-wrap table td, .pg-md-wrap table th { border: 1px solid #3b82f6; padding: 6px 10px; text-align: left; vertical-align: top; min-width: 100px; max-width: 260px; white-space: normal; word-break: break-word; line-height: 1.5; }
                      .pg-md-wrap table th { background: #eff6ff; font-weight: 600; color: #1d4ed8; }
                      .pg-md-wrap table tr:nth-child(even) td { background: #f8faff; }
                    `}</style>
                    <div className="pg-md-wrap">
                      <MarkdownPreview content={parseResult.markdown} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── JSON ── */}
              {parseResult && activeTab === 'json' && (
                <ScrollArea className="h-full">
                  <div className="pg-json p-3">
                    <pre
                      className="whitespace-pre-wrap break-all rounded-xl border border-slate-100 bg-white p-4 text-[11px] leading-relaxed text-slate-800"
                      dangerouslySetInnerHTML={{
                        __html: highlightJson(
                          JSON.stringify(
                            parseResult.raw ?? {
                              pages: parseResult.pages.map((p) => ({
                                ...p,
                                image: p.image ? '[base64 omitted]' : '',
                              })),
                              detail: parseResult.detail,
                            },
                            null,
                            2
                          )
                        ),
                      }}
                    />
                  </div>
                </ScrollArea>
              )}

              {/* ── Tables ── */}
              {parseResult && activeTab === 'tables' && (
                <div className="h-full overflow-y-auto overflow-x-hidden">
                  <div className="space-y-3 p-3">
                    {tables.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                        <Table2 className="h-8 w-8 text-slate-200" />
                        <p className="text-[12px] text-slate-400">No tables detected in this document</p>
                      </div>
                    ) : (
                      tables.map((tbl, idx) => (
                        <div key={tbl.position} className="rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Table2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-[12px] font-medium text-slate-700">Table {idx + 1}</span>
                              <span className="text-[10px] text-slate-400">Page {tbl.page_id + 1}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 gap-1 px-2 text-[11px]"
                              onClick={() => downloadTableCsv(tbl.text, idx)}
                            >
                              <Download className="h-3 w-3" />
                              CSV
                            </Button>
                          </div>
                          {/* Native scroll — ScrollArea blocks horizontal scroll */}
                          <div className="overflow-x-auto">
                            <style>{`
                              .tbl-html table { border-collapse: collapse; width: max-content; min-width: 100%; font-size: 12px; }
                              .tbl-html td, .tbl-html th { border: 1px solid #3b82f6; padding: 6px 10px; text-align: left; vertical-align: top; min-width: 100px; max-width: 260px; white-space: normal; word-break: break-word; line-height: 1.5; }
                              .tbl-html th { background: #eff6ff; font-weight: 600; color: #1d4ed8; }
                              .tbl-html tr:nth-child(even) td { background: #f8faff; }
                            `}</style>
                            <div
                              className="tbl-html p-2"
                              dangerouslySetInnerHTML={{ __html: tbl.text }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── Images ── */}
              {parseResult && activeTab === 'images' && (
                <ScrollArea className="h-full">
                  <div className="p-3 flex flex-col gap-4">
                    {!hasAnyImages ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                        <ImageIcon className="h-8 w-8 text-slate-200" />
                        <p className="text-[12px] text-slate-400">No embedded images detected</p>
                      </div>
                    ) : (
                      <>
                        {/* Base64 images from detail */}
                        {allImages.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {allImages.map((img, idx) => (
                              <div key={img.position} className="group relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={`data:image/jpeg;base64,${img.base64}`} alt={`Image ${idx + 1}`} className="h-full w-full object-contain" />
                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                  <span className="text-[10px] text-white/80">pg. {img.page_id + 1}</span>
                                  <button className="rounded-md bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/40"
                                    onClick={() => { const a = document.createElement('a'); a.href = `data:image/jpeg;base64,${img.base64}`; a.download = `image-p${img.page_id + 1}-${idx + 1}.jpg`; a.click(); }}>
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* URL images from markdown */}
                        {markdownImageUrls.length > 0 && (
                          <>
                            {allImages.length > 0 && (
                              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">From Markdown</p>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              {markdownImageUrls.map((url, idx) => (
                                <div key={url} className="group relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={url} alt={`Markdown image ${idx + 1}`} className="h-full w-full object-contain" />
                                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="text-[10px] text-white/80 truncate max-w-[80%]">img {idx + 1}</span>
                                    <a href={url} download={`image-${idx + 1}.jpg`}
                                      className="rounded-md bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/40">
                                      <Download className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
