import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Text } from 'components/common';
import { PageLayout } from 'components/navigation';
import { flexColumn } from 'utils/styled';

const NotFoundEnrollPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout showFooter={true}>
      <StyledWrapper>
        <Text variant="title2">{t('headingEnrollPageNotFound')}</Text>
        <Text>{t('textEnrollPageNotFound')}</Text>
        <Link to="/">{t('Back home')}</Link>
      </StyledWrapper>
    </PageLayout>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  gap: ${({ theme: { em, spacing } }) => em(spacing.normal)};
  ${flexColumn}
`;

export default NotFoundEnrollPage;
