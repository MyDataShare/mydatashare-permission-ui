import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components/macro';

import type { LogItem } from './types';
import { Text } from 'components/common';
import { getLocaleString } from 'utils/fn';
import { flexColumn, flexStart } from 'utils/styled';

interface Props {
  index: number;
  item: LogItem;
}

const ConsentProgressItem = ({ item }: Props) => {
  const theme = useTheme();
  const { date, icon, text, title } = item;
  const dateStr = date ? getLocaleString(date) : null;

  return (
    <StyledWrapper role="row" key={`progressItem-${item.key}`}>
      <StyledFontAwesomeIcon
        icon={icon.definition}
        color={theme.colors[icon.color]}
        size="2x"
        role="presentation"
      />
      <StyledFlexedColumn>
        {dateStr && <Text color="supplementary">{dateStr}</Text>}
        <Text variant="bold">{title}</Text>
        {text && <Text>{text}</Text>}
      </StyledFlexedColumn>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ${flexStart}
  position: relative;
  margin-left: ${({ theme }) => theme.em(theme.spacing.medium)};
  padding-left: ${({ theme }) => theme.em(theme.spacing.large)};
  padding-bottom: ${({ theme }) => theme.em(theme.spacing.xlarge)};
  border-left: 4px dotted ${p => p.theme.colors.border};
`;

const StyledFlexedColumn = styled.div`
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.xxsmall / 2)} 0;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: -${({ theme }) => theme.em(theme.spacing.xsmall)};
  transform: translateX(-2px);
  background: ${p => p.theme.colors.surface};
  padding: ${({ theme }) => theme.em(theme.spacing.xxsmall)} 0;
`;

export default ConsentProgressItem;
