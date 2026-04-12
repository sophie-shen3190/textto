/**
 * Module-level store for passing a File (and parse mode) from the landing page
 * hero to the Playground without a full page reload.
 *
 * Works because Next.js client-side navigation keeps the same JS module
 * instance alive across route changes.
 */

type ParseMode = 'standard' | 'vlm';

let _pendingFile: File | null = null;
let _pendingMode: ParseMode   = 'standard';

export function setPendingFile(file: File, mode: ParseMode = 'standard'): void {
  _pendingFile = file;
  _pendingMode = mode;
}

export function getPendingFile(): { file: File; mode: ParseMode } | null {
  if (!_pendingFile) return null;
  const result = { file: _pendingFile, mode: _pendingMode };
  _pendingFile = null;
  _pendingMode = 'standard';
  return result;
}
