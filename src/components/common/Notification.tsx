import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import {
  faBan,
  faCheck,
  faTriangleExclamation,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';
import {
  CloseButtonProps,
  toast,
  ToastContainer,
  ToastOptions,
} from 'react-toastify';
import styled from 'styled-components/macro';
import 'react-toastify/dist/ReactToastify.css';

import Text from './Text';
import { NotificationType } from './types';
import type { Color } from 'theme';
import { capitalize } from 'utils/fn';
import { flexStart } from 'utils/styled';

const getToastIcon = (type: NotificationType): IconDefinition =>
  ({
    error: faBan,
    success: faCheck,
    warning: faTriangleExclamation,
  }[type]);

const CloseButton = ({ closeToast }: CloseButtonProps) => (
  <button
    className="Toastify__close-btn"
    type="button"
    aria-label="close"
    onClick={closeToast}
  >
    <FontAwesomeIcon icon={light('xmark')} size="2x" />
  </button>
);

const NotificationContainer = () => (
  <StyledToastContainer
    closeButton={CloseButton}
    position="top-center"
    pauseOnFocusLoss={false}
    closeOnClick={false}
    draggable={false}
    autoClose={false}
    icon={false}
    rtl={false}
    newestOnTop
    pauseOnHover
    hideProgressBar
  />
);

export const showNotification = (
  type: NotificationType,
  title: string,
  description?: string | ReactElement,
  options: ToastOptions = {}
) => {
  const toastContent = (
    <>
      <StyledHeader $notificationType={type}>{title}</StyledHeader>
      {typeof description === 'string' ? (
        <StyledText $notificationType={type}>{description}</StyledText>
      ) : (
        description
      )}
    </>
  );
  toast[type](toastContent, {
    icon: <FontAwesomeIcon icon={getToastIcon(type)} size="2x" />,
    autoClose: type === NotificationType.SUCCESS && 5000,
    closeButton: type !== NotificationType.SUCCESS,
    ...options,
  });
};

const StyledToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    width: 100%;
    max-width: 960px;
    padding-left: 1.5em;
    padding-right: 1.5em;
  }

  .Toastify__toast {
    ${flexStart}
    color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.em(theme.spacing.small)};
    border: 10px solid ${({ theme }) => theme.colors.notificationBorder};
    box-shadow: none;
    cursor: auto;
  }

  .Toastify__toast--error {
    background-color: ${({ theme }) =>
      theme.colors.notificationBackgroundError};

    & .Toastify__close-btn,
    & .Toastify__toast-icon {
      color: ${({ theme }) => theme.colors.notificationContentError};
    }
  }

  .Toastify__toast--success {
    background-color: ${({ theme }) =>
      theme.colors.notificationBackgroundSuccess};

    & .Toastify__close-btn,
    & .Toastify__toast-icon {
      color: ${({ theme }) => theme.colors.notificationContentSuccess};
    }
  }

  .Toastify__toast--warning {
    background-color: ${({ theme }) =>
      theme.colors.notificationBackgroundWarning};

    & .Toastify__close-btn,
    & .Toastify__toast-icon {
      color: ${({ theme }) => theme.colors.notificationContentWarning};
    }
  }

  .Toastify__toast-body {
    ${flexStart}
  }

  .Toastify__toast-icon {
    width: ${({ theme }) => theme.em(theme.sizing.icon.large)};
    margin-right: ${({ theme }) => theme.em(theme.spacing.normal)};
  }

  .Toastify__close-btn {
    padding: ${({ theme }) => theme.em(theme.spacing.xxsmall)};
    background: transparent;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
  }
`;

type StyledTextProps = {
  $notificationType: NotificationType;
};

const StyledHeader = styled(Text)<StyledTextProps>`
  ${({ theme }) => theme.typography.title3}
  color: ${p =>
    p.theme.colors[
      `notificationContent${capitalize(p.$notificationType)}` as Color
    ]};
  font-weight: 900;
  line-height: 1.5;
`;

const StyledText = styled(Text)<StyledTextProps>`
  color: ${p =>
    p.theme.colors[
      `notificationContent${capitalize(p.$notificationType)}` as Color
    ]};
  margin-top: ${({ theme }) => theme.em(theme.spacing.xsmall)};
`;

export default NotificationContainer;
