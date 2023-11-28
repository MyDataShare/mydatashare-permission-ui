import {
  faInfoCircle,
  faLock,
  faLockOpen,
} from '@fortawesome/pro-light-svg-icons';
import { combinePaginatedResponses } from 'mydatashare-core';
import { useRef } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useInfiniteQuery } from 'react-query';
import styled from 'styled-components/macro';

import ConsentProgressList from './ConsentProgressList';
import type { LogItem } from './types';
import { Text } from 'components/common';
import { fetchAccessItems } from 'utils/client';
import { getItemsSortedByDate } from 'utils/fn';
import { getRequiredTranslation as getTranslation } from 'utils/mdsApi';
import { flexColumn } from 'utils/styled';
import {
  AccessItem,
  AccessItemsResponse,
  AccessStatus,
  RecordData,
  RecordStatus,
} from 'utils/types';

interface Props {
  recordData: RecordData;
}

const ConsentAccessLog = ({ recordData }: Props) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const fetchData = ({ pageParam }: { pageParam?: Date | string }) => {
    return fetchAccessItems({
      queryKey: ['accessItems', { prUuid: recordData.record.uuid, pageParam }],
    });
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<AccessItemsResponse, any, AccessItemsResponse>(
      'accessItems',
      fetchData,
      {
        getNextPageParam: lastPage => lastPage.next_offset,
      }
    );

  const { consumerOrg, metadatas } = recordData;
  const combinedPages: AccessItemsResponse =
    data && combinePaginatedResponses(data?.pages);
  const accessItems = combinedPages ? combinedPages.access_items : {};
  const hasItems = !!(accessItems && Object.values(accessItems).length);
  const consumerOrgNameTr = getTranslation(consumerOrg, 'name', metadatas);
  const progressItems = buildLogItems(
    accessItems,
    consumerOrgNameTr ? consumerOrgNameTr.val : '',
    t
  );

  return (
    <StyledWrapper ref={scrollRef}>
      <StyledHeader variant="title2">
        {t('Access log modal heading')}
      </StyledHeader>
      {!isLoading && hasItems && (
        <ConsentProgressList
          items={progressItems}
          scrollRef={scrollRef}
          loading={isFetchingNextPage}
          loadMoreItems={hasNextPage ? fetchNextPage : undefined}
        />
      )}
    </StyledWrapper>
  );
};

/* Helpers */

const buildLogItems = (
  accessItems: Record<string, AccessItem>,
  consumerOrgName: string,
  t: TFunction<'translation', undefined>
) => {
  if (!accessItems || !Object.values(accessItems).length) return [];

  return (
    getItemsSortedByDate(accessItems) as (Omit<AccessItem, 'created'> & {
      created: Date;
    })[]
  ).reduce((acc: LogItem[], accessItem) => {
    const status = accessItem.status;
    const success = accessItem.success;
    const prStatus = accessItem.introspection_status;
    let title = '';
    let text = '';
    let icon: LogItem['icon'] = {
      color: 'logItemInfo',
      definition: faInfoCircle,
    };

    if (status === AccessStatus.INTROSPECTED) {
      if (prStatus === RecordStatus.ACTIVE) {
        title = t('Access Granted');
        text = t('Access To Data Granted', { consumerOrg: consumerOrgName });
        icon = { color: 'logItemPositive', definition: faLockOpen };
      } else {
        title = t('Access Denied');
        text = t('Access To Data Denied', { consumerOrg: consumerOrgName });
        icon = { color: 'logItemNegative', definition: faLock };
      }
    } else if (status === AccessStatus.COMPLETED) {
      if (success) {
        title = t('Access Granted');
        text = t('Access To Data Granted', { consumerOrg: consumerOrgName });
        icon = { color: 'logItemPositive', definition: faLockOpen };
      }
    } else {
      return acc;
    }

    if (title) {
      acc.push({
        key: accessItem.uuid,
        date: accessItem.created,
        icon,
        text,
        title,
      });
    }
    return acc;
  }, []);
};

/* Styled Components */

const StyledWrapper = styled.div`
  ${flexColumn}
  padding: ${({ theme }) => theme.em(theme.spacing.large)};
  height: 100%;
  overflow-y: auto;
`;

const StyledHeader = styled(Text)`
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.medium)};
`;

export default ConsentAccessLog;
