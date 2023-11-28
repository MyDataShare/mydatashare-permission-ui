import { CSSObject } from 'styled-components/macro';

import data from './theme.general.json';

// TODO: Update theme.json

const rem = (px: number) => `${px / 16}rem`;
const em = (px: number) => `${px / 16}em`;

export const theme = {
  em,
  rem,
  colors: data.colors,
  config: data.config,
  typography: {
    title1: {
      fontSize: `clamp(${em(32)}, calc(1.8em + 0.6vw), ${em(36)})`,
      fontWeight: 700,
    } as CSSObject,
    title2: {
      fontSize: em(32),
      fontWeight: 700,
    } as CSSObject,
    title3: {
      fontSize: em(24),
      fontWeight: 700,
    } as CSSObject,
    title4: {
      fontSize: em(20),
      fontWeight: 700,
    } as CSSObject,
    body: {
      fontSize: em(16),
      fontWeight: 400,
    } as CSSObject,
    bodyLarge: {
      fontSize: em(18),
      fontWeight: 400,
    } as CSSObject,
    bodySmall: {
      fontSize: em(12),
      fontWeight: 400,
    } as CSSObject,
    light: {
      fontSize: em(16),
      fontWeight: 300,
    } as CSSObject,
    bold: {
      fontSize: em(16),
      fontWeight: 700,
    } as CSSObject,
    semibold: {
      fontSize: em(16),
      fontWeight: 500,
    } as CSSObject,
  },
  spacing: {
    xxsmall: 4,
    xsmall: 8,
    small: 12,
    normal: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
    xxlarge: 56,
    xxxlarge: 72,
  },
  sizing: {
    icon: {
      small: 14,
      normal: 24,
      large: 32,
    },
    button: {
      small: 32,
      normal: 52,
      large: 60,
    },
  },
  radii: {
    small: 4,
    normal: 8,
    medium: 16,
  },
};

export type Theme = typeof theme;
export type Color = keyof Theme['colors'];
export type Typography = keyof Theme['typography'];
export type Radius = keyof Theme['radii'];
export type Spacing = keyof Theme['spacing'];
export type Size = keyof Theme['sizing'];
