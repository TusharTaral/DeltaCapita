import React from 'react';

type Props = { url: string | null };

export default function PdfViewer({ url }: Props): JSX.Element | null {
  if (!url) return null;
  return (
    <section className="card">
      <h2 className="section-title">Signed PDF</h2>
      <div className="pdf-viewer">
        <iframe
          src={url}
          title="Signed PDF preview"
          className="pdf-object"
        />
        <noscript>
          <p>
            Your device may not support inline PDF preview.
            <a href={url} target="_blank" rel="noopener noreferrer"> Open the PDF</a> or save it.
          </p>
        </noscript>
      </div>
      <div className="actions-row">
        <a className="secondary-btn" href={url} download="signed.pdf">Download</a>
        <a className="secondary-btn" href={url} target="_blank" rel="noopener noreferrer">Open in new tab</a>
      </div>
    </section>
  );
}


