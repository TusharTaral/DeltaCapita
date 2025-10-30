import { useEffect, useRef, useState } from 'react';

export function useObjectUrl(blob: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      prevUrlRef.current = objUrl;
      setUrl(objUrl);
    } else {
      setUrl(null);
    }

    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
    };
  }, [blob]);

  return url;
}


