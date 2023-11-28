import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { Button } from 'components/common';
import { goToExternalUrl } from 'utils/fn';

interface Props {
  url: string;
}

const ConsentBackToServiceButton = ({ url }: Props) => {
  const { t } = useTranslation();

  const onButtonClick = () => goToExternalUrl(url);

  return (
    <StyledButton onClick={onButtonClick}>
      {t('Back to service button')}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  position: relative;
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.large)};
`;

export default ConsentBackToServiceButton;
