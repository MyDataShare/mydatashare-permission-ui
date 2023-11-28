import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFocusRing } from '@react-aria/focus';
import { AnchorHTMLAttributes, forwardRef, ReactNode, useRef } from 'react';
import { useHover, useLink } from 'react-aria';
import mergeRefs from 'react-merge-refs';
import { Link as RRLink, LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';

type Props = LinkProps & {
  children: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ children, ...rest }, ref) => {
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <LinkWrapper
        {...rest}
        {...focusProps}
        ref={ref}
        $isFocusVisible={isFocusVisible}
      >
        {children}
      </LinkWrapper>
    );
  }
);

Link.displayName = 'Link';

export const UnstyledLink = forwardRef<any, Props>(
  ({ children, ...rest }, ref) => {
    return (
      <UnstyledLinkWrapper {...rest} ref={ref}>
        {children}
      </UnstyledLinkWrapper>
    );
  }
);

UnstyledLink.displayName = 'UnstyledLink';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  hoverEffect?: boolean;
  showSymbol?: boolean;
  underline?: boolean;
};

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  // eslint-disable-next-line
  ({ children, hoverEffect, showSymbol, underline, ...rest }, ref) => {
    const localRef = useRef<HTMLAnchorElement>(null);
    const { isHovered, hoverProps } = useHover({});
    const { isFocusVisible, focusProps } = useFocusRing();
    const { linkProps } = useLink({ ...rest } as any, localRef);

    return (
      <StyledOuterWrapper>
        <ExternalLinkWrapper
          {...rest}
          {...linkProps}
          {...focusProps}
          {...hoverProps}
          ref={mergeRefs([localRef, ref])}
          $isFocusVisible={isFocusVisible}
          $isHovered={isHovered}
          $hoverEffect={hoverEffect}
          $underline={underline}
        >
          {children}
        </ExternalLinkWrapper>
        {showSymbol && (
          <FontAwesomeIcon
            icon={light('arrow-up-right-from-square')}
            size="xs"
          />
        )}
      </StyledOuterWrapper>
    );
  }
);

ExternalLink.displayName = 'ExternalLink';

type LinkWrapperProps = {
  $isFocusVisible: boolean;
  $isHovered?: boolean;
};

type ExternalLinkWrapper = LinkWrapperProps & {
  $hoverEffect?: boolean;
  $underline?: boolean;
};

const linkStyles = css<LinkWrapperProps>`
  position: relative;
  color: inherit;
  text-decoration: none;
  outline: ${p =>
    p.$isFocusVisible ? `2px solid ${p.theme.colors.focus}` : 'none'};
  outline-offset: 2px;
`;

const StyledOuterWrapper = styled.div`
  display: inline-flex;
  gap: 0.2em;
  align-items: stretch;
  margin-right: 0.2em;
`;

const LinkWrapper = styled(RRLink)`
  ${linkStyles}
`;

const UnstyledLinkWrapper = styled(RRLink)`
  text-decoration: none;
  outline: none;
`;

const ExternalLinkWrapper = styled.a<ExternalLinkWrapper>`
  ${linkStyles}
  ${({ theme }) => theme.typography.body}
  text-decoration: ${p =>
    (p.$hoverEffect && p.$isHovered) || p.$underline ? 'underline' : 'none'};
`;
