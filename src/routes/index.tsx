import loadable from '@loadable/component';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import TosModal from '../components/TosModal';
import routes from './routes';
import { Page, ProtectedRoute, PublicRoute } from 'components/navigation';
import { LoginCallback } from 'services/auth';

const Main = loadable(() => import('./Main'));
const Login = loadable(() => import('./login'));
const NotFound = loadable(() => import('./not-found'));
const EnrollNotFound = loadable(() => import('./not-found-enroll'));

// TODO: Fix layout

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute />}>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Main showFooter />
            </Suspense>
          }
        >
          <Route
            path="/"
            element={
              <Page>
                <Login />
              </Page>
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <TosModal />
              <Main showFooter />
            </Suspense>
          }
        >
          {routes.map(({ path, component: PageComponent, props }) => (
            <Route
              key={path}
              path={path}
              element={
                <Page fallback={null}>
                  {props ? <PageComponent {...props} /> : <PageComponent />}
                </Page>
              }
            />
          ))}
        </Route>
      </Route>

      <Route path="/login" element={<LoginCallback />} />

      <Route
        path="/enroll/*"
        element={
          <Page>
            <EnrollNotFound />
          </Page>
        }
      />

      <Route
        path="*"
        element={
          <Page>
            <NotFound />
          </Page>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
