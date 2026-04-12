'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  AlignLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileJson,
  FileText,
  ImageIcon,
  Sparkles,
  Table2,
  Upload,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from '@/core/auth/client';
import { setPendingFile } from '@/shared/lib/pending-file-store';
import { useAppContext } from '@/shared/contexts/app';
import { SAMPLE_PARSE_RESULTS } from '@/shared/lib/sample-parse-data';

const FORMATS = [
  { label: 'PDF', icon: '📄' },
  { label: 'Word', icon: '📝' },
  { label: 'Excel', icon: '📊' },
  { label: 'PowerPoint', icon: '📋' },
  { label: 'JPEG / PNG', icon: '🖼️' },
  { label: 'TIFF', icon: '🗂️' },
  { label: 'HTML', icon: '🌐' },
  { label: 'TXT', icon: '📃' },
  { label: 'Markdown', icon: '✍️' },
  { label: 'EPUB', icon: '📚' },
];

// ── Syntax highlighter for JSON tab ─────────────────────────────────────────
function SyntaxHighlight({ code }: { code: string }) {
  const highlighted = code
    .replace(/("[\w_]+")\s*:/g, '<span class="text-blue-600 font-medium">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span class="text-emerald-600">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-amber-600">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-600">$1</span>');
  return (
    <pre
      className="whitespace-pre-wrap font-mono text-xs leading-5 text-slate-700"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

// ── Simple markdown renderer for Markdown tab ────────────────────────────────
function MdPreview({ content }: { content: string }) {
  return (
    <div className="space-y-0.5">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# '))
          return <div key={i} className="text-base font-bold text-slate-900 mt-2">{line.replace(/^# /, '')}</div>;
        if (line.startsWith('## '))
          return <div key={i} className="text-sm font-semibold text-slate-900 mt-2">{line.replace(/^## /, '')}</div>;
        if (line.startsWith('### '))
          return <div key={i} className="mt-1 font-medium text-slate-800 text-xs">{line.replace(/^### /, '')}</div>;
        if (line.startsWith('|'))
          return <div key={i} className="font-mono text-[10px] text-slate-600">{line}</div>;
        if (line.startsWith('> '))
          return <div key={i} className="border-l-2 border-blue-400 pl-2 italic text-[11px] text-slate-500">{line.replace(/^> /, '')}</div>;
        if (line.startsWith('- ') || line.startsWith('* '))
          return <div key={i} className="text-[11px] text-slate-600">• {line.replace(/^[-*] /, '')}</div>;
        if (line.match(/^\d+\./))
          return <div key={i} className="text-[11px] text-slate-600">{line}</div>;
        if (line === '') return <div key={i} className="h-1.5" />;
        // Image: ![alt](src)
        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          const [, alt, src] = imgMatch;
          // eslint-disable-next-line @next/next/no-img-element
          return <img key={i} src={src} alt={alt} className="my-1 max-w-full rounded border border-slate-200" />;
        }
        // Replace inline **bold** / *italic*
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        return <div key={i} className="text-[11px] text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
}

// ── Extract tables from result_json ─────────────────────────────────────────
function extractTables(result_json: any): string[] {
  const tables: string[] = [];
  // xparse format: result_json.elements or result_json.detail
  const elements = result_json?.elements ?? result_json?.detail ?? [];
  for (const el of elements) {
    const type = (el.type || el.category || '').toLowerCase();
    const text = el.text || el.content || '';
    if (type === 'table' && text.trim()) tables.push(text);
  }
  // Also check markdown-embedded tables
  if (tables.length === 0 && result_json?.markdown) {
    const rows = result_json.markdown.match(/<table[\s\S]*?<\/table>/gi);
    if (rows) tables.push(...rows);
  }
  return tables;
}

// ── Extract images from result_json ─────────────────────────────────────────
function extractImages(result_json: any, markdown: string): string[] {
  const srcs: string[] = [];
  const elements = result_json?.elements ?? result_json?.detail ?? [];
  for (const el of elements) {
    if (el.base64) srcs.push(`data:image/png;base64,${el.base64}`);
    else if (el.image_url) srcs.push(el.image_url);
  }
  // Also scan markdown for img tags and markdown images
  const mdImgs = [...markdown.matchAll(/!\[.*?\]\((.*?)\)/g), ...markdown.matchAll(/<img[^>]+src="([^"]+)"/gi)];
  for (const m of mdImgs) if (m[1] && !srcs.includes(m[1])) srcs.push(m[1]);
  return srcs;
}

// ── Parse result panel (4 tabs) ──────────────────────────────────────────────
type PreviewTab = 'markdown' | 'json' | 'tables' | 'images';

function ResultPanel({ sample }: { sample: typeof SAMPLE_PARSE_RESULTS[0] }) {
  const [tab, setTab] = useState<PreviewTab>('markdown');

  const tables = useMemo(() => extractTables(sample.result_json), [sample]);
  const images = useMemo(() => extractImages(sample.result_json, sample.markdown), [sample]);

  const TABS: { key: PreviewTab; label: string; icon: React.ReactNode }[] = [
    { key: 'markdown', label: 'Markdown', icon: <AlignLeft className="h-3 w-3" /> },
    { key: 'json',     label: 'JSON',     icon: <FileJson className="h-3 w-3" /> },
    { key: 'tables',   label: 'Tables',   icon: <Table2 className="h-3 w-3" /> },
    { key: 'images',   label: 'Images',   icon: <ImageIcon className="h-3 w-3" /> },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="ml-1 text-xs font-medium text-slate-500">{sample.filename}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-emerald-700">Parsed · {sample.label}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {TABS.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-all
              ${tab === key ? 'border-blue-500 bg-blue-50/50 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {icon}
            {label}
            {key === 'tables' && tables.length > 0 && (
              <span className="ml-0.5 rounded-full bg-slate-200 px-1.5 text-[10px] text-slate-600">{tables.length}</span>
            )}
            {key === 'images' && images.length > 0 && (
              <span className="ml-0.5 rounded-full bg-slate-200 px-1.5 text-[10px] text-slate-600">{images.length}</span>
            )}
          </button>
        ))}
        <div className="flex-1" />
        <button className="flex items-center gap-1 px-3 py-2 text-[11px] text-slate-400 transition-colors hover:text-slate-600"
          onClick={() => navigator.clipboard?.writeText(tab === 'json' ? JSON.stringify(sample.result_json, null, 2) : sample.markdown)}>
          <Code2 className="h-3 w-3" />
          Copy
        </button>
      </div>

      {/* Content */}
      <div className="h-[400px] overflow-y-auto bg-slate-50/30 p-4">
        {tab === 'markdown' && <MdPreview content={sample.markdown} />}
        {tab === 'json' && <SyntaxHighlight code={JSON.stringify(sample.result_json, null, 2).slice(0, 8000)} />}
        {tab === 'tables' && (
          tables.length === 0
            ? <div className="flex h-full items-center justify-center text-sm text-slate-400">No tables detected</div>
            : <div className="space-y-6">
                {tables.map((html, i) => (
                  <div key={i}>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Table {i + 1}</p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white text-xs [&_table]:w-full [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-2 [&_th]:py-1 [&_th]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                ))}
              </div>
        )}
        {tab === 'images' && (
          images.length === 0
            ? <div className="flex h-full items-center justify-center text-sm text-slate-400">No images detected</div>
            : <div className="grid grid-cols-2 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Image ${i + 1}`} className="w-full object-contain" />
                  </div>
                ))}
              </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>{(sample.result_json?.elements ?? sample.result_json?.detail ?? []).length} elements</span>
          <span>·</span>
          <span>{tables.length} tables</span>
          <span>·</span>
          <span>{images.length} images</span>
        </div>
        <span className="text-[11px] text-slate-400">{sample.label}</span>
      </div>
    </div>
  );
}

// ── ParseModeSelector ────────────────────────────────────────────────────────
function ParseModeSelector({ mode, onChange }: { mode: 'standard' | 'vlm'; onChange: (m: 'standard' | 'vlm') => void }) {
  return (
    <div className="flex rounded-xl border border-blue-200 bg-blue-50/60 p-1 gap-1 shadow-sm">
      {([
        { value: 'standard' as const, icon: <AlignLeft className="h-3.5 w-3.5" />, title: 'Standard Parsing', desc: 'High-accuracy layout & structure recognition for PDFs and documents.' },
        { value: 'vlm'      as const, icon: <Sparkles  className="h-3.5 w-3.5" />, title: 'VLM Parsing',      desc: 'Vision-Language Model (VLM) — Understands images within documents or image files and describes them in natural language.' },
      ] as const).map(({ value, icon, title, desc }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex flex-1 flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-all duration-200
              ${active
                ? 'bg-white shadow-md ring-1 ring-blue-300 border border-blue-200'
                : 'hover:bg-white/70 border border-transparent'}`}
          >
            <div className={`flex items-center gap-1.5 text-sm font-bold ${active ? 'text-blue-600' : 'text-slate-600'}`}>
              <span className={active ? 'text-blue-500' : 'text-slate-400'}>{icon}</span>
              {title}
              {active && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-500" />}
            </div>
            <p className={`text-[10.5px] leading-relaxed ${active ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
          </button>
        );
      })}
    </div>
  );
}

// ── SampleUseCases ───────────────────────────────────────────────────────────
function SampleUseCases({ mode, selectedIdx, onSelect }: {
  mode: 'standard' | 'vlm';
  selectedIdx: number;
  onSelect: (idx: number) => void;
}) {
  const [loading, setLoading] = useState<number | null>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const router = useRouter();
  const { setIsShowSignModal } = useAppContext();

  const handleSelect = async (idx: number) => {
    // Show result inline — no navigation needed
    onSelect(idx);

    // Also allow navigating to playground with the file pre-loaded on click
    // (optional: open in playground if user wants full experience)
  };

  const handleOpenInPlayground = async (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (!isLoggedIn) { setIsShowSignModal(true); return; }
    const sample = SAMPLE_PARSE_RESULTS[idx];
    setLoading(idx);
    try {
      const proxyUrl = `/api/proxy/file?url=${encodeURIComponent(sample.url)}`;
      const res = await fetch(proxyUrl);
      const blob = await res.blob();
      const file = new File([blob], sample.filename, { type: sample.type });
      setPendingFile(file, mode);
      router.push('/playground');
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="mt-1">
      <p className="mb-2 text-sm font-semibold text-slate-700">Sample use cases</p>
      <div className="grid grid-cols-4 gap-2">
        {SAMPLE_PARSE_RESULTS.map((sample, idx) => {
          const isLoading = loading === idx;
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={sample.label}
              onClick={() => handleSelect(idx)}
              className={`group flex flex-col overflow-hidden rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'border-blue-400 shadow-md ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'}`}>
              {/* Thumbnail */}
              <div className="relative h-16 w-full overflow-hidden bg-slate-50">
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  </div>
                )}
                {sample.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sample.thumb} alt={sample.label} className="h-full w-full object-cover object-top transition-transform duration-200 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-0.5 text-slate-300">
                    <FileText className="h-6 w-6" />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/10" />
                )}
              </div>
              {/* Label */}
              <div className="px-1.5 py-1 text-center">
                <p className={`text-[9px] font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'}`}>{sample.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── UploadZone ───────────────────────────────────────────────────────────────
function UploadZone({ mode }: { mode: 'standard' | 'vlm' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const router = useRouter();
  const { setIsShowSignModal } = useAppContext();

  const goToPlaygroundWithFile = (file: File) => {
    setPendingFile(file, mode);
    setIsUploaded(true);
    router.push('/playground');
  };

  const requireLogin = () => {
    setIsShowSignModal(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!isLoggedIn) { requireLogin(); return; }
    goToPlaygroundWithFile(file);
  };

  const handleClick = () => {
    if (!isLoggedIn) { requireLogin(); return; }
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    goToPlaygroundWithFile(file);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 group
        ${isDragging ? 'scale-[1.01] border-blue-600 bg-blue-100'
          : isUploaded ? 'border-emerald-500 bg-emerald-50'
          : 'border-blue-500 bg-white hover:border-blue-600'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.tiff,.webp,.html,.txt"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex flex-col items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300
          ${isDragging ? 'bg-blue-100' : isUploaded ? 'bg-emerald-100' : 'bg-white shadow-sm group-hover:bg-blue-50'}`}>
          {isUploaded
            ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            : <Upload className={`h-6 w-6 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />}
        </div>
        <div>
          <p className={`text-sm font-medium transition-colors
            ${isDragging ? 'text-blue-600' : isUploaded ? 'text-emerald-600' : 'text-slate-600 group-hover:text-blue-600'}`}>
            {isUploaded ? 'File uploaded! Processing…' : isDragging ? 'Drop to parse' : 'Drop your document here'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            or <span className="text-blue-500 underline underline-offset-2">browse files</span> · PDF, Word, Excel, Image & more
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {['PDF', 'DOCX', 'XLSX', 'PNG', 'JPG', 'TIFF', 'HTML', 'TXT'].map((fmt) => (
          <span key={fmt} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── HeroSection ──────────────────────────────────────────────────────────────
export function HeroSection() {
  const [parseMode, setParseMode] = useState<'standard' | 'vlm'>('standard');
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const router = useRouter();
  const { setIsShowSignModal } = useAppContext();

  const handleStartFree = () => {
    if (isLoggedIn) {
      router.push('/playground');
    } else {
      setIsShowSignModal(true);
    }
  };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const leftVariants = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
  const rightVariants = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15 } } };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

      {/* Blue blob */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8">

        {/* H1 — SEO + product category label */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-4 flex justify-start">
          <h1 className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-100">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            AI Document Processing &amp; Parser
          </h1>
        </motion.div>

        {/* Visual hero headline */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-8">
          <p className="text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl xl:text-7xl"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            <span className="text-blue-600">Parse Any Document</span> LLM-Ready in Seconds
          </p>
        </motion.div>

        {/* Stats row — full width below title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10 flex flex-wrap items-center gap-6 sm:gap-10">
          {[
            { value: '99.99%', label: 'Parse Accuracy', color: 'text-emerald-600' },
            { value: '5s',     label: 'Per 100 PDF Pages', color: 'text-blue-600' },
            { value: '1000',   label: 'Pages Per PDF Max', color: 'text-slate-800' },
            { value: '100+',   label: 'File Formats',     color: 'text-slate-800' },
          ].map(({ value, label, color }, i) => (
            <div key={label} className="flex items-center gap-6 sm:gap-10">
              {i > 0 && <div className="hidden h-10 w-px bg-slate-200 sm:block" />}
              <div className="flex flex-col">
                <span className={`text-4xl font-bold leading-none ${color}`}
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  {value}
                </span>
                <span className="mt-1 text-xs font-medium text-slate-500">{label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main grid — equal columns */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_0.8fr] xl:gap-12">

          {/* LEFT */}
          <motion.div variants={leftVariants} className="flex flex-col gap-5">
            <p className="text-lg font-normal leading-relaxed text-slate-500"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Get your documents ready for gen AI
            </p>

            <ParseModeSelector mode={parseMode} onChange={setParseMode} />

            <UploadZone mode={parseMode} />

            {/* Free trial banner */}
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Free & <span className="text-emerald-600">unlimited</span> — sign up to get started
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Create a free account to instantly parse PDFs and images with no usage limits.
                  Supports all formats including scanned documents and handwritten forms.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartFree}
                className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0">
                Start Free — Unlimited Use
                <ArrowRight className="h-5 w-5" />
              </button>
              <a href="/playground"
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md">
                <Code2 className="h-5 w-5" />
                Try Playground
              </a>
            </div>

          </motion.div>

          {/* RIGHT — Sample use cases + Parse result preview */}
          <motion.div variants={rightVariants} className="flex flex-col gap-4">

            <SampleUseCases
              mode={parseMode}
              selectedIdx={selectedSampleIdx}
              onSelect={setSelectedSampleIdx}
            />

            {/* Arrow connector */}
            <div className="flex justify-center">
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="0" x2="12" y2="20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
                <path d="M5 18L12 28L19 18" fill="#94a3b8" />
              </svg>
            </div>

            <ResultPanel sample={SAMPLE_PARSE_RESULTS[selectedSampleIdx]} />

          </motion.div>
        </motion.div>

        {/* Format ticker */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-14 border-t border-slate-200/80 pt-8">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
            Supported Input Formats
          </p>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16"
              style={{ background: 'linear-gradient(to right, #F8FAFC, transparent)' }} />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16"
              style={{ background: 'linear-gradient(to left, #F8FAFC, transparent)' }} />
            <div className="ticker-track flex w-max gap-3">
              {[...FORMATS, ...FORMATS].map((fmt, i) => (
                <div key={i} className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                  <span>{fmt.icon}</span>
                  <span className="font-medium">{fmt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pipeline steps */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
            Processing Pipeline
          </p>
          <div className="flex flex-wrap items-center justify-center gap-0">
            {[
              { step: '01', label: 'Parse', desc: 'OCR + Layout Analysis', color: 'text-blue-400' },
              { step: '02', label: 'Chunk', desc: 'Semantic Segmentation', color: 'text-indigo-400' },
              { step: '03', label: 'Embed', desc: 'Vector Embedding', color: 'text-violet-400' },
              { step: '04', label: 'Extract', desc: 'Structured Output', color: 'text-purple-400' },
            ].map(({ step, label, desc, color }, i) => (
              <div key={step} className="flex items-center">
                <div className="flex min-w-[110px] flex-col items-center rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                  <span className={`mb-1 text-[10px] font-bold ${color}`}>{step}</span>
                  <span className="text-sm font-semibold text-slate-800">{label}</span>
                  <span className="mt-0.5 text-center text-[10px] text-slate-400">{desc}</span>
                </div>
                {i < 3 && (
                  <div className="flex items-center px-1">
                    <div className="h-px w-6 bg-slate-300" />
                    <ChevronRight className="-ml-1 h-3.5 w-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
