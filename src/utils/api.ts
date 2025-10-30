export async function signPdf(file: File): Promise<Blob> {
  const form = new FormData();
  form.append('file', file, 'document.pdf');

  const response = await fetch('/api/sign', {
    method: 'POST',
    body: form,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to sign PDF');
  }
  return await response.blob();
}


