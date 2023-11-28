import { authorizationCallback, endSession } from 'mydatashare-core';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Loading } from 'components/common';
import client from 'utils/client';
import {
  ENDPOINT_IDENTIFIERS,
  POST_LOGOUT_REDIRECT_URI,
  REDIRECT_PATH_AUTHENTICATED,
  REDIRECT_URI,
} from 'utils/constants';
import { getEnvVar } from 'utils/env';
import { formatUsername, getUsername } from 'utils/mdsApi';
import {
  addUserToStorage,
  getFromStorage,
  getUserFromStorage,
  removeFromStorage,
  removeUserFromStorage,
} from 'utils/storage';
import { IdentifiersApiResponse, User } from 'utils/types';

interface AuthContextInterface {
  user?: User;
  logout: () => void;
}

const AuthContext = createContext<undefined | AuthContextInterface>(undefined);

const fetchIdentifiers = async (): Promise<User | undefined> => {
  const savedUser = getUserFromStorage();
  let user: User | undefined;

  if (savedUser.token) {
    user = {
      idToken: savedUser.idToken,
      token: savedUser.token,
      identifiers: [],
    };

    const response: IdentifiersApiResponse = await client(
      ENDPOINT_IDENTIFIERS,
      { method: 'POST' }
    );

    const username = getUsername(response);
    if (response?.identifiers) {
      user.identifiers = Object.values(response.identifiers);
    }

    if (username) {
      const { givenName, familyName } = username;
      user.givenName = givenName;
      user.familyName = familyName;
      user.username = formatUsername({ givenName, familyName });
    }

    addUserToStorage(user);
  }

  return user;
};

const LoginCallback = () => {
  const navigate = useNavigate();
  const { refetch } = useQuery('user', fetchIdentifiers, {
    enabled: false,
  });
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const refetchUser = async () => {
      await refetch();
      const redirectUri = getFromStorage('redirectUri');
      navigate(redirectUri || REDIRECT_PATH_AUTHENTICATED, { replace: true });
      removeFromStorage('redirectUri');
    };

    const clientId = getEnvVar(
      `REACT_APP_IDP_CLIENT_ID_${getFromStorage('idpId')}`
    );

    authorizationCallback(clientId, REDIRECT_URI)
      .then((result: { accessToken: string; idToken: string }) => {
        setIsError(false);
        addUserToStorage({
          token: result.accessToken,
          idToken: result.idToken,
        });
        refetchUser();
      })
      .catch((error: Error) => {
        console.error(`Error occurred in authorizationCallback: ${error}`);
        setIsError(true);
      });
  }, [navigate, refetch]);

  if (isError) {
    throw new Error('Login failed');
  }

  return <Loading />;
};

/**
 * A Context provider for the authenticated user.
 *
 * Provide child components with the authenticated user. Display a loading screen while the user
 * information is being fetched. Provides two values: the current `user`, and a method for logging
 * out current user `logout`.
 *
 * Performs a fetch to the /user endpoint if access token is saved in storage.
 * If the /user endpoint response status code is 401, the user is logged out.
 * If the /user endpoint request fails for some other reason, an error is thrown.
 *
 * A possible alternative for this Context provider would be the ready made AuthenticationProvider
 * from @axa-fr/react-oidc-context.
 * @param {*} props
 */
const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const {
    data: user,
    isError,
    isLoading,
    isIdle,
    isSuccess,
  } = useQuery('user', fetchIdentifiers);

  const logout = useCallback(() => {
    // TODO: Clear query cache, ALSO CHECK DASHBOARD AND DEMO
    removeUserFromStorage();
    if (!endSession(POST_LOGOUT_REDIRECT_URI)) {
      window.location.assign('/');
    }
  }, []);

  const value = useMemo(() => ({ user, logout }), [user, logout]);

  if (isLoading || isIdle) {
    return <Loading />;
  }

  if (isError) {
    throw new Error('Login failed');
  }

  if (isSuccess) {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={undefined}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook for accessing the authenticated user and logout method.
 *
 * Use in functional components like this: `const {user, logout} = useAuth();`.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Missing AuthProvider!');
  return context;
};

export { AuthProvider, LoginCallback, useAuth };
