import { ReactNode } from 'react';
import styled from 'styled-components/macro';

import type { Color, Spacing } from 'theme';
import { capitalize } from 'utils/fn';
import { InfoBoxVariant } from 'utils/types';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: InfoBoxVariant;
  marginTop?: Spacing;
  marginBottom?: Spacing;
}

const InfoBox = ({
  children,
  className,
  variant = 'primary',
  marginTop,
  marginBottom,
}: Props) => {
  return (
    <StyledWrapper
      className={className}
      $variant={variant}
      $marginTop={marginTop}
      $marginBottom={marginBottom}
    >
      <StyledInnerWrapper>{children}</StyledInnerWrapper>
    </StyledWrapper>
  );
};

type StyledWrapperProps = {
  $variant: InfoBoxVariant;
  $marginTop?: Spacing;
  $marginBottom?: Spacing;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  width: fit-content;
  padding: ${({ theme }) => theme.em(theme.spacing.normal)}
    ${({ theme }) => theme.em(theme.spacing.small)};
  border: 2px solid
    ${p => p.theme.colors[`infoBoxBorder${capitalize(p.$variant)}` as Color]};
  border-radius: 2px;
  ${p =>
    p.$marginTop && `margin-top: ${p.theme.em(p.theme.spacing[p.$marginTop])};`}
  ${p =>
    p.$marginBottom &&
    `margin-bottom: ${p.theme.em(p.theme.spacing[p.$marginBottom])};`}
`;

const StyledInnerWrapper = styled.div`
  p {
    line-height: 1.5;
  }
`;

export default InfoBox;
