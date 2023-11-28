import { ReactElement, ReactNode, Suspense } from 'react';

import { ErrorBoundary } from 'components/common';

interface Props {
  children: ReactNode;
  fallback?: null | ReactElement;
}

const Page = ({ children, fallback = null }: Props) => {
  return (
    <ErrorBoundary logOutUser={false}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default Page;
