import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { MainLayout } from 'components/navigation';
import { removeUserFromStorage } from 'utils/storage';

interface Props {
  message?: string;
  logOutUser: boolean;
}

const Error = ({ message, logOutUser = false }: Props) => {
  const { t } = useTranslation();

  if (logOutUser) {
    console.log('Logging out user');
    removeUserFromStorage();
  }

  return (
    <MainLayout>
      <StyledWrapper>
        <h1>{t('headingError')}</h1>
        {message && <p>{t(message)}</p>}
        <a href="/">{t('Back home')}</a>
      </StyledWrapper>
    </MainLayout>
  );
};

export default Error;

const StyledWrapper = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
`;
