import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { Menu, MenuButton, MenuItem } from '../common/Menu';
import Text from '../common/Text';
import { useAuth } from 'services/auth';

const UserMenu = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = () => {
    setIsLoading(true);
    logout();
  };

  return (
    <Menu
      transition
      offsetY={9}
      menuButton={({ open }) => (
        <MenuButton isOpen={open}>
          <FontAwesomeIcon icon={light('user')} size="2x" />
          {user?.username && <StyledText>{user.username}</StyledText>}
          <FontAwesomeIcon
            icon={light('angle-down')}
            size="lg"
            transform={{ rotate: open ? 180 : 0 }}
          />
        </MenuButton>
      )}
    >
      <MenuItem onClick={onLogout} disabled={isLoading}>
        {t('Log out')}
      </MenuItem>
    </Menu>
  );
};

const StyledText = styled(Text)`
  line-height: normal;

  @media only screen and (max-width: 780px) {
    display: none;
  }
`;

export default UserMenu;
