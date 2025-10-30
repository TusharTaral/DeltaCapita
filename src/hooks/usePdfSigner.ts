import { useCallback, useMemo, useState } from 'react';
import { ACCEPT_MIME, MAX_FILE_BYTES } from '../utils/constants';
import { isPdfFile, isWithinSize, formatMaxSize } from '../utils/validation';
import { signPdf } from '../utils/api';
import { useObjectUrl } from './useObjectUrl';
import type { ChangeEvent, FormEvent } from 'react';

export function usePdfSigner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signedBlob, setSignedBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const accept = useMemo(() => ACCEPT_MIME, []);
  const signedUrl = useObjectUrl(signedBlob);

  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!isPdfFile(file)) {
      setSelectedFile(null);
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }
    if (!isWithinSize(file, MAX_FILE_BYTES)) {
      setSelectedFile(null);
      setErrorMessage(
        `File is too large. Maximum allowed size is ${formatMaxSize(MAX_FILE_BYTES)}.`
      );
      return;
    }
    setSelectedFile(file);
  }, []);

  const resetSigned = useCallback(() => {
    setSignedBlob(null);
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage('');
      resetSigned();
      if (!selectedFile) {
        setErrorMessage('Select a PDF to upload.');
        return;
      }
      setIsSubmitting(true);
      try {
        const blob = await signPdf(selectedFile);
        setSignedBlob(blob);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [resetSigned, selectedFile]
  );

  return {
    accept,
    selectedFile,
    signedUrl,
    isSubmitting,
    errorMessage,
    onFileChange,
    onSubmit,
  } as const;
}
