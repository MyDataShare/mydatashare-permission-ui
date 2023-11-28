import React from 'react';
import { get, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

interface Props {
  fieldName: string;
}

const ErrorMessage = ({ fieldName }: Props) => {
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext();
  if (!errors || !get(errors, fieldName)) return null;
  const error = get(errors, fieldName);
  const message = error.message.length
    ? t(error.message)
    : t('errorValidationRequired');
  return <Message role="alert">{message}</Message>;
};

export default ErrorMessage;

/* Styled Components */

const Message = styled.span`
  display: block;
  margin: 0.5em 0;
  color: ${props => props.theme.colors.textNegative};
`;
