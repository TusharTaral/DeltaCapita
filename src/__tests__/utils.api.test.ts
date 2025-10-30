import { signPdf } from '@/utils/api';

describe('api.signPdf', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch as any;
  });

  it('posts to /api/sign and returns blob', async () => {
    const mockBlob = new Blob(['data'], { type: 'application/pdf' });
    global.fetch = vi.fn(async () => ({ ok: true, blob: async () => mockBlob })) as any;

    const file = new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' });
    const result = await signPdf(file);
    expect(result).toBe(mockBlob);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/sign',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('throws error with server text when not ok', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, text: async () => 'Bad file' })) as any;
    const file = new File(['X'], 'doc.pdf', { type: 'application/pdf' });
    await expect(signPdf(file)).rejects.toThrow('Bad file');
  });
});
