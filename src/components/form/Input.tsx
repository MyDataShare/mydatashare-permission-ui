import React, { InputHTMLAttributes } from 'react';
import { get, RegisterOptions, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import ErrorMessage from './ErrorMessage';
import InputHelp from './InputHelp';
import Label from './Label';
import { VALIDATE_EMAIL, VALIDATE_NON_WHITESPACE } from 'utils/validation';

export type InputTypes = 'hidden' | 'text' | 'email' | 'tel';

interface Props {
  id: string;
  name: string;
  label?: string;
  help?: string;
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  maxLength?: number;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  options?: RegisterOptions;
  type?: InputTypes;
}

const Input = ({
  id,
  name,
  label = '',
  help = '',
  required = false,
  hidden = false,
  disabled = false,
  maxLength = undefined,
  readOnly = false,
  placeholder = '',
  value = '',
  type = 'text',
  options = undefined,
}: Props) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const hasError = !!get(errors, name);
  let opt = { required, shouldUnregister: true, ...VALIDATE_NON_WHITESPACE };
  if (type in VALIDATIONS_FOR_TYPE) {
    // @ts-ignore TODO
    opt = { ...opt, ...VALIDATIONS_FOR_TYPE[type] };
  }
  if (options) {
    // @ts-ignore TODO
    opt = { ...opt, ...options };
  }
  return (
    <StyledInputContainer hidden={hidden}>
      {label && (
        <Label labelFor={id} isRequired={required}>
          {label}
        </Label>
      )}
      <StyledInput
        id={name}
        placeholder={t(placeholder)}
        defaultValue={value}
        type={type}
        $hasError={hasError}
        aria-invalid={hasError}
        disabled={disabled}
        maxLength={maxLength}
        readOnly={readOnly}
        {...register(name, opt)}
      />
      <ErrorMessage fieldName={name} />
      {help && <InputHelp>{help}</InputHelp>}
    </StyledInputContainer>
  );
};

export default Input;

/* Helpers */

const VALIDATIONS_FOR_TYPE: Partial<Record<InputTypes, RegisterOptions>> = {
  email: VALIDATE_EMAIL,
};

/* Styled Components */

const StyledInputContainer = styled.div`
  padding: 0.625em 0 1.5em 0;
`;

type StyledInputProps = InputHTMLAttributes<HTMLInputElement> & {
  $hasError: boolean;
};

const StyledInput = styled.input.attrs(props => ({
  type: props.type || 'text',
}))<StyledInputProps>`
  font-size: inherit;
  display: block;
  padding: 1em;
  border-width: ${props => props.theme.config.inputBorderWidth};
  border-style: ${props => props.theme.config.inputBorderStyle};
  border-color: ${props =>
    props.$hasError
      ? props.theme.colors.inputBorderErrorColor
      : props.theme.colors.inputBorderColor};
  width: 100%;
  outline: none;

  ::placeholder {
    color: ${props => props.theme.colors.textSupplementary};
  }
`;
