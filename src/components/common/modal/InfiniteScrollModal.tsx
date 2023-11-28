import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { CSSProperties, ReactNode, useRef } from 'react';
import {
  FocusRing,
  FocusScope,
  mergeProps,
  OverlayContainer,
  useDialog,
  useFocusRing,
  useModal,
  useOverlay,
  usePreventScroll,
  VisuallyHidden,
} from 'react-aria';
import styled, { css } from 'styled-components/macro';

import { flexCenter, flexColumn } from 'utils/styled';

interface Props {
  children: ReactNode;
  title: string;
  showCloseButton?: boolean;
  style?: CSSProperties;
  onClose?: () => void;
}

/* TODO: This Modal layout handles scrolling inside the modal dialog.
         It works well with the current infinite loading of Access and
         Event logs. Inifinite loading should however be probably implemented
         with pagination instead --> Look into implementing Access and Event
         logs using the Modal component instead.
*/

const InfiniteScrollModal = ({
  children,
  showCloseButton,
  title,
  onClose,
  ...rest
}: Props) => {
  const ref = useRef<any>(null);
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { overlayProps } = useOverlay(
    { onClose, isOpen: true, isDismissable: true },
    ref
  );

  const wrapperProps = mergeProps(
    dialogProps,
    focusProps,
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
            <StyledContentBackground $focused={isFocusVisible} />
          </StyledWrapper>
        </FocusScope>
      </StyledBackdrop>
    </OverlayContainer>
  );
};

const StyledBackdrop = styled(motion.div)`
  ${flexCenter}
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
`;

const StyledWrapper = styled(motion.div)`
  outline: none;
  position: relative;
`;

const StyledContent = styled(motion.div)`
  ${flexColumn}
  position: relative;
  z-index: 1;
  height: 100%;
  overflow-x: hidden;
`;

const StyledContentBackground = styled(motion.div)<{ $focused: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-color: ${p => p.theme.colors.surface};
  border-radius: ${p => p.theme.radii.small}px;

  ${p =>
    p.$focused &&
    css`
      box-shadow: 0px 0px 0px 2px ${p => p.theme.colors.primary};
    `}
`;

const StyledCloseButton = styled.button`
  ${flexCenter}
  position: absolute;
  top: ${({ theme }) => theme.em(theme.spacing.normal)};
  right: ${({ theme }) => theme.em(theme.spacing.medium)};
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

export default InfiniteScrollModal;
