import {
  faBan,
  faCircleCheck,
  faCircleXmark,
  faInfoCircle,
} from '@fortawesome/pro-light-svg-icons';
import { TFunctionResult } from 'i18next';
import { capitalize } from 'lodash';
import { combinePaginatedResponses } from 'mydatashare-core';
import { useRef } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useInfiniteQuery } from 'react-query';
import styled from 'styled-components/macro';

import ConsentProgressList from './ConsentProgressList';
import type { LogItem } from './types';
import { Text } from 'components/common';
import InfoBox from 'components/common/InfoBox';
import { Color } from 'theme';
import { fetchRecordHistoryItems } from 'utils/client';
import { V3_1_PROD_DEPLOY_DATE } from 'utils/constants';
import { getItemsSortedByDate, getRecordStatusIcon } from 'utils/fn';
import { getRequiredTranslation as getTranslation } from 'utils/mdsApi';
import { flexColumn } from 'utils/styled';
import {
  ProcessingRecordHistoryItem,
  ProcessingRecordHistoryItemsResponse,
  RecordData,
  RecordStatus,
  RecordType,
  TerminalStatus,
} from 'utils/types';

interface Props {
  recordData: RecordData;
}

const ConsentEventLog = ({ recordData }: Props) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const fetchData = ({ pageParam }: { pageParam?: Date | string }) => {
    return fetchRecordHistoryItems({
      queryKey: ['historyItems', { prUuid: recordData.record.uuid, pageParam }],
    });
  };

  const { record: pr, consumerOrg, providerOrg, metadatas } = recordData;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      ProcessingRecordHistoryItemsResponse,
      any,
      ProcessingRecordHistoryItemsResponse
    >(['changeItems', pr.uuid], fetchData, {
      getNextPageParam: lastPage => lastPage.next_offset,
    });

  const combinedPages: ProcessingRecordHistoryItemsResponse =
    data && combinePaginatedResponses(data?.pages);
  const historyItems = combinedPages
    ? combinedPages.processing_record_history_items
    : {};
  const consumerOrgUuid = consumerOrg ? consumerOrg.uuid : '';
  const consumerOrgNameTr = consumerOrg
    ? getTranslation(consumerOrg, 'name', metadatas).val
    : '';
  const providerOrgUuid = providerOrg ? providerOrg.uuid : '';
  const providerOrgName = providerOrg
    ? getTranslation(providerOrg, 'name', metadatas).val
    : '';

  const progressItems = pr
    ? buildLogItems(
        recordData,
        historyItems,
        consumerOrgUuid,
        consumerOrgNameTr,
        providerOrgUuid,
        providerOrgName,
        t
      )
    : [];

  const prCreated = new Date(recordData.record.created);
  const mightHaveLegacyChangeItems = prCreated <= V3_1_PROD_DEPLOY_DATE;
  return (
    <StyledWrapper ref={scrollRef}>
      <StyledHeader variant="title2">
        {t('Event log modal heading')}
      </StyledHeader>
      {!isLoading && progressItems.length > 0 && (
        <ConsentProgressList
          items={progressItems}
          scrollRef={scrollRef}
          loading={isFetchingNextPage}
          loadMoreItems={hasNextPage ? fetchNextPage : undefined}
        />
      )}
      {mightHaveLegacyChangeItems && (
        <InfoBox>
          <Text>{t('textInfoLegacyChangeItems')}</Text>
        </InfoBox>
      )}
    </StyledWrapper>
  );
};

/* Helpers */

const buildLogItems = (
  data: RecordData,
  historyItems: Record<string, ProcessingRecordHistoryItem>,
  consumerOrgUuid: string,
  consumerOrgName: string,
  providerOrgUuid: string,
  providerOrgName: string,
  t: TFunction<'translation', undefined>
): LogItem[] => {
  const buildCreteEvent = () => {
    // Create LogItem for the "create" event. It is not found in the history items, but instead
    // we use the 'created' timestamp in the ProcessingRecord. We also don't know if the record
    // was created by an admin or the organization since we don't have info about the used domain,
    // so we just show that the consumer organization created it.
    const actor = consumerOrgName;
    let title, text;
    if (
      [RecordType.LEGAL_OBLIGATION, RecordType.LEGITIMATE_INTEREST].includes(
        data.record.record_type
      )
    ) {
      title = t('record created');
      text = t('created the permission record', { actor });
    } else {
      title = t('request created');
      text = t('created the permission request', { actor });
    }
    return {
      key: 'created',
      date: new Date(data.record.created),
      icon: { color: 'logItemInfo' as Color, definition: faInfoCircle },
      title,
      text,
    };
  };

  const isWithdrawn = data.record.terminal_status === TerminalStatus.WITHDRAWN;
  const isExpired = data.record.status === RecordStatus.EXPIRED;
  const isInTerminalState = isWithdrawn || isExpired;

  const sortedLogItems = (
    getItemsSortedByDate(historyItems) as (Omit<
      ProcessingRecordHistoryItem,
      'created'
    > & {
      created: Date;
    })[]
  ).reduce((acc: LogItem[], item) => {
    let text = '';
    let title = '';
    const addSubText = !isInTerminalState && acc.length === 0;
    const isAdmin = item.domain === 'admin';
    const isUser =
      item.processing_record_participant_uuid === data.userParticipant.uuid;
    const isOtherParticipant = Object.keys(data.participants).includes(
      item.processing_record_participant_uuid
    );
    let participantName = '';
    if (isOtherParticipant) {
      participantName =
        data.participants[item.processing_record_participant_uuid]
          .identifier_display_name || '';
      if (participantName.length === 0) {
        participantName = t('labelOtherParticipant');
      }
    }

    const tt = (
      s: string,
      params?: Record<string, string | number | TFunctionResult>
    ) => t(`${isUser ? 'user' : 'participant'} ${s}`, params);

    let actor;
    if (item.domain === 'admin') {
      actor = t('Admin');
    } else if (item.domain === 'organization') {
      actor = consumerOrgName;
    }

    const infoIconDef: LogItem['icon'] = {
      color: 'logItemInfo' as Color,
      definition: faInfoCircle,
    };
    const isAnyWallet = ['wallet', 'embedded_wallet'].includes(item.domain);
    const isExtWallet = item.domain === 'embedded_wallet';
    let orgActor = '';
    let icon = infoIconDef;

    if (item.organization_uuid) {
      if (item.organization_uuid === consumerOrgUuid)
        orgActor = consumerOrgName;
      else if (item.organization_uuid === providerOrgUuid)
        orgActor = providerOrgName;
    }
    if (isAdmin || (item.organization_uuid && !isExtWallet)) {
      title = t('changed permission status', {
        actor,
        oldStatus: t(item.old_prp_status),
        newStatus: t(item.new_prp_status),
      });
    } else if (isAnyWallet) {
      if (isExtWallet) {
        title = tt('changed permission status in service', {
          name: participantName,
          oldStatus: t(item.old_prp_status),
          newStatus: t(item.new_prp_status),
          consumerOrg: orgActor,
        });
      } else {
        title = tt('changed permission status', {
          name: participantName,
          oldStatus: t(item.old_prp_status),
          newStatus: t(item.new_prp_status),
        });
      }
      if (
        item.old_prp_status === RecordStatus.PENDING ||
        item.old_prp_status === RecordStatus.DECLINED
      ) {
        if (item.new_prp_status === RecordStatus.ACTIVE) {
          title = isExtWallet
            ? tt('granted consent in service', {
                name: participantName,
                consumerOrg: orgActor,
              })
            : tt('granted consent', { name: participantName });
          icon = {
            color: 'logItemPositive' as Color,
            definition: faCircleCheck,
          };
          if (addSubText && item.new_pr_derived_status === RecordStatus.ACTIVE)
            text = t('data access allowed', {
              consumerOrg: consumerOrgName,
            });
        } else if (
          item.old_prp_status === RecordStatus.PENDING &&
          item.new_prp_status === RecordStatus.DECLINED
        ) {
          title = isExtWallet
            ? tt('declined consent in service', {
                name: participantName,
                consumerOrg: orgActor,
              })
            : tt('declined consent', { name: participantName });
          icon = {
            color: 'logItemNegative' as Color,
            definition: faCircleXmark,
          };
          if (
            addSubText &&
            item.new_pr_derived_status === RecordStatus.DECLINED
          )
            text = t('data access declined', {
              consumerOrg: consumerOrgName,
            });
        }
      } else if (item.old_prp_status === RecordStatus.ACTIVE) {
        if (item.new_prp_status === RecordStatus.DECLINED) {
          title = isExtWallet
            ? tt('canceled consent in service', {
                name: participantName,
                consumerOrg: orgActor,
              })
            : tt('canceled consent', { name: participantName });
          icon = { color: 'logItemNegative' as Color, definition: faBan };
          if (
            addSubText &&
            item.new_pr_derived_status === RecordStatus.DECLINED
          )
            text = t('data access canceled', {
              consumerOrg: consumerOrgName,
            });
        }
      }
    } else {
      console.warn('Unknown ChangeItem actor');
      return acc;
    }

    if (!text && !title) {
      console.warn('Could not build event text');
      return acc;
    }

    if (item.old_pr_derived_status !== item.new_pr_derived_status) {
      // Derived status changed. If we have no subtext, add generic "status changed to x"
      if (!text?.length) {
        text = t(
          `textRequestStatusChanged${capitalize(item.new_pr_derived_status)}`
        );
      }
    } else if (!text?.length) {
      // Derived status remains the same. If we have no subtext, add generic "status remains"
      // and show "info" icon.
      text = t(
        `textRequestStatusRemains${capitalize(item.new_pr_derived_status)}`
      );
      icon = infoIconDef;
    }

    // As a final fallback, if PRP status !== derived status, show "info" icon.
    // This means a participant made a change, but it did not change the PR status.
    if (item.new_pr_derived_status !== item.new_prp_status) {
      icon = infoIconDef;
    }

    acc.push({
      key: item.uuid,
      date: item.created,
      icon,
      title,
      text,
    });
    return acc;
  }, []);

  // Create events for terminal statuses. Expiration should be shown even after withdrawing.
  // If a record is expired, we can find out whether it had been withdrawn before by checking the
  // value of terminal_status.
  const terminalLogItems = [];
  if (isInTerminalState) {
    if (isWithdrawn) {
      const date = data.record.terminal_state_activated
        ? new Date(data.record.terminal_state_activated)
        : null;
      terminalLogItems.push({
        date,
        icon: {
          color: 'logItemNeutral' as Color,
          definition: getRecordStatusIcon(RecordStatus.WITHDRAWN),
        },
        key: 'withdrawn',
        text: t('data access withdrawn', { consumerOrg: consumerOrgName }),
        title: t('permission withdrawn', { actor: consumerOrgName }),
      });
    }
    if (isExpired) {
      const recordType =
        data.record.record_type === RecordType.CONSENT ? 'request' : 'record';
      const date = data.record.expires ? new Date(data.record.expires) : null;
      terminalLogItems.push({
        date,
        icon: {
          color: 'logItemNeutral' as Color,
          definition: getRecordStatusIcon(RecordStatus.EXPIRED),
        },
        key: 'expired',
        text: t(`permission ${recordType} expired`),
        title: t(`${recordType} expired`),
      });
    }
  }
  // If the LogItem has no date (= it was expired or withdrawn but for some reason no date - should not happen),
  // sort the undated ones on top. No date will be shown for them in the UI.
  return [...terminalLogItems, ...sortedLogItems, buildCreteEvent()].sort(
    (a, b) =>
      +(b.date || new Date('3000-01-01T00:00+00:00')) -
      +(a.date || new Date('3000-01-01T00:00+00:00'))
  );
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

export default ConsentEventLog;
