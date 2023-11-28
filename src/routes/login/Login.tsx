import { store, AuthItem } from 'mydatashare-core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components/macro';

import { Loading, Text } from 'components/common';
import { LoginSelection } from 'components/login';
import { fetchAuthItems } from 'utils/client';
import { AUTH_ITEM_NAMES } from 'utils/constants';
import { flexColumn } from 'utils/styled';
import type { AuthItem as TAuthItem } from 'utils/types';

const Login = () => {
  const { t } = useTranslation();
  // TODO: Fetch all pages
  const { data, isError, isLoading, isIdle, isSuccess, status } = useQuery(
    'authItems',
    fetchAuthItems
  );
  const [authItems, setAuthItems] = useState<TAuthItem[]>([]);

  useEffect(() => {
    if (!authItems.length && data && isSuccess) {
      store.parseApiResponse(data);
      const preselectedAuthItems: TAuthItem[] = AuthItem.asArray(store).filter(
        (ai: TAuthItem) => AUTH_ITEM_NAMES?.includes(ai.name)
      );

      if (preselectedAuthItems.length !== AUTH_ITEM_NAMES?.length) {
        throw new Error('Error fetching auth_items');
      }
      setAuthItems(preselectedAuthItems);
    }
  }, [authItems, data, isSuccess]);

  if (isLoading || isIdle) {
    return <Loading />;
  }

  if (isError) {
    throw new Error('Error fetching auth_items');
  }

  if (!isSuccess) {
    throw new Error(`Unhandled Auth Items query status: ${status}`);
  }

  return (
    <StyledWrapper>
      <StyledHeader variant="title1">{t('Login page header')}</StyledHeader>
      <StyledText>{t('Login page intro')}</StyledText>

      <StyledSection>
        <StyledSectionHeader variant="title2">
          {t('Identify and log in')}
        </StyledSectionHeader>
        {authItems && (
          <LoginSelection authItems={authItems} metadatas={data.metadatas} />
        )}
      </StyledSection>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  ${flexColumn}
`;

const StyledHeader = styled(Text)`
  margin-bottom: ${p => p.theme.em(p.theme.spacing.xsmall)};
`;

const StyledText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.normal)};
`;

const StyledSection = styled.div`
  position: relative;
`;

const StyledSectionHeader = styled(Text)`
  margin-top: ${({ theme }) => theme.em(theme.spacing.small)};
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.small)};
`;

export default Login;
