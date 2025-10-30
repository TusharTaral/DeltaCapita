import { isPdfFile, isWithinSize, formatMaxSize } from '@/utils/validation';
import { MAX_FILE_BYTES, ACCEPT_MIME } from '@/utils/constants';

describe('validation utils', () => {
  it('isPdfFile returns true for PDF mime', () => {
    const file = new File(['%PDF-1.7'], 'a.pdf', { type: ACCEPT_MIME });
    expect(isPdfFile(file)).toBe(true);
  });

  it('isPdfFile returns false for non-PDF mime', () => {
    const file = new File([''], 'a.txt', { type: 'text/plain' });
    expect(isPdfFile(file)).toBe(false);
  });

  it('isWithinSize enforces max bytes inclusive', () => {
    const exact = new File([new Uint8Array(MAX_FILE_BYTES)], 'big.pdf', { type: ACCEPT_MIME });
    expect(isWithinSize(exact, MAX_FILE_BYTES)).toBe(true);
    const over = new File([new Uint8Array(MAX_FILE_BYTES + 1)], 'bigger.pdf', {
      type: ACCEPT_MIME,
    });
    expect(isWithinSize(over, MAX_FILE_BYTES)).toBe(false);
  });

  it('formatMaxSize prints MB with one decimal', () => {
    expect(formatMaxSize(5 * 1024 * 1024)).toBe('5MB');
    expect(formatMaxSize(10.4 * 1024 * 1024)).toBe('10.4MB');
  });
});
