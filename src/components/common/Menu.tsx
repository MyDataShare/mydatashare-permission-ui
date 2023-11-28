import {
  Menu as MenuInner,
  MenuButton as MenuButtonInner,
  MenuDivider as MenuDividerInner,
  MenuItem as MenuItemInner,
  MenuButtonProps as _MenuButtonProps,
  MenuProps,
} from '@szhsin/react-menu';
import { CSSProperties, forwardRef } from 'react';
import { useFocusRing } from 'react-aria';
import styled from 'styled-components/macro';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { flexSpaceBetween } from 'utils/styled';

export const Menu = ({
  align = 'end',
  children,
  menuStyle,
  position = 'anchor',
  viewScroll = 'initial',
  ...rest
}: MenuProps) => {
  return (
    <StyledWrapper>
      <StyledMenu
        {...rest}
        align={align}
        position={position}
        viewScroll={viewScroll}
        menuStyle={{ ...menuStyles, ...menuStyle }}
      >
        {children}
      </StyledMenu>
    </StyledWrapper>
  );
};

const menuStyles: CSSProperties = {
  width: '100%',
  padding: 0,
  borderRadius: 0,
};

type MenuButtonProps = _MenuButtonProps & {
  isOpen: boolean;
};

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  // eslint-disable-next-line
  ({ children, ...rest }, ref) => {
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <MenuButtonWrapper
        {...rest}
        {...focusProps}
        ref={ref}
        $isFocusVisible={isFocusVisible}
      >
        {children}
      </MenuButtonWrapper>
    );
  }
);

MenuButton.displayName = 'MenuButton';

type MenuButtonWrapperProps = {
  $isFocusVisible: boolean;
};

const MenuButtonWrapper = styled(MenuButtonInner)<MenuButtonWrapperProps>`
  font-family: ${p => p.theme.config.fontFamily}, Arial, sans-serif;
  display: flex;
  gap: 6px;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.em(theme.spacing.normal)}
    ${({ theme }) => theme.em(theme.spacing.small)};
  outline: ${p =>
    p.$isFocusVisible ? `2px solid ${p.theme.colors.focus}` : 'none'};
  outline-offset: 1px;
`;

export const MenuDivider = styled(MenuDividerInner)`
  margin: 0;
`;

export const MenuItem = styled(MenuItemInner)`
  ${flexSpaceBetween}
  position: relative;
  color: ${p => !p.disabled && p.theme.colors.primary};
  text-decoration: none;
  padding: ${({ theme }) => theme.em(theme.spacing.normal)}
    ${({ theme }) => theme.em(theme.spacing.medium)};
  cursor: ${p => p.disabled && 'not-allowed'};
`;

const StyledWrapper = styled.div`
  align-self: center;
`;

const StyledMenu = styled(MenuInner)`
  width: 100%;
`;
