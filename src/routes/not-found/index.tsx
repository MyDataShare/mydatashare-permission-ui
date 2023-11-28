import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import { PageLayout } from 'components/navigation';
import { flexColumn } from 'utils/styled';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout showFooter={true}>
      <StyledWrapper>
        <h2>{t('headingPageNotFound')}</h2>
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

export default NotFoundPage;
