import i18n from 'i18next';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import Text from '../common/Text';
import { ExternalLink as Link } from './Link';
import logoMDS from 'images/mydatashare_logo.png';
import { ReactComponent as FooterLogo } from 'images/vastuugroup_logo.svg';
import { getPrivacyLink, getTosLink } from 'utils/fn';
import { contentMaxWidth, flexColumn } from 'utils/styled';

type FooterLink = {
  href: string;
  label: string;
};

interface Props {
  children?: ReactNode;
}

const Footer = ({ children }: Props) => {
  const { t } = useTranslation();

  const footerLinks: FooterLink[] = [
    {
      href: getTosLink(i18n.language),
      label: 'Terms of Service',
    },
    {
      href: getPrivacyLink(i18n.language),
      label: 'Privacy Statement',
    },
  ];
  return (
    <StyledFooter>
      <StyledFooterInner>
        <StyledFooterWrapper>
          <StyledFooterLogosWrapper>
            <Link
              href="https://www.mydatashare.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledText>Powered by</StyledText>
              <StyledFooterLogo src={logoMDS} alt="MyDataShare-logo" />
            </Link>
            <Link
              href="https://www.vastuugroup.fi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FooterLogo height={40} />
            </Link>
            <Link
              href="https://www.hel.fi/"
              target="_blank"
              rel="noopener noreferrer"
            ></Link>
          </StyledFooterLogosWrapper>
          <StyledFooterNavSection>
            <StyledFooterNavList>
              {footerLinks.map(({ href, label }, index) => (
                <StyledListItem key={index}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    hoverEffect
                    showSymbol
                  >
                    {t(label)}
                  </Link>
                </StyledListItem>
              ))}
            </StyledFooterNavList>
          </StyledFooterNavSection>
          {children && <StyledFooterContent>{children}</StyledFooterContent>}
        </StyledFooterWrapper>
      </StyledFooterInner>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  background-color: ${p => p.theme.colors.footerBackground};
  border-top: 1px solid ${p => p.theme.colors.border};
`;

const StyledFooterInner = styled.div`
  ${contentMaxWidth}
  padding-top: ${p => p.theme.em(p.theme.spacing.xxlarge)};
  padding-bottom: ${p => p.theme.em(p.theme.spacing.xxlarge)};
`;

const StyledFooterWrapper = styled.div`
  position: relative;
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.large)};

  @media only screen and (max-width: 690px) {
    gap: ${({ theme }) => theme.em(theme.spacing.xlarge)};
  }
`;

const StyledFooterLogosWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.em(theme.spacing.medium)};
  width: max-content;
  align-items: flex-end;

  @media only screen and (max-width: 690px) {
    ${flexColumn}
    gap: ${({ theme }) => theme.em(theme.spacing.normal)};
    align-items: flex-start;
  }
`;

const StyledText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
`;

const StyledFooterLogo = styled.img`
  display: block;
  margin: 0;
  height: 40px;
`;

const StyledFooterNavSection = styled.nav`
  display: flex;
`;

const StyledFooterNavList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  gap: ${({ theme }) => theme.em(theme.spacing.large)};

  @media only screen and (max-width: 690px) {
    ${flexColumn}
    gap: ${({ theme }) => theme.em(theme.spacing.normal)};
  }
`;

const StyledListItem = styled.li`
  position: relative;
`;

const StyledFooterContent = styled.div`
  position: relative;
`;

export default Footer;
