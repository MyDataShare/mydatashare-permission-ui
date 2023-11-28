import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from 'i18next';
import { LANGUAGES } from 'mydatashare-core';
import { useHover } from 'react-aria';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { Text } from 'components/common';
import {
  capitalize,
  getRecordStatusColor,
  getRecordStatusIcon,
  getRecordStatusInfoCount,
  getRecordStatusInfoKey,
} from 'utils/fn';
import { getConsumerTranslations } from 'utils/mdsApi';
import { flexColumn } from 'utils/styled';
import { ParticipantStatus, RecordData, RecordStatus } from 'utils/types';

interface Props {
  data: RecordData;
}

const ConsentListCard = ({ data }: Props) => {
  const { t } = useTranslation();
  const { isHovered, hoverProps } = useHover({});
  const { consumer, record, metadatas, userParticipant, nonUserParticipants } =
    data;

  // If participant has accepted, show the PR texts in accepted language. Otherwise, the UI language
  const consumerLang =
    userParticipant.status === 'active'
      ? userParticipant.accepted_language
      : LANGUAGES[i18n.language];

  const { nameTr, purposeTr } = getConsumerTranslations(
    consumer,
    consumerLang,
    metadatas
  );

  const count = getRecordStatusInfoCount(consumer, nonUserParticipants);
  const infoTrKey = getRecordStatusInfoKey(
    'textActivationList',
    consumer,
    record,
    userParticipant
  );
  const infoTextsExist = t(infoTrKey, { count, defaultValue: null }) !== null;

  const statusColor = getRecordStatusColor(record.status);
  let statusIcon;
  if (data.isMultiActivated && !data.isOnBehalfUser) {
    statusIcon = getRecordStatusIcon(record.status, userParticipant.status);
  } else {
    statusIcon = getRecordStatusIcon(record.status);
  }
  return (
    <StyledWrapper
      {...hoverProps}
      $borderColor={statusColor}
      $isHovered={isHovered}
      $isPendingUserActivation={data.isPendingUserActivation}
    >
      <StyledInnerWrapper>
        <StyledFlexedColumn style={{ flex: 1 }}>
          <StyledTitleWrapper>
            <StyledHeading
              lang={nameTr.lang}
              variant="title3"
              $isPendingUserActivation={data.isPendingUserActivation}
              $recordStatus={record.status}
            >
              {nameTr.val}
            </StyledHeading>
            {data.nonDataSubjectParticipants.length > 1 && (
              <StyledFlexedRow>
                <FontAwesomeIcon icon={light('users')} size="1x" />
                <div>
                  {
                    data.nonDataSubjectParticipants.filter(
                      prp => prp.status === ParticipantStatus.ACTIVE
                    ).length
                  }
                  /{data.nonDataSubjectParticipants.length}
                </div>
              </StyledFlexedRow>
            )}
          </StyledTitleWrapper>
          <Text lang={purposeTr.lang}>{purposeTr.val}</Text>
          {record.reference && (
            <StyledFlexedRow>
              <Text>{t('labelReference')}: </Text>
              <StyledDiscriminantText>
                {record.reference}
              </StyledDiscriminantText>
            </StyledFlexedRow>
          )}
          {/* We can be sure that data subject has an identifier display name, since on behalf
          PRs can only be created with API >v3.1, and it requires display name. */}
          {data.isMultiActivated && !data.isOnBehalfUser && (
            <StyledFlexedRow>
              {t('textOnBehalfOf', {
                name: data.dataSubjectParticipant.identifier_display_name,
              })}
            </StyledFlexedRow>
          )}
          <StyledFlexedRow>
            <FontAwesomeIcon icon={statusIcon} size="2x" />
            <StyledStatusText
              $recordStatus={record.status}
              $isPendingUserActivation={data.isPendingUserActivation}
            >
              {infoTextsExist &&
              !data.isPendingUserActivation &&
              data.isMultiActivated &&
              ![RecordStatus.EXPIRED, RecordStatus.WITHDRAWN].includes(
                record.status
              ) &&
              (data.nonDataSubjectParticipants.length > 1 ||
                data.isOnBehalfUser)
                ? t(infoTrKey, { count })
                : t(capitalize(record.status))}
            </StyledStatusText>
          </StyledFlexedRow>
        </StyledFlexedColumn>
        <StyledFlexedColumn>
          <FontAwesomeIcon icon={light('chevron-right')} size="2x" />
        </StyledFlexedColumn>
      </StyledInnerWrapper>
    </StyledWrapper>
  );
};

/* Styled Components */

type StyledWrapperProps = {
  $borderColor: string;
  $isHovered: boolean;
  $isPendingUserActivation: boolean;
};

type StyledTextProps = {
  $isPendingUserActivation: boolean;
  $recordStatus: RecordStatus;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: ${p =>
    p.$isPendingUserActivation && `1px solid ${p.theme.colors.borderDark}`};
  border-left: ${p => (p.$isPendingUserActivation ? 12 : 6)}px solid
    ${p => p.$borderColor};
  box-shadow: ${p =>
    `0px ${p.$isPendingUserActivation ? 5 : 0}px 10px rgba(0, 0, 0, ${
      p.$isHovered ? '0.4' : '0.1'
    })`};
  transition: box-shadow 0.3s ease-in-out;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  gap: ${p => p.theme.em(p.theme.spacing.small)};
  padding: ${({ theme }) => theme.em(theme.spacing.medium)};
  padding-left: ${({ theme }) => theme.em(theme.spacing.large)};
`;

const StyledFlexedColumn = styled.div`
  ${flexColumn}
  justify-content: center;
  gap: ${({ theme }) => theme.em(theme.spacing.small)};
`;

const StyledFlexedRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.em(theme.spacing.normal)};
  margin-top: ${({ theme }) => theme.em(theme.spacing.small)};
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  ${StyledFlexedRow} {
    margin: 0 -2em 0 0;
  }
`;

const StyledHeading = styled(Text)<StyledTextProps>`
  font-weight: ${p => !p.$isPendingUserActivation && '400'};
  color: ${p =>
    ![
      RecordStatus.PENDING,
      RecordStatus.ACTIVE,
      RecordStatus.DECLINED,
    ].includes(p.$recordStatus) && p.theme.colors.supplementary};
`;

const StyledStatusText = styled(Text)<StyledTextProps>`
  font-weight: ${p => p.$isPendingUserActivation && '700'};
  text-transform: ${p => p.$isPendingUserActivation && 'uppercase'};
`;

const StyledDiscriminantText = styled(Text)`
  font-weight: 700;
`;

export default ConsentListCard;
