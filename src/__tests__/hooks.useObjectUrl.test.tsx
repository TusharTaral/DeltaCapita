import { renderHook, act } from '@testing-library/react';
import { useObjectUrl } from '@/hooks/useObjectUrl';

describe('useObjectUrl', () => {
  const createSpy = vi.spyOn(URL, 'createObjectURL');
  const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

  beforeEach(() => {
    createSpy.mockReturnValue('blob://mock');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates and revokes object URLs on change and unmount', () => {
    const { result, rerender, unmount } = renderHook(({ blob }) => useObjectUrl(blob), {
      initialProps: { blob: null as Blob | null },
    });

    expect(result.current).toBeNull();

    const blob1 = new Blob(['a']);
    rerender({ blob: blob1 });
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(result.current).toBe('blob://mock');

    const blob2 = new Blob(['b']);
    rerender({ blob: blob2 });
    expect(revokeSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(2);

    unmount();
    expect(revokeSpy).toHaveBeenCalledTimes(2);
  });
});
