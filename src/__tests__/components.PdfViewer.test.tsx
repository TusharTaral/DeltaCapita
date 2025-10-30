import { render, screen } from '@testing-library/react';
import PdfViewer from '@/components/PdfViewer';

describe('PdfViewer', () => {
  it('renders nothing when url is null', () => {
    const { container } = render(<PdfViewer url={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders iframe and actions when url provided', () => {
    render(<PdfViewer url="blob://x" />);
    expect(screen.getByTitle('Signed PDF preview')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open in new tab/i })).toBeInTheDocument();
  });
});
