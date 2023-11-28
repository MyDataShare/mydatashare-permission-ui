import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { Text } from 'components/common';
import { Link } from 'components/navigation';

interface Props {
  position: 'top' | 'bottom';
}

const ConsentBackLink = ({ position }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledLink to="/consents" $position={position}>
      <FontAwesomeIcon icon={light('angle-left')} size="lg" />
      <Text as="span" color="linkMuted">
        {t('Consent back link')}
      </Text>
    </StyledLink>
  );
};

type StyledLinkProps = {
  $position: Props['position'];
};

const StyledLink = styled(Link)<StyledLinkProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.em(theme.spacing.xsmall)};
  max-width: max-content;
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.em(theme.spacing.xsmall)};
  margin-top: ${p =>
    p.$position === 'bottom'
      ? p.theme.em(p.theme.spacing.medium)
      : `-${p.theme.em(p.theme.spacing.xsmall)}`};
  margin-bottom: ${p =>
    p.$position === 'top'
      ? p.theme.em(p.theme.spacing.medium)
      : `-${p.theme.em(p.theme.spacing.xsmall)}`};
  margin-left: -${({ theme }) => theme.em(theme.spacing.xsmall)};
  margin-right: -${({ theme }) => theme.em(theme.spacing.xsmall)};
`;

export default ConsentBackLink;
