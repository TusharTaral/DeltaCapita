import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadForm from './components/UploadForm';
import PdfViewer from './components/PdfViewer';
import { usePdfSigner } from './hooks/usePdfSigner';

export default function App(): JSX.Element {
  const { accept, selectedFile, signedUrl, isSubmitting, errorMessage, onFileChange, onSubmit } =
    usePdfSigner();

  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <UploadForm
          accept={accept}
          isSubmitting={isSubmitting}
          onFileChange={onFileChange}
          onSubmit={onSubmit}
          selectedFile={selectedFile}
          errorMessage={errorMessage}
        />
        <PdfViewer url={signedUrl} />
      </main>
      <Footer />
    </div>
  );
}
