import { renderHook, act } from '@testing-library/react';
import { usePdfSigner } from '@/hooks/usePdfSigner';
import * as api from '@/utils/api';

vi.mock('@/utils/api');

function createFile(type: string, size: number) {
  const blob = new Blob([new Uint8Array(size)] as any, { type });
  return new File([blob], 'file.pdf', { type });
}

describe('usePdfSigner', () => {
  it('rejects non-PDF files', () => {
    const { result } = renderHook(() => usePdfSigner());
    const input = { target: { files: [createFile('text/plain', 10)] } } as any;
    act(() => result.current.onFileChange(input));
    expect(result.current.selectedFile).toBeNull();
    expect(result.current.errorMessage).toMatch(/valid PDF/i);
  });

  it('rejects oversize files', () => {
    const { result } = renderHook(() => usePdfSigner());
    const input = { target: { files: [createFile('application/pdf', 20 * 1024 * 1024)] } } as any;
    act(() => result.current.onFileChange(input));
    expect(result.current.selectedFile).toBeNull();
    expect(result.current.errorMessage).toMatch(/Maximum allowed size/i);
  });

  it('sets error when submitting without a file', async () => {
    const { result } = renderHook(() => usePdfSigner());
    await act(async () => {
      await result.current.onSubmit({ preventDefault: () => {} } as any);
    });
    expect(result.current.errorMessage).toMatch(/Select a PDF/i);
  });

  it('submits and stores signed blob on success', async () => {
    const mockBlob = new Blob(['ok']);
    (api.signPdf as any).mockResolvedValue(mockBlob);
    const { result } = renderHook(() => usePdfSigner());
    const file = createFile('application/pdf', 1024);
    act(() => result.current.onFileChange({ target: { files: [file] } } as any));
    await act(async () => {
      await result.current.onSubmit({ preventDefault: () => {} } as any);
    });
    expect(api.signPdf).toHaveBeenCalled();
    // signedUrl is derived from blob via useObjectUrl; we verify no error and not submitting
    expect(result.current.errorMessage).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('captures API errors', async () => {
    (api.signPdf as any).mockRejectedValue(new Error('Boom'));
    const { result } = renderHook(() => usePdfSigner());
    const file = createFile('application/pdf', 1024);
    act(() => result.current.onFileChange({ target: { files: [file] } } as any));
    await act(async () => {
      await result.current.onSubmit({ preventDefault: () => {} } as any);
    });
    expect(result.current.errorMessage).toBe('Boom');
    expect(result.current.isSubmitting).toBe(false);
  });
});
