import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import Text from '../common/Text';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from './Link';
import UserMenu from './UserMenu';
import logoImg from 'images/logo.png';
import { useAuth } from 'services/auth';
import {
  REDIRECT_PATH_AUTHENTICATED,
  REDIRECT_PATH_UNAUTHENTICATED,
} from 'utils/constants';
import { flexSpaceBetween } from 'utils/styled';

const Toolbar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <StyledWrapper>
      <StyledWrapperInner>
        <StyledContentLeft>
          <StyledLink
            to={
              user ? REDIRECT_PATH_AUTHENTICATED : REDIRECT_PATH_UNAUTHENTICATED
            }
          >
            <StyledLogo src={logoImg} />
          </StyledLink>
          <StyledText forwardedAs="span" variant="bodyLarge">
            {t('Permissions and consents')}
          </StyledText>
        </StyledContentLeft>
        <StyledContentRight>
          <LanguageSwitcher />
          {user && <UserMenu />}
        </StyledContentRight>
      </StyledWrapperInner>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.header`
  flex: none;
  width: 100%;
  background-color: ${p => p.theme.colors.surface};
  padding: 0 ${p => p.theme.em(p.theme.spacing.medium)};
  margin: 0;
  height: 80px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
`;

const StyledWrapperInner = styled.div`
  ${flexSpaceBetween}
  height: 100%;
  padding: ${p => p.theme.em(p.theme.spacing.small)} 0;
`;

const StyledContentLeft = styled.div`
  height: 100%;
  display: flex;
  gap: ${p => p.theme.em(p.theme.spacing.normal)};
  align-items: center;
`;

const StyledLink = styled(Link)`
  display: flex;
  height: 100%;
  position: relative;
  align-items: center;
`;

const StyledLogo = styled.img`
  max-height: 100%;
`;

const StyledText = styled(Text)`
  font-weight: bold;
`;

const StyledContentRight = styled.div`
  display: flex;
  gap: ${p => p.theme.em(p.theme.spacing.small)};

  @media only screen and (max-width: 780px) {
    gap: ${p => p.theme.em(p.theme.spacing.xxsmall)};
  }
`;

export default Toolbar;
