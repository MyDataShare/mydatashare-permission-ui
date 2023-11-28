import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useMemo } from 'react';
import { useHover } from 'react-aria';
import styled, { css } from 'styled-components/macro';

import ButtonContent from './ButtonContent';
import type { FillButtonProps, FillButtonVariant } from './types';
import { Color } from 'theme';
import { capitalize } from 'utils/fn';

const FillButton = forwardRef<HTMLButtonElement, FillButtonProps>(
  // eslint-disable-next-line react/prop-types
  ({ children, disabled, icon, loading, variant, ...rest }, ref) => {
    const { isHovered, hoverProps } = useHover({});

    const customStyles = useMemo(
      () => styles(variant, isHovered, disabled),
      [disabled, isHovered, variant]
    );

    return (
      <ButtonContent
        {...rest}
        {...hoverProps}
        ref={ref}
        disabled={disabled}
        loading={loading}
        customStyles={customStyles}
      >
        {!loading && icon && <FontAwesomeIcon icon={icon} size="lg" />}
        {loading && <StyledSpinner icon={light('spinner')} size="lg" />}
        {children}
      </ButtonContent>
    );
  }
);

const StyledSpinner = styled(FontAwesomeIcon)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const styles = (
  variant: FillButtonVariant,
  hovered: boolean,
  disabled?: boolean
) => css`
  gap: ${({ theme }) => theme.em(theme.spacing.xsmall)};
  min-width: 10em;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.em(theme.spacing.small)}
    ${({ theme }) => theme.em(theme.spacing.large)};
  color: ${p => p.theme.colors.secondary};
  background: ${p =>
    disabled
      ? p.theme.colors[`button${capitalize(variant)}Disabled` as Color]
      : hovered
      ? p.theme.colors[`button${capitalize(variant)}Hover` as Color]
      : p.theme.colors[`button${capitalize(variant)}` as Color]};
  border: 2px solid
    ${p =>
      disabled
        ? p.theme.colors[`button${capitalize(variant)}Disabled` as Color]
        : hovered
        ? p.theme.colors[`button${capitalize(variant)}Hover` as Color]
        : p.theme.colors[`button${capitalize(variant)}` as Color]};
  border-radius: ${({ theme }) => theme.em(theme.radii.small)};

  @media only screen and (max-width: 780px) {
    padding-left: ${({ theme }) => theme.em(theme.spacing.large)};
    padding-right: ${({ theme }) => theme.em(theme.spacing.large)};
    min-width: ${({ theme }) => theme.em(theme.sizing.button.large)};
    flex: 1;
  }
`;

FillButton.displayName = 'FillButton';

export default FillButton;
