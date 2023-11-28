import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { faPen } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from 'i18next';
import { LANGUAGES } from 'mydatashare-core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import styled from 'styled-components/macro';

import ConsentModal from './ConsentModal';
import ConsentSummaryCard from './ConsentSummaryCard';
import ConsentUserProvidedInfoModal from './ConsentUserProvidedInfoModal';
import { Button, Markdown, Text } from 'components/common';
import { showNotification } from 'components/common/Notification';
import { NotificationType } from 'components/common/types';
import { Link } from 'components/navigation';
import { updateMetadata } from 'utils/client';
import {
  getDataConsumerDynamicAttrTranslation,
  getMetadata,
  getUserProvidedDataTemplate,
  validateUserProvidedDataTemplate,
} from 'utils/fn';
import {
  getConsumerTranslations,
  getRequiredTranslation as getTranslation,
} from 'utils/mdsApi';
import { flexColumn } from 'utils/styled';
import { RecordData, RecordStatus } from 'utils/types';

interface Props {
  data: RecordData;
}

const ConsentDetails = ({ data }: Props) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { consumer, consumerOrg, record, provider, metadatas } = data;

  const staticPreviewTr =
    provider && getTranslation(provider, 'static_preview', metadatas);
  const providerTr = provider && getTranslation(provider, 'name', metadatas);

  // Data Consumer organization name and Data Provider info are always shown
  // translated to current language
  const consumerOrganizationName = getTranslation(
    consumerOrg,
    'name',
    metadatas
  );

  const shownLanguage = data.acceptedLanguage || LANGUAGES[i18n.language];
  const { descriptionTr, legalTr } = getConsumerTranslations(
    consumer,
    shownLanguage,
    metadatas
  );

  const userProvidedData = getMetadata(
    record,
    'user_provided_data',
    Object.values(metadatas)
  );
  const userProvidedDataTemplate = getUserProvidedDataTemplate(
    consumer,
    metadatas
  );
  const isTemplateValid = validateUserProvidedDataTemplate(
    userProvidedDataTemplate
  );
  const askUserProvidedData =
    showModal &&
    userProvidedData &&
    userProvidedDataTemplate &&
    isTemplateValid;
  const showUserProvidedData =
    userProvidedData &&
    userProvidedDataTemplate &&
    isTemplateValid &&
    record.status === RecordStatus.ACTIVE;

  const existingUserProvidedFields =
    userProvidedData && userProvidedDataTemplate && isTemplateValid
      ? userProvidedDataTemplate.json_data.data.filter(
          attrs => attrs.name in userProvidedData.json_data
        )
      : [];

  const onMetadataUpdateSuccess = () => {
    queryClient.invalidateQueries(['processingRecord', { uuid: record.uuid }]);
    setShowModal(false);
    showNotification(
      NotificationType.SUCCESS,
      t('textUserProvidedDataUpdated')
    );
  };

  const onMetadataUpdateError = () => {
    showNotification(NotificationType.ERROR, t('General error message'));
  };

  return (
    <>
      <StyledWrapper>
        <ConsentSummaryCard data={data} shownLanguage={shownLanguage} />

        {askUserProvidedData && (
          <ConsentUserProvidedInfoModal
            title={t('headingEditUserProvidedData')}
            prUuid={record.uuid}
            metadataUuid={userProvidedData.uuid}
            closeModal={() => setShowModal(false)}
            onSuccess={onMetadataUpdateSuccess}
            onError={onMetadataUpdateError}
            mutationFn={updateMetadata}
            submitText={t('labelSave')}
            userProvidedData={userProvidedData.json_data}
            userProvidedDataTemplate={userProvidedDataTemplate}
            startHelpText={t('textEditUserProvidedData')}
          />
        )}

        <StyledGroup>
          {record.reference && (
            <StyledSection>
              <StyledText id="reference-label" variant="title3">
                {t('labelReference')}
              </StyledText>
              <Markdown aria-describedby="reference-label">
                {record.reference}
              </Markdown>
            </StyledSection>
          )}

          {showUserProvidedData && (
            <StyledSection>
              <StyledText variant="title3">
                {t('headingUserProvidedData')}
              </StyledText>
              <Text>{t('textUserProvidedData')}</Text>
              {existingUserProvidedFields.map(attrs => {
                const value = userProvidedData.json_data[attrs.name];
                const translatedField = getDataConsumerDynamicAttrTranslation(
                  attrs,
                  'label'
                );
                return value ? (
                  <StyledFlexedColumn key={attrs.name}>
                    <Text variant="bold">{translatedField}</Text>
                    <Text>{value}</Text>
                  </StyledFlexedColumn>
                ) : null;
              })}
              <StyledEditButton
                variant="supplementary"
                onClick={() => setShowModal(true)}
                icon={faPen}
              >
                {t('labelEditUserProvidedData')}
              </StyledEditButton>
            </StyledSection>
          )}

          <StyledSection>
            <StyledText variant="title3">{t('Requesting service')}</StyledText>
            <StyledTextLarge lang={consumerOrganizationName.lang}>
              {consumerOrganizationName.val}
            </StyledTextLarge>

            {descriptionTr.val && (
              <>
                <StyledText id="description-label" variant="title4">
                  {t('Description')}
                </StyledText>
                <Markdown
                  aria-describedby="description-label"
                  lang={descriptionTr.lang}
                >
                  {descriptionTr.val}
                </Markdown>
              </>
            )}
            {legalTr.val && (
              <>
                <StyledText id="legal-label" variant="title4">
                  {t('Legal')}
                </StyledText>
                <Markdown aria-describedby="legal-label" lang={legalTr.lang}>
                  {legalTr.val}
                </Markdown>
              </>
            )}
          </StyledSection>

          {provider && (
            <StyledSection>
              <StyledText variant="title3">
                {t('Requested access to data source')}
              </StyledText>
              {providerTr?.val && (
                <StyledTextLarge
                  aria-describedby="provider-label"
                  lang={providerTr?.lang}
                >
                  {providerTr.val}
                </StyledTextLarge>
              )}

              {staticPreviewTr?.val && (
                <>
                  <StyledText id="static-preview-label" variant="title4">
                    {t('Data requested')}
                  </StyledText>
                  <Markdown aria-describedby="static-preview-label">
                    {staticPreviewTr.val}
                  </Markdown>
                </>
              )}
            </StyledSection>
          )}
        </StyledGroup>

        {provider && (
          <StyledLink to={{ ...window.location, hash: 'access' }}>
            <FontAwesomeIcon icon={light('clock-rotate-left')} size="lg" />
            <Text as="span">{t('Access log link label')}</Text>
          </StyledLink>
        )}
      </StyledWrapper>
      <ConsentModal data={data} />
    </>
  );
};

export default ConsentDetails;

/* Styled Components */

const StyledWrapper = styled.div`
  position: relative;
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.xlarge)};
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.xlarge)};

  @media only screen and (max-width: 780px) {
    gap: ${({ theme }) => theme.em(theme.spacing.large)};
    margin-bottom: ${({ theme }) => theme.em(theme.spacing.medium)};
  }
`;

const StyledGroup = styled.div`
  ${flexColumn}
  gap: ${({ theme }) => theme.em(theme.spacing.xxlarge)};
  padding: 0 ${({ theme }) => theme.em(theme.spacing.xlarge)};

  @media only screen and (max-width: 780px) {
    padding: 0 ${({ theme }) => theme.em(theme.spacing.normal)};
  }
`;

const StyledSection = styled.div`
  position: relative;
`;

const StyledText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.xsmall)};
`;

const StyledTextLarge = styled(Text)`
  ${({ theme }) => theme.typography.title2}
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.em(theme.spacing.small)};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: underline;
  gap: 0 ${({ theme }) => theme.em(theme.spacing.xsmall)};
  margin: 0 ${({ theme }) => theme.em(theme.spacing.xlarge)};

  &:hover {
    color: ${({ theme }) => theme.colors.linkMuted};
  }
`;

const StyledFlexedColumn = styled.div`
  ${flexColumn}
  margin-top: ${({ theme }) => theme.em(theme.spacing.medium)};
  gap: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
`;

const StyledEditButton = styled(Button)`
  margin-top: ${({ theme }) => theme.em(theme.spacing.medium)};
  margin-left: 0;
`;
