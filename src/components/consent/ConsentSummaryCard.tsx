import { alpha2ToAlpha3B } from '@cospired/i18n-iso-languages';
import {
  faBan,
  faCheck,
  faFamily,
  faTurnDownRight,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { camelCase } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components/macro';

import ConsentUserProvidedInfoModal from './ConsentUserProvidedInfoModal';
import { FillButton, Markdown, Text } from 'components/common';
import InfoBox from 'components/common/InfoBox';
import ConfirmModal from 'components/common/modal/ConfirmModal';
import { showNotification } from 'components/common/Notification';
import { NotificationType } from 'components/common/types';
import ConsentParticipants from 'components/consent/ConsentParticipants';
import { Link } from 'components/navigation';
import { Theme, theme } from 'theme';
import {
  createMetadata,
  deleteMetadata,
  MetadataPayload,
  updateParticipant,
} from 'utils/client';
import { NO_BREAK_SPACE } from 'utils/constants';
import {
  capitalize,
  getMetadata,
  getRecordStatusColor,
  getRecordStatusIcon,
  getRecordStatusInfoCount,
  getRecordStatusInfoKey,
  getRecordTypeIcon,
  getUserProvidedDataTemplate,
  recordStatusToInfoBoxVariant,
  validateUserProvidedDataTemplate,
} from 'utils/fn';
import {
  getConsumerTranslations,
  getRequiredTranslation as getTranslation,
} from 'utils/mdsApi';
import { flexCenter, flexColumn } from 'utils/styled';
import {
  ParticipantStatus,
  RecordData,
  RecordStatus,
  RecordType,
} from 'utils/types';

interface Props {
  data: RecordData;
  shownLanguage: string;
}

const ConsentSummaryCard = ({ data, shownLanguage }: Props) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const userProvidedData = getMetadata(
    data.record,
    'user_provided_data',
    Object.values(data.metadatas)
  );
  const userProvidedDataTemplate = getUserProvidedDataTemplate(
    data.consumer,
    data.metadatas
  );

  const needsAdditionalInput = validateUserProvidedDataTemplate(
    userProvidedDataTemplate
  );
  const isTemplateInvalid = !!userProvidedDataTemplate && !needsAdditionalInput;

  const preCancellationTr = getTranslation(
    data.consumer,
    'pre_cancellation',
    data.metadatas
  );

  const { nameTr, descriptionTr } = getConsumerTranslations(
    data.consumer,
    shownLanguage,
    data.metadatas
  );

  const onDecline = async () => {
    const res = await updateParticipant({
      uuid: data.userParticipant.uuid,
      newStatus: ParticipantStatus.DECLINED,
    });
    if (!userProvidedData) {
      return res;
    }
    return deleteMetadata(userProvidedData.uuid);
  };

  const onAccept = async () => {
    // MOP should validate all required translation fields exist. Now we assume this is the
    // case: all DC texts are assumed to be shown in same language as DC.name.
    return updateParticipant({
      uuid: data.userParticipant.uuid,
      language: alpha2ToAlpha3B(nameTr.lang),
      newStatus: ParticipantStatus.ACTIVE,
    });
  };

  const onAcceptWithMetadataCreate = async (payload: MetadataPayload) => {
    if (needsAdditionalInput) {
      await createMetadata(payload);
    }
    return updateParticipant({
      uuid: data.userParticipant.uuid,
      language: alpha2ToAlpha3B(nameTr.lang),
      newStatus: ParticipantStatus.ACTIVE,
    });
  };

  const onRecordUpdateError = () => {
    showNotification(NotificationType.ERROR, t('General error message'));
  };

  const { mutate: declineMutate, isLoading: isDeclineMutateLoading } =
    useMutation(onDecline, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'processingRecord',
          { uuid: data.record.uuid },
        ]);
        showNotification(
          NotificationType.SUCCESS,
          t(`Permission request ${ParticipantStatus.DECLINED}`)
        );
      },
      onError: onRecordUpdateError,
    });

  const onAcceptSuccess = () => {
    setShowAcceptModal(false);
    queryClient.invalidateQueries([
      'processingRecord',
      { uuid: data.record.uuid },
    ]);
    queryClient.invalidateQueries('processingRecords');
    showNotification(
      NotificationType.SUCCESS,
      t(`Permission request ${ParticipantStatus.ACTIVE}`)
    );
  };

  const { mutate: acceptMutate, isLoading: isAcceptMutateLoading } =
    useMutation(onAccept, {
      onSuccess: onAcceptSuccess,
      onError: onRecordUpdateError,
    });

  const onClickAccept = () => {
    if (needsAdditionalInput) {
      setShowAcceptModal(true);
    } else {
      acceptMutate();
    }
  };

  const isConsent = data.record.record_type === RecordType.CONSENT;
  const typeIcon = getRecordTypeIcon(data.record.record_type);
  const expiresDate = data.record.expires && new Date(data.record.expires);

  const showLegalInfo = [
    RecordType.LEGAL_OBLIGATION,
    RecordType.LEGITIMATE_INTEREST,
  ].includes(data.record.record_type);

  const showNotValidInfo =
    isConsent &&
    ![
      RecordStatus.PENDING,
      RecordStatus.ACTIVE,
      RecordStatus.DECLINED,
    ].includes(data.record.status);

  const count = getRecordStatusInfoCount(
    data.consumer,
    data.nonUserParticipants
  );
  const infoTrKey = getRecordStatusInfoKey(
    'textActivationDetails',
    data.consumer,
    data.record,
    data.userParticipant
  );
  const infoTextsExist = t(infoTrKey, { count, defaultValue: null }) !== null;
  return (
    <StyledWrapper $borderColor={getRecordStatusColor(data.record.status)}>
      <StyledGroup>
        <StyledSubHeading variant="bodyLarge">
          {isConsent ? t('Permission request') : t('Permit')}
        </StyledSubHeading>
        <Text lang={nameTr.lang} variant="title1">
          {nameTr.val}
        </Text>
      </StyledGroup>

      <StyledMarkdown lang={descriptionTr.lang}>
        {descriptionTr.val}
      </StyledMarkdown>

      {data.record.reference && (
        <StyledFlexedRow>
          <Text>{t('labelReference')}: </Text>
          <Text>{data.record.reference}</Text>
        </StyledFlexedRow>
      )}

      {needsAdditionalInput &&
        data.userParticipant.status !== ParticipantStatus.ACTIVE && (
          <Text>{t('textInputNeededBeforeAccept')}</Text>
        )}

      {isConsent &&
        (!expiresDate || expiresDate > new Date()) &&
        [
          ParticipantStatus.ACTIVE,
          ParticipantStatus.DECLINED,
          ParticipantStatus.PENDING,
        ].includes(data.userParticipant.status) &&
        !(
          [RecordStatus.WITHDRAWN, RecordStatus.EXPIRED].includes(
            data.record.status
          ) ||
          data.consumer.suspended ||
          data.provider?.suspended
        ) && (
          <>
            {showAcceptModal && userProvidedDataTemplate && (
              <ConsentUserProvidedInfoModal
                mutationFn={onAcceptWithMetadataCreate}
                onSuccess={onAcceptSuccess}
                onError={onRecordUpdateError}
                submitText={t('Accept')}
                title={t('headingAddUserProvidedData')}
                prUuid={data.record.uuid}
                closeModal={() => setShowAcceptModal(false)}
                startHelpText={t('textInputNeededToAccept')}
                endHelpText={t('textInputNeededToAccept2')}
                userProvidedDataTemplate={userProvidedDataTemplate}
              />
            )}
            {showDeclineModal && (
              <ConfirmModal
                confirmButtonType="fillButton"
                confirmButtonVariant="decline"
                confirmIcon={faBan}
                confirmLabel={t('Decline')}
                onClose={() => setShowDeclineModal(false)}
                onConfirm={() => {
                  setShowDeclineModal(false);
                  declineMutate();
                }}
                title={t('headingConfirmDecline')}
              >
                {preCancellationTr?.val ? (
                  <Text lang={preCancellationTr.lang}>
                    {preCancellationTr.val}
                  </Text>
                ) : (
                  <Text>{t('textConfirmDeclineUserDataDeletion')}</Text>
                )}
              </ConfirmModal>
            )}
            {isTemplateInvalid && (
              <InfoBox variant="error">
                <Text>{t('textWarningTemplateInvalid')}</Text>
              </InfoBox>
            )}
            {!data.isOnBehalfUser && (
              <StyledButtonsRow>
                <FillButton
                  variant="accept"
                  icon={needsAdditionalInput ? undefined : faCheck}
                  loading={isAcceptMutateLoading}
                  disabled={
                    data.userParticipant.status === ParticipantStatus.ACTIVE ||
                    isTemplateInvalid
                  }
                  onClick={onClickAccept}
                >
                  {needsAdditionalInput
                    ? `${t('Accept')}${NO_BREAK_SPACE}...`
                    : t('Accept')}
                </FillButton>
                <FillButton
                  variant="decline"
                  icon={faBan}
                  loading={isDeclineMutateLoading}
                  disabled={
                    data.userParticipant.status ===
                      ParticipantStatus.DECLINED || isTemplateInvalid
                  }
                  onClick={() => {
                    if (
                      data.userParticipant.status ===
                        ParticipantStatus.ACTIVE &&
                      (preCancellationTr?.val || userProvidedData)
                    ) {
                      setShowDeclineModal(true);
                    } else {
                      declineMutate();
                    }
                  }}
                >
                  {t('Decline')}
                </FillButton>
              </StyledButtonsRow>
            )}
          </>
        )}

      <StyledFlexedColumn $gap="large">
        <StyledFlexedColumn>
          <StyledFlexedRow>
            <StyledIconWrapper>
              <FontAwesomeIcon
                icon={getRecordStatusIcon(data.record.status)}
                size="2x"
              />
            </StyledIconWrapper>
            <StyledFlexedColumn>
              <Text variant="bold">{capitalize(t(data.record.status))}</Text>
              <StyledWrappedRow>
                {expiresDate && (
                  <Text>{`${
                    expiresDate < new Date()
                      ? t(
                          isConsent
                            ? 'Permission request expired'
                            : 'Permission expired'
                        )
                      : t(
                          isConsent
                            ? 'Permission request expires'
                            : 'Permission expires'
                        )
                  } ${format(expiresDate, 'd.M.yyyy')}.`}</Text>
                )}
                <StyledLink to={{ ...window.location, hash: 'events' }}>
                  {t('Event log link label')}
                </StyledLink>
              </StyledWrappedRow>
            </StyledFlexedColumn>
          </StyledFlexedRow>

          {(data.nonDataSubjectParticipants.length > 1 ||
            data.isOnBehalfUser) && (
            <StyledOuterParticipantsWrapper $enabled={!showNotValidInfo}>
              <StyledParticipantsIndicatorWrapper>
                <FontAwesomeIcon icon={faTurnDownRight} size="2x" />
                <div>
                  {t(
                    `textConsentNeeded${capitalize(
                      camelCase(data.consumer.activation_mode)
                    )}`,
                    { count: data.nonDataSubjectParticipants.length }
                  )}
                </div>
              </StyledParticipantsIndicatorWrapper>
              <StyledParticipantsListingWrapper>
                <ConsentParticipants
                  nonDataSubjectParticipants={data.nonDataSubjectParticipants}
                  userParticipant={data.userParticipant}
                />
              </StyledParticipantsListingWrapper>
            </StyledOuterParticipantsWrapper>
          )}
        </StyledFlexedColumn>

        {showNotValidInfo && (
          <InfoBox variant="secondary">
            <Text>{t('Consent not valid info')}</Text>
          </InfoBox>
        )}

        {data.isMultiActivated && (
          <>
            {(data.nonDataSubjectParticipants.length > 1 ||
              data.isOnBehalfUser) &&
              infoTextsExist &&
              !showNotValidInfo && (
                <InfoBox
                  variant={recordStatusToInfoBoxVariant(data.record.status)}
                >
                  {t(infoTrKey, { count })}
                </InfoBox>
              )}
            <StyledFlexedRow>
              <StyledIconWrapper>
                <FontAwesomeIcon icon={faFamily} size="2x" />
              </StyledIconWrapper>
              <StyledFlexedColumn>
                <Text variant="bold">{t('labelOnBehalfOf')}</Text>
                <Text>
                  {data.dataSubjectParticipant.identifier_display_name}
                </Text>
              </StyledFlexedColumn>
            </StyledFlexedRow>
          </>
        )}

        <StyledFlexedRow>
          <StyledIconWrapper>
            <FontAwesomeIcon icon={typeIcon} size="2x" />
          </StyledIconWrapper>
          <StyledFlexedColumn>
            <Text variant="bold">{t('Processing basis')}</Text>
            <Text>{t(data.record.record_type)}</Text>
          </StyledFlexedColumn>
        </StyledFlexedRow>

        {showLegalInfo && (
          <InfoBox>
            <Text>{t('Legal obligation info')}</Text>
          </InfoBox>
        )}
      </StyledFlexedColumn>
    </StyledWrapper>
  );
};

/* Styled Components */

type StyledWrapperProps = {
  $borderColor: string;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  position: relative;
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.medium)};
  padding: ${({ theme }) => theme.em(theme.spacing.xlarge)};
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.2);
  border-left: 10px solid ${p => p.$borderColor};

  @media only screen and (max-width: 780px) {
    padding: ${({ theme }) => theme.em(theme.spacing.large)};
  }
`;

const StyledGroup = styled.div`
  position: relative;
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
`;

const StyledSubHeading = styled(Text)`
  text-transform: uppercase;
`;

const StyledFlexedRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.em(theme.spacing.small)};
`;

type StyledFlexedColumnProps = {
  $gap?: keyof Theme['spacing'];
};

const StyledFlexedColumn = styled.div<StyledFlexedColumnProps>`
  ${flexColumn}
  gap: ${p => theme.em(theme.spacing[p.$gap ? p.$gap : 'xxsmall'])};
`;

const StyledMarkdown = styled(Markdown)`
  &:not(:last-child) {
    margin-bottom: 0;
  }
`;

const StyledButtonsRow = styled(StyledFlexedRow)`
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.small)};
`;

const StyledIconWrapper = styled.div`
  ${flexCenter}
  min-width: ${({ theme }) => theme.em(2 * theme.spacing.medium)};
`;

const StyledWrappedRow = styled(StyledFlexedRow)`
  flex-wrap: wrap;
  gap: 0 ${({ theme }) => theme.em(theme.spacing.xsmall)};
`;

const StyledLink = styled(Link)`
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.linkMuted};
  }
`;

type StyledOuterParticipantsWrapperProps = {
  $enabled: boolean;
};

const StyledOuterParticipantsWrapper = styled(
  StyledFlexedColumn
)<StyledOuterParticipantsWrapperProps>`
  color: ${p => (p.$enabled ? 'inherit' : p.theme.colors.linkMuted)};
`;

const StyledParticipantsIndicatorWrapper = styled(StyledFlexedRow)`
  margin: 0.5em 0 0 1.45em;
  p {
    font-size: 0.875em;
    font-weight: ${p => p.theme.typography.semibold.fontWeight};
  }
`;

const StyledParticipantsListingWrapper = styled.div`
  margin: 0 0 0 4.25em;
`;

export default ConsentSummaryCard;
