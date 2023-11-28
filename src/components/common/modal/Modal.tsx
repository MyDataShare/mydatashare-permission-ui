import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import {
  FocusRing,
  FocusScope,
  mergeProps,
  OverlayContainer,
  useDialog,
  useModal,
  useOverlay,
  usePreventScroll,
  VisuallyHidden,
} from 'react-aria';
import styled from 'styled-components/macro';

import ModalProps from './types';
import { flexCenter, flexColumn } from 'utils/styled';

const Modal = ({
  children,
  showCloseButton,
  title,
  onClose,
  ...rest
}: ModalProps) => {
  const ref = useRef<any>(null);
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, ref);
  const { overlayProps } = useOverlay(
    { onClose, isOpen: true, isDismissable: true },
    ref
  );

  const wrapperProps = mergeProps(
    dialogProps,
    modalProps,
    overlayProps,
    rest
  ) as any;

  usePreventScroll();

  return (
    <OverlayContainer>
      <StyledBackdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FocusScope contain restoreFocus autoFocus>
          <StyledWrapper
            {...wrapperProps}
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -15 }}
            ref={ref}
          >
            <VisuallyHidden>
              <h3 {...titleProps}>{title}</h3>
            </VisuallyHidden>
            <StyledContent>
              {showCloseButton && (
                <FocusRing focusRingClass="modal-close-button-focus">
                  <StyledCloseButton onClick={onClose}>
                    <FontAwesomeIcon icon={light('xmark')} size="2x" />
                  </StyledCloseButton>
                </FocusRing>
              )}
              {children}
            </StyledContent>
            {/* <StyledContentBackground $focused={isFocusVisible} /> */}
          </StyledWrapper>
        </FocusScope>
      </StyledBackdrop>
    </OverlayContainer>
  );
};

const StyledBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-x: hidden;
  overflow-y: auto;
`;

const StyledWrapper = styled(motion.div)`
  outline: none;
  position: relative;
  background-color: ${p => p.theme.colors.surface};
  border-radius: ${p => p.theme.radii.small}px;
  padding: ${({ theme: { em, spacing } }) => em(spacing.large)};
  margin: ${({ theme: { em, spacing } }) => `${em(spacing.xlarge)} auto`};
  max-width: min(690px, calc(100vw - 1em));
  width: 100%;
  @media only screen and (max-width: 400px) {
    padding: ${({ theme: { em, spacing } }) => em(spacing.small)};
    max-width: min(690px, calc(100vw - 0.25em));
  }
`;

const StyledContent = styled(motion.div)`
  ${flexColumn}
  position: relative;
  z-index: 1;
  @media only screen and (max-width: 780px) {
    button {
      flex: 1;
    }
  }
`;

const StyledCloseButton = styled.button`
  ${flexCenter}
  position: absolute;
  top: 0;
  right: 0;
  width: 2em;
  height: 2em;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1;
  border-radius: 50%;
  outline: none;
  transition: transform 100ms ease;

  &.modal-close-button-focus {
    box-shadow: 0px 0px 0px 2px ${p => p.theme.colors.primary};
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export default Modal;
