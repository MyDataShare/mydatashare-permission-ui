import React, { ReactNode } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

interface Props {
  children: ReactNode;
  labelFor: string;
  isRequired?: boolean;
}

const Label = ({ labelFor, isRequired = false, children }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledLabel $t={t} htmlFor={labelFor} $isRequired={isRequired}>
      {children}
    </StyledLabel>
  );
};

export default Label;

/* Styled Components */

type StyledLabelProps = {
  $isRequired: boolean;
  $t: TFunction;
};

const StyledLabel = styled.label<StyledLabelProps>`
  font-weight: ${props => props.theme.typography.semibold.fontWeight};
  color: ${props => props.theme.colors.inputLabelColor};
  display: block;
  margin: 0 0 0.25em 0;
  ::after {
    content: ${props =>
      props.$isRequired ? '"\\00a0 *"' : `" (${props.$t('labelOptional')})"`};
    color: ${props =>
      props.$isRequired
        ? props.theme.colors.inputRequiredAsteriskColor
        : props.theme.colors.textSupplementary};
    font-weight: ${props =>
      props.$isRequired ? 'inherit' : props.theme.typography.light};
  }
`;
