import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from 'services/auth';
import { REDIRECT_PATH_UNAUTHENTICATED } from 'utils/constants';

const ProtectedRoute = () => {
  const { user } = useAuth();
  const { pathname, search, hash } = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to={REDIRECT_PATH_UNAUTHENTICATED}
      replace
      state={{ path: pathname, search, hash }}
    />
  );
};

export default ProtectedRoute;
