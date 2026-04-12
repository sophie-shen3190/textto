/**
 * In-memory job result store.
 *
 * Development: results live in this Map for the lifetime of the dev server.
 * Production:  swap the Map operations for DB reads/writes (Redis / Postgres).
 *
 * Shape stored per job:
 *   status : 'pending' | 'done' | 'error'
 *   result : ParseResult | undefined
 *   error  : string | undefined
 *   ts     : timestamp of last update
 */

import type { ParseResult } from '@/app/api/playground/parse/route';

export interface JobRecord {
  status: 'pending' | 'done' | 'error';
  result?: ParseResult;
  error?: string;
  ts: number;
}

// Module-level singleton — survives hot-reload in dev (Next.js caches module instances)
const store = new Map<string, JobRecord>();

// Prune entries older than 2 hours to avoid unbounded growth
const TTL = 2 * 60 * 60 * 1000;
function pruneOld() {
  const cutoff = Date.now() - TTL;
  for (const [id, rec] of store) {
    if (rec.ts < cutoff) store.delete(id);
  }
}

export function setJob(jobId: string, rec: Omit<JobRecord, 'ts'>) {
  pruneOld();
  store.set(jobId, { ...rec, ts: Date.now() });
}

export function getJob(jobId: string): JobRecord | undefined {
  return store.get(jobId);
}
