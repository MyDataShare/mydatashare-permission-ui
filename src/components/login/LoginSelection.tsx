import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import LoginButton from './LoginButton';
import {
  AUTH_ITEM_NAMES,
  REDIRECT_PATH_AUTHENTICATED,
  REDIRECT_URI,
  SCOPE,
} from 'utils/constants';
import { getEnvVar } from 'utils/env';
import { getSearchParams } from 'utils/fn';
import { getRequiredTranslation as getTranslation } from 'utils/mdsApi';
import { addToStorage } from 'utils/storage';
import { flexColumn } from 'utils/styled';
import type { AuthItem, Location, Metadata } from 'utils/types';

interface Props {
  authItems: AuthItem[];
  metadatas: Record<string, Metadata>;
}

const LoginSelection = ({ authItems, metadatas }: Props) => {
  const { state } = useLocation() as Location;
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (item: AuthItem) => {
      setIsLoading(true);

      /* Fix for Safari: If user clicks a login button and then navigates back
       * using browser back navigation, the login page buttons will still be
       * disabled. Safari uses cache from the login page and that cache will
       * have isLoading = true still even after leaving the page for auth.
       * The timeout here makes sure we revert loading state back to false
       * after a set time has elapsed.
       */
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      const idProvider = item.getIdProvider();
      addToStorage('idpId', idProvider.id);
      const clientId = getEnvVar(`REACT_APP_IDP_CLIENT_ID_${idProvider.id}`);

      if (state) {
        let redirecPath = state.path;
        if (state.path === '/') {
          redirecPath = REDIRECT_PATH_AUTHENTICATED;
        }
        addToStorage(
          'redirectUri',
          `${redirecPath}${state.search}${state.hash}`
        );
      }

      if (clientId) {
        await item.performAuthorization(clientId, REDIRECT_URI, SCOPE);
      }
    },
    [state]
  );

  useEffect(() => {
    const searchParams = getSearchParams(state?.search);

    if (searchParams.auth_item_uuid) {
      const selectedAuthItem = authItems.find(
        ai => ai.uuid === searchParams.auth_item_uuid
      );

      if (selectedAuthItem) {
        login(selectedAuthItem);
      }
    }
  }, [authItems, login, state]);

  const onLoginSelection = (item: AuthItem) => login(item);

  const sortingOrder = AUTH_ITEM_NAMES || [];
  const sortedAuthItems = authItems.sort(
    (a, b) => sortingOrder.indexOf(a.name) - sortingOrder.indexOf(b.name)
  );

  return (
    <StyledLoginItems role="region">
      {sortedAuthItems.map(item => {
        if (item.name && item.name.endsWith('_HIDDEN')) {
          return null;
        }

        const iconUrls = item.getUrls('icon_medium');
        const iconUrl = iconUrls.length ? iconUrls[0].json_data.url : null;
        const itemNameTr = getTranslation(item, 'name', metadatas);
        const itemDescriptionTr = getTranslation(
          item,
          'description',
          metadatas
        );

        return (
          <StyledLoginItem key={item.uuid} data-auth-item-uuid={item.uuid}>
            <LoginButton
              loading={isLoading}
              label={itemNameTr}
              description={itemDescriptionTr}
              icon={iconUrl}
              onClick={() => onLoginSelection(item)}
            />
          </StyledLoginItem>
        );
      })}
    </StyledLoginItems>
  );
};

const StyledLoginItems = styled.ul`
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.xsmall)};
`;

const StyledLoginItem = styled.li`
  display: flex;
`;

export default LoginSelection;
