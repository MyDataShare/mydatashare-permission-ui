import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { FillButtonVariant } from '../types';
import Modal from './Modal';
import ModalProps from './types';
import { Button, FillButton, Text } from 'components/common';

type Props = ModalProps & {
  confirmButtonType?: 'fillButton' | 'regular';
  confirmButtonVariant?: FillButtonVariant;
  confirmIcon?: IconDefinition;
  confirmLabel?: string;
  onConfirm: () => void;
  showCancel?: boolean;
  showTitle?: boolean;
};

const ConfirmModal = (props: Props) => {
  const { t } = useTranslation();
  const {
    confirmButtonType = 'regular',
    confirmButtonVariant = 'accept',
    confirmIcon,
    confirmLabel,
    onClose,
    onConfirm,
    showCancel = true,
    showTitle = true,
    title,
    ...rest
  } = props;
  return (
    <StyledModalLayout title={title} onClose={onClose} {...rest}>
      {showTitle && (
        <StyledTitleWrapper>
          <Text variant="title2">{title}</Text>
        </StyledTitleWrapper>
      )}
      {props.children}
      <StyledModalButtonWrapper>
        {showCancel && (
          <Button variant="supplementary" onClick={onClose}>
            {t('labelCancel')}
          </Button>
        )}
        {confirmButtonType === 'regular' ? (
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel ? t(confirmLabel) : t('labelConfirm')}
          </Button>
        ) : (
          <FillButton
            icon={confirmIcon}
            onClick={onConfirm}
            variant={confirmButtonVariant}
          >
            {confirmLabel ? t(confirmLabel) : t('labelConfirm')}
          </FillButton>
        )}
      </StyledModalButtonWrapper>
    </StyledModalLayout>
  );
};

export default ConfirmModal;

/* Styled Components */

const StyledModalLayout = styled(Modal)`
  p + p {
    margin-top: ${({ theme: { em, spacing } }) => em(spacing.medium)};
  }
`;

const StyledTitleWrapper = styled.div`
  margin-right: ${({ theme: { em, spacing } }) => em(spacing.large)};
  margin-bottom: ${({ theme: { em, spacing } }) => em(spacing.medium)};
`;

const StyledSpacer = styled.div`
  margin-top: ${({ theme: { em, spacing } }) => em(spacing.large)};
`;

const StyledModalButtonWrapper = styled(StyledSpacer)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme: { em, spacing } }) => em(spacing.small)};
`;
