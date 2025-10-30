import { render, screen } from '@testing-library/react';
import UploadForm from '@/components/UploadForm';

describe('UploadForm', () => {
  const baseProps = {
    accept: 'application/pdf',
    isSubmitting: false,
    onFileChange: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
    selectedFile: null as File | null,
    errorMessage: '',
  };

  it('disables submit without selected file', () => {
    render(<UploadForm {...baseProps} />);
    expect(screen.getByRole('button', { name: /upload & sign/i })).toBeDisabled();
  });

  it('shows error message when provided', () => {
    render(<UploadForm {...baseProps} errorMessage="Oops" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Oops');
  });

  it('enables submit when file selected', () => {
    const file = new File(['%PDF'], 'a.pdf', { type: 'application/pdf' });
    render(<UploadForm {...baseProps} selectedFile={file} />);
    expect(screen.getByRole('button', { name: /upload & sign/i })).toBeEnabled();
  });
});
