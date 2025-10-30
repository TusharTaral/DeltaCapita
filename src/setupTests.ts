import '@testing-library/jest-dom';

// jsdom does not implement createObjectURL; provide a simple mock for tests
if (!(URL as any).createObjectURL) {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(() => 'blob://mock'),
  });
}

if (!(URL as any).revokeObjectURL) {
  Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn(),
  });
}
