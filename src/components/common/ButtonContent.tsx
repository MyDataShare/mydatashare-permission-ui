import { forwardRef, useRef } from 'react';
import { useButton, useFocusRing } from 'react-aria';
import mergeRefs from 'react-merge-refs';
import styled from 'styled-components/macro';

import { ButtonProps, ButtonSize } from './types';
import { Theme, Typography } from 'theme';

const ButtonContent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    /* eslint-disable react/prop-types */
    {
      as: asTag,
      children,
      customStyles,
      disabled = false,
      id,
      loading = false,
      onClick,
      size = 'normal',
      type = 'button',
      ...rest
    },
    /* eslint-enable */
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const { isFocusVisible, focusProps } = useFocusRing();
    const { buttonProps, isPressed } = useButton(
      {
        id,
        type,
        children,
        elementType: asTag,
        isDisabled: disabled || loading,
        onPress: onClick,
      },
      localRef
    );

    return (
      <StyledWrapper
        {...rest}
        {...buttonProps}
        {...focusProps}
        ref={mergeRefs([localRef, ref])}
        $customStyles={customStyles}
        $isFocusVisible={isFocusVisible}
        $isLoading={loading}
        $isPressed={isPressed}
        $size={size}
      >
        {children}
      </StyledWrapper>
    );
  }
);

const buttonSizeToTextVariant: { [size in ButtonSize]: Partial<Typography> } = {
  small: 'bodySmall',
  normal: 'body',
  large: 'bodyLarge',
};

const horizontalPadding: {
  [size in keyof Theme['sizing']['button']]: keyof Theme['spacing'];
} = {
  small: 'normal',
  normal: 'large',
  large: 'large',
};

type StyledWrapperProps = {
  $customStyles: any;
  $isFocusVisible: boolean;
  $isLoading: boolean;
  $isPressed: boolean;
  $size: ButtonSize;
};

const StyledWrapper = styled.button<StyledWrapperProps>`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin: 0;
  height: ${p => p.theme.sizing.button[p.$size]}px;
  padding-left: ${p => p.theme.em(p.theme.spacing[horizontalPadding[p.$size]])};
  padding-right: ${p =>
    p.theme.em(p.theme.spacing[horizontalPadding[p.$size]])};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  outline: ${p =>
    p.$isFocusVisible ? `2px solid ${p.theme.colors.focus}` : 'none'};
  outline-offset: 1px;

  ${p => p.theme.typography[buttonSizeToTextVariant[p.$size]]}
  ${p => p.$customStyles}
  font-weight: ${props => props.theme.typography.semibold.fontWeight};
`;

ButtonContent.displayName = 'ButtonContent';

export default ButtonContent;
