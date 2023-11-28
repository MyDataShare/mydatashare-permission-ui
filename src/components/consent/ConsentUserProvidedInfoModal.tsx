import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { UserProvidedDataTemplate } from '../../utils/types';
import Modal from '../common/modal/Modal';
import { Button, FillButton, Text } from 'components/common';
import { Form, Input } from 'components/form';
import { MetadataPayload } from 'utils/client';
import { getDataConsumerDynamicAttrTranslation } from 'utils/fn';

interface Props {
  title: string;
  prUuid: string;
  closeModal: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  mutationFn: (payload: MetadataPayload) => Promise<Record<string, any>>;
  submitText: string;
  metadataUuid?: string;
  userProvidedData?: Record<string, any>;
  userProvidedDataTemplate: UserProvidedDataTemplate;
  startHelpText?: string;
  endHelpText?: string;
}

const ConsentUserProvidedInfoModal = ({
  title,
  prUuid,
  closeModal,
  onSuccess,
  onError,
  mutationFn,
  submitText,
  metadataUuid,
  userProvidedData = {},
  userProvidedDataTemplate,
  startHelpText,
  endHelpText,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Modal title={title} showCloseButton onClose={closeModal}>
      <StyledHeading>{title}</StyledHeading>
      {startHelpText && (
        <StyledSpacer>
          <Text>{startHelpText}</Text>
        </StyledSpacer>
      )}
      <Form
        buildFormPayload={formValues =>
          buildFormPayload(formValues, prUuid, metadataUuid)
        }
        mutationFn={mutationFn}
        onSuccess={onSuccess}
        onError={onError}
      >
        {({ isLoading }) => {
          return (
            <>
              {userProvidedDataTemplate.json_data.data.map(attrs => {
                const value =
                  attrs.name in userProvidedData
                    ? userProvidedData[attrs.name]
                    : undefined;
                return (
                  <Input
                    key={attrs.name}
                    id={attrs.name}
                    name={attrs.name}
                    maxLength={attrs.maxLength}
                    help={getDataConsumerDynamicAttrTranslation(attrs, 'help')}
                    type={attrs.type}
                    required={attrs.required}
                    label={getDataConsumerDynamicAttrTranslation(
                      attrs,
                      'label'
                    )}
                    value={value}
                    placeholder={getDataConsumerDynamicAttrTranslation(
                      attrs,
                      'placeholder'
                    )}
                  />
                );
              })}
              {endHelpText && (
                <StyledSpacer>
                  <Text>{endHelpText}</Text>
                </StyledSpacer>
              )}
              <StyledModalButtonWrapper>
                <Button variant="supplementary" onClick={closeModal}>
                  {t('labelCancel')}
                </Button>
                <SubmitButton
                  submitText={submitText}
                  isLoading={isLoading}
                  userProvidedDataTemplate={userProvidedDataTemplate}
                />
              </StyledModalButtonWrapper>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};

export default ConsentUserProvidedInfoModal;

const SubmitButton = ({
  submitText,
  isLoading,
  userProvidedDataTemplate,
}: {
  submitText: Props['submitText'];
  isLoading: boolean;
  userProvidedDataTemplate: UserProvidedDataTemplate;
}) => {
  const { isDirty } = useFormState();
  const { watch } = useFormContext();
  const formValues = watch();
  const requiredFields = userProvidedDataTemplate.json_data.data
    .filter(attrs => attrs.required)
    .map(attrs => attrs.name);
  const emptyValues = Object.entries(formValues)
    .filter(([k, v]) => requiredFields.includes(k) && !v?.trim())
    .map(([k, _]) => k);
  const isDisabled = emptyValues.length > 0 || !isDirty || isLoading;

  return (
    <FillButton
      variant="accept"
      icon={faCheck}
      type="submit"
      disabled={isDisabled}
      loading={isLoading}
    >
      {submitText}
    </FillButton>
  );
};

/* Helpers */

const buildFormPayload = (
  formValues: Record<string, any>,
  prUuid: string,
  metadataUuid?: string
) => {
  return {
    model: 'processing_record',
    model_uuid: prUuid,
    type: 'user_provided_data',
    name: 'User provided data during record activation',
    json_data: { ...formValues },
    metadataUuid,
  };
};

/* Styled Components */

const StyledHeading = styled(Text).attrs({ variant: 'title2' })`
  margin-right: ${({ theme: { em, spacing } }) => em(spacing.large)};
`;

const StyledSpacer = styled.div`
  margin-top: ${({ theme: { em, spacing } }) => em(spacing.medium)};
`;

const StyledModalButtonWrapper = styled.div`
  margin-top: ${({ theme: { em, spacing } }) => em(spacing.xlarge)};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1em;
`;
