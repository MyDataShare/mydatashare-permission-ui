import { faBan, faCheck } from '@fortawesome/pro-light-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components/macro';

import { FillButton, Modal, Text } from 'components/common';
import LanguageSwitcher from 'components/navigation/LanguageSwitcher';
import { ExternalLink } from 'components/navigation/Link';
import { useAuth } from 'services/auth';
import {
  fetchProcessingRecords,
  getRecordDataFromResponse,
  updateParticipant,
} from 'utils/client';
import {
  getPrivacyLink,
  getReturnUrl,
  getTosLink,
  goToExternalUrl,
} from 'utils/fn';
import {
  ParticipantStatus,
  ProcessingRecordsResponse,
  RecordData,
  RecordStatus,
  RecordType,
  SearchTerms,
} from 'utils/types';

const TosModal = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const returnUrl = getReturnUrl();

  const { data, isSuccess } = useQuery<
    any,
    any,
    ProcessingRecordsResponse,
    [string, SearchTerms]
  >(
    [
      'tos',
      {
        record_type: RecordType.SERVICE_TOS,
        status: [RecordStatus.PENDING, RecordStatus.DECLINED],
      },
    ],
    fetchProcessingRecords,
    { staleTime: 1000 * 60 * 15 } // set stale after 15 minutes
  );

  const {
    mutate: updateRecordStatus,
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
  } = useMutation(acceptAll);

  if (!isSuccess || isUpdateSuccess || isUpdateError) {
    // Dismiss the ToS modal if fetching ToS PRs fails and always when user clicks "accept" regardless of the outcome
    return null;
  }

  const pendingPrRecordData = getRecordDataFromResponse(data, user);
  if (pendingPrRecordData.length === 0) return null;

  const onAcceptTos = () => {
    updateRecordStatus(pendingPrRecordData);
  };

  const onDeclineTos = () => {
    if (returnUrl) goToExternalUrl(returnUrl);
    else logout();
  };

  return (
    <Modal title="headingTosModal">
      <StyledInlineHeadingWrapper>
        <StyledHeader variant="title2">{t('headingTosModal')}</StyledHeader>
        <LanguageSwitcher />
      </StyledInlineHeadingWrapper>
      <StyledParagraph variant="body">
        <Trans
          i18nKey="paragraphTosInfo"
          components={{
            termsLink: (
              <ExternalLink
                href={getTosLink(i18n.language)}
                target="_blank"
                rel="noopener noreferrer"
                underline
                showSymbol
              />
            ),
            privacyLink: (
              <ExternalLink
                href={getPrivacyLink(i18n.language)}
                target="_blank"
                rel="noopener noreferrer"
                underline
                showSymbol
              />
            ),
          }}
        />
      </StyledParagraph>
      {returnUrl ? (
        <StyledParagraph variant="bold" color="text">
          {t('paragraphTosDeclineToExtService')}
        </StyledParagraph>
      ) : (
        <StyledParagraph variant="bold" color="text">
          {t('paragraphTosDeclineLogout')}
        </StyledParagraph>
      )}
      <StyledButtonsRow>
        <FillButton
          variant="accept"
          icon={faCheck}
          loading={isUpdateLoading}
          onClick={onAcceptTos}
        >
          {t('labelAcceptTos')}
        </FillButton>
        <FillButton variant="negative" icon={faBan} onClick={onDeclineTos}>
          {t('labelDeclineTos')}
        </FillButton>
      </StyledButtonsRow>
    </Modal>
  );
};

/* Helpers */

const acceptAll = async (records: RecordData[]) => {
  return Promise.all(
    records.map(({ consumer, userParticipant }) =>
      updateParticipant({
        uuid: userParticipant.uuid,
        newStatus: ParticipantStatus.ACTIVE,
        language: consumer.default_language,
      })
    )
  );
};

/* Styled Components */

const StyledInlineHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1em;

  button {
    padding: ${({ theme: { em, spacing } }) => `0 ${em(spacing.xxsmall)}`};
    margin: ${({ theme: { em, spacing } }) => em(spacing.xxsmall)};
  }

  margin-bottom: ${({ theme: { em, spacing } }) => em(spacing.large)};
`;

const StyledHeader = styled(Text)`
  margin: 0;
`;

const StyledParagraph = styled(Text)`
  margin-bottom: ${({ theme: { em, spacing } }) => em(spacing.medium)};

  a {
    white-space: nowrap;
  }
`;

const StyledFlexedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme: { em, spacing } }) => em(spacing.small)};
`;

const StyledButtonsRow = styled(StyledFlexedRow)`
  margin-top: ${({ theme: { em, spacing } }) => em(spacing.small)};
`;

export default TosModal;
