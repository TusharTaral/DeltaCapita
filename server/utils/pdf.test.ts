// @vitest-environment node
import { looksLikePdf } from './pdf';

describe('looksLikePdf', () => {
  it('returns false for short buffers', () => {
    expect(looksLikePdf(Buffer.from([]))).toBe(false);
    expect(looksLikePdf(Buffer.from([0x25, 0x50, 0x44]))).toBe(false);
  });

  it('detects %PDF header', () => {
    expect(looksLikePdf(Buffer.from([0x25, 0x50, 0x44, 0x46]))).toBe(true);
    const withVersion = Buffer.from('%PDF-1.7\nRest');
    expect(looksLikePdf(withVersion)).toBe(true);
  });

  it('rejects non-PDF header', () => {
    expect(looksLikePdf(Buffer.from('GIF89a'))).toBe(false);
  });
});
