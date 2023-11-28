import { ReactNode } from 'react';
import { OverlayProvider } from 'react-aria';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components/macro';

import { theme } from './theme';
import { ErrorBoundary } from 'components/common';
import { AuthProvider } from 'services/auth';
import { I18nProvider } from 'services/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false, // Loading state is handled in code
      useErrorBoundary: false, // Errors are thrown to the boundary in code
      staleTime: 5000, // Queries become stale after 5 seconds
    },
  },
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <I18nProvider>
        <OverlayProvider>
          <Router>
            <ErrorBoundary logOutUser>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
              </QueryClientProvider>
            </ErrorBoundary>
          </Router>
        </OverlayProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default Providers;
