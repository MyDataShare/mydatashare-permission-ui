import { useEffect } from 'react';

export const useDocumentTitle = (title: string, addition?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = addition ? `${title} | ${addition}` : title;
    return () => {
      document.title = prevTitle;
    };
  }, [title, addition]);
};
