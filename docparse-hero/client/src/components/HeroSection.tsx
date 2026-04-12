/**
 * HeroSection.tsx
 * Design Philosophy: Developer Tool + Glassmorphism Light
 * - Background: #F8FAFC (near-white with subtle blue tint)
 * - Brand Blue: #2563EB (buttons, highlights)
 * - Success Green: #059669 (accuracy badge, numbers)
 * - Code Area: #F1F5F9 (light blue-gray)
 * - Typography: Space Grotesk (headings) + Inter (body) + JetBrains Mono (code)
 * - Layout: Asymmetric 55/45 split — left: copy + upload, right: parse result preview
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Code2,
  FileJson,
  AlignLeft,
  Sparkles,
} from "lucide-react";

// ─── Ticker formats ────────────────────────────────────────────────────────────
const FORMATS = [
  { label: "PDF", icon: "📄" },
  { label: "Word", icon: "📝" },
  { label: "Excel", icon: "📊" },
  { label: "PowerPoint", icon: "📋" },
  { label: "JPEG / PNG", icon: "🖼️" },
  { label: "TIFF", icon: "🗂️" },
  { label: "HTML", icon: "🌐" },
  { label: "TXT", icon: "📃" },
  { label: "Markdown", icon: "✍️" },
  { label: "EPUB", icon: "📚" },
];

// ─── Mock parse result tabs ─────────────────────────────────────────────────────
const MARKDOWN_RESULT = `## Quarterly Financial Report — Q3 2024

**Company:** ACME Corp.
**Revenue:** $4.5 Billion ↑ 12% YoY

### Consolidated Income Statement

| Item | Q3 2024 | Q3 2023 |
|------|---------|---------|
| Revenue | $4,500M | $4,018M |
| Gross Profit | $2,400M | $2,100M |
| Net Income | $900M | $780M |

> Key Highlight: Total revenue for the quarter
> reached **$4.5 billion**, driven by strong
> performance in cloud services segment.

### Revenue Trend
- 2022: $3,200M
- 2023: $4,018M  
- 2024: $4,500M (projected $5.1B)`;

const JSON_RESULT = `{
  "document_id": "doc_q3_2024",
  "status": "completed",
  "confidence": 0.995,
  "elements": [
    {
      "type": "Title",
      "text": "Quarterly Financial Report",
      "coordinates": [0.08, 0.05, 0.72, 0.09],
      "page": 1
    },
    {
      "type": "Table",
      "rows": 4,
      "cols": 3,
      "data": [
        ["Item", "Q3 2024", "Q3 2023"],
        ["Revenue", "$4,500M", "$4,018M"],
        ["Gross Profit", "$2,400M", "$2,100M"],
        ["Net Income", "$900M", "$780M"]
      ],
      "coordinates": [0.08, 0.35, 0.92, 0.62]
    }
  ]
}`;

// ─── Animated counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current * 10) / 10);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toFixed(1)}{suffix}
    </span>
  );
}

// ─── Syntax highlighted JSON ───────────────────────────────────────────────────
function SyntaxHighlight({ code }: { code: string }) {
  const highlighted = code
    .replace(/("[\w_]+")\s*:/g, '<span class="text-blue-600 font-medium">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span class="text-emerald-600">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-amber-600">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-600">$1</span>');
  return (
    <pre
      className="text-xs leading-5 font-mono text-slate-700 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

// ─── Markdown preview ──────────────────────────────────────────────────────────
function MarkdownPreview({ content }: { content: string }) {
  return (
    <pre className="text-xs leading-5 font-mono text-slate-700 whitespace-pre-wrap">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) {
          return <div key={i} className="text-slate-900 font-semibold text-sm">{line.replace("## ", "")}</div>;
        }
        if (line.startsWith("### ")) {
          return <div key={i} className="text-slate-800 font-medium mt-1">{line.replace("### ", "")}</div>;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <div key={i} className="font-semibold text-slate-800">{line.replace(/\*\*/g, "")}</div>;
        }
        if (line.startsWith("|")) {
          return <div key={i} className="text-slate-600 font-mono text-[11px]">{line}</div>;
        }
        if (line.startsWith("> ")) {
          return <div key={i} className="border-l-2 border-blue-400 pl-2 text-slate-500 italic">{line.replace("> ", "")}</div>;
        }
        if (line.startsWith("- ")) {
          return <div key={i} className="text-slate-600">• {line.replace("- ", "")}</div>;
        }
        if (line === "") return <div key={i} className="h-2" />;
        return <div key={i} className="text-slate-700">{line}</div>;
      })}
    </pre>
  );
}

// ─── Upload zone ───────────────────────────────────────────────────────────────
function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsUploaded(true);
    setTimeout(() => setIsUploaded(false), 3000);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragging
          ? "border-blue-600 bg-blue-100 scale-[1.01]"
          : isUploaded
            ? "border-emerald-500 bg-emerald-50"
            : "border-blue-500 bg-white hover:border-blue-600 hover:bg-white"
        }
        p-8 text-center group
      `}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
          ${isDragging ? "bg-blue-100" : isUploaded ? "bg-emerald-100" : "bg-white shadow-sm group-hover:bg-blue-50"}
        `}>
          {isUploaded
            ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            : <Upload className={`w-6 h-6 transition-colors ${isDragging ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"}`} />
          }
        </div>
        <div>
          <p className={`text-sm font-medium transition-colors ${isDragging ? "text-blue-600" : isUploaded ? "text-emerald-600" : "text-slate-600 group-hover:text-blue-600"}`}>
            {isUploaded ? "File uploaded! Processing..." : isDragging ? "Drop to parse" : "Drop your document here"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            or <span className="text-blue-500 underline underline-offset-2">browse files</span> · PDF, Word, Excel, Image & more
          </p>
        </div>
      </div>

      {/* Format pills */}
      <div className="flex flex-wrap gap-1.5 justify-center mt-4">
        {["PDF", "DOCX", "XLSX", "PNG", "JPG", "TIFF", "HTML", "TXT"].map((fmt) => (
          <span key={fmt} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-500">
            {fmt}
          </span>
        ))}
      </div>

      {/* Or section */}
      <div className="mt-4 pt-4 border-t border-slate-200/80">
        <p className="text-xs text-slate-400 mb-2">Or try with a sample document</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {["Financial Report", "Invoice", "Research Paper", "Contract"].map((sample) => (
            <button
              key={sample}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Hero ─────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"markdown" | "json">("markdown");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15 } },
  };

  return (
    <section className="relative min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("https://d2xsxph8kpxj0f.cloudfront.net/310419663026720850/Cj4MtAcpGXjVDepg3fJmrn/hero-bg-pattern-BaNrByj2M7QxmRHiV4PbGy.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Blue gradient blob top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">

        {/* ── Top badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <ChevronRight className="w-3 h-3 opacity-60" />
          </div>
        </motion.div>

        {/* ── Main grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-start"
        >

          {/* ── LEFT COLUMN ── */}
          <motion.div variants={leftVariants} className="flex flex-col gap-6">

            {/* H1 */}
            <div>
              <h1 className="text-5xl xl:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Parse Any Document
                <br />
                <span className="text-blue-600">LLM-Ready</span> in Seconds
              </h1>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed font-normal"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Get your documents ready for gen AI
              </p>
            </div>

            {/* Accuracy stat */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="text-4xl font-bold text-emerald-600 leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <AnimatedCounter target={99.5} suffix="%" />
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Parse Accuracy</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <div className="text-4xl font-bold text-slate-800 leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <AnimatedCounter target={50} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">File Formats</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <div className="text-4xl font-bold text-slate-800 leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  3
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Output Formats</div>
              </div>
            </div>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <FileJson className="w-3.5 h-3.5" />, label: "Markdown / JSON / XML" },
                { icon: <Zap className="w-3.5 h-3.5" />, label: "RAG-Optimized Chunks" },
                { icon: <Code2 className="w-3.5 h-3.5" />, label: "LLM-Ready Output" },
                { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Tables & Formulas" },
                { icon: <FileText className="w-3.5 h-3.5" />, label: "Finance & Invoices" },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm">
                  <span className="text-blue-500">{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            {/* Upload zone */}
            <UploadZone />

            {/* Free trial banner */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/60">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Free <span className="text-emerald-600">100 credits</span> — no credit card needed
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Sign in to instantly parse PDFs and images. Each page costs 1 credit.
                  Supports all formats including scanned documents and handwritten forms.
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                Start Free — 100 Credits
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <Code2 className="w-4 h-4" />
                View API Docs
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Sign in with Google or GitHub
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                100 free credits on signup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                SOC 2 compliant
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN — Parse result preview ── */}
          <motion.div variants={rightVariants} className="flex flex-col gap-4">

            {/* Preview card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium ml-1">quarterly_report_q3_2024.pdf</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-emerald-700">Parsed · 99.5% confidence</span>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab("markdown")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                    activeTab === "markdown"
                      ? "border-blue-500 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  Markdown
                </button>
                <button
                  onClick={() => setActiveTab("json")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                    activeTab === "json"
                      ? "border-blue-500 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" />
                  JSON
                </button>
                <div className="flex-1" />
                <button className="flex items-center gap-1 px-3 py-2 text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
                  <Code2 className="w-3 h-3" />
                  Copy
                </button>
              </div>

              {/* Content area */}
              <div className="p-4 h-[380px] overflow-y-auto bg-slate-50/30">
                {activeTab === "markdown" ? (
                  <MarkdownPreview content={MARKDOWN_RESULT} />
                ) : (
                  <SyntaxHighlight code={JSON_RESULT} />
                )}
              </div>

              {/* Card footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>12 elements extracted</span>
                  <span>·</span>
                  <span>3 tables detected</span>
                  <span>·</span>
                  <span>1 chart recognized</span>
                </div>
                <span className="text-[11px] text-slate-400">0.8s</span>
              </div>
            </div>

            {/* Supported industries */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "💰", title: "Finance & Banking", desc: "Annual reports, 10-K filings, balance sheets" },
                { icon: "🧾", title: "Invoice & Receipts", desc: "VAT invoices, purchase orders, receipts" },
                { icon: "⚕️", title: "Healthcare", desc: "Medical records, lab reports, prescriptions" },
                { icon: "⚖️", title: "Legal & Contracts", desc: "Agreements, NDAs, regulatory filings" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-xs font-semibold text-slate-800">{title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Format ticker ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-14 pt-8 border-t border-slate-200/80"
        >
          <p className="text-center text-xs text-slate-400 mb-4 font-medium uppercase tracking-widest">
            Supported Input Formats
          </p>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #F8FAFC, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #F8FAFC, transparent)" }} />
            <div className="ticker-track flex gap-3 w-max">
              {[...FORMATS, ...FORMATS].map((fmt, i) => (
                <div key={i} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 whitespace-nowrap shadow-sm">
                  <span>{fmt.icon}</span>
                  <span className="font-medium">{fmt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Pipeline steps ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12"
        >
          <p className="text-center text-xs text-slate-400 mb-6 font-medium uppercase tracking-widest">
            Processing Pipeline
          </p>
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {[
              { step: "01", label: "Parse", desc: "OCR + Layout Analysis", color: "blue" },
              { step: "02", label: "Chunk", desc: "Semantic Segmentation", color: "indigo" },
              { step: "03", label: "Embed", desc: "Vector Embedding", color: "violet" },
              { step: "04", label: "Extract", desc: "Structured Output", color: "purple" },
            ].map(({ step, label, desc, color }, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm min-w-[110px]">
                  <span className={`text-[10px] font-bold text-${color}-400 mb-1`}>{step}</span>
                  <span className="text-sm font-semibold text-slate-800">{label}</span>
                  <span className="text-[10px] text-slate-400 text-center mt-0.5">{desc}</span>
                </div>
                {i < 3 && (
                  <div className="flex items-center px-1">
                    <div className="w-6 h-px bg-slate-300" />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 -ml-1" />
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
