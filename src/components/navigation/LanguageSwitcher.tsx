import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuRadioGroup, RadioChangeEvent } from '@szhsin/react-menu';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { LocaleAlpha2 } from '../../locales';
import { Menu, MenuButton, MenuItem } from '../common/Menu';
import Text from '../common/Text';

type Language = {
  name: string;
  label: string;
};

const LANGUAGES: Record<LocaleAlpha2, Language> = {
  fi: {
    name: 'suomi',
    label: 'Suomeksi',
  },
  en: {
    name: 'English',
    label: 'In English',
  },
  sv: {
    name: 'svenska',
    label: 'På svenska',
  },
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguageCode = useMemo(
    () => i18n.resolvedLanguage as LocaleAlpha2,
    [i18n.resolvedLanguage]
  );

  const onChangeLanguage = (e: RadioChangeEvent) => {
    i18n.changeLanguage(e.value);
  };

  return (
    <Menu
      transition
      offsetY={9}
      menuButton={({ open }) => (
        <MenuButton isOpen={open}>
          <FontAwesomeIcon icon={light('language')} size="2x" />
          <StyledText>{LANGUAGES[currentLanguageCode].label}</StyledText>
          <FontAwesomeIcon
            icon={light('angle-down')}
            size="lg"
            transform={{ rotate: open ? 180 : 0 }}
          />
        </MenuButton>
      )}
    >
      <MenuRadioGroup
        value={currentLanguageCode}
        onRadioChange={onChangeLanguage}
      >
        {Object.entries(LANGUAGES).map(
          ([key, lang]) =>
            key !== currentLanguageCode && (
              <StyledMenuItem key={key} type="radio" value={key}>
                {lang.name}
              </StyledMenuItem>
            )
        )}
      </MenuRadioGroup>
    </Menu>
  );
};

const StyledText = styled(Text)`
  line-height: normal;

  @media only screen and (max-width: 780px) {
    display: none;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &::before {
    display: none;
  }
`;

export default LanguageSwitcher;
