export const VALIDATE_EMAIL = {
  pattern: {
    value:
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: 'errorValidationEmail',
  },
};

export const VALIDATE_NON_WHITESPACE = {
  pattern: {
    value: /\S/,
    message: 'errorValidationOnlyWhitespace',
  },
};
