'use client';

import {
  ArrowRight,
  FileText,
  Landmark,
  Layers,
  PenLine,
  Scale,
  Tag,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UseCase {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  h3: string;
  description: string;
  keywords: string[];
  preview: React.ReactNode;
}

function JsonBlock({ lines }: { lines: Array<{ key: string; value: string; type?: 'string' | 'number' | 'array' | 'comment' }> }) {
  const colorMap = {
    string: 'text-emerald-600',
    number: 'text-amber-600',
    array: 'text-violet-600',
    comment: 'text-slate-400 italic',
  };
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC]">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="ml-1 font-mono text-[11px] text-slate-400">output.json</span>
      </div>
      <div className="p-4 font-mono text-xs leading-6">
        <span className="text-slate-500">{'{'}</span>
        {lines.map(({ key, value, type = 'string' }, i) => (
          <div key={i} className="pl-4">
            {type === 'comment' ? (
              <span className={colorMap.comment}>{value}</span>
            ) : (
              <>
                <span className="text-blue-600">"{key}"</span>
                <span className="text-slate-500">: </span>
                <span className={colorMap[type]}>{value}</span>
                {i < lines.length - 1 && <span className="text-slate-400">,</span>}
              </>
            )}
          </div>
        ))}
        <span className="text-slate-500">{'}'}</span>
      </div>
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="text-[11px] font-medium text-slate-500">Extracted Table — CSV Preview</span>
        <span className="ml-auto rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ Parsed</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {headers.map((h) => <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                {row.map((cell, j) => <td key={j} className="px-3 py-2 font-mono text-slate-600">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarkdownBlock({ lines }: { lines: Array<{ text: string; type: 'h1' | 'h2' | 'body' | 'bold' | 'tag' | 'divider' }> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="text-[11px] font-medium text-slate-500">output.md</span>
        <span className="ml-auto rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">Markdown</span>
      </div>
      <div className="space-y-1 p-4 font-mono text-xs leading-6">
        {lines.map(({ text, type }, i) => {
          if (type === 'h1') return <div key={i} className="text-sm font-bold text-slate-900">{text}</div>;
          if (type === 'h2') return <div key={i} className="mt-1 font-semibold text-slate-800">{text}</div>;
          if (type === 'bold') return <div key={i} className="font-medium text-slate-700">{text}</div>;
          if (type === 'tag') return <span key={i} className="mr-1.5 inline-block rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">{text}</span>;
          if (type === 'divider') return <div key={i} className="my-1 border-t border-slate-100" />;
          return <div key={i} className="text-slate-500">{text}</div>;
        })}
      </div>
    </div>
  );
}

const USE_CASES: UseCase[] = [
  {
    id: 'pdf-parsing',
    icon: <FileText className="h-5 w-5" />,
    iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
    badge: 'Most Popular', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700',
    h3: 'PDF Parser & Data Extraction',
    description: 'Extract structured data from any PDF — financial reports, research papers, scanned invoices, and more. Output as JSON, Markdown, CSV, or XML with normalized coordinates for every element. Ideal for building RAG pipelines, LLM applications, and automated document workflows.',
    keywords: ['pdf parsing', 'extract data from pdf', 'pdf to json converter', 'pdf to csv', 'pdf data extraction', 'pdf parser'],
    preview: (
      <JsonBlock lines={[
        { key: 'document_type', value: '"financial_report"', type: 'string' },
        { key: 'pages', value: '12', type: 'number' },
        { key: 'confidence', value: '0.995', type: 'number' },
        { key: 'tables_detected', value: '3', type: 'number' },
        { key: 'elements', value: '[Title, Table, NarrativeText, ...]', type: 'array' },
        { key: 'output_formats', value: '["markdown", "json", "csv", "xml"]', type: 'array' },
      ]} />
    ),
  },
  {
    id: 'resume-parser',
    icon: <User className="h-5 w-5" />,
    iconBg: 'bg-violet-100', iconColor: 'text-violet-600',
    badge: 'HR & Recruiting', badgeBg: 'bg-violet-50', badgeText: 'text-violet-700',
    h3: 'AI Resume Parser & CV Extraction',
    description: 'Automatically extract candidate information from resumes and CVs in any format — PDF, Word, or image scans. Structured output includes name, contact, skills, work experience, and education fields. Plug directly into your ATS or HR automation pipeline.',
    keywords: ['resume parser', 'ai resume parser', 'resume data extraction', 'cv extraction'],
    preview: (
      <JsonBlock lines={[
        { key: 'name', value: '"Sarah Chen"', type: 'string' },
        { key: 'email', value: '"sarah.chen@email.com"', type: 'string' },
        { key: 'skills', value: '["Python", "Machine Learning", "SQL", ...]', type: 'array' },
        { key: 'experience_years', value: '6', type: 'number' },
        { key: 'current_title', value: '"Senior Data Scientist"', type: 'string' },
        { key: 'education', value: '["M.S. Computer Science, MIT"]', type: 'array' },
      ]} />
    ),
  },
  {
    id: 'bank-statement-parser',
    icon: <Landmark className="h-5 w-5" />,
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    badge: 'Finance & Compliance', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700',
    h3: 'Bank Statement Parser',
    description: 'Convert bank statements from any institution into clean, structured CSV or JSON. Automatically extract transaction dates, descriptions, debit/credit amounts, and running balances. Supports multi-page statements, foreign currency accounts, and scanned PDFs.',
    keywords: ['bank statement parser', 'bank statement to csv'],
    preview: (
      <TableBlock
        headers={['Date', 'Description', 'Debit', 'Credit', 'Balance']}
        rows={[
          ['2024-09-01', 'STRIPE PAYOUT', '', '$12,400.00', '$48,320.00'],
          ['2024-09-03', 'AWS INVOICE', '$2,340.00', '', '$45,980.00'],
          ['2024-09-05', 'PAYROLL — ACME', '$18,500.00', '', '$27,480.00'],
          ['2024-09-07', 'CUSTOMER REFUND', '$450.00', '', '$27,030.00'],
          ['2024-09-10', 'VENDOR PAYMENT', '$3,200.00', '', '$23,830.00'],
        ]}
      />
    ),
  },
  {
    id: 'document-extraction',
    icon: <Layers className="h-5 w-5" />,
    iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
    badge: 'Enterprise', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700',
    h3: 'Document Extraction Software & Automation',
    description: 'Scale document extraction across your entire organization. Batch process thousands of documents via API, trigger webhooks on completion, and integrate with your existing data pipelines. Supports Word, Excel, PowerPoint, HTML, and 50+ formats alongside PDF.',
    keywords: ['document extraction', 'document parser', 'document extraction software', 'pdf document automation'],
    preview: (
      <MarkdownBlock lines={[
        { text: '## Batch Processing Pipeline', type: 'h1' },
        { text: '', type: 'divider' },
        { text: 'POST /api/xparse/pipeline', type: 'h2' },
        { text: '✓  1,240 documents queued', type: 'body' },
        { text: '✓  Processing: 12 concurrent workers', type: 'body' },
        { text: '✓  Completed: 1,198 / 1,240', type: 'bold' },
        { text: '', type: 'divider' },
        { text: 'PDF', type: 'tag' },
        { text: 'DOCX', type: 'tag' },
        { text: 'XLSX', type: 'tag' },
        { text: 'PPTX', type: 'tag' },
        { text: 'HTML', type: 'tag' },
      ]} />
    ),
  },
  {
    id: 'handwriting-recognition',
    icon: <PenLine className="h-5 w-5" />,
    iconBg: 'bg-rose-100', iconColor: 'text-rose-600',
    badge: 'OCR & Digitization', badgeBg: 'bg-rose-50', badgeText: 'text-rose-700',
    h3: 'Handwriting to Text Converter',
    description: 'Digitize handwritten forms, notes, prescriptions, and receipts with high accuracy. Our multi-engine OCR handles mixed printed and handwritten content on the same page, supporting both English and multilingual documents.',
    keywords: ['handwriting to text converter', 'ocr handwriting', 'handwriting recognition'],
    preview: (
      <JsonBlock lines={[
        { key: 'type', value: '"HandwrittenText"', type: 'string' },
        { key: 'text', value: '"Patient: John D. / DOB: 1985-03-12"', type: 'string' },
        { key: 'confidence', value: '0.97', type: 'number' },
        { key: 'language', value: '"en"', type: 'string' },
        { key: 'mixed_content', value: 'true', type: 'number' },
        { key: 'coordinates', value: '[0.08, 0.12, 0.72, 0.18]', type: 'array' },
      ]} />
    ),
  },
  {
    id: 'legal-document-extraction',
    icon: <Scale className="h-5 w-5" />,
    iconBg: 'bg-slate-100', iconColor: 'text-slate-600',
    badge: 'Legal & Compliance', badgeBg: 'bg-slate-50', badgeText: 'text-slate-700',
    h3: 'Legal Document Data Extraction',
    description: 'Extract key clauses, parties, dates, obligations, and defined terms from contracts, NDAs, and regulatory filings. Accelerate legal review and due diligence with structured, machine-readable output ready for your LLM or contract analysis platform.',
    keywords: ['legal document data extraction', 'contract extraction', 'nda parser'],
    preview: (
      <JsonBlock lines={[
        { key: 'document_type', value: '"NDA"', type: 'string' },
        { key: 'parties', value: '["ACME Corp.", "Vendor Inc."]', type: 'array' },
        { key: 'effective_date', value: '"2024-01-15"', type: 'string' },
        { key: 'term_years', value: '3', type: 'number' },
        { key: 'governing_law', value: '"State of Delaware"', type: 'string' },
        { key: 'key_clauses', value: '["Confidentiality", "Non-Compete", ...]', type: 'array' },
      ]} />
    ),
  },
];

function KeywordBadges({ keywords }: { keywords: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Tag className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-300" />
      {keywords.map((kw) => (
        <span key={kw}
          className="cursor-default rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
          {kw}
        </span>
      ))}
    </div>
  );
}

function UseCaseRow({ useCase, index }: { useCase: UseCase; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <motion.section id={useCase.id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="grid grid-cols-1 items-center gap-10 border-b border-slate-100 py-14 last:border-0 lg:grid-cols-2 xl:gap-16">

      <div className={`flex flex-col gap-5 ${!isEven ? 'lg:order-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${useCase.iconBg} ${useCase.iconColor}`}>
            {useCase.icon}
          </div>
          <span className={`rounded-full border border-current/10 px-2.5 py-1 text-xs font-semibold ${useCase.badgeBg} ${useCase.badgeText}`}>
            {useCase.badge}
          </span>
        </div>

        <h3 className="text-2xl font-bold leading-snug tracking-tight text-slate-900"
          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
          {useCase.h3}
        </h3>

        <p className="text-base leading-relaxed text-slate-500"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          {useCase.description}
        </p>

        <KeywordBadges keywords={useCase.keywords} />

        <a href={`/playground?usecase=${useCase.id}`}
          className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
          Try this use case free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className={!isEven ? 'lg:order-1' : ''}>
        {useCase.preview}
      </div>
    </motion.section>
  );
}

interface UseCasesSectionProps {
  label?: string;
  heading?: string;
  subheading?: string;
  industries?: Array<{ icon: string; title: string; desc: string }>;
  cta_heading?: string;
  cta_sub?: string;
  cta_button?: string;
}

export function UseCasesSection({
  label = 'Use Cases',
  heading = 'AI Document Parser for Every Workflow, Document Data Extraction',
  subheading = 'From extracting data from PDFs to parsing resumes and bank statements — one API handles every document type your application needs.',
  industries = [
    { icon: '💰', title: 'Finance & Banking', desc: 'Annual reports, 10-K filings, balance sheets' },
    { icon: '🧾', title: 'Invoice & Receipts', desc: 'VAT invoices, purchase orders, receipts' },
    { icon: '⚕️', title: 'Healthcare', desc: 'Medical records, lab reports, prescriptions' },
    { icon: '⚖️', title: 'Legal & Contracts', desc: 'Agreements, NDAs, regulatory filings' },
  ],
  cta_heading = 'Ready to parse your first document?',
  cta_sub = 'Sign in and get 100 free credits. No credit card required.',
  cta_button = 'Start Free — 100 Credits',
}: UseCasesSectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 xl:gap-16">

          {/* Left: heading */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
              {label}
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              {heading}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              {subheading}
            </p>
          </div>

          {/* Right: industry cards */}
          <div className="grid grid-cols-2 gap-3">
            {industries.map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:border-blue-200 hover:shadow-sm">
                <div className="mb-1 text-lg">{icon}</div>
                <div className="text-xs font-semibold text-slate-800">{title}</div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div>
          {USE_CASES.map((uc, i) => <UseCaseRow key={uc.id} useCase={uc} index={i} />)}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white sm:flex-row">
          <div>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              {cta_heading}
            </p>
            <p className="mt-1 text-sm text-blue-100">
              {cta_sub}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-3">
            <a href="/playground"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50">
              {cta_button}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
