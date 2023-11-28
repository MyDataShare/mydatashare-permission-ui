import { combinePaginatedResponses } from 'mydatashare-core';
import { useTranslation } from 'react-i18next';
import type { InfiniteData } from 'react-query';
import styled from 'styled-components/macro';

import { Text } from 'components/common';
import { ConsentListItem } from 'components/consent';
import { useAuth } from 'services/auth';
import { getRecordDataFromResponse } from 'utils/client';
import { flexColumn } from 'utils/styled';
import { ProcessingRecordsResponse, RecordStatus } from 'utils/types';

interface Props {
  processingRecordsQuery?: InfiniteData<ProcessingRecordsResponse>;
}

const ConsentList = ({ processingRecordsQuery }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const combinedPages = combinePaginatedResponses(
    processingRecordsQuery?.pages
  );
  const recordDatas = getRecordDataFromResponse(combinedPages, user);
  const sortingOrder = [
    RecordStatus.PENDING,
    RecordStatus.ACTIVE,
    RecordStatus.DECLINED,
    RecordStatus.EXPIRED,
    RecordStatus.SUSPENDED,
    RecordStatus.WITHDRAWN,
  ];
  const sortedRecordDatas =
    recordDatas &&
    [...recordDatas].sort((a, b) => {
      if (a.isPendingUserActivation) return -1;
      return (
        sortingOrder.indexOf(a.record.status) -
        sortingOrder.indexOf(b.record.status)
      );
    });

  return (
    <StyledWrapper>
      <StyledGroup>
        {user?.username && (
          <StyledText variant="bodyLarge">{user.username}</StyledText>
        )}
        <Text variant="title1">{t('Consents')}</Text>
      </StyledGroup>

      <StyledSection>
        {sortedRecordDatas && sortedRecordDatas.length > 0 ? (
          <StyledList>
            {sortedRecordDatas.map(item => (
              <ConsentListItem key={item.record.uuid} item={item} />
            ))}
          </StyledList>
        ) : (
          <StyledParagraphWrapper>
            <Text>{t('paragraphNoRecords1')}</Text>
            <Text>{t('paragraphNoRecords2')}</Text>
            <Text>{t('paragraphNoRecords3')}</Text>
          </StyledParagraphWrapper>
        )}
      </StyledSection>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.large)};
`;

const StyledGroup = styled.div`
  position: relative;
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
`;

const StyledText = styled(Text)`
  text-transform: uppercase;
`;

const StyledSection = styled.div`
  ${flexColumn}
`;

// TODO: Refactor styles – ideally by default, most elements should have sensible styles applied to them.
//       So that when constructing a view from headers, paragraphs, lists etc, we wouldn't always need to
//       apply custom styling to them but instead the global style would apply margins.
//       See Dashboard code for this kind of implementation.
const StyledParagraphWrapper = styled.div`
  p + p {
    margin-top: ${({ theme: { em, spacing } }) => em(spacing.medium)};
  }
`;

const StyledList = styled.ul`
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.normal)}
`;

export default ConsentList;
