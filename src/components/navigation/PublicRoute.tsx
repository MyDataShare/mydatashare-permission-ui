import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from 'services/auth';
import { REDIRECT_PATH_AUTHENTICATED } from 'utils/constants';

const PublicRoute = () => {
  const { user } = useAuth();
  const { pathname, search, hash } = useLocation();

  return user ? (
    <Navigate
      to={REDIRECT_PATH_AUTHENTICATED}
      replace
      state={{ path: pathname, search, hash }}
    />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
