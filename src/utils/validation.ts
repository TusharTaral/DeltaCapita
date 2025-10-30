import { MAX_FILE_BYTES, ACCEPT_MIME } from './constants';

export function isPdfFile(file: File | null | undefined): boolean {
  return Boolean(file && file.type === ACCEPT_MIME);
}

export function isWithinSize(file: File | null | undefined, maxBytes: number = MAX_FILE_BYTES): boolean {
  return Boolean(file && typeof file.size === 'number' && file.size <= maxBytes);
}

export function formatMaxSize(bytes: number = MAX_FILE_BYTES): string {
  const mb = Math.round((bytes / (1024 * 1024)) * 10) / 10;
  return `${mb}MB`;
}


