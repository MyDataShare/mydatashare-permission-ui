import type { HTMLAttributes } from 'react';
import styled, { CSSProperties } from 'styled-components/macro';

import type { Color, Typography } from 'theme';

type Tags = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'label';

export type TextProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: Typography;
  color?: Color;
  align?: CSSProperties['textAlign'];
  lineHeight?: CSSProperties['lineHeight'];
  as?: Tags;
};

type TransientProps = {
  $variant: Typography;
  $color?: TextProps['color'];
  $align?: TextProps['align'];
  $lineHeight?: TextProps['lineHeight'];
};

const Text = ({
  color,
  variant = 'body',
  align,
  lineHeight,
  as: asTag,
  children,
  ...rest
}: TextProps) => {
  const tag = asTag || variantToTag[variant];

  return (
    <TextBase
      {...rest}
      as={tag}
      $variant={variant}
      $color={color}
      $align={align}
      $lineHeight={lineHeight}
    >
      {children}
    </TextBase>
  );
};

const variantToTag: { [key in Typography]: Partial<Tags> } = {
  title1: 'h1',
  title2: 'h2',
  title3: 'h3',
  title4: 'h4',
  body: 'p',
  bodyLarge: 'p',
  bodySmall: 'p',
  light: 'p',
  semibold: 'p',
  bold: 'p',
};

const TextBase = styled.span<TransientProps>`
  ${p => p.theme.typography[p.$variant]}
  margin: 0;
  color: ${p => p.theme.colors[p.$color || 'text']};
  text-align: ${p => p.$align || 'left'};
  line-height: ${p => p.$lineHeight && p.$lineHeight};
`;

export default Text;
