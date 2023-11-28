import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ForwardedRef, forwardRef, useMemo } from 'react';
import { useHover } from 'react-aria';
import { css } from 'styled-components/macro';

import ButtonContent from './ButtonContent';
import type { ButtonProps, ButtonVariant } from './types';
import { Color } from 'theme';
import { capitalize } from 'utils/fn';

type Props = ButtonProps & {
  icon?: IconDefinition;
};

const BaseButton = forwardRef(function BaseButtonBase(
  props: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const {
    children,
    customStyles: style,
    disabled,
    icon,
    variant = 'primary',
    ...rest
  } = props;
  const { isHovered, hoverProps } = useHover({});
  const customStyles = useMemo(
    () => styles(variant, isHovered, disabled, style),
    [variant, disabled, isHovered, style]
  );

  return (
    <ButtonContent
      {...rest}
      {...hoverProps}
      ref={ref}
      disabled={disabled}
      variant={variant}
      customStyles={customStyles}
    >
      {icon && <FontAwesomeIcon icon={icon} size="lg" />}
      {children}
    </ButtonContent>
  );
});

const styles = (
  variant: ButtonVariant,
  hovered: boolean,
  disabled?: boolean,
  style?: any
) => css`
  gap: ${({ theme }) => theme.em(theme.spacing.small)};
  padding-top: ${({ theme }) => theme.em(theme.spacing.normal)};
  padding-bottom: ${({ theme }) => theme.em(theme.spacing.normal)};
  color: ${p =>
    disabled
      ? p.theme.colors[`buttonColorDisabled${capitalize(variant)}` as Color]
      : p.theme.colors[`buttonColor${capitalize(variant)}` as Color]};
  background-color: ${p =>
    disabled
      ? p.theme.colors[
          `buttonBackgroundDisabled${capitalize(variant)}` as Color
        ]
      : hovered
      ? p.theme.colors[`buttonHover${capitalize(variant)}` as Color]
      : p.theme.colors[`buttonBackground${capitalize(variant)}` as Color]};
  border: 2px solid
    ${p =>
      disabled
        ? p.theme.colors[`buttonBorderDisabled${capitalize(variant)}` as Color]
        : hovered
        ? p.theme.colors[`buttonBorderHover${capitalize(variant)}` as Color]
        : p.theme.colors[`buttonBorder${capitalize(variant)}` as Color]};
  ${style};
`;

BaseButton.displayName = 'BaseButton';

export default BaseButton;
