import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import ConsentProgressItem from './ConsentProgressItem';
import type { LogItem } from './types';
import { VirtualList } from 'components/common';
import type { VirtualListContext } from 'components/common/types';
import { flexColumn, flexStart } from 'utils/styled';

interface Props {
  items: LogItem[];
  scrollRef: MutableRefObject<any>;
  loading: boolean;
  loadMoreItems?: () => Promise<any>;
}

const ConsentProgressList = ({
  items,
  loading,
  scrollRef,
  loadMoreItems,
}: Props) => {
  return (
    <StyledWrapper>
      <VirtualList
        items={items}
        scrollRef={scrollRef}
        itemContent={(index, data) => (
          <ConsentProgressItem index={index} item={data} />
        )}
        loadMoreItems={loadMoreItems}
        loading={loading}
        components={{
          Footer,
          List,
          Item: StyledItemContainer,
        }}
      />
    </StyledWrapper>
  );
};

/* Components */

const List = forwardRef<HTMLDivElement>((props, ref) => {
  return <StyledListContainer {...props} ref={ref} />;
});

List.displayName = 'List';

const Footer = ({ context }: { context?: VirtualListContext }) => {
  const { t } = useTranslation();
  return (
    <>
      {context?.loading && (
        <StyledFooterWrapper>
          <StyledSpinner icon={light('circle-notch')} /> {`${t('Loading')}...`}
        </StyledFooterWrapper>
      )}
    </>
  );
};

/* Styled Components */

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledListContainer = styled.div`
  ${flexColumn}
  position: relative;
`;

const StyledItemContainer = styled.div`
  &:last-child > div {
    border-left-color: transparent;
    padding-bottom: ${({ theme }) => theme.em(theme.spacing.large)};
  }

  &:not(:first-child) {
    opacity: 0.5;
  }
`;

const StyledFooterWrapper = styled.div`
  ${flexStart}
  justify-content: center;
  gap: 0 ${({ theme }) => theme.em(theme.spacing.xsmall)};
  color: ${p => p.theme.colors.primary};
  padding: ${({ theme }) => theme.em(theme.spacing.large)}
    ${({ theme }) => theme.em(theme.spacing.large)}
    ${({ theme }) => theme.em(theme.spacing.medium)};
`;

const StyledSpinner = styled(FontAwesomeIcon)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default ConsentProgressList;
