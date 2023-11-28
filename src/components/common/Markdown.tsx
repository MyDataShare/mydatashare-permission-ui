import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components/macro';

import Text from './Text';

interface Props {
  children: string;
  className?: string;
  [x: string]: string | undefined;
}

/**
 * A list of allowed ReactMarkdown node types for Markdown components.
 *
 * See ReactMarkdown.types for a list of all supported types.
 */
const ALLOWED_MD_TYPES = [
  'em',
  'strong',
  'li',
  'ul',
  'ol',
  'p',
  'a',
  'br',
  'pre',
  'span',
];

const components: Record<string, any> = {
  p({ children }: { children: ReactNode }) {
    return <Text variant="body">{children}</Text>;
  },
};

/**
 * A pre-configured markdown component with allowed types and other settings.
 */
const Markdown = ({ children, ...props }: Props) => (
  <StyledInlineWrapper {...props}>
    <ReactMarkdown
      allowedElements={ALLOWED_MD_TYPES}
      components={components}
      linkTarget="_blank"
      remarkPlugins={[remarkGfm]}
      unwrapDisallowed
    >
      {children}
    </ReactMarkdown>
  </StyledInlineWrapper>
);

const StyledInlineWrapper = styled.div`
  display: inline-block;

  ul,
  ol {
    padding-left: ${({ theme }) => theme.em(theme.spacing.large)};
    margin: ${({ theme }) => theme.em(theme.spacing.small)} 0;
  }
  ol {
    list-style: decimal;
  }
  ul {
    list-style: disc;
  }
  li {
    line-height: 1.5;
    padding-left: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
  }
  ul ul,
  ul ol,
  ol ol,
  ol ul {
    margin: 0;
  }

  p {
    margin-bottom: ${({ theme }) => theme.em(theme.spacing.normal)};
  }

  *:last-child {
    margin-bottom: 0;
  }

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.em(theme.spacing.large)};
  }
`;

export default Markdown;
