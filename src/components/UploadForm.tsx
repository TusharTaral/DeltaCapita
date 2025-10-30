import React from 'react';
import { MAX_FILE_BYTES } from '../utils/constants';
import { formatMaxSize } from '../utils/validation';
import type { ChangeEvent, FormEvent } from 'react';

type Props = {
  accept: string;
  isSubmitting: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  selectedFile: File | null;
  errorMessage: string;
};

export default function UploadForm({
  accept,
  isSubmitting,
  onFileChange,
  onSubmit,
  selectedFile,
  errorMessage,
}: Props): JSX.Element {
  return (
    <section className="card">
      <form className="upload-form" onSubmit={onSubmit} autoComplete="off">
        <label htmlFor="file" className="input-label">
          Choose a PDF
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept={accept}
          onChange={onFileChange}
          aria-describedby="file-help"
        />
        <p id="file-help" className="help-text">
          Max size {formatMaxSize(MAX_FILE_BYTES)}. Only PDF.
        </p>
        <button className="primary-btn" type="submit" disabled={isSubmitting || !selectedFile}>
          {isSubmitting ? 'Signing…' : 'Upload & Sign'}
        </button>
        {errorMessage ? (
          <p role="alert" aria-live="polite" className="error-text">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}
