import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useMemo } from 'react';
import styled, { css, useTheme } from 'styled-components/macro';

import { Button, Text } from 'components/common';
import { ButtonProps } from 'components/common/types';
import { flexCenter } from 'utils/styled';

type Translation = {
  val: string;
  lang: string;
};

type Props = ButtonProps & {
  label: Translation;
  description?: Translation;
  icon?: string | null;
};

const LoginButton = forwardRef<HTMLButtonElement, Props>(
  // eslint-disable-next-line react/prop-types
  ({ disabled = false, icon, label, description, ...rest }, ref) => {
    const theme = useTheme();
    const customStyles = useMemo(() => styles(disabled), [disabled]);

    return (
      <Button
        {...rest}
        ref={ref}
        disabled={disabled}
        variant="supplementary"
        customStyles={customStyles}
      >
        <StyledLoginLogoWrapper>
          {icon && <StyledImage src={icon} alt="" />}
        </StyledLoginLogoWrapper>
        <StyledColCenter>
          {label.val && (
            <Text lang={label.lang} variant="bold">
              {label.val}
            </Text>
          )}
          {description && description.val && (
            <Text lang={description.lang}>{description.val}</Text>
          )}
        </StyledColCenter>
        <StyledCol>
          <FontAwesomeIcon
            icon={light('chevron-right')}
            size="2x"
            color={theme.colors.primary}
          />
        </StyledCol>
      </Button>
    );
  }
);

const styles = (disabled: boolean) => css`
  display: flex;
  gap: ${({ theme }) => theme.em(theme.spacing.small)};
  appearance: none;
  width: 100%;
  height: ${({ theme }) => theme.sizing.button.large}px;
  padding: ${({ theme }) => theme.em(theme.spacing.xsmall)}
    ${({ theme }) => theme.em(theme.spacing.xsmall)};
  opacity: ${disabled && '0.4'};
  border: 2px solid transparent;
`;

const StyledCol = styled.span`
  position: relative;
`;

const StyledColCenter = styled(StyledCol)`
  flex: 1 1 74%;

  & > :not(:last-child) {
    margin-bottom: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
  }
`;

const StyledLoginLogoWrapper = styled(StyledCol)`
  height: 100%;
  flex: 1;
  ${flexCenter}
`;

const StyledImage = styled.img`
  display: block;
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
`;

LoginButton.displayName = 'LoginButton';

export default LoginButton;
